export function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`flex items-center gap-3 text-muted ${className}`}>
      <span aria-hidden className="h-3 w-1.5 shrink-0 bg-emerald" />
      <span className="u-mono">{children}</span>
    </p>
  );
}
