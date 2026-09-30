import "server-only";

import { headers } from "next/headers";

import { ADMIN_AUTH_HEADER, authenticateBasic, getAdminUsers } from "./auth";

/**
 * Resolve the authenticated admin (judge) name from the request headers.
 *
 * The proxy performs Basic Auth for `/admin`, but Server Actions can be reached
 * by direct POST, so every admin action re-checks auth here.
 */
export async function getAdminUser(): Promise<string | null> {
  const headerList = await headers();
  const forwarded = headerList.get(ADMIN_AUTH_HEADER);
  return authenticateBasic(forwarded, getAdminUsers());
}

export async function requireAdmin(): Promise<string> {
  const user = await getAdminUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
