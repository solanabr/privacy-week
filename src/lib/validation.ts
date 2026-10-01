import { z } from "zod";

export const CATEGORIES = ["cloak", "zcash", "private_payments"] as const;
export const TECHS = ["cloak", "zcash", "both"] as const;
export const PROOF_TYPES = ["solana_tx", "zcash_tx", "app_url"] as const;

export type Category = (typeof CATEGORIES)[number];
export type Tech = (typeof TECHS)[number];
export type ProofType = (typeof PROOF_TYPES)[number];

export const MAX_MEMBERS = 6;
export const MAX_WRITEUP_WORDS = 300;

const VIDEO_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "loom.com",
  "www.loom.com",
  "vimeo.com",
  "www.vimeo.com",
]);

const SOLANA_SIGNATURE = /^[1-9A-HJ-NP-Za-km-z]{86,90}$/;
const ZCASH_TXID = /^[0-9a-fA-F]{64}$/;

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/u).length;
}

export function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function isGithubRepoUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "github.com" &&
      /^\/[^/]+\/[^/]+/.test(url.pathname)
    );
  } catch {
    return false;
  }
}

export function isAllowedVideoUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && VIDEO_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

export function isValidSolanaSignature(value: string): boolean {
  return SOLANA_SIGNATURE.test(value);
}

export function isValidZcashTxid(value: string): boolean {
  return ZCASH_TXID.test(value);
}

const optionalTrimmed = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value))
  .nullable();

const optionalHttpsUrl = optionalTrimmed.refine(
  (value) => value === null || isHttpsUrl(value),
  { error: "Use uma URL https:// válida" },
);

export const memberSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Informe o nome" })
    .max(80, { error: "Máximo de 80 caracteres" }),
  x: optionalTrimmed,
  github: optionalTrimmed,
});

export type Member = z.infer<typeof memberSchema>;

