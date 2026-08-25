import { motion, useReducedMotion } from 'motion/react'
import { education } from '../data/education'
import Eyebrow from './Eyebrow'
import MaskReveal from './MaskReveal'

const uw = education.find((e) => e.school === 'University of Washington')!
const skyline = education.find((e) => e.school === 'Skyline High School')!

export default function Education() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="education" className="relative mx-auto max-w-6xl px-6 py-28 sm:px-8 lg:px-12">
      <Eyebrow>Record</Eyebrow>
      <MaskReveal className="mt-2 w-fit">
        <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-paper sm:text-5xl">
          Education
        </h2>
      </MaskReveal>

      {/* University of Washington — the primary entry, given the scale it earns */}
      <motion.div
        className="mt-16 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-16"
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 32 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      >
        <div>
          <span className="font-mono text-xs tracking-wide text-paper-dim tabular uppercase">{uw.dates}</span>
          <h3 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight text-paper sm:text-5xl">
            {uw.school}
          </h3>
          <p className="mt-2 text-sm font-medium text-accent">{uw.detail.split(' — ')[0]}</p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-paper-dim">
            {uw.program}. Relevant coursework: {uw.coursework}.
          </p>
        </div>
        <div className="lg:text-right">
          <p className="font-display text-6xl font-bold tabular text-paper sm:text-7xl">3.98</p>
          <p className="font-mono text-xs text-paper-dim">/ 4.00 GPA</p>
        </div>
      </motion.div>

      {/* Skyline High School — a quieter coda, distinguished by scale and weight */}
      <motion.div
        className="mt-16 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t border-ink-900 pt-8"
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ type: 'spring', stiffness: 140, damping: 20, delay: 0.1 }}
      >
        <div>
          <h4 className="font-display text-xl font-bold uppercase tracking-tight text-paper-dim">
            {skyline.school}
          </h4>
          <p className="mt-1 max-w-md text-xs leading-relaxed text-paper-dim/70">
            {skyline.detail} · {skyline.coursework}
          </p>
        </div>
        <span className="font-mono text-xs text-paper-dim/60 tabular uppercase">{skyline.dates}</span>
      </motion.div>
    </section>
  )
}
