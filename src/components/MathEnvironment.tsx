import { useEffect, useRef } from 'react'
import { useMotionValue, useSpring, useTransform, motion } from 'motion/react'

// A small, real mathematical workspace, not a single decorative graph.
// Three elements share one coordinate plane, all drawn from the same
// research described in Experience:
//   — the primary curve: URL-based detection accuracy, 81% -> 91%,
//     the actual "suspicious-first" 8-shot result on GPT-4o.
//   — a second, visually distinct curve: the "10-point gain" on
//     Gemini 1.5 Pro from the same framework — a different model, a
//     comparable magnitude of improvement, genuinely a separate real
//     result, not a duplicate.
//   — a small converging step path: the 8-shot framework was iterated
//     "across five rounds" — five discrete points settling toward a
//     target, the real shape of iterative refinement.
// A shared cursor position scrubs both curves at once, the way a real
// graphing tool reads multiple functions at one x — not independent
// per-element gimmicks.
const VIEW_W = 1200
const VIEW_H = 760

// Primary curve — GPT-4o accuracy, 81% -> 91%.
const CURVE_LEFT = 40
const CURVE_RIGHT = 1160
const CURVE_TOP = 70
const CURVE_BOTTOM = 400
const STEEPNESS = 6.2
const MIDPOINT = 0.52
const TANGENT_LENGTH = 100

// Secondary curve — Gemini 1.5 Pro, +10-point gain. Same domain, a
// visibly different shape and a lower ceiling, drawn lighter and
// dashed so it reads as a comparison series, not a repeated line.
const CURVE2_TOP = 190
const CURVE2_BOTTOM = 470
const STEEPNESS_2 = 4.2
const MIDPOINT_2 = 0.62

function sigmoid(x: number, steep: number, mid: number) {
  return 1 / (1 + Math.exp(-steep * (x - mid)))
}

function sigmoidDerivative(x: number, steep: number, mid: number) {
  const s = sigmoid(x, steep, mid)
  return steep * s * (1 - s)
}

function curvePoint(xNorm: number, top: number, bottom: number, steep: number, mid: number) {
  const x = CURVE_LEFT + xNorm * (CURVE_RIGHT - CURVE_LEFT)
  const y = bottom - sigmoid(xNorm, steep, mid) * (bottom - top)
  return { x, y }
}

function curveSlope(xNorm: number, top: number, bottom: number, steep: number, mid: number) {
  return (-sigmoidDerivative(xNorm, steep, mid) * (bottom - top)) / (CURVE_RIGHT - CURVE_LEFT)
}

function tangentEndpoints(xNorm: number) {
  const { x, y } = curvePoint(xNorm, CURVE_TOP, CURVE_BOTTOM, STEEPNESS, MIDPOINT)
  const slope = curveSlope(xNorm, CURVE_TOP, CURVE_BOTTOM, STEEPNESS, MIDPOINT)
  const norm = Math.sqrt(1 + slope * slope)
  const dx = TANGENT_LENGTH / norm / 2
  const dy = (TANGENT_LENGTH * slope) / norm / 2
  return { x1: x - dx, y1: y - dy, x2: x + dx, y2: y + dy }
}

