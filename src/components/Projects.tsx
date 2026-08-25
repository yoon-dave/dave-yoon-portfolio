import { useRef, type ReactNode, type RefObject } from 'react'
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'motion/react'
import { projects } from '../data/projects'
import { experience } from '../data/experience'
import Tag from './Tag'
import CodelensArtifact from './projects/CodelensArtifact'
import GymBudArtifact from './projects/GymBudArtifact'
import AlgoverseArtifact from './projects/AlgoverseArtifact'
import DubHacksArtifact from './projects/DubHacksArtifact'

const codelens = projects.find((p) => p.title === 'Codelens')!
const gymbud = projects.find((p) => p.title === 'GymBud')!
const dubhacks = projects.find((p) => p.title === 'T-Mobile AI Pricing Assistant')!
const algoverse = experience.find((e) => e.company === 'Algoverse AI Research')!

// Four vertical guide lines, quiet at rest, that resolve into focus as the
// exhibit scrolls into view — the strongest transition on the page, built
// as a continuous system rather than a fade. Scoped to this section only.
function GridLines({ target }: { target: RefObject<HTMLElement | null> }) {
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'start 30%'] })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 200, damping: 34, restDelta: 0.001 })
  const opacity = useTransform(smoothProgress, [0, 1], [0, 1])

  if (prefersReducedMotion) {
    return (
      <div className="pointer-events-none absolute inset-0 hidden lg:grid lg:grid-cols-12" aria-hidden="true">
        {[1, 4, 8, 12].map((col) => (
          <span key={col} className="border-l border-ink-800" style={{ gridColumn: col }} />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 hidden lg:grid lg:grid-cols-12"
      style={{ opacity }}
      aria-hidden="true"
    >
      {[1, 4, 8, 12].map((col) => (
        <span key={col} className="border-l border-ink-800" style={{ gridColumn: col }} />
      ))}
    </motion.div>
  )
}

function ExhibitItem({
  className,
  artifact,
  eyebrow,
  title,
  description,
  tags,
  statText,
  link,
  linkLabel,
  delay,
}: {
  className: string
  artifact: ReactNode
  eyebrow: string
  title: string
  description: string
  tags: string[]
  statText?: string
  link?: string
  linkLabel?: string
  delay: number
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={`relative flex flex-col gap-6 ${className}`}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 40, rotate: -0.6 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ type: 'spring', stiffness: 120, damping: 17, delay }}
    >
      <div className="flex justify-center sm:justify-start">{artifact}</div>
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-paper sm:text-3xl">
          {title}
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-paper-dim">{description}</p>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {tags.map((tag, i) => (
            <Tag key={tag} label={tag} delay={i * 30} />
          ))}
        </ul>
        <div className="mt-5 flex items-center gap-6 font-mono text-xs tracking-wide uppercase">
          {statText && <span className="text-accent">{statText}</span>}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="link-underline inline-flex items-center gap-1.5 text-paper transition-colors hover:text-accent"
            >
              {linkLabel ?? 'View'}
              <span aria-hidden="true" className="text-[0.6875rem]">
                ↗
              </span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative mx-auto max-w-6xl px-6 py-28 sm:px-8 lg:px-12"
    >
      <GridLines target={sectionRef} />

      <div className="relative flex items-center gap-3">
        <span aria-hidden="true" className="h-1.5 w-1.5 bg-accent" />
        <span className="eyebrow">Exhibit</span>
      </div>
      <h2 className="relative mt-2 font-display text-5xl font-bold uppercase tracking-tight text-paper sm:text-6xl">
        Selected work
      </h2>

      <div className="relative mt-20 grid grid-cols-1 gap-x-8 gap-y-24 lg:grid-cols-12 lg:gap-y-16">
        <ExhibitItem
          className="lg:col-span-7 lg:col-start-1"
          artifact={<CodelensArtifact />}
          eyebrow={codelens.code}
          title={codelens.title}
          description={codelens.description}
          tags={codelens.tags}
          statText="150+ Tests"
          link={codelens.link}
          linkLabel="Live site"
          delay={0}
        />
        <ExhibitItem
          className="lg:col-span-4 lg:col-start-9 lg:mt-20"
          artifact={<GymBudArtifact />}
          eyebrow={gymbud.code}
          title={gymbud.title}
          description={gymbud.description}
          tags={gymbud.tags}
          link={gymbud.link}
          linkLabel={gymbud.linkLabel}
          delay={0.08}
        />
        <ExhibitItem
          className="lg:col-span-8 lg:col-start-2 lg:mt-8"
          artifact={<AlgoverseArtifact />}
          eyebrow={algoverse.code}
          title={algoverse.company}
          description={algoverse.description}
          tags={algoverse.tags}
          link={algoverse.link}
          linkLabel={algoverse.linkLabel}
          delay={0.12}
        />
        <ExhibitItem
          className="lg:col-span-4 lg:col-start-9 lg:mt-4"
          artifact={<DubHacksArtifact />}
          eyebrow={dubhacks.code}
          title={dubhacks.title}
          description={dubhacks.description}
          tags={dubhacks.tags}
          statText="3rd Place"
          delay={0.2}
        />
      </div>

      <p className="relative mt-24 font-mono text-xs text-paper-dim/60">
        This site — React · TypeScript · Vite · Tailwind CSS · Resend
      </p>
    </section>
  )
}
