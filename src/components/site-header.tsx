import Link from "next/link";

import { accessibility, cta, headerLabels, nav, site } from "@/content/site";
import { getWindowState } from "@/lib/window";

import { CutLink } from "./cut-button";

export function SiteHeader() {
  const isOpen = getWindowState() === "open";

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display text-lg font-extrabold uppercase tracking-tight">
            {site.brand}
          </span>
          <span className="u-mono text-muted">{site.organizer}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label={accessibility.primaryNavigation}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="u-mono text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CutLink
            href={isOpen ? "/enviar" : "/projetos"}
            variant="primary"
            className="hidden sm:inline-flex"
          >
            {isOpen ? cta.submit : cta.viewProjects}
          </CutLink>

          <details className="relative md:hidden">
            <summary className="cut-corner-sm cursor-pointer list-none bg-surface-kraft px-4 py-2 font-display text-sm font-extrabold uppercase tracking-wide">
              {headerLabels.menu}
            </summary>
            <div className="absolute right-0 z-50 mt-2 flex w-52 flex-col gap-3 border border-ink/15 bg-surface-raised p-4 shadow-lg">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="u-mono text-muted hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
              <CutLink href={isOpen ? "/enviar" : "/projetos"} variant="primary">
                {isOpen ? cta.submit : cta.viewProjects}
              </CutLink>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
