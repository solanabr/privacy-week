import type { Metadata } from "next";
import Link from "next/link";

import { admin } from "@/content/admin";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: admin.title,
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-dvh bg-surface">
      <header className="border-b border-ink/15 bg-surface-raised">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/admin" className="font-display text-lg font-extrabold uppercase">
            {admin.title}
          </Link>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link href="/admin" className="underline underline-offset-4">{admin.fields.dashboard}</Link>
            <Link href="/admin/export" className="underline underline-offset-4">{admin.actions.export}</Link>
            <Link href="/" className="underline underline-offset-4">{site.brand}</Link>
          </nav>
        </div>
      </header>
      <main id="conteudo">{children}</main>
    </div>
  );
}
