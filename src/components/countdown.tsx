"use client";

import { useEffect, useState } from "react";

function format(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  const seconds = Math.floor((ms % 60000) / 1000);
  const pad = (value: number) => String(value).padStart(2, "0");
  if (days > 0) return `${days}d ${pad(hours)}h ${pad(minutes)}m`;
  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}

/**
 * Client-only countdown. It formats a deadline that comes from the server; it
 * does not decide anything about the window.
 */
export function Countdown({
  deadline,
  suffix,
  closedLabel,
}: {
  deadline: string;
  suffix: string;
  closedLabel: string;
}) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(deadline).getTime();
    const tick = () => setRemaining(target - Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [deadline]);

  if (remaining !== null && remaining <= 0) {
    return <span className="font-display font-extrabold">{closedLabel}</span>;
  }

  return (
    <span className="font-display font-extrabold tabular-nums">
      {suffix}{" "}
      {remaining === null ? (
        <span aria-hidden>—</span>
      ) : (
        <time dateTime={deadline}>{format(remaining)}</time>
      )}
    </span>
  );
}
