import { describe, expect, it } from "vitest";

import {
  PUBLIC_FIELDS,
  toPublicSubmission,
  type SubmissionRow,
} from "@/lib/db/submissions";

const PRIVATE_SENTINELS = {
  contact_email: "private-contact@example.com",
  contact_name: "Pessoa Secreta",
  contact_telegram: "@naoexpor",
  contact_whatsapp: "+5511999999999",
  edit_token_hash: "deadbeef".repeat(8),
  ip_hash: "cafebabe".repeat(8),
  admin_notes: "nota interna secreta",
};

export function makeRow(overrides: Partial<SubmissionRow> = {}): SubmissionRow {
  return {
    id: "00000000-0000-0000-0000-000000000000",
    number: 7,
    slug: "projeto-exemplo-abc123",
    project_name: "Projeto Exemplo",
    team_name: "Time Exemplo",
    tagline: "Uma frase com mais de dez caracteres.",
    category: "cloak",
    tech: "cloak",
    repo_url: "https://github.com/exemplo/projeto",
    sprint_changes: "PR #1",
    proof_type: "solana_tx",
    proof_value: "5".repeat(88),
    demo_video_url: "https://www.youtube.com/watch?v=abc",
    writeup: "Texto de privacidade.",
    colosseum_url: null,
    website_url: null,
    members: [
      { name: "Integrante Um", github: "um" },
      { name: "Integrante Dois" },
    ],
    show_members: true,
    contact_name: PRIVATE_SENTINELS.contact_name,
    contact_email: PRIVATE_SENTINELS.contact_email,
    contact_telegram: PRIVATE_SENTINELS.contact_telegram,
    contact_whatsapp: PRIVATE_SENTINELS.contact_whatsapp,
    accepted_rules: true,
    status: "submitted",
    is_winner: false,
    prize_pool: null,
    payout_status: "pending",
    admin_notes: PRIVATE_SENTINELS.admin_notes,
    edit_token_hash: PRIVATE_SENTINELS.edit_token_hash,
    ip_hash: PRIVATE_SENTINELS.ip_hash,
    created_at: "2026-10-01T12:00:00.000Z",
    updated_at: "2026-10-01T12:00:00.000Z",
    ...overrides,
  };
}

describe("toPublicSubmission", () => {
  it("only exposes whitelisted fields", () => {
    const publicSubmission = toPublicSubmission(makeRow());
    for (const key of Object.keys(publicSubmission)) {
      expect(PUBLIC_FIELDS as readonly string[]).toContain(key);
    }
  });

  it("never leaks private values", () => {
    const json = JSON.stringify(toPublicSubmission(makeRow()));
    for (const sentinel of Object.values(PRIVATE_SENTINELS)) {
      expect(json).not.toContain(sentinel);
    }
    expect(json).not.toContain("edit_token_hash");
    expect(json).not.toContain("accepted_rules");
    expect(json).not.toContain("payout_status");
  });

  it("includes members by default", () => {
    expect(toPublicSubmission(makeRow()).members).toHaveLength(2);
  });

  it("hides members when show_members is false", () => {
    const publicSubmission = toPublicSubmission(makeRow({ show_members: false }));
    expect(publicSubmission.members).toEqual([]);
  });

  it("exposes results fields", () => {
    const publicSubmission = toPublicSubmission(
      makeRow({ is_winner: true, prize_pool: "cloak" }),
    );
    expect(publicSubmission.is_winner).toBe(true);
    expect(publicSubmission.prize_pool).toBe("cloak");
  });
});
