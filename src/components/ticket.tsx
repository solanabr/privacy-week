export interface TicketField {
  label: string;
  value: React.ReactNode;
}

/**
 * Raised paper ticket with a cut corner, a perforated right edge, mono field
 * labels and a barcode strip.
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
        "relative cut-corner-one",
        isInk ? "bg-ink text-surface-raised" : "bg-surface-raised text-ink",
        "shadow-[0_14px_30px_-18px_rgba(27,35,29,0.55)]",
        rotate ? "rotate-[-1.5deg]" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        aria-hidden
        className="ticket-holes absolute inset-y-3 right-2 w-3 opacity-80"
      />
      <div className="flex flex-col gap-4 p-5 pr-8 sm:p-6 sm:pr-10">
        {(header || serial) && (
          <div className="flex items-baseline justify-between gap-4 border-b border-current/15 pb-3">
            {header ? <span className="u-mono">{header}</span> : <span />}
            {serial ? (
              <span className="u-mono whitespace-nowrap">{serial}</span>
            ) : null}
          </div>
        )}

        {fields && fields.length > 0 && (
          <dl className="flex flex-col gap-3">
            {fields.map((field) => (
              <div key={field.label} className="flex flex-col gap-1">
                <dt className={`u-mono ${isInk ? "text-surface-raised/70" : "text-muted"}`}>
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

        <div
          aria-hidden
          className={`barcode h-6 w-40 ${isInk ? "opacity-90" : "opacity-80"}`}
        />
      </div>
    </div>
  );
}
