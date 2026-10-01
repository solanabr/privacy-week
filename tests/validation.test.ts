import { describe, expect, it } from "vitest";

import {
  countWords,
  isAllowedVideoUrl,
  isGithubRepoUrl,
  isValidSolanaSignature,
  isValidZcashTxid,
  MAX_MEMBERS,
  memberSchema,
  submissionSchema,
  validateSubmissionFormData,
} from "@/lib/validation";
import { buildFormData, SOLANA_SIGNATURE, words, ZCASH_TXID } from "./helpers";

describe("countWords", () => {
  it("counts words separated by whitespace", () => {
    expect(countWords("  um   dois\ntrês  ")).toBe(3);
    expect(countWords("")).toBe(0);
  });
});

describe("writeup word limit", () => {
  it("accepts exactly 300 words", () => {
    const result = validateSubmissionFormData(
      buildFormData({ writeup: words(300) }),
    );
    expect(result.success).toBe(true);
  });

  it("rejects 301 words", () => {
    const result = validateSubmissionFormData(
      buildFormData({ writeup: words(301) }),
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.writeup).toContain("300");
    }
  });
});

describe("URL rules", () => {
  it("only accepts GitHub repos under github.com", () => {
    expect(isGithubRepoUrl("https://github.com/a/b")).toBe(true);
    expect(isGithubRepoUrl("http://github.com/a/b")).toBe(false);
    expect(isGithubRepoUrl("https://gitlab.com/a/b")).toBe(false);
    expect(isGithubRepoUrl("https://github.com")).toBe(false);
  });

  it("allows only known video hosts", () => {
    expect(isAllowedVideoUrl("https://youtu.be/abc")).toBe(true);
    expect(isAllowedVideoUrl("https://www.loom.com/share/abc")).toBe(true);
    expect(isAllowedVideoUrl("https://vimeo.com/123")).toBe(true);
    expect(isAllowedVideoUrl("https://example.com/video")).toBe(false);
    expect(isAllowedVideoUrl("http://youtube.com/watch?v=a")).toBe(false);
  });

  it("rejects a non-github repo", () => {
    const result = validateSubmissionFormData(
      buildFormData({ repo_url: "https://example.com/repo" }),
    );
    expect(result.success).toBe(false);
  });
});

describe("proof formats", () => {
  it("validates solana signatures and zcash txids", () => {
    expect(isValidSolanaSignature(SOLANA_SIGNATURE)).toBe(true);
    expect(isValidSolanaSignature("0OIl")).toBe(false);
    expect(isValidZcashTxid(ZCASH_TXID)).toBe(true);
    expect(isValidZcashTxid("zz".repeat(32))).toBe(false);
  });

  it("checks proof_value against proof_type", () => {
    const ok = validateSubmissionFormData(
      buildFormData({ proof_type: "zcash_tx", proof_value: ZCASH_TXID }),
    );
    expect(ok.success).toBe(true);

    const bad = validateSubmissionFormData(
      buildFormData({ proof_type: "zcash_tx", proof_value: "not-a-txid" }),
    );
    expect(bad.success).toBe(false);

    const appOk = validateSubmissionFormData(
      buildFormData({ proof_type: "app_url", proof_value: "https://app.example.com" }),
    );
    expect(appOk.success).toBe(true);
  });
});

describe("members", () => {
  it("requires between 1 and 6 members", () => {
    const none = submissionSchema.safeParse({
      ...validPayload(),
      members: [],
    });
    expect(none.success).toBe(false);

    const seven = submissionSchema.safeParse({
      ...validPayload(),
      members: Array.from({ length: MAX_MEMBERS + 1 }, (_, i) => ({
        name: `M${i}`,
        x: null,
        github: null,
      })),
    });
    expect(seven.success).toBe(false);
  });

  it("trims member names", () => {
    expect(memberSchema.parse({ name: "  Ana  ", x: "", github: "" }).name).toBe(
      "Ana",
    );
  });
});

describe("full form", () => {
  it("accepts a valid submission and trims strings", () => {
    const result = validateSubmissionFormData(
      buildFormData({ project_name: "  Projeto X  " }),
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.project_name).toBe("Projeto X");
      expect(result.data.members).toHaveLength(1);
      expect(result.data.members[0].name).toBe("Integrante Um");
      expect(result.data.category).toBe("cloak");
    }
  });

  it("requires the rules acceptance", () => {
    const result = validateSubmissionFormData(
      buildFormData({ accepted_rules: undefined }),
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.accepted_rules).toBeDefined();
    }
  });
});

function validPayload() {
  return {
    project_name: "Projeto de Teste",
    team_name: null,
    tagline: "Uma frase com mais de dez caracteres.",
    category: "cloak" as const,
    tech: "cloak" as const,
    repo_url: "https://github.com/exemplo/projeto",
    sprint_changes: "PR #1",
    proof_type: "solana_tx" as const,
    proof_value: SOLANA_SIGNATURE,
    demo_video_url: "https://www.youtube.com/watch?v=abc",
    writeup: "Um texto curto de privacidade.",
    colosseum_url: null,
    website_url: null,
    members: [{ name: "Um", x: null, github: null }],
    show_members: true,
    contact_name: "Pessoa",
    contact_email: "pessoa@example.com",
    contact_telegram: null,
    contact_whatsapp: null,
    accepted_rules: true,
  };
}
