import type { Metadata } from "next";
import Link from "next/link";

import { SHELL } from "@/components/section";
import { admin } from "@/content/admin";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: admin.title,
  robots: { index: false, follow: false, noarchive: true },
};

const LINKS = [
  { href: "/admin/dashboard", label: admin.dashboard.navLabel },
  { href: "/admin", label: admin.fields.list },
  { href: "/admin/export", label: admin.actions.export },
] as const;

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-dvh overflow-x-clip bg-surface">
      <header className="sticky top-0 z-40 border-b-2 border-ink/10 bg-surface/90 backdrop-blur-md">
        <div className={`${SHELL} flex flex-wrap items-center justify-between gap-3 py-3`}>
          <Link href="/admin/dashboard" className="flex items-center gap-3 leading-none">
            <span
              aria-hidden
              className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-ink font-display text-sm font-black text-yellow shadow-sticker-sm"
            >
              PW
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="font-display text-base font-black uppercase tracking-tight">
                {admin.title}
              </span>
              <span className="u-mono text-[10px] text-muted">{admin.fields.dashboard}</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1" aria-label={admin.fields.dashboard}>
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="nav-pill">
                {link.label}
              </Link>
            ))}
            <Link href="/" className="nav-pill text-muted">
              {site.brand} ↗
            </Link>
          </nav>
        </div>
      </header>
      <main id="conteudo">{children}</main>
    </div>
  );
}
