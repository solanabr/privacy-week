export interface TicketField {
  label: string;
  value: React.ReactNode;
}

/**
 * Raised paper ticket: 2px ink rim, hard sticker shadow, a perforated stub on
 * the right with a vertical barcode, mono field labels.
 */
export function TicketCard({
  header,
  serial,
  fields,
  footer,
  tone = "paper",
  rotate = false,
  className = "",
}: {
  header?: string;
  serial?: string;
  fields?: TicketField[];
  footer?: React.ReactNode;
  tone?: "paper" | "ink";
  rotate?: boolean;
  className?: string;
}) {
  const isInk = tone === "ink";
  return (
    <div
      className={[
        "relative flex",
        isInk ? "sticker-ink" : "sticker",
        rotate ? "rotate-[-1.5deg]" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-4 p-5 sm:p-6">
        {(header || serial) && (
          <div
            className={`flex items-baseline justify-between gap-4 border-b-2 pb-3 ${
              isInk ? "border-surface-raised/20" : "border-ink/15"
            }`}
          >
            {header ? (
              <span className={`u-mono ${isInk ? "text-yellow" : "text-emerald-deep"}`}>
                {header}
              </span>
            ) : (
              <span />
            )}
            {serial ? (
              <span className="u-mono whitespace-nowrap">{serial}</span>
            ) : null}
          </div>
        )}

        {fields && fields.length > 0 && (
          <dl className="flex flex-col gap-3">
            {fields.map((field) => (
              <div key={field.label} className="flex flex-col gap-1">
                <dt
                  className={`u-mono ${isInk ? "text-surface-raised/70" : "text-muted"}`}
                >
                  {field.label}
                </dt>
                <dd className="font-display text-lg font-extrabold leading-tight">
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {footer}
      </div>

      {/* The stub. */}
      <div
        aria-hidden
        className={`relative flex w-10 shrink-0 flex-col items-center justify-between border-l-2 border-dashed py-4 sm:w-12 ${
          isInk ? "border-surface-raised/30" : "border-ink/30"
        }`}
        style={
          {
            "--ticket-hole-fill": isInk
              ? "var(--color-surface-deep)"
              : "var(--color-surface)",
          } as React.CSSProperties
        }
      >
        <span className="ticket-holes absolute inset-y-3 left-[-7px] w-3" />
        <span className="barcode-v h-24 w-4 opacity-80" />
        <span className="u-mono whitespace-nowrap text-[9px] opacity-70 [writing-mode:vertical-rl]">
          {serial ?? header ?? ""}
        </span>
      </div>
    </div>
  );
}
