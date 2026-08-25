import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'

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

function Letterline({
  letters,
  prefersReducedMotion,
}: {
  letters: typeof LINE_ONE
  prefersReducedMotion: boolean
}) {
  return (
    <div className="flex">
      {letters.map((l, i) => (
        <motion.span
          key={`${l.char}-${i}`}
          className="inline-block"
          initial={
            prefersReducedMotion ? undefined : { x: l.x, y: l.y, rotate: l.r, scale: l.scale, opacity: 0 }
          }
          animate={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 110, damping: 14, mass: 1, delay: l.delay }
          }
        >
          {l.char}
        </motion.span>
      ))}
    </div>
  )
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)
  const [trackingEnabled, setTrackingEnabled] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setTrackingEnabled(fine && !reduceMotion)
  }, [])

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (!trackingEnabled || !sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    setCursor({ x: event.clientX - rect.left, y: event.clientY - rect.top })
  }

  // The assembled name reads cursor position as a physical object would —
  // a couple of degrees of tilt, nothing more. Only ever moves in response
  // to the visitor's own mouse, never on its own.
  const tiltX = cursor ? (cursor.y / (sectionRef.current?.offsetHeight || 800) - 0.5) * -3 : 0
  const tiltY = cursor ? (cursor.x / (sectionRef.current?.offsetWidth || 1200) - 0.5) * 3 : 0

  // The specimen plate sits on a shallower plane than the name — half the
  // tilt amplitude — so the two read as genuinely separated in depth
  // rather than moving as one rigid unit.
  const plateTiltX = tiltX * 0.4
  const plateTiltY = tiltY * 0.4

  return (
    <section
      ref={sectionRef}
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setCursor(null)}
      className="relative mx-auto flex min-h-[92svh] w-full max-w-6xl flex-col justify-center overflow-hidden px-6 py-28 sm:px-8 lg:px-12"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 hidden select-none font-display text-[42rem] leading-none font-extrabold text-transparent lg:block"
        style={{ WebkitTextStroke: '1px var(--color-ink-700)' }}
      >
        D
      </span>

      <motion.div
        className="relative w-fit"
        animate={{ rotateX: tiltX, rotateY: tiltY }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        style={{ transformPerspective: 900 }}
      >
        <h1 className="font-display text-[clamp(3.5rem,13vw,8.5rem)] leading-[0.85] font-extrabold uppercase tracking-tight text-paper">
          <Letterline letters={LINE_ONE} prefersReducedMotion={Boolean(prefersReducedMotion)} />
          <Letterline letters={LINE_TWO} prefersReducedMotion={Boolean(prefersReducedMotion)} />
        </h1>
      </motion.div>

      <div className="absolute top-1/2 right-6 hidden w-52 -translate-y-1/2 lg:block xl:right-12">
        <motion.div
          className="border border-ink-800 bg-ink-950/60 p-4 backdrop-blur-[2px]"
          style={{ transformPerspective: 900 }}
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0, rotateX: plateTiltX, rotateY: plateTiltY }}
          transition={
            prefersReducedMotion
              ? { rotateX: { type: 'spring', stiffness: 150, damping: 20 }, default: { duration: 0 } }
              : {
                  opacity: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.56 },
                  y: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.56 },
                  rotateX: { type: 'spring', stiffness: 150, damping: 20 },
                  rotateY: { type: 'spring', stiffness: 150, damping: 20 },
                }
          }
        >
          <span className="font-mono text-[0.625rem] tracking-[0.14em] text-paper-dim/70 uppercase">No. 01</span>
          <div className="mt-2 flex items-start gap-2">
            <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 shrink-0 bg-accent" />
            <p className="font-mono text-[0.6875rem] leading-relaxed tracking-wide text-paper-dim uppercase">
              Computer Science — University of Washington
            </p>
          </div>
        </motion.div>
      </div>

      <div className="animate-hero-in mt-7 flex items-center gap-3 lg:hidden" style={{ animationDelay: '620ms' }}>
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
    </section>
  )
}
