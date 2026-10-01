import type { SubmissionRow } from "@/lib/db/submissions";

type ExportField = Exclude<keyof SubmissionRow, "edit_token_hash" | "ip_hash">;

/** Full export whitelist; the two bearer/security values are excluded by type. */
export const CSV_FIELDS = [
  "id",
  "number",
  "slug",
  "project_name",
  "team_name",
  "tagline",
  "category",
  "tech",
  "repo_url",
  "sprint_changes",
  "proof_type",
  "proof_value",
  "demo_video_url",
  "writeup",
  "colosseum_url",
  "website_url",
  "members",
  "show_members",
  "x_user_id",
  "x_username",
  "contact_name",
  "contact_email",
  "contact_telegram",
  "contact_whatsapp",
  "accepted_rules",
  "status",
  "is_winner",
  "prize_pool",
  "payout_status",
  "admin_notes",
  "created_at",
  "updated_at",
] as const satisfies readonly ExportField[];

type UnlistedField = Exclude<ExportField, (typeof CSV_FIELDS)[number]>;
const allExportFieldsIncluded: UnlistedField extends never ? true : never = true;
void allExportFieldsIncluded;

export function csvCell(value: unknown): string {
  let text = value === null || value === undefined
    ? ""
    : typeof value === "string"
      ? value
      : typeof value === "number" || typeof value === "boolean"
        ? String(value)
        : JSON.stringify(value) ?? "";
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function submissionToCsvRow(row: SubmissionRow): string {
  return CSV_FIELDS.map((field) => csvCell(row[field])).join(",");
}
