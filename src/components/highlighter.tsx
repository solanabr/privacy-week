export function Highlighter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <mark className={`bg-yellow px-[0.08em] text-ink ${className}`}>
      {children}
    </mark>
  );
}
