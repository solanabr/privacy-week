import { randomBytes } from "node:crypto";

/** Lowercase, ASCII, dash-separated slug. */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Short random suffix (hex) to avoid slug collisions. */
export function randomSlugSuffix(bytes = 3): string {
  return randomBytes(bytes).toString("hex");
}

/** Slug from the project name plus a random suffix. */
export function makeSlug(projectName: string, suffix = randomSlugSuffix()): string {
  const base = slugify(projectName) || "projeto";
  return `${base}-${suffix}`;
}
