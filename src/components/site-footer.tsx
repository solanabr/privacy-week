import Link from "next/link";

import { footer, site } from "@/content/site";

import { TodoBadge } from "./todo-badge";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-surface-raised">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-2">
          <p className="font-display text-xl font-extrabold uppercase tracking-tight">
            {site.brand} · {site.organizer}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="u-mono text-surface-raised/70">
              organizado com Cloak
            </span>
            <TodoBadge label={footer.credit} note={footer.creditNote} />
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
