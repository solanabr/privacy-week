import { describe, expect, it } from "vitest";

import {
  aggregateScores,
  weightedScore,
  type ScoreInput,
} from "@/lib/db/judging";
import type { JudgeScoreRow } from "@/lib/db/submissions";

const perfect: ScoreInput = {
  privacy_impact: 10,
  execution: 10,
  project_fit: 10,
  ux_presentation: 10,
};

describe("weightedScore", () => {
  it("is 10 for a perfect score", () => {
    expect(weightedScore(perfect)).toBeCloseTo(10);
  });

  it("applies the weights", () => {
    expect(
      weightedScore({
        privacy_impact: 10,
        execution: 0,
        project_fit: 0,
        ux_presentation: 0,
      }),
    ).toBeCloseTo(3);
  });

  it("is 0 for zeros", () => {
    expect(
      weightedScore({
        privacy_impact: 0,
        execution: 0,
        project_fit: 0,
        ux_presentation: 0,
      }),
    ).toBe(0);
  });
});

function scoreRow(
  submissionId: string,
  values: Partial<JudgeScoreRow>,
): JudgeScoreRow {
  return {
    id: "x",
    submission_id: submissionId,
    judge: "juiz",
    privacy_impact: 0,
    execution: 0,
    project_fit: 0,
    ux_presentation: 0,
    notes: null,
    created_at: "2026-10-01T12:00:00.000Z",
    updated_at: "2026-10-01T12:00:00.000Z",
    ...values,
  };
}

describe("aggregateScores", () => {
  it("averages the weighted score across judges", () => {
    const aggregates = aggregateScores([
      scoreRow("a", { judge: "j1", ...perfect }),
      scoreRow("a", {
        judge: "j2",
        privacy_impact: 0,
        execution: 0,
        project_fit: 0,
        ux_presentation: 0,
      }),
      scoreRow("b", { judge: "j1", privacy_impact: 10, execution: 0, project_fit: 0, ux_presentation: 0 }),
    ]);

    expect(aggregates.get("a")).toEqual({ weighted: 5, judges: 2 });
    expect(aggregates.get("b")?.weighted).toBeCloseTo(3);
    expect(aggregates.get("b")?.judges).toBe(1);
  });
});
