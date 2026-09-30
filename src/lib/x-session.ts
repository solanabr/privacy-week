import { createHmac, timingSafeEqual } from "node:crypto";

export interface XAccountIdentity {
  id: string;
  username: string;
}

export interface XAccountSession extends XAccountIdentity {
  exp: number;
}

export function signCookiePayload(payload: object, secret: string): string {
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );
  const signature = createHmac("sha256", secret)
    .update(encodedPayload, "utf8")
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

export function readSignedCookiePayload<T extends { exp: number }>(
  value: string | undefined,
  secret: string,
  nowMs = Date.now(),
): T | null {
  if (!value || !secret) return null;
  const [encodedPayload, encodedSignature, extra] = value.split(".");
  if (!encodedPayload || !encodedSignature || extra !== undefined) return null;

  const expected = createHmac("sha256", secret)
    .update(encodedPayload, "utf8")
    .digest();
  const actual = Buffer.from(encodedSignature, "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    );
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed) ||
      typeof (parsed as { exp?: unknown }).exp !== "number" ||
      (parsed as { exp: number }).exp <= Math.floor(nowMs / 1000)
    ) {
      return null;
    }
    return parsed as T;
  } catch {
    return null;
  }
}

export function readXAccountSession(
  value: string | undefined,
  secret: string,
  nowMs = Date.now(),
): XAccountSession | null {
  const payload = readSignedCookiePayload<XAccountSession>(value, secret, nowMs);
  if (
    !payload ||
    !/^\d{1,30}$/.test(payload.id) ||
    !/^[A-Za-z0-9_]{1,50}$/.test(payload.username)
  ) {
    return null;
  }
  return { id: payload.id, username: payload.username, exp: payload.exp };
}
