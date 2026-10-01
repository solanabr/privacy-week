import { Eyebrow } from "./eyebrow";

export type SectionTone =
  | "surface"
  | "deep"
  | "dots"
  | "kraft"
  | "ink"
  | "raised";

const TONES: Record<SectionTone, string> = {
  surface: "bg-surface",
  deep: "bg-surface-deep",
  dots: "paper-dots",
  kraft: "bg-surface-kraft",
  ink: "ink-grid text-surface-raised",
  raised: "bg-surface-raised",
};

/** One stage for every band: header, footer and sections share the rails. */
export const SHELL = "mx-auto w-full max-w-6xl px-5 sm:px-8";

export function Section({
  id,
  children,
  className = "",
  tone = "surface",
  padding = "md",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  tone?: SectionTone;
  padding?: "sm" | "md" | "lg" | "none";
}) {
  const paddings = {
    none: "",
    sm: "py-10 sm:py-12",
    md: "py-16 sm:py-20",
    lg: "py-20 sm:py-28",
  };
  return (
    <section id={id} className={`relative ${TONES[tone]} ${className}`}>
      <div className={`${SHELL} ${paddings[padding]}`}>{children}</div>
    </section>
  );
}

/**
 * Section heading: numbered hat, display title and an optional lede, with a
 * slot on the right for an action or a figure.
 */
export function SectionHeading({
  number,
  eyebrow,
  title,
  lede,
  aside,
  onInk = false,
  id,
  className = "",
}: {
  number?: string;
  eyebrow: string;
  title: string;
  lede?: string;
  aside?: React.ReactNode;
  onInk?: boolean;
  id?: string;
  className?: string;
}) {
  return (
    <div
      className={`mb-10 flex flex-col gap-6 sm:mb-12 lg:flex-row lg:items-end lg:justify-between ${className}`}
    >
      <div className="flex max-w-3xl flex-col gap-4">
        <Eyebrow number={number} onInk={onInk}>
          {eyebrow}
        </Eyebrow>
        <h2 id={id} className="u-display text-3xl sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        {lede ? (
          <p
            className={`max-w-2xl text-base leading-relaxed sm:text-lg ${
              onInk ? "text-surface-raised/80" : "text-muted"
            }`}
          >
            {lede}
          </p>
        ) : null}
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  );
}
