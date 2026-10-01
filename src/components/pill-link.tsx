import Link from "next/link";

/** Filters and tabs share one pill. */
export function PillLink({
  href,
  active = false,
  className = "",
  children,
}: {
  href: string;
  active?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`pill ${active ? "pill-active" : ""} ${className}`.trim()}
    >
      {children}
    </Link>
  );
}
