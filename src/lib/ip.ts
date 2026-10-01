import "server-only";

import { headers } from "next/headers";

/** Best-effort client IP from proxy headers. */
export function pickClientIp(
  forwardedFor: string | null,
  realIp: string | null,
): string {
  const first = forwardedFor?.split(",")[0]?.trim();
  if (first) return first;
  const real = realIp?.trim();
  if (real) return real;
  return "unknown";
}

export async function getClientIp(): Promise<string> {
  const headerList = await headers();
  return pickClientIp(
    headerList.get("x-forwarded-for"),
    headerList.get("x-real-ip"),
  );
}
