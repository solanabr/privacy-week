import { getSiteUrl } from "@/lib/site-url";

function unavailable() {
  return new Response("Not found", { status: 404 });
}

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development" || process.env.PW_MOCK_X !== "1") {
    return unavailable();
  }

  const params = new URL(request.url).searchParams;
  const state = params.get("state");
  const challenge = params.get("code_challenge");
  const redirectUri = params.get("redirect_uri");
  const expectedRedirect = `${getSiteUrl()}/auth/x/callback`;
  if (
    params.get("client_id") !== process.env.X_CLIENT_ID ||
    params.get("response_type") !== "code" ||
    params.get("code_challenge_method") !== "S256" ||
    !params.get("scope")?.split(" ").includes("users.read") ||
    !state ||
    !challenge ||
    redirectUri !== expectedRedirect
  ) {
    return new Response("Invalid mock authorization request", { status: 400 });
  }

  const callback = new URL(redirectUri);
  callback.searchParams.set("code", `e2e.${challenge}`);
  callback.searchParams.set("state", state);
  return Response.redirect(callback, 302);
}
