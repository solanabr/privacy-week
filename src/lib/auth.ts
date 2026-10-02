import { constantTimeEqual } from "./tokens";

export interface AdminUser {
  name: string;
  password: string;
}

/** Internal header populated only after the request passes through `proxy.ts`. */
export const ADMIN_AUTH_HEADER = "x-privacy-week-admin-authorization";

/** Parse `ADMIN_USERS` (`name:password,name2:password2`). */
export function parseAdminUsers(raw: string | undefined): AdminUser[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const separator = entry.indexOf(":");
      if (separator === -1) {
        return { name: entry, password: "" };
      }
      return {
        name: entry.slice(0, separator).trim(),
        password: entry.slice(separator + 1),
      };
    })
    .filter((user) => user.name.length > 0);
}

/**
 * Names expected to score every submission. `JUDGES` (comma-separated) lets
 * organizers log in to the admin area without counting as judges; when it is
 * unset every admin user is a judge.
 */
export function getJudgeNames(): string[] {
  const raw = process.env.JUDGES;
  if (raw && raw.trim()) {
    return raw
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);
  }
  return getAdminUsers().map((user) => user.name);
}

export function getAdminUsers(): AdminUser[] {
  return parseAdminUsers(process.env.ADMIN_USERS);
}

/**
 * Validate a Basic `Authorization` header value. Returns the matching judge
 * name, or null. Comparison is constant time.
 */
export function authenticateBasic(
  header: string | null,
  users: AdminUser[],
): string | null {
  if (!header) return null;
  const [scheme, encoded] = header.split(" ");
  if (!scheme || scheme.toLowerCase() !== "basic" || !encoded) return null;

  let decoded: string;
  try {
    decoded = Buffer.from(encoded, "base64").toString("utf8");
  } catch {
    return null;
  }

  const separator = decoded.indexOf(":");
  if (separator === -1) return null;
  const name = decoded.slice(0, separator);
  const password = decoded.slice(separator + 1);

  let matched: string | null = null;
  for (const user of users) {
    const nameOk = constantTimeEqual(name, user.name);
    const passwordOk = constantTimeEqual(password, user.password);
    if (nameOk && passwordOk) {
      matched = user.name;
    }
  }
  return matched;
}

export function buildBasicChallenge(realm = "Privacy Week admin"): string {
  return `Basic realm="${realm}", charset="UTF-8"`;
}
