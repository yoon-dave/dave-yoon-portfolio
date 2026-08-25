import type { RefObject } from 'react'
import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react'
import { useReveal } from '../hooks/useReveal'
import DimensionLine from './DimensionLine'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  /**
   * Draws the dimension line as a function of scroll position instead of
   * the usual intersection-triggered reveal. Reserved for the section that
   * immediately follows the hero, so the ruler feels drawn by the act of
   * scrolling in rather than replaying the same cue on every section.
   */
  scrollLinked?: boolean
}

function ScrollLinkedLine({ target }: { target: RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({ target, offset: ['start 0.9', 'start 0.55'] })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 300, damping: 40, restDelta: 0.001 })

  return (
    <motion.div className="mt-5 origin-left" style={{ scaleX: smoothProgress }}>
      <DimensionLine />
    </motion.div>
  )
}

export default function SectionHeading({ eyebrow, title, scrollLinked = false }: SectionHeadingProps) {
  const reveal = useReveal<HTMLDivElement>()
  const prefersReducedMotion = useReducedMotion()

  return (
    <div ref={reveal.ref} className={reveal.className} style={reveal.style}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight text-paper sm:text-5xl">
        {title}
      </h2>
      {scrollLinked && !prefersReducedMotion ? (
        <ScrollLinkedLine target={reveal.ref} />
      ) : (
        <DimensionLine
          className="mt-5 origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
          style={{ transform: reveal.visible ? 'scaleX(1)' : 'scaleX(0)' }}
        />
      )}
    </div>
  )
}
