/**
 * Section hat: the small emerald block and a mono label. `number` prints a
 * running index before the label, so the page reads as a numbered document.
 */
export function Eyebrow({
  children,
  number,
  onInk = false,
  className = "",
}: {
  children: React.ReactNode;
  number?: string;
  onInk?: boolean;
  className?: string;
}) {
  return (
    <p className={`hat ${onInk ? "hat-on-ink" : ""} ${className}`.trim()}>
      {number ? (
        <span className={onInk ? "text-yellow" : "text-emerald-deep"}>
          {number}
        </span>
      ) : null}
      <span>{children}</span>
    </p>
  );
}
