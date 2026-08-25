import { motion, useReducedMotion } from 'motion/react'
import { education, type EducationEntry } from '../data/education'
import SectionHeading from './SectionHeading'

function EducationRow({ entry, index }: { entry: EducationEntry; index: number }) {
  const fromRight = index % 2 === 1
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className="grid gap-x-6 gap-y-2 border-t border-ink-800 py-7 sm:grid-cols-[1fr_auto]"
      initial={prefersReducedMotion ? undefined : { opacity: 0, x: fromRight ? 28 : -28 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
    >
      <div>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-paper">
            {entry.school}
          </h3>
          <span className="font-mono text-xs text-paper-dim">{entry.location}</span>
        </div>
        {entry.program && <p className="mt-1 font-mono text-xs text-paper-dim">{entry.program}</p>}
        <p className="mt-2 text-sm font-medium text-accent">{entry.detail}</p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper-dim">
          Relevant coursework: {entry.coursework}
        </p>
      </div>
      <span className="font-mono text-xs tabular text-paper-dim sm:text-right">{entry.dates}</span>
    </motion.div>
  )
}

export default function Education() {
  return (
    <section id="education" className="mx-auto max-w-6xl px-6 py-24 sm:px-8 lg:px-12">
      <SectionHeading eyebrow="Record" title="Education" />
      <div className="mt-10 border-b border-ink-800">
        {education.map((entry, index) => (
          <EducationRow key={entry.school} entry={entry} index={index} />
        ))}
      </div>
    </section>
  )
}
