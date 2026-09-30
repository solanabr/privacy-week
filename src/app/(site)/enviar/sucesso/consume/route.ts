import { NextResponse, type NextRequest } from "next/server";

import { FLASH_COOKIE } from "@/lib/form-state";

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return new NextResponse(null, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(FLASH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/enviar/sucesso",
    maxAge: 0,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
