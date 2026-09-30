export const SOLANA_SIGNATURE = `5${"a".repeat(87)}`;
export const ZCASH_TXID = "a".repeat(64);

export interface FormOverrides {
  [key: string]: string | undefined;
}

const BASE_FIELDS: Record<string, string> = {
  project_name: "Projeto de Teste",
  team_name: "Time de Teste",
  tagline: "Uma frase com mais de dez caracteres.",
  category: "cloak",
  tech: "cloak",
  repo_url: "https://github.com/exemplo/projeto",
  sprint_changes: "PR #1",
  proof_type: "solana_tx",
  proof_value: SOLANA_SIGNATURE,
  demo_video_url: "https://www.youtube.com/watch?v=abc",
  writeup: "Um texto curto de privacidade.",
  contact_name: "Pessoa de Teste",
  contact_email: "pessoa@example.com",
  "members[0].name": "Integrante Um",
  show_members: "on",
  accepted_rules: "on",
};

export function buildFormData(overrides: FormOverrides = {}): FormData {
  const formData = new FormData();
  const merged: Record<string, string> = { ...BASE_FIELDS };
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      delete merged[key];
    } else {
      merged[key] = value;
    }
  }
  for (const [key, value] of Object.entries(merged)) {
    formData.append(key, value);
  }
  return formData;
}

export function words(count: number): string {
  return Array.from({ length: count }, (_, index) => `p${index}`).join(" ");
}

export function makeSubmissionRow(
  overrides: Partial<import("@/lib/db/submissions").SubmissionRow> = {},
): import("@/lib/db/submissions").SubmissionRow {
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
    contact_name: "Pessoa Secreta",
    contact_email: "private-contact@example.com",
    contact_telegram: "@naoexpor",
    contact_whatsapp: "+5511999999999",
    accepted_rules: true,
    status: "submitted",
    is_winner: false,
    prize_pool: null,
    payout_status: "pending",
    admin_notes: "nota interna secreta",
    edit_token_hash: "deadbeef".repeat(8),
    ip_hash: "cafebabe".repeat(8),
    created_at: "2026-10-01T12:00:00.000Z",
    updated_at: "2026-10-01T12:00:00.000Z",
    ...overrides,
  };
}
