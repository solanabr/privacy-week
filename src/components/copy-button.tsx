"use client";

import { useState } from "react";

export function CopyButton({
  value,
  label,
  copiedLabel,
}: {
  value: string;
  label: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="cut-corner-sm inline-flex items-center bg-emerald px-5 py-3 font-display text-sm font-extrabold uppercase tracking-[0.08em] text-surface-raised hover:bg-emerald-deep"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
