import { describe, expect, it } from "vitest";

import { buildDashboard, dayKey } from "@/lib/dashboard";
import type { JudgeScoreRow, SubmissionRow } from "@/lib/db/submissions";

let counter = 0;

function submission(overrides: Partial<SubmissionRow> = {}): SubmissionRow {
  counter += 1;
  return {
    id: `id-${counter}`,
    number: counter,
    slug: `projeto-${counter}`,
    project_name: `Projeto ${counter}`,
    team_name: null,
    tagline: "Tagline",
    category: "cloak",
    tech: "cloak",
    repo_url: "https://github.com/x/y",
    sprint_changes: "PR #1",
    proof_type: "solana_tx",
    proof_value: "abc",
    demo_video_url: "https://youtube.com/watch?v=1",
    writeup: "texto",
    colosseum_url: null,
    website_url: null,
    members: [{ name: "A" }, { name: "B" }],
    show_members: true,
    contact_name: "A",
    contact_email: "a@example.com",
    contact_telegram: null,
    contact_whatsapp: null,
    accepted_rules: true,
    status: "submitted",
    is_winner: false,
    prize_pool: null,
    payout_status: "pending",
    admin_notes: null,
    edit_token_hash: "hash",
    ip_hash: null,
    x_user_id: null,
    x_username: null,
    created_at: "2026-10-01T12:00:00-03:00",
    updated_at: "2026-10-01T12:00:00-03:00",
    ...overrides,
  };
}

function score(
  submission_id: string,
  judge: string,
  values: [number, number, number, number],
): JudgeScoreRow {
  counter += 1;
  return {
    id: `score-${counter}`,
    submission_id,
    judge,
    privacy_impact: values[0],
    execution: values[1],
    project_fit: values[2],
    ux_presentation: values[3],
    notes: null,
    created_at: "2026-10-02T10:00:00-03:00",
    updated_at: "2026-10-02T10:00:00-03:00",
  };
}

const options = {
  now: new Date("2026-10-02T15:00:00-03:00"),
  window: {
    openAt: new Date("2026-09-30T15:00:00-03:00"),
    closeAt: new Date("2026-10-03T23:59:59-03:00"),
  },
  judges: ["Victor", "Marcelo", "Matheus"],
};

describe("dayKey", () => {
  it("buckets by Brasília day, not UTC", () => {
    // 23:30 BRT on the 1st is 02:30 UTC on the 2nd.
    expect(dayKey(new Date("2026-10-01T23:30:00-03:00"))).toBe("2026-10-01");
  });
});