export const submissionSchema = z
  .object({
    project_name: z
      .string()
      .trim()
      .min(2, { error: "Use entre 2 e 80 caracteres" })
      .max(80, { error: "Use entre 2 e 80 caracteres" }),
    team_name: optionalTrimmed.refine(
      (value) => value === null || value.length <= 80,
      { error: "Máximo de 80 caracteres" },
    ),
    tagline: z
      .string()
      .trim()
      .min(10, { error: "Use entre 10 e 140 caracteres" })
      .max(140, { error: "Use entre 10 e 140 caracteres" }),
    category: z.enum(CATEGORIES, { error: "Escolha uma categoria" }),
    tech: z.enum(TECHS, { error: "Escolha uma opção" }),
    repo_url: z
      .string()
      .trim()
      .refine(isGithubRepoUrl, { error: "Use uma URL https://github.com/..." }),
    sprint_changes: z
      .string()
      .trim()
      .min(1, { error: "Descreva o que foi feito no sprint" })
      .max(300, { error: "Máximo de 300 caracteres" }),
    proof_type: z.enum(PROOF_TYPES, { error: "Escolha uma prova" }),
    proof_value: z.string().trim().min(1, { error: "Informe a prova" }),
    demo_video_url: z
      .string()
      .trim()
      .refine(isAllowedVideoUrl, {
        error: "Use um link do YouTube, Loom ou Vimeo",
      }),
    writeup: z
      .string()
      .trim()
      .min(1, { error: "Escreva o texto de privacidade" })
      .refine((value) => countWords(value) <= MAX_WRITEUP_WORDS, {
        error: `Máximo de ${MAX_WRITEUP_WORDS} palavras`,
      }),
    colosseum_url: optionalHttpsUrl,
    website_url: optionalHttpsUrl,
    members: z
      .array(memberSchema)
      .min(1, { error: "Informe pelo menos um integrante" })
      .max(MAX_MEMBERS, { error: `Máximo de ${MAX_MEMBERS} integrantes` }),
    show_members: z.boolean(),
    contact_name: z
      .string()
      .trim()
      .min(1, { error: "Informe o nome de contato" })
      .max(120, { error: "Máximo de 120 caracteres" }),
    contact_email: z.email({ error: "Informe um e-mail válido" }),
    contact_telegram: optionalTrimmed,
    contact_whatsapp: optionalTrimmed,
    accepted_rules: z.literal(true, {
      error: "É preciso aceitar as regras",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.proof_type === "solana_tx" && !isValidSolanaSignature(data.proof_value)) {
      ctx.addIssue({
        code: "custom",
        path: ["proof_value"],
        message: "Assinatura Solana inválida (86 a 90 caracteres, base58)",
      });
    }
    if (data.proof_type === "zcash_tx" && !isValidZcashTxid(data.proof_value)) {
      ctx.addIssue({
        code: "custom",
        path: ["proof_value"],
        message: "Txid Zcash inválido (64 caracteres hexadecimais)",
      });
    }
    if (data.proof_type === "app_url" && !isHttpsUrl(data.proof_value)) {
      ctx.addIssue({
        code: "custom",
        path: ["proof_value"],
        message: "Use uma URL https:// válida",
      });
    }
  });

export type SubmissionData = z.infer<typeof submissionSchema>;

export interface MemberFormValue {
  name: string;
  x: string;
  github: string;
}

export interface SubmissionFormValues {
  project_name: string;
  team_name: string;
  tagline: string;
  category: string;
  tech: string;
  repo_url: string;
  sprint_changes: string;
  proof_type: string;
  proof_value: string;
  demo_video_url: string;
  writeup: string;
  colosseum_url: string;
  website_url: string;
  members: MemberFormValue[];
  show_members: boolean;
  contact_name: string;
  contact_email: string;
  contact_telegram: string;
  contact_whatsapp: string;
  accepted_rules: boolean;
}

export function emptySubmissionValues(): SubmissionFormValues {
  return {
    project_name: "",
    team_name: "",
    tagline: "",
    category: "",
    tech: "",
    repo_url: "",
    sprint_changes: "",
    proof_type: "solana_tx",
    proof_value: "",
    demo_video_url: "",
    writeup: "",
    colosseum_url: "",
    website_url: "",
    members: [{ name: "", x: "", github: "" }],
    show_members: true,
    contact_name: "",
    contact_email: "",
    contact_telegram: "",
    contact_whatsapp: "",
    accepted_rules: false,
  };
}

function readString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function readSubmissionForm(formData: FormData): SubmissionFormValues {
  const members: MemberFormValue[] = [];
  for (let i = 0; i < MAX_MEMBERS; i += 1) {
    const name = readString(formData, `members[${i}].name`);
    const x = readString(formData, `members[${i}].x`);
    const github = readString(formData, `members[${i}].github`);
    if (name || x || github) {
      members.push({ name, x, github });
    }
  }

  return {
    project_name: readString(formData, "project_name"),
    team_name: readString(formData, "team_name"),
    tagline: readString(formData, "tagline"),
    category: readString(formData, "category"),
    tech: readString(formData, "tech"),
    repo_url: readString(formData, "repo_url"),
    sprint_changes: readString(formData, "sprint_changes"),
    proof_type: readString(formData, "proof_type"),
    proof_value: readString(formData, "proof_value"),
    demo_video_url: readString(formData, "demo_video_url"),
    writeup: readString(formData, "writeup"),
    colosseum_url: readString(formData, "colosseum_url"),
    website_url: readString(formData, "website_url"),
    members: members.length > 0 ? members : [{ name: "", x: "", github: "" }],
    show_members: formData.get("show_members") === "on",
    contact_name: readString(formData, "contact_name"),
    contact_email: readString(formData, "contact_email"),
    contact_telegram: readString(formData, "contact_telegram"),
    contact_whatsapp: readString(formData, "contact_whatsapp"),
    accepted_rules: formData.get("accepted_rules") === "on",
  };
}

export type SubmissionValidation =
  | { success: true; data: SubmissionData; values: SubmissionFormValues }
  | {
      success: false;
      fieldErrors: Record<string, string>;
      values: SubmissionFormValues;
    };

export function validateSubmissionFormData(
  formData: FormData,
): SubmissionValidation {
  const values = readSubmissionForm(formData);
  const parsed = submissionSchema.safeParse(values);

  if (parsed.success) {
    return { success: true, data: parsed.data, values };
  }

  const flat = z.flattenError(parsed.error).fieldErrors as Record<
    string,
    string[] | undefined
  >;
  const fieldErrors: Record<string, string> = {};
  for (const [field, messages] of Object.entries(flat)) {
    if (messages && messages.length > 0) {
      fieldErrors[field] = messages[0];
    }
  }
  return { success: false, fieldErrors, values };
}

/** True when the hidden honeypot field was filled in. */
export function isHoneypotFilled(formData: FormData): boolean {
  return readString(formData, "website").length > 0;
}
