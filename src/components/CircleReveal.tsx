import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'motion/react'

// An expanding circle, scroll-linked, opening from the small accent mark
// near the top-left corner — the same recurring signature dot used as
// every section's eyebrow, now the literal origin of a reveal. Used to
// bookend Projects: the exhibit opens from that point, and Contact closes
// the page by opening from the same point again.
export default function CircleReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'start 0.3'] })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 220, damping: 36, restDelta: 0.001 })
  const clipPath = useTransform(smoothProgress, (v) => `circle(${v * 142}% at 1.5% 3%)`)

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <motion.div ref={ref} className={className} style={{ clipPath }}>
      {children}
    </motion.div>
  )
}
