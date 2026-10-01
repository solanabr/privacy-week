export const inputClass = "control";

export const textareaClass = `${inputClass} min-h-40 max-h-[32rem] leading-relaxed [field-sizing:content]`;

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
        {required ? (
          <span aria-hidden className="text-emerald-deep">
            {"\u00a0*"}
          </span>
        ) : null}
      </label>
      {help ? <p className="text-xs leading-relaxed text-muted">{help}</p> : null}
      <div className={alignControl ? "mt-auto" : undefined}>{children}</div>
      {error ? (
        <p role="alert" className="text-xs font-semibold text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
