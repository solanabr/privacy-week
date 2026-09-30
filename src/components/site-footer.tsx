import Link from "next/link";
import Image from "next/image";

import { footer, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-surface-raised">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-2">
          <p className="font-display text-xl font-extrabold uppercase tracking-tight">
            {site.brand} · {site.organizer}
          </p>
          <div className="flex flex-col gap-3">
            <p className="u-mono text-surface-raised/70">Patrocinadores</p>
            <ul className="flex flex-wrap items-center gap-3">
              {footer.sponsors.map((sponsor) => (
                <li key={sponsor.name}>
                  <Link
                    href={sponsor.href}
                    className="flex h-16 min-w-40 items-center justify-center rounded-sm bg-surface-raised px-5 py-3"
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
                          : "h-8 w-auto max-w-36 object-contain"
                      }
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {footer.links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="u-mono text-surface-raised/80 underline-offset-4 hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="u-mono text-surface-raised/50">
          {site.domain}
        </p>
      </div>
    </footer>
  );
}
