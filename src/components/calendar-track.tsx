import type { CalendarRow } from "@/content/home";
import { calendarState, nextCalendarIndex } from "@/lib/calendar";

import { Badge } from "./badge";

/**
 * A dated track. State comes from the clock: everything that ended is done,
 * what is between start and end is now, the rest is yet to come. When nothing
 * is happening, the first upcoming row is marked as next.
 */
export function CalendarTrack({
  rows,
  now,
  labels,
}: {
  rows: readonly CalendarRow[];
  now: Date;
  labels: { now: string; next: string; done: string };
}) {
  const nextIndex = nextCalendarIndex(rows, now);

  return (
    <ol className="sticker flex flex-col px-5 sm:px-7">
      {rows.map((row, index) => {
        const state = calendarState(row, now);
        const isNow = state === "now";
        const isDone = state === "done";
        const isNext = index === nextIndex;
        const first = index === 0;
        const last = index === rows.length - 1;

        return (
          <li
            key={`${row.at}-${row.what}`}
            aria-current={isNow ? "step" : undefined}
            className={`relative flex gap-4 py-5 sm:gap-6 ${
              first ? "" : "border-t-2 border-ink/10"
            }`}
          >
            {isNow ? (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-5 -right-5 bg-emerald/[0.07] sm:-left-7 sm:-right-7"
              />
            ) : null}

            {/* The rail and its dot. */}
            <span
              aria-hidden
              className={`absolute left-[6rem] w-0.5 -translate-x-1/2 sm:left-[7rem] ${
                isDone || isNow ? "bg-emerald" : "bg-ink/15"
              } ${first ? "top-[2.375rem] bottom-0" : last ? "top-0 h-[2.375rem]" : "inset-y-0"}`}
            />
            <span
              aria-hidden
              className={`absolute left-[6rem] top-[2.375rem] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 sm:left-[7rem] ${
                isNow
                  ? "pulse border-emerald bg-emerald"
                  : isDone
                    ? "border-emerald bg-emerald"
                    : isNext
                      ? "border-ink bg-yellow"
                      : "border-ink/40 bg-surface-raised"
              }`}
            />

            <div className="w-20 shrink-0 pr-2 text-right sm:w-24">
              <p
                className={`flex h-9 items-center justify-end font-display font-black leading-none tabular-nums ${
                  row.day.length > 2 ? "whitespace-nowrap text-lg sm:text-xl" : "text-3xl sm:text-4xl"
                } ${isNow ? "text-emerald-deep" : isDone ? "text-muted" : "text-ink"}`}
              >
                {row.day}
              </p>
              <p className="mt-1 font-mono text-[10px] font-bold uppercase leading-tight tracking-wider text-muted">
                {row.month}
              </p>
            </div>

            <div className="relative min-w-0 flex-1 pl-5 sm:pl-7">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span
                  className={`font-display text-base font-black sm:text-lg ${
                    isDone ? "text-muted" : "text-ink"
                  }`}
                >
                  {row.what}
                </span>
                {isNow ? (
                  <Badge tone="emerald">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-surface-raised" />
                    {labels.now}
                  </Badge>
                ) : isNext ? (
                  <Badge tone="yellow">{labels.next}</Badge>
                ) : isDone ? (
                  <span className="sr-only">{labels.done}</span>
                ) : null}
              </p>
              <p className={`mt-1 u-mono ${isDone ? "text-muted/80" : "text-muted"}`}>
                {row.when}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
