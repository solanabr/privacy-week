"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export interface NavItem {
  href: string;
  label: string;
}

function hashOf(href: string): string | null {
  const index = href.indexOf("#");
  return index >= 0 ? href.slice(index) : null;
}

/**
 * Which section is being read. Position, not IntersectionObserver: comparing
 * each anchor's distance to a reading line is deterministic and answers the
 * same for an anchor, a section and a card. One passive listener, coalesced
 * into requestAnimationFrame.
 */
function useActiveSection(targets: string, enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const ids = targets.split(" ").filter(Boolean);
    let raf = 0;
    const measure = () => {
      raf = 0;
      const line = window.innerHeight * 0.34;
      let current: string | null = null;
      for (const id of ids) {
        const element = document.getElementById(id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [targets, enabled]);

  return enabled ? active : null;
}

export function HeaderNav({
  items,
  label,
  className = "",
  onNavigate,
}: {
  items: readonly NavItem[];
  label: string;
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const targets = items
    .map((item) => hashOf(item.href)?.slice(1) ?? "")
    .filter(Boolean)
    .join(" ");
  const active = useActiveSection(targets, onHome);

  return (
    <nav aria-label={label} className={className}>
      {items.map((item) => {
        const hash = hashOf(item.href);
        const id = hash?.slice(1) ?? null;
        const isActive = onHome
          ? id !== null && id === active
          : !hash && pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            data-active={isActive ? "true" : undefined}
            aria-current={isActive ? "true" : undefined}
            className="nav-pill"
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** How much of the sheet has gone by, drawn as a yellow rule under the bar. */
export function ScrollRuler({ label }: { label: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const root = document.documentElement;
      const total = root.scrollHeight - root.clientHeight;
      const progress = total > 0 ? Math.min(1, root.scrollTop / total) : 0;
      element.style.setProperty("--ruler", progress.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <span
      ref={ref}
      role="presentation"
      aria-label={label}
      className="ruler pointer-events-none absolute inset-x-0 bottom-[-2px] h-[3px] bg-yellow-strong"
    />
  );
}

/** Mobile menu: a details element that closes after a link is chosen. */
export function MobileMenu({
  items,
  navLabel,
  menuLabel,
  closeLabel,
  children,
}: {
  items: readonly NavItem[];
  navLabel: string;
  menuLabel: string;
  closeLabel: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <details
      ref={ref}
      className="relative lg:hidden"
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className="btn-cut btn-cut-outline min-h-10 list-none px-3.5 py-2 text-xs">
        <span>{open ? closeLabel : menuLabel}</span>
      </summary>
      <div className="sticker absolute right-0 z-50 mt-3 flex w-[min(calc(100vw-2.5rem),24rem)] flex-col gap-1 p-3">
        <HeaderNav
          items={items}
          label={navLabel}
          className="flex flex-col"
          onNavigate={() => {
            if (ref.current) ref.current.open = false;
          }}
        />
        {children ? (
          <div className="mt-2 border-t-2 border-ink/10 pt-3 sm:hidden">{children}</div>
        ) : null}
      </div>
    </details>
  );
}
