import { NextResponse, type NextRequest } from "next/server";

import {
  authenticateBasic,
  ADMIN_AUTH_HEADER,
  buildBasicChallenge,
  getAdminUsers,
} from "@/lib/auth";

export function proxy(request: NextRequest) {
  const user = authenticateBasic(
    request.headers.get("authorization"),
    getAdminUsers(),
  );

  if (!user) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": buildBasicChallenge(),
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    });
  }

  const forwardedHeaders = new Headers(request.headers);
  forwardedHeaders.set(ADMIN_AUTH_HEADER, request.headers.get("authorization") ?? "");
  const response = NextResponse.next({ request: { headers: forwardedHeaders } });
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
