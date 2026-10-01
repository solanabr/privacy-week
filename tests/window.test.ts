import { describe, expect, it } from "vitest";

import { getWindowState, type SubmissionWindow } from "@/lib/window";

const window: SubmissionWindow = {
  openAt: new Date("2026-09-30T15:00:00-03:00"),
  closeAt: new Date("2026-10-03T23:59:59-03:00"),
};

function offset(base: Date, ms: number): Date {
  return new Date(base.getTime() + ms);
}

describe("getWindowState", () => {
  it("is before one second before opening", () => {
    expect(getWindowState(offset(window.openAt, -1000), window)).toBe("before");
  });

  it("is open exactly at opening", () => {
    expect(getWindowState(window.openAt, window)).toBe("open");
  });

  it("is open exactly at closing", () => {
    expect(getWindowState(window.closeAt, window)).toBe("open");
  });

  it("is closed one second after closing", () => {
    expect(getWindowState(offset(window.closeAt, 1000), window)).toBe("closed");
  });

  it("is open in the middle of the window", () => {
    expect(
      getWindowState(new Date("2026-10-01T12:00:00-03:00"), window),
    ).toBe("open");
  });
});
