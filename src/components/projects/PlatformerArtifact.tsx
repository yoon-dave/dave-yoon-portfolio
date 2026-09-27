// A designed readout of the real training run's completion rate across
// four key checkpoints (baseline, LR decay, the persistent-cloning
// breakthrough, and the final fix) — not a screenshot. Numbers are the
// actual measured 1,000-episode evaluation results, not illustrative.
const GENERATIONS = [
  { label: 'Baseline', v: 0.0 },
  { label: 'LR decay', v: 0.075 },
  { label: 'Persistent BC', v: 0.49 },
  { label: 'Solved', v: 1.0 },
]

export default function PlatformerArtifact() {
  return (
    <div className="artifact-frame w-full max-w-sm border border-ink-700 bg-ink-900 p-5 shadow-[6px_6px_0_0_var(--color-ink-800)]">
      <span className="font-mono text-[0.625rem] tracking-[0.14em] text-paper-dim uppercase">
        Real training run · completion rate
      </span>
      <div className="mt-4 flex h-28 items-end gap-3">
        {GENERATIONS.map((g) => (
          <div key={g.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <div
              className={`w-full ${g.v >= 1 ? 'bg-accent' : 'bg-ink-700'}`}
              style={{ height: `${Math.max(g.v * 100, 3)}%` }}
            />
            <span className="text-center font-mono text-[0.5625rem] leading-tight text-paper-dim/60">
              {g.label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-5 border-t border-ink-800 pt-4">
        <p className="font-display text-4xl font-bold tabular text-accent">100%</p>
        <p className="mt-1 font-mono text-[0.6875rem] tracking-wide text-paper-dim uppercase">
          single-attempt completion, from 0%
        </p>
      </div>
    </div>
  )
}
