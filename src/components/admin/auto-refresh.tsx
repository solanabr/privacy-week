"use client";

import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";

/**
 * Re-renders the server page on an interval while the tab is visible, and on
 * demand. The previous render stays on screen (dimmed) until the new one is
 * ready, so nothing jumps.
 */
export function AutoRefresh({
  seconds,
  updatedAt,
  labels,
}: {
  seconds: number;
  updatedAt: string;
  labels: { updatedAt: string; auto: string; refresh: string };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      startTransition(() => router.refresh());
    }, seconds * 1000);
    return () => window.clearInterval(id);
  }, [router, seconds]);

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      <span className="u-mono text-muted" aria-live="polite">
        {labels.updatedAt} {updatedAt}
      </span>
      <span className="text-muted">·</span>
      <span className="text-muted">{labels.auto}</span>
      <button
        type="button"
        onClick={() => startTransition(() => router.refresh())}
        disabled={pending}
        className="pill disabled:opacity-60"
      >
        <span
          aria-hidden
          className={`h-2 w-2 rounded-full ${pending ? "bg-yellow-strong" : "bg-emerald"}`}
        />
        {labels.refresh}
      </button>
    </div>
  );
}
