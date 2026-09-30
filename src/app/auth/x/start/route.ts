import { NextResponse } from "next/server";

import { beginXOAuth } from "@/lib/x-oauth";
import { getSiteUrl } from "@/lib/site-url";

export async function GET() {
  const authorizationUrl = await beginXOAuth();
  if (!authorizationUrl) {
    return NextResponse.redirect(
      new URL("/enviar?x_error=not_configured", getSiteUrl()),
    );
  }
  return NextResponse.redirect(authorizationUrl);
}
