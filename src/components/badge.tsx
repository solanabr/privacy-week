type Tone = "yellow" | "emerald" | "ink" | "neutral" | "light";

const TONES: Record<Tone, string> = {
  yellow: "border-ink bg-yellow text-ink",
  emerald: "border-emerald-deep bg-emerald text-surface-raised",
  ink: "border-ink bg-ink text-surface-raised",
  neutral: "border-ink/30 bg-surface-raised text-ink",
  light: "border-surface-raised/40 bg-surface-raised/10 text-surface-raised",
};

export function Badge({
  tone = "neutral",
  mono = true,
  className = "",
  children,
}: {
  tone?: Tone;
  mono?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border-2 px-2.5 py-0.5 ${
        mono
          ? "font-mono text-[11px] font-bold uppercase tracking-[0.14em]"
          : "text-xs font-bold"
      } ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
