import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, useInView, useMotionValue, useTransform, animate } from 'motion/react'

const fields = [
  { label: 'Based', value: 'Sammamish, WA' },
  { label: 'Role', value: 'B.S. CS, Business Minor — UW' },
  { label: 'Built with', value: 'React · Tailwind · Vercel' },
]

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cellVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
}

// A wipe reveal driven by its own isolated useInView + MotionValue, not a
// declarative whileInView — nesting an independently viewport-triggered
// motion child inside an ancestor that also manages its own viewport-
// triggered animation state (this cell's parent grid) was found to get
// permanently stuck, the same failure mode found in the Projects titles.
function NameReveal() {
  const prefersReducedMotion = useReducedMotion()
  // Kept separate from the styled motion.p's own ref below — sharing one
  // ref between useInView and a styled motion component was the exact
  // cause of the earlier Projects-title bug.
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const inView = useInView(wrapperRef, { once: true, margin: '-80px' })
  const progress = useMotionValue(0)
  const clipPath = useTransform(progress, (v) => `inset(0% ${100 - v * 100}% 0% 0%)`)

  useEffect(() => {
    if (!inView) return
    if (prefersReducedMotion) {
      progress.set(1)
      return
    }
    const controls = animate(progress, 1, { duration: 0.6, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [inView, prefersReducedMotion, progress])

  return (
    <span ref={wrapperRef} className="block w-fit">
      <motion.p
        style={{ clipPath }}
        className="mt-1 w-fit font-display text-2xl font-bold uppercase tracking-tight text-paper"
      >
        Dave Yoon
      </motion.p>
    </span>
  )
}

export default function TitleBlock() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <footer className="border-t border-ink-800">
      <motion.div
        className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-ink-800 border-l border-ink-800 sm:grid-cols-4 sm:divide-y-0"
        initial={prefersReducedMotion ? undefined : 'hidden'}
        whileInView={prefersReducedMotion ? undefined : 'visible'}
        viewport={{ once: true, margin: '-80px' }}
        variants={prefersReducedMotion ? undefined : gridVariants}
      >
        <motion.div
          className="border-r border-ink-800 px-6 py-5"
          variants={prefersReducedMotion ? undefined : cellVariants}
        >
          <span className="eyebrow">Name</span>
          <NameReveal />
        </motion.div>
        {fields.map((field) => (
          <motion.div
            key={field.label}
            className="border-r border-ink-800 px-6 py-5"
            variants={prefersReducedMotion ? undefined : cellVariants}
          >
            <span className="eyebrow">{field.label}</span>
            <p className="mt-1.5 text-sm text-paper">{field.value}</p>
          </motion.div>
        ))}
      </motion.div>
      <p className="mx-auto max-w-6xl px-6 pt-4 pb-20 font-mono text-[0.6875rem] tracking-wide text-paper-dim/70">
        © {new Date().getFullYear()} Dave Yoon
      </p>
    </footer>
  )
}
