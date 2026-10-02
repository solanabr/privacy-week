export interface ColumnDatum {
  key: string;
  label: string;
  count: number;
}

/**
 * Columns for a short run of days. Plain HTML so it is responsive and the
 * labels use real text: every column carries its count on the cap (there are
 * at most a handful), the baseline is a hairline and the track is recessive.
 */
export function ColumnChart({
  data,
  highlightKey,
  height = 160,
}: {
  data: readonly ColumnDatum[];
  /** The column for "today" gets the yellow cap marker. */
  highlightKey?: string;
  height?: number;
}) {
  const max = Math.max(...data.map((datum) => datum.count), 1);
  return (
    <div className="flex flex-col">
      <ol
        className="flex items-end gap-2 border-b-2 border-ink/15 sm:gap-4"
        style={{ height }}
      >
        {data.map((datum) => {
          const ratio = datum.count / max;
          const isToday = datum.key === highlightKey;
          return (
            <li
              key={datum.key}
              className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1"
              title={`${datum.label}: ${datum.count}`}
            >
              <span className="font-semibold tabular-nums leading-none text-ink">
                {datum.count}
              </span>
              <span
                aria-hidden
                className={`w-6 max-w-full rounded-t-[4px] ${
                  datum.count === 0 ? "bg-ink/10" : "bg-emerald"
                }`}
                style={{ height: `calc(${Math.max(ratio, 0.02) * 100}% - 1.5rem)` }}
              />
              {isToday ? (
                <span aria-hidden className="h-1 w-6 bg-yellow-strong" />
              ) : null}
            </li>
          );
        })}
      </ol>
      <ol className="flex gap-2 pt-2 sm:gap-4">
        {data.map((datum) => (
          <li
            key={datum.key}
            className={`min-w-0 flex-1 text-center font-mono text-[11px] tabular-nums ${
              datum.key === highlightKey ? "font-bold text-ink" : "text-muted"
            }`}
          >
            {datum.label}
          </li>
        ))}
      </ol>
    </div>
  );
}
