import "server-only";

import { countCreatesByIpHashSince } from "./db/submissions";

export const CREATE_LIMIT_PER_HOUR = 5;
export const RATE_LIMIT_WINDOW_MINUTES = 60;

/**
 * At most `CREATE_LIMIT_PER_HOUR` creates per hour per IP. Implemented with a
 * query on `submissions`, so no extra service is required. The IP is hashed
 * before it reaches this function.
 */
export async function isRateLimited(ipHash: string | null): Promise<boolean> {
  if (!ipHash) return false;
  const since = new Date(
    Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  );
  const count = await countCreatesByIpHashSince(ipHash, since);
  return count >= CREATE_LIMIT_PER_HOUR;
}
