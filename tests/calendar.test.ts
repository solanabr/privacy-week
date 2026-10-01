import { describe, expect, it } from "vitest";

import { calendarState, nextCalendarIndex } from "@/lib/calendar";

const workshop = { at: "2026-09-30T15:00:00-03:00" };
const build = {
  at: "2026-09-30T15:00:00-03:00",
  until: "2026-10-03T23:59:59-03:00",
};
const results = { at: "2026-10-10T00:00:00-03:00" };

describe("calendarState", () => {
  it("is upcoming before the start", () => {
    expect(calendarState(build, new Date("2026-09-30T14:59:00-03:00"))).toBe(
      "upcoming",
    );
  });

  it("is now between start and end of a span", () => {
    expect(calendarState(build, new Date("2026-10-01T12:00:00-03:00"))).toBe(
      "now",
    );
  });

  it("is done after the end of a span", () => {
    expect(calendarState(build, new Date("2026-10-04T00:00:00-03:00"))).toBe(
      "done",
    );
  });

  it("treats a point event as lasting the rest of its day", () => {
    expect(calendarState(workshop, new Date("2026-09-30T20:00:00-03:00"))).toBe(
      "now",
    );
    expect(calendarState(workshop, new Date("2026-10-01T15:00:00-03:00"))).toBe(
      "done",
    );
  });
});

describe("nextCalendarIndex", () => {
  const rows = [workshop, build, results];

  it("returns -1 while something is happening", () => {
    expect(nextCalendarIndex(rows, new Date("2026-10-01T12:00:00-03:00"))).toBe(
      -1,
    );
  });

  it("points at the first upcoming entry during a gap", () => {
    expect(nextCalendarIndex(rows, new Date("2026-10-05T12:00:00-03:00"))).toBe(
      2,
    );
  });

  it("returns -1 when everything is over", () => {
    expect(nextCalendarIndex(rows, new Date("2026-10-20T12:00:00-03:00"))).toBe(
      -1,
    );
  });
});
