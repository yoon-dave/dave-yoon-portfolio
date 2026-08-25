import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'motion/react'

// A horizontal wipe driven by the reader's own scroll position, not a
// timed entrance — the recurring "resolving into focus" move that echoes
// the hero's letter assembly and Projects' guide lines, reused wherever a
// heading needs to arrive without being another fade-up.
export default function MaskReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 1', 'start 0.65'] })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 260, damping: 38, restDelta: 0.001 })
  const clipPath = useTransform(smoothProgress, (v) => `inset(0 ${100 - v * 100}% 0 0)`)

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div ref={ref} className={className} style={{ clipPath }}>
      {children}
    </motion.div>
  )
}