function buildPath(top: number, bottom: number, steep: number, mid: number, samples: number) {
  return Array.from({ length: samples + 1 }, (_, i) => {
    const { x, y } = curvePoint(i / samples, top, bottom, steep, mid)
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
}

const CURVE_PATH = buildPath(CURVE_TOP, CURVE_BOTTOM, STEEPNESS, MIDPOINT, 64)
const CURVE2_PATH = buildPath(CURVE2_TOP, CURVE2_BOTTOM, STEEPNESS_2, MIDPOINT_2, 64)

// A sparse reference grid, deliberately weighted toward the right two-
// thirds of the canvas — where the curves actually live — rather than
// evenly tiled edge to edge, so the plane reads as composed space
// rather than wallpaper. The wordmark occupies the left; the grid
// gives it room rather than running under it uniformly.
const GRID_X = [0.25, 0.42, 0.58, 0.75, 0.92].map((t) => t * VIEW_W)
const GRID_Y = [0.15, 0.38, 0.62, 0.85].map((t) => t * VIEW_H)

// One emphasized axis pair, not decorative: x = 0 of the curve's own
// domain (where the accuracy series begins), y = the real 81% baseline
// it climbs from. Bolder than the reference grid, these read as the
// plane's true origin — and because that origin sits at the curve's
// own left edge, the wordmark ends up anchored at it, plotted at the
// workspace's origin rather than laid over an unrelated backdrop.
const AXIS_X = CURVE_LEFT
const AXIS_Y = CURVE_BOTTOM

// Five discrete rounds, oscillating and converging toward a target —
// the real shape of the paper's iterative 8-shot refinement.
const STEP_LEFT = 860
const STEP_RIGHT = 1140
const STEP_TARGET_Y = 430
const STEP_POINTS = [0, 1, 2, 3, 4].map((i) => {
  const t = i / 4
  const amplitude = 130 * Math.pow(1 - t, 1.8)
  const direction = i % 2 === 0 ? 1 : -1
  return {
    x: STEP_LEFT + t * (STEP_RIGHT - STEP_LEFT),
    y: STEP_TARGET_Y - direction * amplitude,
  }
})
const STEP_PATH = STEP_POINTS.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

// Real accuracy at a point on the primary curve — the same sigmoid value
// that positions the dot vertically, rescaled to the paper's actual
// 81% -> 91% range rather than a second, independent number.
function accuracyAt(xNorm: number) {
  return 81 + sigmoid(xNorm, STEEPNESS, MIDPOINT) * 10
}

function StaticMarker({ xNorm }: { xNorm: number }) {
  const { x, y } = curvePoint(xNorm, CURVE_TOP, CURVE_BOTTOM, STEEPNESS, MIDPOINT)
  const { y: y2 } = curvePoint(xNorm, CURVE2_TOP, CURVE2_BOTTOM, STEEPNESS_2, MIDPOINT_2)
  const t = tangentEndpoints(xNorm)
  return (
    <>
      <line x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="var(--color-accent)" strokeWidth={1.25} opacity={0.45} />
      <circle cx={x} cy={y} r={5} fill="var(--color-accent)" opacity={0.9} />
      <circle cx={x} cy={y2} r={3} fill="var(--color-paper-dim)" opacity={0.55} />
    </>
  )
}

// A Desmos-style coordinate readout for the scan point, rendered as HTML
// (not SVG text) so it never inherits the curve's non-uniform stretch
// from preserveAspectRatio="none" — plain text stays crisp at any aspect
// ratio. Position and values are both driven by the same xNorm, so the
// label always matches exactly where the dot sits.
function StaticAnnotation({ xNorm }: { xNorm: number }) {
  const { x, y } = curvePoint(xNorm, CURVE_TOP, CURVE_BOTTOM, STEEPNESS, MIDPOINT)
  return (
    <div
      className="absolute font-mono text-[0.625rem] whitespace-nowrap text-paper-dim tabular"
      style={{ left: `${(x / VIEW_W) * 100}%`, top: `${(y / VIEW_H) * 100}%`, transform: 'translate(10px, -16px)' }}
    >
      ({xNorm.toFixed(2)}, <span className="text-accent">{accuracyAt(xNorm).toFixed(0)}%</span>)
    </div>
  )
}

function TrackedAnnotation({ smoothX }: { smoothX: ReturnType<typeof useSpring> }) {
  const left = useTransform(smoothX, (t) => `${(curvePoint(t, CURVE_TOP, CURVE_BOTTOM, STEEPNESS, MIDPOINT).x / VIEW_W) * 100}%`)
  const top = useTransform(smoothX, (t) => `${(curvePoint(t, CURVE_TOP, CURVE_BOTTOM, STEEPNESS, MIDPOINT).y / VIEW_H) * 100}%`)
  const xLabel = useTransform(smoothX, (t) => t.toFixed(2))
  const accLabel = useTransform(smoothX, (t) => `${accuracyAt(t).toFixed(0)}%`)

  return (
    <motion.div
      className="absolute font-mono text-[0.625rem] whitespace-nowrap text-paper-dim tabular"
      style={{ left, top, x: 10, y: -16 }}
    >
      (<motion.span>{xLabel}</motion.span>, <motion.span className="text-accent">{accLabel}</motion.span>)
    </motion.div>
  )
}

function TrackedMarkers({ smoothX }: { smoothX: ReturnType<typeof useSpring> }) {
  const cx = useTransform(smoothX, (t) => curvePoint(t, CURVE_TOP, CURVE_BOTTOM, STEEPNESS, MIDPOINT).x)
  const cy = useTransform(smoothX, (t) => curvePoint(t, CURVE_TOP, CURVE_BOTTOM, STEEPNESS, MIDPOINT).y)
  const cy2 = useTransform(smoothX, (t) => curvePoint(t, CURVE2_TOP, CURVE2_BOTTOM, STEEPNESS_2, MIDPOINT_2).y)
  const x1 = useTransform(smoothX, (t) => tangentEndpoints(t).x1)
  const y1 = useTransform(smoothX, (t) => tangentEndpoints(t).y1)
  const x2 = useTransform(smoothX, (t) => tangentEndpoints(t).x2)
  const y2 = useTransform(smoothX, (t) => tangentEndpoints(t).y2)

  return (
    <>
      <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-accent)" strokeWidth={1.25} opacity={0.45} />
      <motion.circle cx={cx} cy={cy} r={5} fill="var(--color-accent)" opacity={0.9} />
      <motion.circle cx={cx} cy={cy2} r={3} fill="var(--color-paper-dim)" opacity={0.55} />
    </>
  )
}

export default function MathEnvironment({
  active,
  prefersReducedMotion,
}: {
  active: boolean
  prefersReducedMotion: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const xNorm = useMotionValue(0.5)
  const smoothX = useSpring(xNorm, { stiffness: 60, damping: 14, mass: 1.1, restDelta: 0.001 })

  useEffect(() => {
    const el = containerRef.current
    if (!el || !active) return
    const handleMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const t = (event.clientX - rect.left) / rect.width
      xNorm.set(Math.min(1, Math.max(0, t)))
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [active, xNorm])

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
      <svg className="h-full w-full" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="none">
        {GRID_X.map((x, i) => (
          <line key={`gx-${i}`} x1={x} y1={0} x2={x} y2={VIEW_H} stroke="var(--color-ink-700)" strokeWidth={1} opacity={0.09} />
        ))}
        {GRID_Y.map((y, i) => (
          <line key={`gy-${i}`} x1={0} y1={y} x2={VIEW_W} y2={y} stroke="var(--color-ink-700)" strokeWidth={1} opacity={0.09} />
        ))}
        <line x1={AXIS_X} y1={0} x2={AXIS_X} y2={VIEW_H} stroke="var(--color-paper-dim)" strokeWidth={1} opacity={0.2} />
        <line x1={0} y1={AXIS_Y} x2={VIEW_W} y2={AXIS_Y} stroke="var(--color-paper-dim)" strokeWidth={1} opacity={0.2} />

        <path d={STEP_PATH} fill="none" stroke="var(--color-ink-600)" strokeWidth={1} opacity={0.32} />
        {STEP_POINTS.map((p, i) => (
          <circle
            key={`step-${i}`}
            cx={p.x}
            cy={p.y}
            r={i === STEP_POINTS.length - 1 ? 3.5 : 2}
            fill={i === STEP_POINTS.length - 1 ? 'var(--color-accent)' : 'var(--color-ink-600)'}
            opacity={i === STEP_POINTS.length - 1 ? 0.65 : 0.45}
          />
        ))}

        <path d={CURVE2_PATH} fill="none" stroke="var(--color-paper-dim)" strokeWidth={1} strokeDasharray="4 7" opacity={0.16} />
        <path d={CURVE_PATH} fill="none" stroke="var(--color-accent)" strokeWidth={2} opacity={0.4} />

        {!prefersReducedMotion && active ? <TrackedMarkers smoothX={smoothX} /> : <StaticMarker xNorm={0.5} />}
      </svg>
      {!prefersReducedMotion && active ? (
        <TrackedAnnotation smoothX={smoothX} />
      ) : (
        <StaticAnnotation xNorm={0.5} />
      )}
    </div>
  )
}
