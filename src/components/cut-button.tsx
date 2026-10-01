import Link from "next/link";

type Variant =
  | "primary"
  | "secondary"
  | "yellow"
  | "ink"
  | "outline"
  | "outline-light";

type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "btn-cut btn-cut-primary",
  secondary: "btn-cut btn-cut-outline",
  outline: "btn-cut btn-cut-outline",
  "outline-light": "btn-cut btn-cut-outline btn-cut-outline-light",
  yellow: "btn-cut btn-cut-yellow",
  ink: "btn-cut btn-cut-ink",
};

const SIZES: Record<Size, string> = {
  sm: "min-h-10 px-4 py-2 text-xs",
  md: "",
  lg: "min-h-13 px-7 py-4 text-base",
};

function classes(variant: Variant, size: Size, className: string): string {
  return `${VARIANTS[variant]} ${SIZES[size]} ${className}`.trim();
}

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

export function CutLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}) {
  const content = <span>{children}</span>;
  if (isExternal(href)) {
    return (
      <a
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        className={classes(variant, size, className)}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes(variant, size, className)}>
      {content}
    </Link>
  );
}

export function CutButton({
  variant = "primary",
  size = "md",
  className = "",
  type = "submit",
  disabled,
  onClick,
  children,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
  type?: "submit" | "button";
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${classes(variant, size, className)} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      <span>{children}</span>
    </button>
  );
}
