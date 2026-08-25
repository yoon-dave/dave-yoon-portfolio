import { motion, useReducedMotion } from 'motion/react'
import { useReveal } from '../hooks/useReveal'
import { experience, type ExperienceEntry } from '../data/experience'
import SectionHeading from './SectionHeading'
import Tag from './Tag'

function ExperienceRow({ entry, delay }: { entry: ExperienceEntry; delay: number }) {
  const reveal = useReveal<HTMLDivElement>(delay)
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      ref={reveal.ref}
      className={`group relative grid gap-x-6 gap-y-3 border-t border-ink-800 py-9 transition-colors duration-300 ease-out hover:bg-white/5 sm:grid-cols-[1fr_auto] ${reveal.className}`}
      style={reveal.style}
    >
      {entry.link && (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-y-100"
        />
      )}

      <div>
        <span className="eyebrow">{entry.code}</span>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h3
            className={`inline-flex items-center gap-2 font-display text-2xl font-bold uppercase tracking-tight text-paper transition-colors duration-300 sm:text-2xl ${entry.link ? 'group-hover:text-accent' : ''}`}
          >
            {entry.company}
            {entry.link && (
              <span
                aria-hidden="true"
                className="text-accent opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100"
              >
                →
              </span>
            )}
          </h3>
          <span className="font-mono text-xs text-paper-dim">{entry.location}</span>
        </div>
        <p className="mt-1 text-sm font-medium text-accent">{entry.role}</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-paper-dim">{entry.description}</p>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {entry.tags.map((tag, index) => (
            <Tag key={tag} label={tag} delay={delay + index * 30} />
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
      </div>

      <div className="flex flex-row items-start justify-between gap-4 sm:flex-col sm:items-end sm:justify-start sm:text-right">
        <span className="font-mono text-xs tabular text-paper-dim">{entry.dates}</span>
        {entry.stat && (
          <motion.span
            className="inline-block font-display text-2xl font-bold tabular text-accent"
            initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.6 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            {entry.stat}
          </motion.span>
        )}
      </div>
    </div>
  )
}

export default function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-24 sm:px-8 lg:px-12">
      <SectionHeading eyebrow="Work" title="Experience" />
      <div className="mt-10 border-b border-ink-800">
        {experience.map((entry, index) => (
          <ExperienceRow key={entry.company} entry={entry} delay={index * 100} />
        ))}
      </div>
    </section>
  )
}
