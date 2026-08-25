import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import MathEnvironment from './MathEnvironment'

// Hand-authored scatter for each letterform — not randomized, so the
// assembly reads as designed (like cut letters being placed on a page)
// rather than physics-random. x/y in px, r in degrees, delay in seconds.
// Each letter also starts oversized, so the name reads as materializing
// from illegible, too-large fragments rather than just sliding into
// place — an unusual scale relationship, not just a position tween.
const LINE_ONE = [
  { char: 'D', x: -64, y: -46, r: -16, scale: 2.4, delay: 0.02 },
  { char: 'A', x: 52, y: -60, r: 13, scale: 2.1, delay: 0.16 },
  { char: 'V', x: -38, y: 54, r: 20, scale: 2.6, delay: 0.09 },
  { char: 'E', x: 70, y: 34, r: -11, scale: 1.9, delay: 0.24 },
]

const LINE_TWO = [
  { char: 'Y', x: -80, y: 22, r: 15, scale: 2.3, delay: 0.32 },
  { char: 'O', x: 56, y: -36, r: -18, scale: 2, delay: 0.44 },
  { char: 'O', x: -28, y: 62, r: 9, scale: 2.5, delay: 0.38 },
  { char: 'N', x: 84, y: -18, r: -13, scale: 2.2, delay: 0.52 },
]

type Letter = (typeof LINE_ONE)[number]

function Letterline({
  letters,
  prefersReducedMotion,
  hoverEnabled,
  hoveredChar,
  onHover,
}: {
  letters: Letter[]
  prefersReducedMotion: boolean
  hoverEnabled: boolean
  hoveredChar: Letter | null
  onHover: (letter: Letter | null) => void
}) {
  return (
    <div className="flex">
      {letters.map((l, i) => (
        <motion.span
          key={`${l.char}-${i}`}
          className="inline-block"
          onMouseEnter={() => hoverEnabled && onHover(l)}
          onMouseLeave={() => hoverEnabled && onHover(null)}
          initial={
            prefersReducedMotion ? undefined : { x: l.x, y: l.y, rotate: l.r, scale: l.scale, opacity: 0 }
          }
          animate={{
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            color: hoveredChar === l ? 'var(--color-accent)' : 'var(--color-paper)',
          }}
          transition={{
            x: prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 110, damping: 14, mass: 1, delay: l.delay },
            y: prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 110, damping: 14, mass: 1, delay: l.delay },
            rotate: prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 110, damping: 14, mass: 1, delay: l.delay },
            scale: prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 110, damping: 14, mass: 1, delay: l.delay },
            opacity: prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 110, damping: 14, mass: 1, delay: l.delay },
            color: { duration: 0.2, ease: 'easeOut' },
          }}
        >
          {l.char}
        </motion.span>
      ))}
    </div>
  )
}

export default function Hero() {
  const [trackingEnabled, setTrackingEnabled] = useState(false)
  const [hoveredChar, setHoveredChar] = useState<Letter | null>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setTrackingEnabled(fine && !reduceMotion)
  }, [])

  return (
    <section
      id="home"
      onMouseLeave={() => setHoveredChar(null)}
      className="relative mx-auto flex min-h-[92svh] w-full max-w-6xl flex-col justify-center px-6 py-28 sm:px-8 lg:px-12"
    >
      <MathEnvironment active={trackingEnabled} prefersReducedMotion={Boolean(prefersReducedMotion)} />

      <div className="relative z-10 flex flex-col">
        <div className="w-fit">
          <h1 className="font-display text-[clamp(3.5rem,13vw,8.5rem)] leading-[0.85] font-extrabold uppercase tracking-tight">
            <Letterline
              letters={LINE_ONE}
              prefersReducedMotion={Boolean(prefersReducedMotion)}
              hoverEnabled={trackingEnabled}
              hoveredChar={hoveredChar}
              onHover={setHoveredChar}
            />
            <Letterline
              letters={LINE_TWO}
              prefersReducedMotion={Boolean(prefersReducedMotion)}
              hoverEnabled={trackingEnabled}
              hoveredChar={hoveredChar}
              onHover={setHoveredChar}
            />
          </h1>
        </div>

        <div className="animate-hero-in mt-7 flex items-center gap-3" style={{ animationDelay: '620ms' }}>
          <span aria-hidden="true" className="h-1.5 w-1.5 bg-accent" />
          <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-paper-dim uppercase">
            Computer Science — University of Washington
          </span>
        </div>

        <p
          className="animate-hero-in mt-6 max-w-xl text-lg leading-relaxed text-paper-dim"
          style={{ animationDelay: '720ms' }}
        >
          CS student at the University of Washington. I ship across the
          stack: AI research tooling, iOS apps, and full-stack products.
        </p>

        <div className="animate-hero-in mt-9 flex flex-wrap gap-4" style={{ animationDelay: '820ms' }}>
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-[3px] bg-paper px-6 py-3 font-mono text-xs font-medium tracking-[0.08em] text-ink-950 uppercase transition-colors duration-200 hover:bg-accent"
          >
            View projects
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </a>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-[3px] border border-ink-700 px-6 py-3 font-mono text-xs font-medium tracking-[0.08em] text-paper uppercase transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            Get in touch
          </a>
        </div>
      </div>
    </section>
  )
}
