/**
 * Submission window logic. Times are configured in BRT (America/Sao_Paulo) and
 * displayed in the same zone.
 */

export const TIME_ZONE = "America/Sao_Paulo";

export type WindowState = "before" | "open" | "closed";

export interface SubmissionWindow {
  openAt: Date;
  closeAt: Date;
}

const DEFAULT_OPEN_AT = "2026-09-30T15:00:00-03:00";
const DEFAULT_CLOSE_AT = "2026-10-05T04:00:00-03:00";

function parseEnvDate(name: string, fallback: string): Date {
  const raw = process.env[name] ?? fallback;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date in ${name}: ${raw}`);
  }
  return date;
}

export function getSubmissionWindow(): SubmissionWindow {
  return {
    openAt: parseEnvDate("SUBMISSIONS_OPEN_AT", DEFAULT_OPEN_AT),
    closeAt: parseEnvDate("SUBMISSIONS_CLOSE_AT", DEFAULT_CLOSE_AT),
  };
}

/**
 * Current time. In development only, `DEV_NOW` can override it to test the
 * window. Production builds always use the real clock.
 */
export function getNow(): Date {
  if (process.env.NODE_ENV === "development" && process.env.DEV_NOW) {
    const devNow = new Date(process.env.DEV_NOW);
    if (!Number.isNaN(devNow.getTime())) {
      return devNow;
    }
  }
  return new Date();
}

export function getWindowState(
  now: Date = getNow(),
  window: SubmissionWindow = getSubmissionWindow(),
): WindowState {
  const time = now.getTime();
  if (time < window.openAt.getTime()) return "before";
  if (time > window.closeAt.getTime()) return "closed";
  return "open";
}

export function isWindowOpen(now: Date = getNow()): boolean {
  return getWindowState(now) === "open";
}

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIME_ZONE,
  weekday: "short",
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** e.g. "sáb., 03 de out., 23:59" */
export function formatDateTimeBRT(date: Date): string {
  return dateTimeFormatter.format(date);
}

/** e.g. "03/10/2026 23:59" */
export function formatShortBRT(date: Date): string {
  return dateFormatter.format(date);
}

const clockFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/** e.g. "21:13:05" */
export function formatClockBRT(date: Date): string {
  return clockFormatter.format(date);
}

export function formatIsoBRT(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
}
