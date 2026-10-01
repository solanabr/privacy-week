import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const EDIT_TOKEN_BYTES = 32;

/** Random, URL-safe edit token. The raw value is shown once and never stored. */
export function generateEditToken(): string {
  return randomBytes(EDIT_TOKEN_BYTES).toString("base64url");
}

/** SHA-256 hash of an edit token. Only the hash is persisted. */
export function hashEditToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

/** SHA-256 hash of a client IP, salted with IP_HASH_SALT. */
export function hashIp(ip: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${ip}`, "utf8").digest("hex");
}

/**
 * Constant-time string comparison. Both inputs are hashed first so that the
 * comparison length never depends on the input length.
 */
export function constantTimeEqual(a: string, b: string): boolean {
  const hashA = createHash("sha256").update(a, "utf8").digest();
  const hashB = createHash("sha256").update(b, "utf8").digest();
  return timingSafeEqual(hashA, hashB);
}
