import "server-only";

import { makeSlug } from "@/lib/slug";
import type {
  Category,
  Member,
  ProofType,
  SubmissionData,
  SubmissionFormValues,
  Tech,
} from "@/lib/validation";

import { getDb, type Database } from "./server";

type Json = Database["public"]["Tables"]["submissions"]["Row"]["members"];

export type SubmissionRow = Database["public"]["Tables"]["submissions"]["Row"];
export type JudgeScoreRow = Database["public"]["Tables"]["judge_scores"]["Row"];

export interface PublicMember {
  name: string;
  x?: string;
  github?: string;
}

/** The only fields allowed to leave the server for public pages. */
export interface PublicSubmission {
  number: number;
  slug: string;
  project_name: string;
  team_name: string | null;
  tagline: string;
  category: Category;
  tech: Tech;
  repo_url: string;
  sprint_changes: string;
  proof_type: ProofType;
  proof_value: string;
  demo_video_url: string;
  writeup: string;
  colosseum_url: string | null;
  website_url: string | null;
  members: PublicMember[];
  created_at: string;
  is_winner: boolean;
  prize_pool: "cloak" | "zcash" | null;
}

/**
 * Whitelist of keys that may appear on a `PublicSubmission`. Used by the unit
 * test that guards against leaking private fields.
 */
export const PUBLIC_FIELDS = [
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
  "created_at",
  "is_winner",
  "prize_pool",
] as const satisfies readonly (keyof PublicSubmission)[];

/**
 * Columns selected for public queries. `show_members` is read to decide whether
 * to expose members, but it is never part of the public output.
 */
const PUBLIC_SELECT =
  "number, slug, project_name, team_name, tagline, category, tech, repo_url, sprint_changes, proof_type, proof_value, demo_video_url, writeup, colosseum_url, website_url, members, show_members, created_at, is_winner, prize_pool";

export function parseMembers(value: Json): PublicMember[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry): PublicMember[] => {
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
      return [];
    }
    const record = entry as Record<string, unknown>;
    const name = typeof record.name === "string" ? record.name : "";
    if (!name) return [];
    const member: PublicMember = { name };
    if (typeof record.x === "string" && record.x) member.x = record.x;
    if (typeof record.github === "string" && record.github) {
      member.github = record.github;
    }
    return [member];
  });
}

type PublicRow = Pick<
  SubmissionRow,
  | "number"
  | "slug"
  | "project_name"
  | "team_name"
  | "tagline"
  | "category"
  | "tech"
  | "repo_url"
  | "sprint_changes"
  | "proof_type"
  | "proof_value"
  | "demo_video_url"
  | "writeup"
  | "colosseum_url"
  | "website_url"
  | "members"
  | "show_members"
  | "created_at"
  | "is_winner"
  | "prize_pool"
>;

/** Map a full row to the public shape, dropping every private field. */
export function toPublicSubmission(row: PublicRow): PublicSubmission {
  return {
    number: row.number,
    slug: row.slug,
    project_name: row.project_name,
    team_name: row.team_name,
    tagline: row.tagline,
    category: row.category as Category,
    tech: row.tech as Tech,
    repo_url: row.repo_url,
    sprint_changes: row.sprint_changes,
    proof_type: row.proof_type as ProofType,
    proof_value: row.proof_value,
    demo_video_url: row.demo_video_url,
    writeup: row.writeup,
    colosseum_url: row.colosseum_url,
    website_url: row.website_url,
    members: row.show_members ? parseMembers(row.members) : [],
    created_at: row.created_at,
    is_winner: row.is_winner,
    prize_pool: row.prize_pool as "cloak" | "zcash" | null,
  };
}

export interface PublicFilters {
  category?: Category;
  tech?: Tech;
}

export async function listPublicSubmissions(
  filters: PublicFilters = {},
): Promise<PublicSubmission[]> {
  let query = getDb()
    .from("submissions")
    .select(PUBLIC_SELECT)
    .eq("status", "submitted")
    .order("created_at", { ascending: false });

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.tech) query = query.eq("tech", filters.tech);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row) => toPublicSubmission(row as PublicRow));
}

export async function getPublicSubmissionBySlug(
  slug: string,
): Promise<PublicSubmission | null> {
  const { data, error } = await getDb()
    .from("submissions")
    .select(PUBLIC_SELECT)
    .eq("slug", slug)
    .eq("status", "submitted")
    .maybeSingle();
  if (error) throw error;
  return data ? toPublicSubmission(data as PublicRow) : null;
}

export interface CreateSubmissionResult {
  id: string;
  number: number;
  slug: string;
}

