import Link from "next/link";

import { accessibility, cta, headerLabels, nav, site } from "@/content/site";
import { getWindowState } from "@/lib/window";

import { SHELL } from "./section";
import { CutLink } from "./cut-button";
import { HeaderNav, MobileMenu, ScrollRuler } from "./header-nav";

export function SiteHeader() {
  const isOpen = getWindowState() === "open";
  const ctaHref = isOpen ? "/enviar" : "/projetos";
  const ctaLabel = isOpen ? cta.submit : cta.viewProjects;

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink/10 bg-surface/90 backdrop-blur-md">
      <div className={`${SHELL} flex h-16 items-center justify-between gap-4`}>
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 rounded-sm leading-none"
        >
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-yellow font-display text-sm font-black text-ink shadow-sticker-sm"
          >
            PW
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="font-display text-base font-black uppercase tracking-tight sm:text-lg">
              {site.brand}
            </span>
            <span className="u-mono text-[10px] text-muted">{site.organizer}</span>
          </span>
        </Link>

        <HeaderNav
          items={nav}
          label={accessibility.sectionNavigation}
          className="hidden items-center gap-1 lg:flex"
        />

        <div className="flex items-center gap-2">
          <CutLink href={ctaHref} variant="primary" size="sm" className="hidden sm:inline-flex">
            {ctaLabel}
          </CutLink>

          <MobileMenu
            items={nav}
            navLabel={accessibility.primaryNavigation}
            menuLabel={headerLabels.menu}
            closeLabel={headerLabels.close}
          >
            <CutLink href={ctaHref} variant="primary" size="sm" className="w-full">
              {ctaLabel}
            </CutLink>
          </MobileMenu>
        </div>
      </div>
      <ScrollRuler label={accessibility.scrollProgress} />
    </header>
  );
}
