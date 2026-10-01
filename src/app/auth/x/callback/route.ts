import { NextResponse } from "next/server";

import { completeXOAuth } from "@/lib/x-oauth";
import { getSiteUrl } from "@/lib/site-url";

export async function GET(request: Request) {
  const result = await completeXOAuth(request);
  const query = result === "connected" ? "x_connected=1" : `x_error=${result}`;
  return NextResponse.redirect(new URL(`/enviar?${query}`, getSiteUrl()));
}
