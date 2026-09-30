import { describe, expect, it } from "vitest";

import {
  PUBLIC_FIELDS,
  toPublicSubmission,
} from "@/lib/db/submissions";
import { makeSubmissionRow } from "./helpers";

const PRIVATE_SENTINELS = {
  contact_email: "private-contact@example.com",
  contact_name: "Pessoa Secreta",
  contact_telegram: "@naoexpor",
  contact_whatsapp: "+5511999999999",
  edit_token_hash: "deadbeef".repeat(8),
  ip_hash: "cafebabe".repeat(8),
  admin_notes: "nota interna secreta",
};

describe("toPublicSubmission", () => {
  it("only exposes whitelisted fields", () => {
    const publicSubmission = toPublicSubmission(makeSubmissionRow());
    for (const key of Object.keys(publicSubmission)) {
      expect(PUBLIC_FIELDS as readonly string[]).toContain(key);
    }
  });

  it("never leaks private values", () => {
    const json = JSON.stringify(toPublicSubmission(makeSubmissionRow()));
    for (const sentinel of Object.values(PRIVATE_SENTINELS)) {
      expect(json).not.toContain(sentinel);
    }
    expect(json).not.toContain("edit_token_hash");
    expect(json).not.toContain("accepted_rules");
    expect(json).not.toContain("payout_status");
  });

  it("includes members by default", () => {
    expect(toPublicSubmission(makeSubmissionRow()).members).toHaveLength(2);
  });

  it("hides members when show_members is false", () => {
    const publicSubmission = toPublicSubmission(makeSubmissionRow({ show_members: false }));
    expect(publicSubmission.members).toEqual([]);
  });

  it("exposes results fields", () => {
    const publicSubmission = toPublicSubmission(
      makeSubmissionRow({ is_winner: true, prize_pool: "cloak" }),
    );
    expect(publicSubmission.is_winner).toBe(true);
    expect(publicSubmission.prize_pool).toBe("cloak");
  });
});
