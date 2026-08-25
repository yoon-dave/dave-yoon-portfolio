// A schematic of the real system architecture built at DubHacks — not a
// photo of the hardware. The "artifact-frame" wrapper is a fixed slot for
// a real hardware photo later.
const STAGES = [
  { label: 'Live sales + inventory data', detail: 'Input' },
  { label: 'Gemini 1.5 Pro', detail: 'Reasoning' },
  { label: 'Raspberry Pi 5', detail: 'Edge deployment' },
  { label: 'Pricing decision', detail: 'Output' },
]

export default function DubHacksArtifact() {
  return (
    <div className="artifact-frame w-full max-w-md -rotate-[0.6deg] border border-ink-700 bg-ink-900 p-5 shadow-[6px_6px_0_0_var(--color-ink-800)]">
      <span className="font-mono text-[0.625rem] tracking-[0.14em] text-paper-dim uppercase">
        System diagram · T-Mobile 5G Home Internet gateway
      </span>
      <div className="mt-4 flex flex-col">
        {STAGES.map((s, i) => (
          <div key={s.label}>
            <div
              className={`border px-3 py-2.5 ${
                i === 2 ? 'border-accent/50 bg-accent/10' : 'border-ink-700 bg-ink-800'
              }`}
            >
              <p className={`text-sm font-medium ${i === 2 ? 'text-accent' : 'text-paper'}`}>{s.label}</p>
              <p className="font-mono text-[0.5625rem] text-paper-dim/60 uppercase">{s.detail}</p>
            </div>
            {i < STAGES.length - 1 && (
              <div aria-hidden="true" className="flex justify-center py-1 font-mono text-paper-dim/40">
                ↓
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
