import { motion, useReducedMotion } from 'motion/react'
import { education } from '../data/education'
import Eyebrow from './Eyebrow'
import MaskReveal from './MaskReveal'
import Tag from './Tag'

const uw = education.find((e) => e.school === 'University of Washington')!
const skyline = education.find((e) => e.school === 'Skyline High School')!
const uwCoursework = uw.coursework.split(', ')

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

      {/* University of Washington — the current chapter, given the scale and
          richness that earns: coursework rendered as real tags, not prose. */}
      <motion.div
        className="mt-16 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-16"
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 32 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      >
        <div>
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-1.5 w-1.5 bg-accent" />
            <span className="font-mono text-[0.625rem] tracking-[0.14em] text-accent uppercase">In progress</span>
          </div>
          <span className="mt-3 block font-mono text-xs tracking-wide text-paper-dim tabular uppercase">
            {uw.dates}
          </span>
          <h3 className="mt-2 font-display text-5xl font-bold uppercase tracking-tight text-paper sm:text-6xl">
            {uw.school}
          </h3>
          <p className="mt-2 text-sm font-medium text-accent">{uw.detail.split(' — ')[0]}</p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-paper-dim">{uw.program}.</p>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {uwCoursework.map((course, index) => (
              <Tag key={course} label={course} delay={index * 30} />
            ))}
          </ul>
        </div>
        <div className="lg:text-right">
          <p className="font-display text-6xl font-bold tabular text-paper sm:text-7xl">3.98</p>
          <p className="font-mono text-xs text-paper-dim">/ 4.00 GPA</p>
        </div>
      </motion.div>

      {/* Skyline High School — contained rather than mirrored: a smaller
          footprint than UW, but full brightness and a real accent line
          for the diploma, so the finished foundation is still legible
          at a glance instead of fading into a footnote. */}
      <motion.div
        className="mt-20 max-w-xl border-t border-ink-900 pt-6"
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ type: 'spring', stiffness: 140, damping: 20, delay: 0.1 }}
      >
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-1.5 w-1.5 bg-paper-dim/70" />
          <span className="font-mono text-[0.625rem] tracking-[0.14em] text-paper-dim uppercase">Completed</span>
        </div>
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h4 className="font-display text-3xl font-bold uppercase tracking-tight text-paper sm:text-4xl">
            {skyline.school}
          </h4>
          <span className="font-mono text-xs text-paper-dim tabular uppercase">{skyline.dates}</span>
        </div>
        <p className="mt-2 text-sm font-medium text-accent">{skyline.detail.split(' — ')[0]}</p>
        <p className="mt-2 text-xs leading-relaxed text-paper-dim/80">
          {skyline.detail.split(' — ')[1]} · {skyline.coursework}
        </p>
      </motion.div>
    </section>
  )
}
