import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'motion/react'
import { experience, type ExperienceEntry } from '../data/experience'
import Eyebrow from './Eyebrow'
import MaskReveal from './MaskReveal'
import Tag from './Tag'

// Chronology is the actual structure of this content, so it becomes the
// visual structure: a spine that grows as you scroll through it, with
// each entry as a node along the timeline rather than an exhibit object.
function ExperienceRow({ entry, delay }: { entry: ExperienceEntry; delay: number }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className="relative"
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ type: 'spring', stiffness: 120, damping: 18, delay }}
    >
      <span
        aria-hidden="true"
        className="absolute top-1.5 -left-10 hidden h-2.5 w-2.5 -translate-x-1/2 bg-accent sm:block"
      />
      <span className="font-mono text-xs tracking-wide text-paper-dim tabular uppercase">{entry.dates}</span>

      <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h3 className="font-display text-3xl font-bold uppercase tracking-tight text-paper sm:text-4xl">
          {entry.company}
        </h3>
        <span className="font-mono text-xs text-paper-dim">{entry.location}</span>
        {entry.stat && (
          <span className="font-display text-lg font-bold tabular text-accent">{entry.stat}</span>
        )}
      </div>
      <p className="mt-1 text-sm font-medium text-accent">{entry.role}</p>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-paper-dim">{entry.description}</p>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {entry.tags.map((tag, index) => (
          <Tag key={tag} label={tag} delay={delay * 1000 + index * 30} />
        ))}
      </ul>

      {entry.link && (
        <a
          href={entry.link}
          target="_blank"
          rel="noreferrer"
          className="link-underline mt-4 inline-flex w-fit items-center gap-1.5 font-mono text-xs font-medium tracking-wide text-accent uppercase transition-colors hover:text-paper"
        >
          {entry.linkLabel ?? 'Read Paper'}
          <span aria-hidden="true" className="text-[0.6875rem]">
            ↗
          </span>
        </a>
      )}
    </motion.div>
  )
}

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start 0.75', 'end 0.6'] })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 200, damping: 34, restDelta: 0.001 })
  const spineScale = useTransform(smoothProgress, [0, 1], [0, 1])

  return (
    <section id="experience" className="relative mx-auto max-w-6xl px-6 py-28 sm:px-8 lg:px-12">
      <Eyebrow>Work</Eyebrow>
      <MaskReveal className="mt-2 w-fit">
        <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-paper sm:text-5xl">
          Experience
        </h2>
      </MaskReveal>

      <div ref={containerRef} className="relative mt-16 sm:pl-10">
        <div className="absolute top-0 left-0 hidden h-full w-px bg-ink-800 sm:block" aria-hidden="true" />
        {!prefersReducedMotion && (
          <motion.div
            className="absolute top-0 left-0 hidden h-full w-px origin-top bg-accent sm:block"
            style={{ scaleY: spineScale }}
            aria-hidden="true"
          />
        )}
        <div className="space-y-20">
          {experience.map((entry, index) => (
            <ExperienceRow key={entry.company} entry={entry} delay={index * 0.08} />
          ))}
        </div>
      </div>
    </section>
  )
}
