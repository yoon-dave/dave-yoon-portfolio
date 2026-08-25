import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'motion/react'
import DimensionLine from './DimensionLine'

const CROP_MARK = 'absolute h-4 w-4 border-ink-600/70'

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

  // Crop marks stay put while the hero is comfortably in view, then open
  // outward and fade only during the final stretch of scrolling past it —
  // the frame releasing the sheet, not a constant drift.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const rawExit = useTransform(scrollYProgress, [0, 0.65, 1], [0, 0, 1])
  const exit = useSpring(rawExit, { stiffness: 300, damping: 40, restDelta: 0.001 })
  const exitDistance = useTransform(exit, [0, 1], [0, prefersReducedMotion ? 0 : 14])
  const exitDistanceNeg = useTransform(exitDistance, (v) => -v)
  const exitOpacity = useTransform(exit, [0, 1], [1, prefersReducedMotion ? 1 : 0])

  // The name plate reads cursor position as a physical instrument would —
  // a couple of degrees of tilt, nothing more. Reuses the same cursor state
  // already tracked for the coordinate readout, and only ever moves in
  // response to the visitor's own mouse, never on its own.
  const tiltX = cursor ? (cursor.y / (sectionRef.current?.offsetHeight || 800) - 0.5) * -3 : 0
  const tiltY = cursor ? (cursor.x / (sectionRef.current?.offsetWidth || 1200) - 0.5) * 3 : 0

  return (
    <section
      ref={sectionRef}
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setCursor(null)}
      className="relative mx-auto flex min-h-[92svh] w-full max-w-6xl flex-col justify-center overflow-hidden px-6 py-28 sm:px-8 lg:px-12"
    >
      <motion.span
        className={`${CROP_MARK} top-6 left-6 border-t border-l sm:top-8 sm:left-8`}
        style={{ x: exitDistanceNeg, y: exitDistanceNeg, opacity: exitOpacity }}
        aria-hidden="true"
      />
      <motion.span
        className={`${CROP_MARK} top-6 right-6 border-t border-r sm:top-8 sm:right-8`}
        style={{ x: exitDistance, y: exitDistanceNeg, opacity: exitOpacity }}
        aria-hidden="true"
      />
      <motion.span
        className={`${CROP_MARK} bottom-6 left-6 border-b border-l sm:bottom-8 sm:left-8`}
        style={{ x: exitDistanceNeg, y: exitDistance, opacity: exitOpacity }}
        aria-hidden="true"
      />
      <motion.span
        className={`${CROP_MARK} bottom-6 right-6 border-b border-r sm:bottom-8 sm:right-8`}
        style={{ x: exitDistance, y: exitDistance, opacity: exitOpacity }}
        aria-hidden="true"
      />

      {trackingEnabled && cursor && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute z-10 font-mono text-[0.625rem] tracking-wider text-accent/70 tabular-nums"
          style={{ left: cursor.x + 16, top: cursor.y + 12 }}
        >
          X {String(Math.max(0, Math.round(cursor.x))).padStart(4, '0')} Y{' '}
          {String(Math.max(0, Math.round(cursor.y))).padStart(4, '0')}
        </span>
      )}

      <div
        className="animate-hero-in flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 font-mono text-[0.6875rem] tracking-[0.16em] text-paper-dim uppercase"
        style={{ animationDelay: '0ms' }}
      >
        <span>University of Washington — Seattle, WA</span>
        <span className="tabular">Rev. 2026.08</span>
      </div>

      <motion.div
        className="mt-6"
        animate={{ rotateX: tiltX, rotateY: tiltY }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        style={{ transformPerspective: 900 }}
      >
        <h1 className="font-display text-[clamp(3.5rem,13vw,8.5rem)] leading-[0.85] font-extrabold uppercase tracking-tight text-paper">
          <motion.span
            className="block"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            transition={{ type: 'spring', stiffness: 55, damping: 16, delay: 0.15 }}
          >
            Dave
          </motion.span>
          <motion.span
            className="block"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            transition={{ type: 'spring', stiffness: 55, damping: 16, delay: 0.32 }}
          >
            Yoon
          </motion.span>
        </h1>
        <motion.div
          className="mt-5 max-w-xs origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26, delay: 0.75 }}
        >
          <DimensionLine />
        </motion.div>
      </motion.div>

      <p
        className="animate-hero-in mt-8 max-w-xl text-lg leading-relaxed text-paper-dim"
        style={{ animationDelay: '220ms' }}
      >
        CS student at the University of Washington. I ship across the
        stack: AI research tooling, iOS apps, and full-stack products.
      </p>

      <div className="animate-hero-in mt-9 flex flex-wrap gap-4" style={{ animationDelay: '340ms' }}>
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
