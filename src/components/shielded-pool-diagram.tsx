import { whyPrivacy } from "@/content/home";

const L = whyPrivacy.diagram.labels;

function Wallet({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="flex w-32 shrink-0 flex-col gap-1 border border-ink/20 bg-surface-raised p-3 text-center">
      <span className="font-display text-sm font-extrabold uppercase">{label}</span>
      <span className="u-mono text-muted">{detail}</span>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="u-mono border border-ink/20 bg-surface px-2 py-1 text-ink">
      {children}
    </span>
  );
}

export function ShieldedPoolDiagram() {
  return (
    <figure className="flex flex-col gap-3">
      <div
        role="img"
        aria-label={whyPrivacy.diagram.caption}
        className="flex items-stretch gap-3 overflow-x-auto pb-2 sm:gap-5"
      >
        <Wallet label="A" detail={L.deposit} />

        <div className="flex items-center text-2xl text-muted" aria-hidden>
          →
        </div>

        <div className="relative flex min-w-56 flex-1 flex-col gap-3 border-2 border-dashed border-emerald/70 bg-surface-deep p-4">
          <span className="u-mono text-emerald">{L.pool}</span>
          <div className="flex flex-wrap gap-2">
            <Chip>{L.note}</Chip>
            <Chip>{L.commitment}</Chip>
            <Chip>{L.nullifier}</Chip>
            <Chip>{L.proof}</Chip>
            <Chip>{L.viewingKey}</Chip>
          </div>
          <p className="text-xs text-muted">Merkle tree de commitments + conjunto de nullifiers</p>
        </div>

        <div className="flex items-center text-2xl text-muted" aria-hidden>
          →
        </div>

        <Wallet label="B" detail={L.withdraw} />
      </div>

      <div className="flex items-center gap-3">
        <svg
          viewBox="0 0 200 20"
          className="h-5 w-40 text-ink"
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
        <span className="text-sm text-muted">{L.crossed}</span>
      </div>

      <figcaption className="max-w-2xl text-sm text-muted">
        {whyPrivacy.diagram.caption}
      </figcaption>
    </figure>
  );
}