function toInsertPayload(data: SubmissionData) {
  return {
    project_name: data.project_name,
    team_name: data.team_name,
    tagline: data.tagline,
    category: data.category,
    tech: data.tech,
    repo_url: data.repo_url,
    sprint_changes: data.sprint_changes,
    proof_type: data.proof_type,
    proof_value: data.proof_value,
    demo_video_url: data.demo_video_url,
    writeup: data.writeup,
    colosseum_url: data.colosseum_url,
    website_url: data.website_url,
    members: data.members as unknown as SubmissionRow["members"],
    show_members: data.show_members,
    contact_name: data.contact_name,
    contact_email: data.contact_email,
    contact_telegram: data.contact_telegram,
    contact_whatsapp: data.contact_whatsapp,
    accepted_rules: data.accepted_rules,
  };
}

export async function createSubmission(
  data: SubmissionData,
  options: { editTokenHash: string; ipHash: string | null },
): Promise<CreateSubmissionResult> {
  const slug = makeSlug(data.project_name);
  const { data: inserted, error } = await getDb()
    .from("submissions")
    .insert({
      ...toInsertPayload(data),
      slug,
      edit_token_hash: options.editTokenHash,
      ip_hash: options.ipHash,
    })
    .select("id, number, slug")
    .single();
  if (error) throw error;
  return inserted;
}

export async function getSubmissionByEditTokenHash(
  editTokenHash: string,
): Promise<SubmissionRow | null> {
  const { data, error } = await getDb()
    .from("submissions")
    .select("*")
    .eq("edit_token_hash", editTokenHash)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Update the public fields of a submission by edit-token hash. Moderation,
 * winner and payout fields are never touched here.
 */
export async function updateSubmissionByEditTokenHash(
  editTokenHash: string,
  data: SubmissionData,
): Promise<SubmissionRow | null> {
  const { data: updated, error } = await getDb()
    .from("submissions")
    .update(toInsertPayload(data))
    .eq("edit_token_hash", editTokenHash)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return updated;
}

export interface AdminFilters {
  category?: Category;
  tech?: Tech;
  status?: "submitted" | "hidden" | "disqualified";
}

export async function listAdminSubmissions(
  filters: AdminFilters = {},
): Promise<SubmissionRow[]> {
  let query = getDb()
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.tech) query = query.eq("tech", filters.tech);
  if (filters.status) query = query.eq("status", filters.status);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getAdminSubmission(id: string): Promise<SubmissionRow | null> {
  const { data, error } = await getDb()
    .from("submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export interface ModerationPatch {
  status?: "submitted" | "hidden" | "disqualified";
  is_winner?: boolean;
  prize_pool?: "cloak" | "zcash" | null;
  payout_status?: "pending" | "link_sent" | "claimed";
  admin_notes?: string | null;
}

export async function updateSubmissionModeration(
  id: string,
  patch: ModerationPatch,
): Promise<void> {
  const { error } = await getDb()
    .from("submissions")
    .update(patch)
    .eq("id", id);
  if (error) throw error;
}

export async function countCreatesByIpHashSince(
  ipHash: string,
  since: Date,
): Promise<number> {
  const { count, error } = await getDb()
    .from("submissions")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since.toISOString());
  if (error) throw error;
  return count ?? 0;
}

export async function getWinnerCounts(): Promise<{ cloak: number; zcash: number }> {
  const { data, error } = await getDb()
    .from("submissions")
    .select("prize_pool")
    .eq("is_winner", true);
  if (error) throw error;
  let cloak = 0;
  let zcash = 0;
  for (const row of data ?? []) {
    if (row.prize_pool === "cloak") cloak += 1;
    if (row.prize_pool === "zcash") zcash += 1;
  }
  return { cloak, zcash };
}

export async function listAllSubmissionsForExport(): Promise<SubmissionRow[]> {
  const { data, error } = await getDb()
    .from("submissions")
    .select("*")
    .order("number", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export type { Member };

/** Prefill values for the edit form from a full row. */
export function rowToFormValues(row: SubmissionRow): SubmissionFormValues {
  const members = parseMembers(row.members);
  return {
    project_name: row.project_name,
    team_name: row.team_name ?? "",
    tagline: row.tagline,
    category: row.category,
    tech: row.tech,
    repo_url: row.repo_url,
    sprint_changes: row.sprint_changes,
    proof_type: row.proof_type,
    proof_value: row.proof_value,
    demo_video_url: row.demo_video_url,
    writeup: row.writeup,
    colosseum_url: row.colosseum_url ?? "",
    website_url: row.website_url ?? "",
    members:
      members.length > 0
        ? members.map((member) => ({
            name: member.name,
            x: member.x ?? "",
            github: member.github ?? "",
          }))
        : [{ name: "", x: "", github: "" }],
    show_members: row.show_members,
    contact_name: row.contact_name,
    contact_email: row.contact_email,
    contact_telegram: row.contact_telegram ?? "",
    contact_whatsapp: row.contact_whatsapp ?? "",
    accepted_rules: row.accepted_rules,
  };
}
