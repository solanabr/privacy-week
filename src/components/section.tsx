export function Section({
  id,
  children,
  className = "",
  tone = "surface",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  tone?: "surface" | "deep" | "dots" | "kraft" | "ink";
}) {
  const tones: Record<string, string> = {
    surface: "bg-surface",
    deep: "bg-surface-deep",
    dots: "paper-dots",
    kraft: "bg-surface-kraft",
    ink: "bg-ink text-surface-raised",
  };
  return (
    <section
      id={id}
      className={`scroll-mt-24 ${tones[tone]} ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        {children}
      </div>
    </section>
  );
}
