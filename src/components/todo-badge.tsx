export function TodoBadge({
  label,
  note,
  className = "",
}: {
  label: string;
  note?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 border border-dashed border-ink/40 bg-surface-deeper px-2 py-0.5 text-ink ${className}`}
    >
      <span className="u-mono">{label}</span>
      {note ? <span className="text-xs text-muted">{note}</span> : null}
    </span>
  );
}
