import type { FaqItem } from "@/content/home";

export function FaqList({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item, index) => (
        <details
          key={item.question}
          className={`sticker-sm group ${
            index === items.length - 1 && items.length % 2 === 1 ? "md:col-span-2" : ""
          }`}
        >
          <summary className="flex cursor-pointer items-start justify-between gap-4 p-5 font-display text-base font-black leading-snug sm:text-lg">
            <span>{item.question}</span>
            <span
              aria-hidden
              className="faq-marker mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border-2 border-ink bg-yellow font-mono text-base font-bold leading-none"
            >
              +
            </span>
          </summary>
          <div className="faq-answer border-t-2 border-ink/10 px-5 pb-5 pt-4 text-sm leading-relaxed text-ink-soft">
            <p>{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
