import { buildBasicChallenge } from "@/lib/auth";
import { getAdminUser } from "@/lib/admin-auth";
import { CSV_FIELDS, submissionToCsvRow } from "@/lib/csv";
import { listAllSubmissionsForExport } from "@/lib/db/submissions";

export async function GET(): Promise<Response> {
  const user = await getAdminUser();
  if (!user) {
    return new Response("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": buildBasicChallenge(), "Cache-Control": "no-store" },
    });
  }

  const rows = await listAllSubmissionsForExport();
  const body = [CSV_FIELDS.join(","), ...rows.map(submissionToCsvRow)].join("\r\n");
  return new Response(`\uFEFF${body}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=privacy-week-submissions.csv",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}