describe("buildDashboard", () => {
  it("counts statuses, payouts, winners, members and the last 24 hours", () => {
    const rows = [
      submission({ created_at: "2026-10-02T10:00:00-03:00", is_winner: true, prize_pool: "cloak", payout_status: "link_sent" }),
      submission({ created_at: "2026-10-01T10:00:00-03:00", status: "hidden" }),
      submission({ created_at: "2026-09-30T16:00:00-03:00", status: "disqualified", members: [] }),
      submission({ created_at: "2026-10-02T14:00:00-03:00", is_winner: true, prize_pool: "zcash", payout_status: "claimed" }),
    ];
    const stats = buildDashboard(rows, [], options);
    expect(stats.total).toBe(4);
    expect(stats.byStatus).toEqual({ submitted: 2, hidden: 1, disqualified: 1 });
    expect(stats.payouts).toEqual({ pending: 2, link_sent: 1, claimed: 1 });
    expect(stats.winners).toEqual({ cloak: 1, zcash: 1, cap: 5 });
    expect(stats.last24h).toBe(2);
    expect(stats.membersTotal).toBe(6);
  });

  it("builds one column per day from opening through the later of close and now", () => {
    const rows = [
      submission({ created_at: "2026-09-30T16:00:00-03:00" }),
      submission({ created_at: "2026-10-01T23:30:00-03:00" }),
      submission({ created_at: "2026-10-01T09:00:00-03:00" }),
    ];
    const stats = buildDashboard(rows, [], options);
    expect(stats.perDay.map((day) => `${day.label}:${day.count}`)).toEqual([
      "30/09:1",
      "01/10:2",
      "02/10:0",
      "03/10:0",
    ]);
  });

  it("shares and sorts category, tech and proof counts over public rows only", () => {
    const rows = [
      submission({ category: "zcash", tech: "zcash", proof_type: "zcash_tx" }),
      submission({ category: "zcash", tech: "both", proof_type: "app_url" }),
      submission({ category: "cloak", tech: "cloak" }),
      submission({ category: "cloak", status: "hidden" }),
    ];
    const stats = buildDashboard(rows, [], options);
    expect(stats.byCategory).toEqual([
      { key: "zcash", count: 2, share: 2 / 3 },
      { key: "cloak", count: 1, share: 1 / 3 },
    ]);
    expect(stats.byTech.map((row) => row.key)).toEqual(["both", "cloak", "zcash"]);
    expect(stats.byProof.map((row) => row.count)).toEqual([1, 1, 1]);
  });

  it("ranks public submissions by weighted score with unscored ones last", () => {
    const a = submission({ project_name: "A" });
    const b = submission({ project_name: "B" });
    const c = submission({ project_name: "C" });
    const hidden = submission({ project_name: "Hidden", status: "hidden" });
    const scores = [
      score(a.id, "Victor", [10, 10, 10, 10]),
      score(a.id, "Marcelo", [8, 8, 8, 8]),
      score(b.id, "Victor", [10, 10, 10, 10]),
      score(hidden.id, "Victor", [10, 10, 10, 10]),
    ];
    const stats = buildDashboard([c, b, a, hidden], scores, options);
    expect(stats.leaderboard.map((row) => row.project_name)).toEqual(["B", "A", "C"]);
    expect(stats.leaderboard[0].weighted).toBe(10);
    expect(stats.leaderboard[1].weighted).toBe(9);
    expect(stats.leaderboard[2].weighted).toBeNull();
    expect(stats.leaderboard[1].judges).toBe(2);
  });

  it("reports judging progress per expected judge over public submissions", () => {
    const a = submission();
    const b = submission();
    const hidden = submission({ status: "hidden" });
    const scores = [
      score(a.id, "Victor", [5, 5, 5, 5]),
      score(b.id, "Victor", [5, 5, 5, 5]),
      score(a.id, "Marcelo", [5, 5, 5, 5]),
      score(hidden.id, "Marcelo", [5, 5, 5, 5]),
      score(a.id, "Matheus", [7, 7, 7, 7]),
    ];
    const stats = buildDashboard([a, b, hidden], scores, options);
    expect(stats.judging.total).toBe(2);
    expect(stats.judging.scored).toBe(2);
    expect(stats.judging.fullyScored).toBe(1);
    expect(stats.judging.expectedJudges).toBe(3);
    expect(stats.judging.perJudge).toEqual([
      { judge: "Marcelo", scored: 1, total: 2 },
      { judge: "Matheus", scored: 1, total: 2 },
      { judge: "Victor", scored: 2, total: 2 },
    ]);
    expect(stats.judging.averageWeighted).toBeCloseTo((17 / 3 + 5) / 2, 5);
  });

  it("merges judges that only appear on scores and lists the latest submissions", () => {
    const a = submission({ created_at: "2026-10-01T10:00:00-03:00" });
    const b = submission({ created_at: "2026-10-02T10:00:00-03:00" });
    const stats = buildDashboard([a, b], [score(a.id, "Convidado", [1, 1, 1, 1])], {
      ...options,
      judges: [],
      latestSize: 1,
    });
    expect(stats.judging.expectedJudges).toBe(1);
    expect(stats.judging.perJudge[0].judge).toBe("Convidado");
    expect(stats.latest.map((row) => row.id)).toEqual([b.id]);
  });

  it("handles an empty database", () => {
    const stats = buildDashboard([], [], options);
    expect(stats.total).toBe(0);
    expect(stats.perDay.length).toBe(4);
    expect(stats.judging.averageWeighted).toBeNull();
    expect(stats.leaderboard).toEqual([]);
  });
});
