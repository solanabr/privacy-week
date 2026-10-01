"use client";

import { useState } from "react";

import { CutButton } from "./cut-button";

export function CopyButton({
  value,
  label,
  copiedLabel,
  variant = "primary",
  size = "md",
}: {
  value: string;
  label: string;
  copiedLabel: string;
  variant?: "primary" | "outline" | "yellow" | "ink";
  size?: "sm" | "md";
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
    <CutButton type="button" variant={variant} size={size} onClick={copy}>
      {copied ? copiedLabel : label}
    </CutButton>
  );
}
