import { describe, expect, it } from "vitest";

import { CSV_FIELDS, csvCell, submissionToCsvRow } from "@/lib/csv";
import { makeSubmissionRow } from "./helpers";

describe("submission CSV export", () => {
  it("exports every submission field except token and IP hashes", () => {
    const row = makeSubmissionRow();
    const allowed = Object.keys(row).filter(
      (key) => key !== "edit_token_hash" && key !== "ip_hash",
    );
    expect([...CSV_FIELDS].sort()).toEqual(allowed.sort());
    expect(CSV_FIELDS).not.toContain("edit_token_hash");
    expect(CSV_FIELDS).not.toContain("ip_hash");
  });

  it("quotes fields and protects spreadsheet formulas", () => {
    expect(csvCell('Ana "Exemplo"')).toBe('"Ana ""Exemplo"""');
    expect(csvCell("=IMPORTDATA(\"https://example.com\")")).toBe(
      '"\'=IMPORTDATA(""https://example.com"")"',
    );
  });

  it("includes private contact fields for the admin export", () => {
    const csv = submissionToCsvRow(makeSubmissionRow());
    expect(csv).toContain("private-contact@example.com");
    expect(csv).not.toContain("deadbeef");
    expect(csv).not.toContain("cafebabe");
  });
});
