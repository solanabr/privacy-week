export const inputClass =
  "w-full border border-ink/30 bg-surface-raised px-3 py-2 text-base text-ink placeholder:text-muted/60 focus:border-emerald";

export const textareaClass = `${inputClass} min-h-40 leading-relaxed`;

export function Field({
  label,
  htmlFor,
  help,
  error,
  required,
  alignControl,
  children,
}: {
  label: string;
  htmlFor: string;
  help?: string;
  error?: string;
  required?: boolean;
  alignControl?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="font-display text-sm font-extrabold uppercase tracking-[0.04em]"
      >
        {label}
        {required ? <span aria-hidden> *</span> : null}
      </label>
      {help ? <p className="text-xs text-muted">{help}</p> : null}
      <div className={alignControl ? "mt-auto" : undefined}>{children}</div>
      {error ? (
        <p role="alert" className="text-xs font-semibold text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
