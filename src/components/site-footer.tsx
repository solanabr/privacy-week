import Image from "next/image";
import Link from "next/link";

import { footer, site } from "@/content/site";

import { SHELL } from "./section";

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const external = /^https?:\/\//.test(href);
  const className =
    "text-sm font-semibold text-surface-raised/75 underline-offset-4 transition-colors hover:text-surface-raised hover:underline";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink text-surface-raised">
      <div className={`${SHELL} pt-14`}>
        <div className="grid gap-12 pb-12 xl:grid-cols-12">
          <div className="flex flex-col gap-5 xl:col-span-6">
            <p className="flex items-center gap-3">
              <span
                aria-hidden
                className="flex h-10 w-10 items-center justify-center border-2 border-surface-raised bg-yellow font-display text-sm font-black text-ink"
              >
                PW
              </span>
              <span className="flex flex-col">
                <span className="font-display text-xl font-black uppercase tracking-tight">
                  {site.brand}
                </span>
                <span className="u-mono text-[10px] text-surface-raised/60">
                  {site.organizer} · {site.challengeName}
                </span>
              </span>
            </p>
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-surface-raised/70">
              {footer.tagline}
            </p>

            <div className="flex flex-col gap-3">
              <p className="u-mono text-yellow">{footer.sponsorsLabel}</p>
              <ul className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
                {footer.sponsors.map((sponsor) => (
                  <li key={sponsor.name}>
                    <a
                      href={sponsor.href}
                      className="flex h-14 w-full items-center justify-center border-2 border-surface-raised/20 bg-surface-raised px-4 py-2 transition-colors hover:border-yellow sm:w-auto sm:min-w-28"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Image
                        src={sponsor.logo}
                        width={sponsor.width}
                        height={sponsor.height}
                        alt={sponsor.name}
                        className={
                          sponsor.name === "Zcash Brasil"
                            ? "h-10 w-10 object-contain"
                            : "h-8 w-auto max-w-32 object-contain"
                        }
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 xl:col-span-6 xl:gap-8">
            {footer.columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="u-mono text-yellow">{column.title}</h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <FooterLink href={link.href}>{link.label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <div>
              <h2 className="u-mono text-yellow">{site.challengeName}</h2>
              <p className="mt-4 text-sm leading-relaxed text-surface-raised/70">
                {site.tagline}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t-2 border-surface-raised/15 py-6 text-sm text-surface-raised/60 sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright}</p>
          <p className="u-mono">{site.domain}</p>
        </div>
      </div>

      <svg
        aria-hidden
        viewBox="0 0 1000 150"
        className="hidden w-full select-none text-surface-raised/[0.06] sm:block"
      >
        <text
          x="500"
          y="140"
          textAnchor="middle"
          textLength="990"
          lengthAdjust="spacingAndGlyphs"
          fill="currentColor"
          fontSize="170"
          fontWeight="900"
          className="font-display"
        >
          PRIVACY WEEK
        </text>
      </svg>
    </footer>
  );
}
