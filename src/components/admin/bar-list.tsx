export interface BarListRow {
  label: string;
  count: number;
  share: number;
}

/**
 * Horizontal bars for a handful of categories. One hue, thin marks, the value
 * and share as direct labels in text tokens above each bar, so no label is
 * ever truncated; the list itself is the table view.
 */
export function BarList({
  rows,
  emptyLabel,
}: {
  rows: readonly BarListRow[];
  emptyLabel: string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted">{emptyLabel}</p>;
  }
  const max = Math.max(...rows.map((row) => row.count), 1);
  return (
    <ul className="flex flex-col gap-3">
      {rows.map((row) => (
        <li key={row.label} className="flex flex-col gap-1.5 text-sm">
          <div className="flex items-baseline justify-between gap-3">
            <span className="min-w-0 font-semibold leading-snug">{row.label}</span>
            <span className="whitespace-nowrap font-mono text-xs tabular-nums text-muted">
              <span className="font-bold text-ink">{row.count}</span> ·{" "}
              {Math.round(row.share * 100)}%
            </span>
          </div>
          <span
            className="block h-3 w-full bg-emerald/15"
            role="img"
            aria-label={`${row.label}: ${row.count}`}
          >
            <span
              className="block h-full rounded-r-[4px] bg-emerald"
              style={{ width: `${(row.count / max) * 100}%` }}
            />
          </span>
        </li>
      ))}
    </ul>
  );
}
