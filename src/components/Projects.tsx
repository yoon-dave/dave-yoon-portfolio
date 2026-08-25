import { useEffect, useRef, useState, type RefObject } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  useInView,
  useMotionValue,
  animate,
  type MotionValue,
} from 'motion/react'
import { projects, type Project } from '../data/projects'
import SectionHeading from './SectionHeading'
import Tag from './Tag'

// Renders a numeric stat that counts up from zero the first time it scrolls
// into view — the same "measured result" idea as the site's other stats,
// but felt rather than just read.
function CountUpStat({ value, suffix }: { value: number; suffix: string }) {
  const prefersReducedMotion = useReducedMotion()
  const ref = useRef<HTMLParagraphElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const count = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const unsubscribe = count.on('change', (v) => setDisplay(Math.round(v)))
    return unsubscribe
  }, [count])

  useEffect(() => {
    if (!inView) return
    if (prefersReducedMotion) {
      count.set(value)
      return
    }
    const controls = animate(count, value, { duration: 1.3, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [inView, prefersReducedMotion, value, count])

  return (
    <p ref={ref} className="mt-2 font-display text-4xl font-bold tabular text-accent">
      {display}
      {suffix}
    </p>
  )
}

// Title reveal, driven by a MotionValue rather than a nested declarative
// whileInView (which never reliably fired when its motion.article ancestor
// also carried its own whileInView and a scroll-linked scale transform).
// The trigger reuses the row's own ref rather than a ref of its own: a ref
// shared between useInView and a styled motion component's `ref` prop never
// resolved, apparently because Motion's internal ref handling on the styled
// element prevented useInView's effect from ever seeing a populated
// ref.current. The row's ref, read here only (never assigned to a styled
// motion node), doesn't have that conflict.
function ProjectTitle({
  title,
  hasLink,
  clipPath,
}: {
  title: string
  hasLink: boolean
  clipPath: MotionValue<string>
}) {
  return (
    <motion.h3
      style={{ clipPath }}
      className="inline-flex items-center gap-3 font-display text-4xl font-bold uppercase tracking-tight text-paper transition-colors duration-300 group-hover:text-accent sm:text-5xl"
    >
      {title}
      {hasLink && (
        <span
          aria-hidden="true"
          className="text-2xl text-accent opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100 sm:text-3xl"
        >
          →
        </span>
      )}
    </motion.h3>
  )
}

function ProjectRow({ project, delay }: { project: Project; delay: number }) {
  const rowRef = useRef<HTMLElement>(null)
  const hasLink = Boolean(project.link || project.repo)
  const prefersReducedMotion = useReducedMotion()
  const rowInView = useInView(rowRef, { once: true, margin: '-80px' })
  const titleProgress = useMotionValue(0)
  const titleClipPath = useTransform(titleProgress, (v) => `inset(0% ${100 - v * 100}% 0% 0%)`)

  useEffect(() => {
    if (!rowInView) return
    if (prefersReducedMotion) {
      titleProgress.set(1)
      return
    }
    const controls = animate(titleProgress, 1, { type: 'spring', stiffness: 60, damping: 18, delay: delay / 1000 })
    return () => controls.stop()
  }, [rowInView, prefersReducedMotion, delay, titleProgress])

  // A subtle "in focus" weight as each row passes through the middle of the
  // viewport — nowhere near a full dim/undim, just enough that the row
  // you're actually reading feels a hair more present than its neighbors.
  const { scrollYProgress } = useScroll({ target: rowRef, offset: ['start end', 'end start'] })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 300, damping: 40, restDelta: 0.001 })
  const focusScale = useTransform(smoothProgress, [0, 0.5, 1], [0.98, 1, 0.98])

  return (
    <motion.article
      ref={rowRef}
      className="group relative grid grid-cols-1 gap-6 border-t border-ink-800 py-12 transition-colors duration-300 ease-out hover:bg-white/5 sm:grid-cols-[220px_1fr] sm:gap-10"
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 28 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
      style={prefersReducedMotion ? undefined : { scale: focusScale }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-y-100"
      />

      <div className="flex flex-col gap-5">
        <div>
          <span className="eyebrow">{project.code}</span>
          {project.statNumber !== undefined ? (
            <CountUpStat value={project.statNumber} suffix={project.statSuffix ?? ''} />
          ) : (
            project.stat && <p className="mt-2 font-display text-4xl font-bold tabular text-accent">{project.stat}</p>
          )}
        </div>
        <ul className="flex flex-col gap-2 sm:mt-1">
          {project.tags.map((tag, index) => (
            <Tag key={tag} label={tag} delay={delay + index * 30} />
          ))}
        </ul>
      </div>

      <div className="flex flex-col">
        <ProjectTitle title={project.title} hasLink={hasLink} clipPath={titleClipPath} />
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-paper-dim">{project.description}</p>
        {hasLink && (
          <div className="mt-5 flex gap-6 font-mono text-xs tracking-wide uppercase">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="link-underline inline-flex items-center gap-1.5 font-medium text-accent transition-colors hover:text-paper"
              >
                {project.linkLabel ?? 'Live site'}
                <span aria-hidden="true" className="text-[0.6875rem]">
                  ↗
                </span>
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="link-underline inline-flex items-center gap-1.5 text-paper-dim transition-colors hover:text-accent"
              >
                Source
                <span aria-hidden="true" className="text-[0.6875rem]">
                  ↗
                </span>
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  )
}

// The section's ink-900 band, given motion: closed to a thin central slit
// while Projects is offscreen, opening like a drafting sheet unfolding as it
// scrolls into view, held open through the reading portion, then closing
// again on the way out. One continuous scroll-linked value covers both the
// Experience -> Projects arrival and the Projects -> Contact departure.
function ProjectsPanel({ target }: { target: RefObject<HTMLElement | null> }) {
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 260, damping: 36, restDelta: 0.001 })
  const clipPath = useTransform(
    smoothProgress,
    [0, 0.18, 0.82, 1],
    ['inset(46% 40% 46% 40%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(46% 40% 46% 40%)'],
  )

  if (prefersReducedMotion) {
    return <div className="absolute inset-0 bg-ink-900" aria-hidden="true" />
  }

  return <motion.div className="absolute inset-0 bg-ink-900" style={{ clipPath }} aria-hidden="true" />
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section id="projects" ref={sectionRef} className="relative">
      <ProjectsPanel target={sectionRef} />
      <div className="relative mx-auto max-w-6xl px-6 py-24 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="Log" title="Projects" />
        <div className="mt-10 border-b border-ink-800">
          {projects.map((project, index) => (
            <ProjectRow key={project.title} project={project} delay={index * 80} />
          ))}
        </div>
      </div>
    </section>
  )
}
