// Real recorded gameplay, not a rendering -- the trained agent clearing
// the level, pulled straight from an evaluation episode. Served from
// public/learning-to-jump/, the same file used on that project's own page.
export default function PlatformerArtifact() {
  return (
    <div className="artifact-frame w-full max-w-sm border border-ink-700 bg-ink-900 p-5 shadow-[6px_6px_0_0_var(--color-ink-800)]">
      <span className="font-mono text-[0.625rem] tracking-[0.14em] text-paper-dim uppercase">
        Real gameplay · deterministic solve
      </span>
      <div className="mt-3 overflow-hidden border border-ink-700 bg-black" style={{ aspectRatio: '1400 / 600' }}>
        <img
          src="/learning-to-jump/stage5.gif"
          alt="The trained agent clearing the level in one attempt"
          className="h-full w-full object-cover"
          style={{ imageRendering: 'pixelated' }}
        />
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
