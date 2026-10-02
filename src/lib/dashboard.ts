import { weightedScore } from "@/lib/db/judging";
import type { JudgeScoreRow, SubmissionRow } from "@/lib/db/submissions";
import { TIME_ZONE } from "@/lib/window";

export type Status = "submitted" | "hidden" | "disqualified";
export type PayoutStatus = "pending" | "link_sent" | "claimed";

export interface DayBucket {
  /** YYYY-MM-DD in BRT. */
  key: string;
  /** DD/MM */
  label: string;
  count: number;
}

export interface CountRow {
  key: string;
  count: number;
  /** 0..1 share of the total. */
  share: number;
}

export interface JudgeProgress {
  judge: string;
  scored: number;
  total: number;
}

export interface LeaderboardRow {
  id: string;
  number: number;
  slug: string;
  project_name: string;
  team_name: string | null;
  category: string;
  tech: string;
  status: string;
  created_at: string;
  weighted: number | null;
  judges: number;
  is_winner: boolean;
  prize_pool: string | null;
}

export interface DashboardStats {
  total: number;
  byStatus: Record<Status, number>;
  last24h: number;
  membersTotal: number;
  winners: { cloak: number; zcash: number; cap: number };
  payouts: Record<PayoutStatus, number>;
  judging: {
    /** Public submissions with at least one score. */
    scored: number;
    /** Public submissions scored by every expected judge. */
    fullyScored: number;
    /** Public submissions, the judging denominator. */
    total: number;
    expectedJudges: number;
    perJudge: JudgeProgress[];
    averageWeighted: number | null;
  };
  perDay: DayBucket[];
  byCategory: CountRow[];
  byTech: CountRow[];
  byProof: CountRow[];
  leaderboard: LeaderboardRow[];
  latest: LeaderboardRow[];
}

export interface DashboardOptions {
  now: Date;
  window: { openAt: Date; closeAt: Date };
  /** Judge names from ADMIN_USERS; names found on scores are merged in. */
  judges: readonly string[];
  winnersCap?: number;
  leaderboardSize?: number;
  latestSize?: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const dayKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** YYYY-MM-DD of a moment, in BRT. */
export function dayKey(date: Date): string {
  return dayKeyFormatter.format(date);
}

function dayLabel(key: string): string {
  const [, month, day] = key.split("-");
  return `${day}/${month}`;
}

function countBy(rows: readonly SubmissionRow[], pick: (row: SubmissionRow) => string): CountRow[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const key = pick(row);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const total = rows.length;
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count, share: total ? count / total : 0 }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

function membersCount(value: SubmissionRow["members"]): number {
  return Array.isArray(value) ? value.length : 0;
}

/**
 * Everything the admin dashboard shows, from the full submission and score
 * lists. Pure, so it is unit-tested and the page only renders.
 */
export function buildDashboard(
  submissions: readonly SubmissionRow[],
  scores: readonly JudgeScoreRow[],
  options: DashboardOptions,
): DashboardStats {
  const {
    now,
    window,
    winnersCap = 5,
    leaderboardSize = 10,
    latestSize = 5,
  } = options;

  const byStatus: Record<Status, number> = { submitted: 0, hidden: 0, disqualified: 0 };
  const payouts: Record<PayoutStatus, number> = { pending: 0, link_sent: 0, claimed: 0 };
  const winners = { cloak: 0, zcash: 0, cap: winnersCap };
  let last24h = 0;
  let membersTotal = 0;
  const since = now.getTime() - DAY_MS;

  for (const row of submissions) {
    if (row.status in byStatus) byStatus[row.status as Status] += 1;
    if (row.payout_status in payouts) payouts[row.payout_status as PayoutStatus] += 1;
    if (row.is_winner && row.prize_pool === "cloak") winners.cloak += 1;
    if (row.is_winner && row.prize_pool === "zcash") winners.zcash += 1;
    if (new Date(row.created_at).getTime() >= since) last24h += 1;
    membersTotal += membersCount(row.members);
  }

  // Per day, from the opening day through the later of close day and today,
  // so a quiet day still shows as an empty column.
  const perDayMap = new Map<string, number>();
  const end = Math.max(window.closeAt.getTime(), now.getTime());
  for (let t = window.openAt.getTime(); t <= end + DAY_MS; t += DAY_MS) {
    const key = dayKey(new Date(t));
    if (!perDayMap.has(key)) perDayMap.set(key, 0);
    if (key === dayKey(new Date(end))) break;
  }
  for (const row of submissions) {
    const key = dayKey(new Date(row.created_at));
    perDayMap.set(key, (perDayMap.get(key) ?? 0) + 1);
  }
  const perDay: DayBucket[] = [...perDayMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => ({ key, label: dayLabel(key), count }));

  // Scores grouped per submission.
  const scoresBySubmission = new Map<string, JudgeScoreRow[]>();
  for (const score of scores) {
    const list = scoresBySubmission.get(score.submission_id) ?? [];
    list.push(score);
    scoresBySubmission.set(score.submission_id, list);
  }

  const toRow = (row: SubmissionRow): LeaderboardRow => {
    const list = scoresBySubmission.get(row.id) ?? [];
    const weighted =
      list.length > 0
        ? list.reduce((sum, score) => sum + weightedScore(score), 0) / list.length
        : null;
    return {
      id: row.id,
      number: row.number,
      slug: row.slug,
      project_name: row.project_name,
      team_name: row.team_name,
      category: row.category,
      tech: row.tech,
      status: row.status,
      created_at: row.created_at,
      weighted,
      judges: list.length,
      is_winner: row.is_winner,
      prize_pool: row.prize_pool,
    };
  };

  const publicRows = submissions.filter((row) => row.status === "submitted");
  const judgeNames = new Set<string>(options.judges);
  for (const score of scores) judgeNames.add(score.judge);
  const publicIds = new Set(publicRows.map((row) => row.id));
  const expectedJudges = judgeNames.size;

  const perJudge: JudgeProgress[] = [...judgeNames]
    .sort((a, b) => a.localeCompare(b))
    .map((judge) => ({
      judge,
      scored: scores.filter(
        (score) => score.judge === judge && publicIds.has(score.submission_id),
      ).length,
      total: publicRows.length,
    }));

  const ranked = publicRows.map(toRow);
  const scored = ranked.filter((row) => row.judges > 0);
  const fullyScored = ranked.filter(
    (row) => expectedJudges > 0 && row.judges >= expectedJudges,
  ).length;
  const averageWeighted =
    scored.length > 0
      ? scored.reduce((sum, row) => sum + (row.weighted ?? 0), 0) / scored.length
      : null;

  const leaderboard = [...ranked]
    .sort((a, b) => {
      if (a.weighted === null && b.weighted === null) return a.number - b.number;
      if (a.weighted === null) return 1;
      if (b.weighted === null) return -1;
      return b.weighted - a.weighted || b.judges - a.judges || a.number - b.number;
    })
    .slice(0, leaderboardSize);

  const latest = [...submissions]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, latestSize)
    .map(toRow);

  return {
    total: submissions.length,
    byStatus,
    last24h,
    membersTotal,
    winners,
    payouts,
    judging: {
      scored: scored.length,
      fullyScored,
      total: publicRows.length,
      expectedJudges,
      perJudge,
      averageWeighted,
    },
    perDay,
    byCategory: countBy(publicRows, (row) => row.category),
    byTech: countBy(publicRows, (row) => row.tech),
    byProof: countBy(publicRows, (row) => row.proof_type),
    leaderboard,
    latest,
  };
}
