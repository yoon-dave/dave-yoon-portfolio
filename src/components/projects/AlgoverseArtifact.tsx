// A real research figure built from the actual paper's reported numbers
// (baseline vs. 8-shot "suspicious-first" prompting, n=600) — not a
// screenshot of the paper. The "artifact-frame" wrapper is a fixed slot
// for a real figure image later.
export default function AlgoverseArtifact() {
  return (
    <div className="artifact-frame w-full max-w-md rotate-[0.8deg] border border-ink-700 bg-ink-900 p-5 shadow-[6px_6px_0_0_var(--color-ink-800)]">
      <span className="font-mono text-[0.625rem] tracking-[0.14em] text-paper-dim uppercase">
        Fig. 1 · URL-based detection accuracy (n=600)
      </span>

      <div className="mt-5 flex items-end gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-24 w-10 items-end bg-ink-800">
            <div className="w-full bg-ink-600" style={{ height: '81%' }} />
          </div>
          <span className="font-mono text-xs tabular text-paper-dim">81%</span>
          <span className="font-mono text-[0.5625rem] text-paper-dim/60 uppercase">Baseline</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-24 w-10 items-end bg-ink-800">
            <div className="w-full bg-accent" style={{ height: '91%' }} />
          </div>
          <span className="font-mono text-xs tabular text-accent">91%</span>
          <span className="font-mono text-[0.5625rem] text-paper-dim/60 uppercase">8-shot</span>
        </div>

        <div className="ml-auto grid gap-3 border-l border-ink-800 pl-6">
          <div>
            <p className="font-display text-2xl font-bold tabular text-paper">0.93</p>
            <p className="font-mono text-[0.5625rem] text-paper-dim/70 uppercase">F1 · GPT-4o</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold tabular text-paper">+10pt</p>
            <p className="font-mono text-[0.5625rem] text-paper-dim/70 uppercase">Gemini 1.5 Pro</p>
          </div>
        </div>
      </div>
    </div>
  )
}
