import { whyPrivacy } from "@/content/home";

const L = whyPrivacy.diagram.labels;

function Wallet({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="sticker-sm flex w-full shrink-0 flex-col items-center gap-1 px-4 py-4 text-center sm:w-28">
      <span className="font-display text-3xl font-black leading-none">{label}</span>
      <span className="u-mono text-muted">{detail}</span>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="u-mono border-2 border-ink/20 bg-surface-raised px-2 py-1 text-ink">
      {children}
    </span>
  );
}

function Arrow() {
  return (
    <div className="flex items-center justify-center text-ink" aria-hidden>
      <svg viewBox="0 0 24 24" className="h-7 w-7 rotate-90 sm:rotate-0" fill="none">
        <path
          d="M3 12h16m0 0-6-6m6 6-6 6"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function ShieldedPoolDiagram() {
  return (
    <figure className="sticker flex min-w-0 flex-col gap-5 p-5 sm:p-6">
      <p className="hat">{whyPrivacy.diagram.title}</p>
      <div
        role="img"
        aria-label={whyPrivacy.diagram.caption}
        className="flex min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center"
      >
        <Wallet label={L.walletA} detail={L.deposit} />
        <Arrow />
        <div className="relative flex min-w-0 flex-1 flex-col gap-3 border-2 border-dashed border-emerald bg-surface-deep p-4">
          <span className="u-mono text-emerald-deep">{L.pool}</span>
          <div className="flex flex-wrap gap-2">
            <Chip>{L.note}</Chip>
            <Chip>{L.commitment}</Chip>
            <Chip>{L.nullifier}</Chip>
            <Chip>{L.proof}</Chip>
            <Chip>{L.viewingKey}</Chip>
          </div>
          <p className="text-xs leading-relaxed text-muted">
            {whyPrivacy.diagram.treeNote}
          </p>
        </div>
        <Arrow />
        <Wallet label={L.walletB} detail={L.withdraw} />
      </div>

      <div className="flex items-center gap-3 border-t-2 border-ink/10 pt-4">
        <svg
          viewBox="0 0 200 20"
          className="h-5 w-32 shrink-0 text-ink"
          role="img"
          aria-label={L.crossed}
        >
          <line
            x1="0"
            y1="10"
            x2="200"
            y2="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="6 5"
          />
          <line x1="70" y1="2" x2="130" y2="18" stroke="currentColor" strokeWidth="3" />
          <line x1="130" y1="2" x2="70" y2="18" stroke="currentColor" strokeWidth="3" />
        </svg>
        <span className="text-sm font-semibold">{L.crossed}</span>
      </div>

      <figcaption className="text-sm leading-relaxed text-muted">
        {whyPrivacy.diagram.caption}
      </figcaption>
    </figure>
  );
}
