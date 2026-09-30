export function Redaction({ children }: { children: React.ReactNode }) {
  return (
    <span className="redaction" aria-hidden>
      {children}
    </span>
  );
}
