import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

import { getSiteUrl } from "@/lib/site-url";

import {
  readSignedCookiePayload,
  readXAccountSession,
  signCookiePayload,
  type XAccountIdentity,
} from "./x-session";

export const X_ACCOUNT_COOKIE = "pw_x_account";
const X_PENDING_COOKIE = "pw_x_oauth_pending";
const OAUTH_STATE_MAX_AGE_SECONDS = 10 * 60;
const ACCOUNT_MAX_AGE_SECONDS = 12 * 60 * 60;

interface XOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

interface PendingOAuthState {
  state: string;
  verifier: string;
  exp: number;
}

interface OAuthEndpoints {
  authorize: string;
  token: string;
  me: string;
}

function isMockXProvider(): boolean {
  return process.env.NODE_ENV === "development" && process.env.PW_MOCK_X === "1";
}

function getEndpoints(): OAuthEndpoints {
  if (isMockXProvider()) {
    const base = getSiteUrl();
    return {
      authorize: new URL("/api/e2e-x/authorize", base).toString(),
      token: new URL("/api/e2e-x/token", base).toString(),
      me: new URL("/api/e2e-x/me", base).toString(),
    };
  }
  return {
    authorize: "https://x.com/i/oauth2/authorize",
    token: "https://api.x.com/2/oauth2/token",
    me: "https://api.x.com/2/users/me",
  };
}

function getConfig(): XOAuthConfig | null {
  const clientId = process.env.X_CLIENT_ID;
  const clientSecret = process.env.X_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  if (process.env.NODE_ENV === "production" && !process.env.SITE_URL) return null;

  const redirectUri = `${getSiteUrl()}/auth/x/callback`;
  try {
    const parsed = new URL(redirectUri);
    if (process.env.NODE_ENV === "production" && parsed.protocol !== "https:") {
      return null;
    }
  } catch {
    return null;
  }

  return { clientId, clientSecret, redirectUri };
}

function cookieOptions(path: string, maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path,
    maxAge,
  };
}

export async function getConnectedXAccount(): Promise<XAccountIdentity | null> {
  const secret = process.env.X_CLIENT_SECRET;
  if (!secret) return null;
  const cookieStore = await cookies();
  const session = readXAccountSession(
    cookieStore.get(X_ACCOUNT_COOKIE)?.value,
    secret,
  );
  return session ? { id: session.id, username: session.username } : null;
}

export async function beginXOAuth(): Promise<string | null> {
  const config = getConfig();
  if (!config) return null;

  const state = randomBytes(32).toString("base64url");
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const expiresAt = Math.floor(Date.now() / 1000) + OAUTH_STATE_MAX_AGE_SECONDS;
  const cookieStore = await cookies();
  cookieStore.set(
    X_PENDING_COOKIE,
    signCookiePayload({ state, verifier, exp: expiresAt }, config.clientSecret),
    cookieOptions("/auth/x/callback", OAUTH_STATE_MAX_AGE_SECONDS),
  );

  const authorizeUrl = new URL(getEndpoints().authorize);
  authorizeUrl.search = new URLSearchParams({
    response_type: "code",
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: "tweet.read users.read",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  }).toString();
  return authorizeUrl.toString();
}

function clearPendingCookie(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  cookieStore.set(
    X_PENDING_COOKIE,
    "",
    cookieOptions("/auth/x/callback", 0),
  );
}

function isIdentity(value: unknown): value is XAccountIdentity {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    /^\d{1,30}$/.test(record.id) &&
    typeof record.username === "string" &&
    /^[A-Za-z0-9_]{1,50}$/.test(record.username)
  );
}

async function exchangeAuthorizationCode(
  code: string,
  verifier: string,
  config: XOAuthConfig,
): Promise<string | null> {
  const response = await fetch(getEndpoints().token, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: config.redirectUri,
      code_verifier: verifier,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) return null;
  const payload: unknown = await response.json().catch(() => null);
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return null;
  }
  const accessToken = (payload as Record<string, unknown>).access_token;
  return typeof accessToken === "string" && accessToken ? accessToken : null;
}

async function getXIdentity(accessToken: string): Promise<XAccountIdentity | null> {
  const response = await fetch(getEndpoints().me, {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) return null;
  const payload: unknown = await response.json().catch(() => null);
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return null;
  }
  const data = (payload as Record<string, unknown>).data;
  if (!isIdentity(data)) return null;
  return { id: data.id, username: data.username };
}

export async function completeXOAuth(request: Request): Promise<
  "connected" | "not_configured" | "denied" | "invalid_state" | "failed"
> {
  const cookieStore = await cookies();
  const config = getConfig();
  const pendingCookie = cookieStore.get(X_PENDING_COOKIE)?.value;
  clearPendingCookie(cookieStore);
  if (!config) return "not_configured";

  const params = new URL(request.url).searchParams;
  if (params.has("error")) return "denied";
  const code = params.get("code");
  const state = params.get("state");
  const pending = readSignedCookiePayload<PendingOAuthState>(
    pendingCookie,
    config.clientSecret,
  );
  if (
    !code ||
    !state ||
    !pending ||
    !pending.state ||
    !pending.verifier ||
    pending.state !== state
  ) {
    return "invalid_state";
  }

  try {
    const accessToken = await exchangeAuthorizationCode(
      code,
      pending.verifier,
      config,
    );
    if (!accessToken) return "failed";
    const identity = await getXIdentity(accessToken);
    if (!identity) return "failed";

    const cookieStore = await cookies();
    const exp = Math.floor(Date.now() / 1000) + ACCOUNT_MAX_AGE_SECONDS;
    cookieStore.set(
      X_ACCOUNT_COOKIE,
      signCookiePayload({ ...identity, exp }, config.clientSecret),
      cookieOptions("/", ACCOUNT_MAX_AGE_SECONDS),
    );
    return "connected";
  } catch {
    return "failed";
  }
}
