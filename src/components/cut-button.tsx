import Link from "next/link";

type Variant = "primary" | "secondary";

const BASE =
  "cut-corner-sm inline-flex items-center justify-center gap-2 px-5 py-3 font-display text-sm font-extrabold uppercase tracking-[0.08em] transition-colors";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-emerald text-surface-raised hover:bg-emerald-deep",
  secondary: "bg-surface-kraft text-ink hover:bg-surface-deeper",
};

function classes(variant: Variant, className: string): string {
  return `${BASE} ${VARIANTS[variant]} ${className}`;
}

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

export function CutLink({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  if (isExternal(href)) {
    return (
      <a
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        className={classes(variant, className)}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes(variant, className)}>
      {children}
    </Link>
  );
}

export function CutButton({
  variant = "primary",
  className = "",
  type = "submit",
  disabled,
  children,
}: {
  variant?: Variant;
  className?: string;
  type?: "submit" | "button";
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${classes(variant, className)} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {children}
    </button>
  );
}
