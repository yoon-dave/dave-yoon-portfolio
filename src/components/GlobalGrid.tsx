// A quiet, page-wide floor grid — the one continuous structural system
// every section sits on, so the page reads as one composition rather
// than stacked, unrelated components. Static; Projects layers its own
// richer, scroll-linked version of the same four guide lines on top.
export default function GlobalGrid() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 hidden lg:block" aria-hidden="true">
      <div className="mx-auto grid h-full max-w-6xl grid-cols-12 px-12">
        {[1, 4, 8, 12].map((col) => (
          <span key={col} className="h-full border-l border-ink-900" style={{ gridColumn: col }} />
        ))}
      </div>
    </div>
  )
}
