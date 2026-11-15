import { useState } from 'react'
import { motion } from 'motion/react'

// Thyrd's ingest (lib/events/ingest.ts) runs every source on its own. A
// feed that throws is reported as failed and nothing of its is deleted, so
// its last good events stay on Discover while the other sources keep
// upserting. Clicking a source here simulates that outage. The sample
// events are real listings seen on the live Discover feed (Nov 2026),
// except the athletics row, which stands in for the gohuskies.com schedule.
const SOURCES = [
  { id: 'uw-trumba', label: 'UW Seattle calendars', sample: 'Civic Belonging in an Anti-Democratic Age', where: 'HUB' },
  { id: 'huskylink', label: 'HuskyLink student orgs', sample: 'Commander Night at the Hub', where: 'WGA Magic: The Gathering' },
  { id: 'husky-athletics', label: 'Husky Athletics', sample: 'Home games', where: 'gohuskies.com schedule' },
  { id: 'venues', label: 'Venue iCal feeds', sample: 'Candlelight Concert', where: 'Town Hall Seattle' },
  { id: 'ticketmaster', label: 'Ticketmaster', sample: 'Houndmouth', where: 'Moore Theatre' },
]

export default function ThyrdArtifact() {
  const [failed, setFailed] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setFailed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const okCount = SOURCES.length - failed.size

  return (
    <div className="artifact-frame w-full max-w-xl border border-ink-700 bg-ink-900 shadow-[6px_6px_0_0_var(--color-ink-800)]">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink-800 px-5 py-3">
        <span className="font-mono text-[0.625rem] tracking-[0.14em] text-paper-dim uppercase">
          Ingest run · sources isolated
        </span>
        <span className="font-mono text-[0.5625rem] tracking-[0.12em] text-paper-dim/60 uppercase">
          Click a source to break it
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr]">
        <ul className="flex flex-col gap-1.5 p-4">
          {SOURCES.map((s) => {
            const isFailed = failed.has(s.id)
            return (
              <li key={s.id}>
                <button
                  type="button"
                  aria-pressed={isFailed}
                  aria-label={`${s.label}: ${isFailed ? 'failed, click to restore' : 'upserted, click to simulate a failure'}`}
                  onClick={() => toggle(s.id)}
                  className={`flex w-full items-center justify-between gap-3 border px-3 py-2 text-left transition-colors ${
                    isFailed
                      ? 'border-ink-700 bg-ink-950 text-paper-dim/50'
                      : 'border-ink-700 bg-ink-800 text-paper hover:border-accent/60'
                  }`}
                >
                  <span className={`text-xs ${isFailed ? 'line-through' : ''}`}>{s.label}</span>
                  <span
                    className={`shrink-0 font-mono text-[0.5625rem] tracking-[0.1em] uppercase ${
                      isFailed ? 'text-paper-dim/60' : 'text-accent'
                    }`}
                  >
                    {isFailed ? 'Failed' : 'Upserted'}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <div
          aria-hidden="true"
          className="flex items-center justify-center border-ink-800 py-1 font-mono text-paper-dim/40 sm:border-x sm:px-3"
        >
          <span className="sm:hidden">↓</span>
          <span className="hidden sm:inline">→</span>
        </div>

        <div className="p-4">
          <span className="font-mono text-[0.5625rem] tracking-[0.12em] text-paper-dim/60 uppercase">Discover feed</span>
          <ul className="mt-2 flex flex-col gap-1.5">
            {SOURCES.map((s) => {
              const isFailed = failed.has(s.id)
              return (
                <motion.li
                  key={s.id}
                  animate={{ opacity: isFailed ? 0.55 : 1 }}
                  transition={{ duration: 0.25 }}
                  className={`border-l-2 bg-ink-800/60 px-3 py-1.5 ${isFailed ? 'border-ink-600' : 'border-accent/60'}`}
                >
                  <p className="truncate text-xs text-paper">{s.sample}</p>
                  <p className="truncate font-mono text-[0.5625rem] text-paper-dim/70 uppercase">
                    {isFailed ? 'Kept from last good run' : s.where}
                  </p>
                </motion.li>
              )
            })}
          </ul>
        </div>
      </div>

      <div aria-live="polite" className="border-t border-ink-800 px-5 py-3 font-mono text-[0.625rem] tracking-wide text-paper-dim uppercase">
        <span className="text-accent">
          {okCount} of {SOURCES.length}
        </span>{' '}
        {failed.size === 0
          ? 'sources upserted · 130+ upcoming events'
          : `upserted · ${failed.size} failed, nothing deleted`}
      </div>
    </div>
  )
}
