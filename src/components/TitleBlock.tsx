import { motion, useReducedMotion } from 'motion/react'

const fields = [
  { label: 'Name', value: 'Dave Yoon' },
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
