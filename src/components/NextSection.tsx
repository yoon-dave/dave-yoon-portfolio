import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

// Order matters: each entry's "next" is simply the following one. Home
// points to About; Contact has no next and the cue hides entirely.
const SEQUENCE = [
  { id: 'home', label: 'About' },
  { id: 'about', label: 'Education' },
  { id: 'education', label: 'Experience' },
  { id: 'experience', label: 'Projects' },
  { id: 'projects', label: 'Contact' },
  { id: 'contact', label: null },
]

export default function NextSection() {
  const [activeId, setActiveId] = useState('home')
  const [footerVisible, setFooterVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const ids = SEQUENCE.map((s) => s.id)
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )
    sections.forEach((section) => observer.observe(section))

    const footer = document.querySelector('footer')
    const footerObserver = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), {
      rootMargin: '0px 0px -20% 0px',
    })
    if (footer) footerObserver.observe(footer)

    return () => {
      observer.disconnect()
      footerObserver.disconnect()
    }
  }, [])

  const currentIndex = SEQUENCE.findIndex((s) => s.id === activeId)
  const next = SEQUENCE[currentIndex]?.label

  if (!next || footerVisible) return null

  return (
    <a
      href={`#${SEQUENCE[currentIndex + 1]?.id}`}
      aria-label={`Scroll to ${next} section`}
      className="group fixed bottom-6 left-4 z-40 flex items-center gap-2 sm:left-6 sm:gap-3"
    >
      <span className="relative flex h-8 w-4 items-start justify-center overflow-hidden">
        <motion.span
          aria-hidden="true"
          className="h-4 w-px bg-ink-600 transition-colors duration-200 group-hover:bg-accent"
          animate={prefersReducedMotion ? undefined : { y: [0, 10, 0] }}
          transition={
            prefersReducedMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
          }
        />
      </span>
      <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-paper-dim uppercase transition-colors duration-200 group-hover:text-paper">
        Next — {next}
      </span>
    </a>
  )
}
