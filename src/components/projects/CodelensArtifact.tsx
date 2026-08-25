// A designed representation of Codelens's real output shape (severity,
// category, explanation, suggested fix) — not a screenshot of the live
// product. The "artifact-frame" wrapper is a fixed slot: a real screenshot
// can replace this component's contents later without touching Projects.tsx.
export default function CodelensArtifact() {
  return (
    <div className="artifact-frame w-full max-w-sm border border-ink-700 bg-ink-900 p-5 shadow-[6px_6px_0_0_var(--color-ink-800)]">
      <div className="flex items-center justify-between border-b border-ink-800 pb-3">
        <span className="font-mono text-[0.625rem] tracking-[0.14em] text-paper-dim uppercase">
          Sample finding · output structure
        </span>
        <span className="border border-accent/50 px-1.5 py-0.5 font-mono text-[0.625rem] font-medium tracking-wide text-accent uppercase">
          High
        </span>
      </div>
      <div className="mt-3 space-y-1">
        <p className="font-mono text-[0.6875rem] text-paper-dim">Security · Access Control</p>
        <p className="font-mono text-[0.6875rem] text-paper-dim/70">github-app/tokens.ts:42</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-paper">
        Token scope is broader than the operation requires. Narrowing to
        read-only contents limits blast radius if the token leaks.
      </p>
      <div className="mt-4 space-y-1 border-t border-ink-800 pt-3 font-mono text-[0.75rem]">
        <p className="text-paper-dim/70">
          <span className="text-paper-dim/40">− </span>const scope = 'repo'
        </p>
        <p className="text-accent">
          <span className="text-accent/50">+ </span>const scope = 'repo:read'
        </p>
      </div>
    </div>
  )
}
