/** A ratio against a limit: the fill and the track are steps of one ramp. */
export function Meter({
  label,
  value,
  max,
  detail,
  compact = false,
}: {
  label: string;
  value: number;
  max: number;
  detail?: string;
  /** Track only; the caller already shows the label and value. */
  compact?: boolean;
}) {
  const ratio = max > 0 ? Math.min(1, value / max) : 0;
  return (
    <div className="flex flex-col gap-2">
      {compact ? null : (
        <div className="flex items-baseline justify-between gap-3 text-sm">
          <span className="font-semibold">{label}</span>
          {detail ? (
            <span className="font-mono text-xs tabular-nums text-muted">{detail}</span>
          ) : null}
        </div>
      )}
      <div
        className="h-3 w-full bg-emerald/15"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
      >
        <span
          className="block h-full rounded-r-[4px] bg-emerald"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
}
