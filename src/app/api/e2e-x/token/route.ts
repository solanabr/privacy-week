import { createHash } from "node:crypto";

import { getSiteUrl } from "@/lib/site-url";

function unavailable() {
  return new Response("Not found", { status: 404 });
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development" || process.env.PW_MOCK_X !== "1") {
    return unavailable();
  }

  const form = new URLSearchParams(await request.text());
  const expectedAuthorization = `Basic ${Buffer.from(`${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`).toString("base64")}`;
  const [prefix, challenge] = (form.get("code") ?? "").split(".");
  const verifier = form.get("code_verifier") ?? "";
  const actualChallenge = createHash("sha256").update(verifier).digest("base64url");
  if (
    request.headers.get("authorization") !== expectedAuthorization ||
    form.get("grant_type") !== "authorization_code" ||
    form.get("redirect_uri") !== `${getSiteUrl()}/auth/x/callback` ||
    prefix !== "e2e" ||
    challenge !== actualChallenge
  ) {
    return Response.json({ error: "invalid_grant" }, { status: 400 });
  }

  return Response.json({
    access_token: "e2e-access-token",
    token_type: "bearer",
    expires_in: 7200,
    scope: "tweet.read users.read",
  });
}
