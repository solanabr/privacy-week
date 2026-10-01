import { hero, requirements } from "@/content/home";
import { cta, sectionIds } from "@/content/site";

import { CutLink } from "./cut-button";

/**
 * What the form asks for, at a glance, beside it on wide screens: the
 * deadline and the four requirements. Reads the same content the home page
 * shows, so the two never disagree.
 */
export function SubmissionAside() {
  const deadline = hero.facts[hero.facts.length - 1];

  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
      <div className="sticker-yellow flex flex-col gap-1 p-5">
        <p className="u-mono">{deadline.label}</p>
        <p className="u-display text-2xl">{deadline.value}</p>
        <p className="text-sm text-ink-soft">{deadline.detail}</p>
      </div>
      <div className="sticker flex flex-col gap-4 p-5">
        <p className="hat">{requirements.title}</p>
        <ol className="flex flex-col gap-3">
          {requirements.items.map((item, index) => (
            <li key={item.title} className="flex gap-3 text-sm leading-snug">
              <span
                aria-hidden
                className="flex h-6 w-6 shrink-0 items-center justify-center border-2 border-ink bg-surface font-display text-xs font-black"
              >
                {index + 1}
              </span>
              <span className="font-semibold">{item.title.replace(/[,.]$/, "")}</span>
            </li>
          ))}
        </ol>
        <CutLink href={`/#${sectionIds.requirements}`} variant="outline" size="sm">
          {cta.rules}
        </CutLink>
      </div>
    </aside>
  );
}
