"use client";

import { useEffect, useState } from "react";

type Segments = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function segments(deadlineMs: number, nowMs: number): Segments | null {
  const diff = deadlineMs - nowMs;
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  };
}

function compact(seg: Segments): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  if (seg.days > 0) return `${seg.days}d ${pad(seg.hours)}h ${pad(seg.minutes)}m`;
  return `${pad(seg.hours)}h ${pad(seg.minutes)}m ${pad(seg.seconds)}s`;
}

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * One digit of the board. The swap is a remount: the `key` is the character
 * itself, so a digit only re-animates when it changes.
 */
function TickDigit({ char }: { char: string }) {
  return (
    <span key={char} className="tique" suppressHydrationWarning>
      {char}
    </span>
  );
}

export interface CountdownLabels {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

/**
 * Client-only countdown. It formats a deadline that comes from the server; it
 * does not decide anything about the window.
 *
 * "compact" renders a single string. "tiles" renders four sharp-cornered
 * paper blocks with the label on an ink band beneath each. SSR renders a dash
 * or zeros to avoid a hydration mismatch.
 */
export function Countdown({
  deadline,
  suffix,
  closedLabel,
  loadingLabel = "",
  labels,
  variant = "compact",
  tone = "paper",
  className = "",
}: {
  deadline: string;
  suffix: string;
  closedLabel: string;
  loadingLabel?: string;
  labels?: CountdownLabels;
  variant?: "compact" | "tiles";
  tone?: "paper" | "ink";
  className?: string;
}) {
  // undefined = no client tick yet, null = expired.
  const [seg, setSeg] = useState<Segments | null | undefined>(undefined);

  useEffect(() => {
    const target = new Date(deadline).getTime();
    const tick = () => setSeg(segments(target, Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [deadline]);

  if (variant === "tiles") {
    if (seg === null) {
      return (
        <p
          className={`sticker-yellow inline-flex px-4 py-3 font-display text-lg font-black uppercase ${className}`}
        >
          {closedLabel}
        </p>
      );
    }
    const tiles: Array<{ value: number; label: string }> = [
      { value: seg?.days ?? 0, label: labels?.days ?? "d" },
      { value: seg?.hours ?? 0, label: labels?.hours ?? "h" },
      { value: seg?.minutes ?? 0, label: labels?.minutes ?? "m" },
      { value: seg?.seconds ?? 0, label: labels?.seconds ?? "s" },
    ];
    const onInk = tone === "ink";
    return (
      <div role="timer" className={className}>
        <span className="sr-only" suppressHydrationWarning>
          {seg === undefined
            ? loadingLabel
            : `${suffix} ${tiles[0].value} ${tiles[0].label}, ${tiles[1].value} ${tiles[1].label}, ${tiles[2].value} ${tiles[2].label}, ${tiles[3].value} ${tiles[3].label}`}
        </span>
        <div aria-hidden className="grid grid-cols-4 gap-1.5 sm:gap-2.5">
          {tiles.map((tile) => (
            <div
              key={tile.label}
              className={`flex min-w-0 flex-col border-2 [container-type:inline-size] ${
                onInk
                  ? "border-surface-raised bg-surface-raised shadow-[4px_4px_0_var(--color-yellow)]"
                  : "border-ink bg-surface-raised shadow-sticker-sm"
              }`}
            >
              {/* Digits scale with the tile, not the viewport: two glyphs of
                  Archivo Black take ~1.4em, so 50cqw fills the box without
                  ever running past its edge. */}
              <span className="flex flex-1 items-center justify-center px-1 pb-1.5 pt-2 font-display text-[clamp(1.1rem,50cqw,3rem)] font-black leading-[0.9] tracking-[-0.03em] text-ink tabular-nums">
                {(seg === undefined ? "00" : pad(tile.value))
                  .split("")
                  .map((char, index) => (
                    <TickDigit key={`${tile.label}-${index}`} char={char} />
                  ))}
              </span>
              <span className="overflow-hidden whitespace-nowrap border-t-2 border-ink bg-ink px-0.5 py-1 text-center font-mono text-[clamp(8px,11cqw,10px)] font-bold uppercase leading-none tracking-[0.12em] text-surface-raised">
                {tile.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (seg === null) {
    return <span className="font-display font-extrabold">{closedLabel}</span>;
  }

  return (
    <span className={`font-display font-extrabold tabular-nums ${className}`}>
      {suffix}{" "}
      {seg === undefined ? (
        <span aria-hidden>—</span>
      ) : (
        <time dateTime={deadline}>{compact(seg)}</time>
      )}
    </span>
  );
}
