import "server-only";

import { getDb } from "./server";
import type { JudgeScoreRow } from "./submissions";

export const JUDGING_CRITERIA = [
  { key: "privacy_impact", weight: 0.3 },
  { key: "execution", weight: 0.3 },
  { key: "project_fit", weight: 0.2 },
  { key: "ux_presentation", weight: 0.2 },
] as const;

export type JudgingCriterionKey = (typeof JUDGING_CRITERIA)[number]["key"];

export interface ScoreInput {
  privacy_impact: number;
  execution: number;
  project_fit: number;
  ux_presentation: number;
  notes?: string | null;
}

export function weightedScore(score: ScoreInput): number {
  return JUDGING_CRITERIA.reduce((total, criterion) => {
    return total + score[criterion.key] * criterion.weight;
  }, 0);
}

export interface ScoreAggregate {
  weighted: number | null;
  judges: number;
}

export function aggregateScores(
  scores: JudgeScoreRow[],
): Map<string, ScoreAggregate> {
  const grouped = new Map<string, JudgeScoreRow[]>();
  for (const score of scores) {
    const list = grouped.get(score.submission_id) ?? [];
    list.push(score);
    grouped.set(score.submission_id, list);
  }

  const result = new Map<string, ScoreAggregate>();
  for (const [submissionId, list] of grouped) {
    const total = list.reduce((sum, score) => sum + weightedScore(score), 0);
    result.set(submissionId, {
      weighted: total / list.length,
      judges: list.length,
    });
  }
  return result;
}

export async function getAllScores(): Promise<JudgeScoreRow[]> {
  const { data, error } = await getDb().from("judge_scores").select("*");
  if (error) throw error;
  return data ?? [];
}

export async function listScoresForSubmission(
  submissionId: string,
): Promise<JudgeScoreRow[]> {
  const { data, error } = await getDb()
    .from("judge_scores")
    .select("*")
    .eq("submission_id", submissionId)
    .order("judge", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getJudgeScore(
  submissionId: string,
  judge: string,
): Promise<JudgeScoreRow | null> {
  const { data, error } = await getDb()
    .from("judge_scores")
    .select("*")
    .eq("submission_id", submissionId)
    .eq("judge", judge)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertJudgeScore(
  submissionId: string,
  judge: string,
  input: ScoreInput,
): Promise<void> {
  const { error } = await getDb()
    .from("judge_scores")
    .upsert(
      {
        submission_id: submissionId,
        judge,
        privacy_impact: input.privacy_impact,
        execution: input.execution,
        project_fit: input.project_fit,
        ux_presentation: input.ux_presentation,
        notes: input.notes ?? null,
      },
      { onConflict: "submission_id,judge" },
    );
  if (error) throw error;
}
