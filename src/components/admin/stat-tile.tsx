/**
 * One headline number. `lead` makes it the hero figure of the row. Values use
 * the body sans with proportional figures; only columns of numbers go tabular.
 */
export function StatTile({
  label,
  value,
  detail,
  lead = false,
  tone = "paper",
}: {
  label: string;
  value: string | number;
  detail?: string;
  lead?: boolean;
  tone?: "paper" | "yellow" | "ink";
}) {
  const surface =
    tone === "yellow" ? "sticker-yellow" : tone === "ink" ? "sticker-ink" : "sticker-sm";
  const muted =
    tone === "ink" ? "text-surface-raised/70" : tone === "yellow" ? "text-ink-soft" : "text-muted";
  return (
    <div className={`${surface} flex flex-col gap-1 p-4 sm:p-5`}>
      <p className={`u-mono ${muted}`}>{label}</p>
      <p
        className={`font-semibold leading-none ${
          lead ? "text-5xl sm:text-6xl" : "text-3xl sm:text-4xl"
        }`}
      >
        {value}
      </p>
      {detail ? <p className={`text-xs ${muted}`}>{detail}</p> : null}
    </div>
  );
}
