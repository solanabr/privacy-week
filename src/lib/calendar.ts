export type CalendarState = "done" | "now" | "upcoming";

export interface CalendarEntry {
  at: string;
  until?: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * A point event without an end lasts the rest of its day, so "now" means
 * "today" for it; a span is "now" from its start until its end.
 */
export function calendarState(entry: CalendarEntry, now: Date): CalendarState {
  const start = new Date(entry.at).getTime();
  const end = entry.until
    ? new Date(entry.until).getTime()
    : start + DAY_MS;
  const time = now.getTime();
  if (time >= end) return "done";
  if (time >= start) return "now";
  return "upcoming";
}

/**
 * Index of the first upcoming entry when nothing is happening right now, so
 * the track can point at what comes next. Returns -1 otherwise.
 */
export function nextCalendarIndex(
  entries: readonly CalendarEntry[],
  now: Date,
): number {
  const states = entries.map((entry) => calendarState(entry, now));
  if (states.includes("now")) return -1;
  return states.indexOf("upcoming");
}
