// A designed chart evoking GymBud's real calendar-aware progress tracking
// (Swift Charts) — illustrative data, honestly labeled, not a screenshot.
// The "artifact-frame" wrapper is a fixed slot for a real screenshot later.
const DAYS = [
  { label: 'M', v: 0.42 },
  { label: 'T', v: 0.68 },
  { label: 'W', v: 0.31 },
  { label: 'T', v: 0.85 },
  { label: 'F', v: 0.54 },
  { label: 'S', v: 0.97 },
  { label: 'S', v: 0.22 },
]

export default function GymBudArtifact() {
  return (
    <div className="artifact-frame w-full max-w-[15rem] border border-ink-700 bg-ink-900 p-5 shadow-[6px_6px_0_0_var(--color-ink-800)]">
      <span className="font-mono text-[0.625rem] tracking-[0.14em] text-paper-dim uppercase">
        Illustrative · weekly consistency
      </span>
      <div className="mt-4 flex h-28 items-end gap-2">
        {DAYS.map((d, i) => (
          <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <div
              className={`w-full ${d.v > 0.9 ? 'bg-accent' : 'bg-ink-700'}`}
              style={{ height: `${d.v * 100}%` }}
            />
            <span className="font-mono text-[0.5625rem] text-paper-dim/60">{d.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 border-t border-ink-800 pt-4">
        <p className="font-display text-4xl font-bold tabular text-accent">943+</p>
        <p className="mt-1 font-mono text-[0.6875rem] tracking-wide text-paper-dim uppercase">App Store users</p>
      </div>
    </div>
  )
}
