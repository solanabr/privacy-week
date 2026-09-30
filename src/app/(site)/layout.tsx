import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { accessibility } from "@/content/site";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-emerald focus:px-4 focus:py-2 focus:font-display focus:text-surface-raised"
      >
        {accessibility.skipToContent}
      </a>
      <SiteHeader />
      <main id="conteudo">{children}</main>
      <SiteFooter />
    </>
  );
}
