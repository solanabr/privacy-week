"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { admin } from "@/content/admin";
import { upsertJudgeScore } from "@/lib/db/judging";
import { getAdminSubmission, updateSubmissionModeration } from "@/lib/db/submissions";
import { requireAdmin } from "@/lib/admin-auth";

const STATUSES = ["submitted", "hidden", "disqualified"] as const;
const POOLS = ["cloak", "zcash"] as const;
const PAYOUT_STATUSES = ["pending", "link_sent", "claimed"] as const;

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function invalidate(id: string, slug?: string): void {
  revalidatePath("/admin");
  revalidatePath(`/admin/${id}`);
  revalidatePath("/projetos");
  if (slug) revalidatePath(`/projetos/${slug}`);
}

export async function saveStatusAction(id: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const status = text(formData, "status");
  const reason = text(formData, "reason");
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) {
    throw new Error(admin.errors.invalid);
  }
  if (status === "disqualified" && reason.length < 3) {
    throw new Error(admin.errors.invalid);
  }

  const current = await getAdminSubmission(id);
  if (!current) redirect("/admin");
  const notes = status === "disqualified"
    ? [current.admin_notes, `Desclassificação: ${reason}`].filter(Boolean).join("\n")
    : current.admin_notes;
  await updateSubmissionModeration(id, {
    status: status as (typeof STATUSES)[number],
    ...(status === "disqualified" ? { admin_notes: notes } : {}),
  });
  invalidate(id, current.slug);
}

export async function saveWinnerAction(id: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const current = await getAdminSubmission(id);
  if (!current) redirect("/admin");
  const winnerValue = text(formData, "is_winner");
  if (winnerValue !== "true" && winnerValue !== "false") {
    throw new Error(admin.errors.invalid);
  }
  const winner = winnerValue === "true";
  const pool = text(formData, "prize_pool");
  if (winner && !POOLS.includes(pool as (typeof POOLS)[number])) {
    throw new Error(admin.errors.invalid);
  }
  await updateSubmissionModeration(id, {
    is_winner: winner,
    prize_pool: winner ? (pool as (typeof POOLS)[number]) : null,
  });
  invalidate(id, current.slug);
}

export async function savePayoutAction(id: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const current = await getAdminSubmission(id);
  if (!current) redirect("/admin");
  const payoutStatus = text(formData, "payout_status");
  if (!PAYOUT_STATUSES.includes(payoutStatus as (typeof PAYOUT_STATUSES)[number])) {
    throw new Error(admin.errors.invalid);
  }
  await updateSubmissionModeration(id, {
    payout_status: payoutStatus as (typeof PAYOUT_STATUSES)[number],
  });
  invalidate(id, current.slug);
}

export async function saveAdminNotesAction(id: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const current = await getAdminSubmission(id);
  if (!current) redirect("/admin");
  const notes = text(formData, "admin_notes");
  if (notes.length > 5000) throw new Error(admin.errors.invalid);
  await updateSubmissionModeration(id, { admin_notes: notes || null });
  invalidate(id, current.slug);
}

export async function saveJudgeScoreAction(id: string, formData: FormData): Promise<void> {
  const judge = await requireAdmin();
  const current = await getAdminSubmission(id);
  if (!current) redirect("/admin");

  const scoreValue = (field: string): number | null => {
    const value = text(formData, field);
    if (!value || !/^\d+$/.test(value)) return null;
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed <= 10 ? parsed : null;
  };
  const privacyImpact = scoreValue("privacy_impact");
  const execution = scoreValue("execution");
  const projectFit = scoreValue("project_fit");
  const uxPresentation = scoreValue("ux_presentation");
  const validScores = [privacyImpact, execution, projectFit, uxPresentation].every(
    (score) => score !== null,
  );
  const notes = text(formData, "notes");
  if (!validScores || notes.length > 2000) {
    throw new Error(admin.errors.invalid);
  }

  if (privacyImpact === null || execution === null || projectFit === null || uxPresentation === null) {
    throw new Error(admin.errors.invalid);
  }
  await upsertJudgeScore(current.id, judge, {
    privacy_impact: privacyImpact,
    execution,
    project_fit: projectFit,
    ux_presentation: uxPresentation,
    notes: notes || null,
  });
  invalidate(id, current.slug);
  redirect(`/admin/${id}`);
}
