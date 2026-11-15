import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { motion } from 'motion/react'

// A toy version of the lost-in-space pipeline LOST runs: centroid every
// star in the camera frame, match the bright ones against a catalog, and
// solve for where the camera points. The sky patch is real (Orion and its
// neighbors, J2000 RA/Dec and visual magnitude); the faint background
// stars are seeded noise that gets centroided but never matched.
const CATALOG = [
  { name: 'Betelgeuse', ra: 88.79, dec: 7.41, mag: 0.5 },
  { name: 'Rigel', ra: 78.63, dec: -8.2, mag: 0.13 },
  { name: 'Bellatrix', ra: 81.28, dec: 6.35, mag: 1.64 },
  { name: 'Alnilam', ra: 84.05, dec: -1.2, mag: 1.69 },
  { name: 'Alnitak', ra: 85.19, dec: -1.94, mag: 1.77 },
  { name: 'Mintaka', ra: 83.0, dec: -0.3, mag: 2.23 },
  { name: 'Saiph', ra: 86.94, dec: -9.67, mag: 2.07 },
  { name: 'Meissa', ra: 83.78, dec: 9.93, mag: 3.39 },
  { name: 'Tabit', ra: 72.46, dec: 6.96, mag: 3.19 },
  { name: 'Cursa', ra: 76.96, dec: -5.09, mag: 2.79 },
  { name: 'Aldebaran', ra: 68.98, dec: 16.51, mag: 0.86 },
  { name: 'Ain', ra: 67.15, dec: 19.18, mag: 3.53 },
  { name: 'Arneb', ra: 83.18, dec: -17.82, mag: 2.58 },
  { name: 'Nihal', ra: 82.06, dec: -20.76, mag: 2.84 },
  { name: 'Sirius', ra: 101.29, dec: -16.72, mag: -1.46 },
  { name: 'Mirzam', ra: 95.67, dec: -17.96, mag: 1.98 },
  { name: 'Procyon', ra: 114.83, dec: 5.22, mag: 0.34 },
  { name: 'Gomeisa', ra: 111.79, dec: 8.29, mag: 2.89 },
  { name: 'Alhena', ra: 99.43, dec: 16.4, mag: 1.93 },
]

// Sky window, mapped so a degree is roughly the same size on both axes.
const W = 640
const H = 480
const RA_MAX = 124
const RA_SPAN = 62
const DEC_MAX = 22
const DEC_SPAN = 46
const FOV = 160 // px, about 15.5 degrees
const MATCH_LIMIT = 4 // brightest catalog stars used for the match
const MIN_MATCHES = 3 // fewer than this and there's no attitude to report

const toX = (ra: number) => ((RA_MAX - ra) / RA_SPAN) * W
const toY = (dec: number) => ((DEC_MAX - dec) / DEC_SPAN) * H
const toRa = (x: number) => RA_MAX - (x / W) * RA_SPAN
const toDec = (y: number) => DEC_MAX - (y / H) * DEC_SPAN
const radius = (mag: number) => Math.max(0.9, 4.2 - 0.85 * mag)

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const STARS = (() => {
  const rand = mulberry32(155)
  const named = CATALOG.map((s) => ({ ...s, x: toX(s.ra), y: toY(s.dec) }))
  const faint = Array.from({ length: 170 }, () => ({
    name: '',
    ra: 0,
    dec: 0,
    mag: 3.8 + rand() * 2.4,
    x: rand() * W,
    y: rand() * H,
  }))
  return [...faint, ...named]
})()

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

function formatRa(ra: number) {
  // Round to whole minutes first so 5h 59.7m reads 06h 00m, not 05h 60m.
  const minutes = Math.round((ra / 15) * 60)
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`
}

function formatDec(dec: number) {
  const sign = dec < 0 ? '−' : '+'
  return `${sign}${Math.abs(dec).toFixed(1).padStart(4, '0')}°`
}

export default function StarTrackerFigure() {
  const svgRef = useRef<SVGSVGElement>(null)
  // Start the frame on Orion's belt so the first view is a clean solve.
  const [center, setCenter] = useState({ x: toX(84.05), y: toY(-1.2) })

  const half = FOV / 2
  const { centroids, matched } = useMemo(() => {
    const inFrame = STARS.filter((s) => Math.abs(s.x - center.x) <= half && Math.abs(s.y - center.y) <= half)
    const catalogHits = inFrame
      .filter((s) => s.name)
      .sort((a, b) => a.mag - b.mag)
      .slice(0, MATCH_LIMIT)
    return { centroids: inFrame, matched: catalogHits }
  }, [center, half])

  const solved = matched.length >= MIN_MATCHES
  const matchKey = matched.map((s) => s.name).join('|')
  const edges = matched.flatMap((a, i) => matched.slice(i + 1).map((b) => [a, b] as const))
  // Close pairs like Alnilam and Alnitak would print on top of each other,
  // so walk the labels top to bottom and nudge any that collide.
  const labelY = new Map<string, number>()
  let lastY = -Infinity
  for (const s of [...matched].sort((a, b) => a.y - b.y)) {
    const y = Math.max(s.y + 3, lastY + 12)
    labelY.set(s.name, y)
    lastY = y
  }

  function moveTo(clientX: number, clientY: number) {
    const svg = svgRef.current
    const ctm = svg?.getScreenCTM()
    if (!svg || !ctm) return
    const p = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse())
    setCenter({ x: clamp(p.x, half, W - half), y: clamp(p.y, half, H - half) })
  }

  function onPointerMove(e: PointerEvent<SVGSVGElement>) {
    // Mice steer on hover; touch only moves the frame on tap or drag so
    // the page still scrolls normally past the figure.
    if (e.pointerType === 'mouse' || e.buttons > 0) moveTo(e.clientX, e.clientY)
  }

  function onKeyDown(e: KeyboardEvent<SVGSVGElement>) {
    const step = 16
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    }
    const d = delta[e.key]
    if (!d) return
    e.preventDefault()
    setCenter((c) => ({ x: clamp(c.x + d[0], half, W - half), y: clamp(c.y + d[1], half, H - half) }))
  }

  return (
    <div className="w-full border border-ink-700 bg-ink-900 shadow-[6px_6px_0_0_var(--color-ink-800)]">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink-800 px-5 py-3">
        <span className="font-mono text-[0.625rem] tracking-[0.14em] text-paper-dim uppercase">
          Interactive · Lost-in-space solve
        </span>
        <span className="font-mono text-[0.5625rem] tracking-[0.12em] text-paper-dim/60 uppercase">
          Move the frame across the sky
        </span>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full cursor-crosshair bg-ink-950 select-none"
        role="img"
        aria-label="Star field of Orion and nearby stars. A camera frame can be moved with the mouse, by tapping, or with the arrow keys; stars inside it are matched against a catalog to solve for pointing direction."
        tabIndex={0}
        onPointerMove={onPointerMove}
        onPointerDown={(e) => moveTo(e.clientX, e.clientY)}
        onKeyDown={onKeyDown}
      >
        {/* RA/Dec grid every 10 degrees */}
        <g stroke="var(--color-ink-800)" strokeWidth={1}>
          {[70, 80, 90, 100, 110, 120].map((ra) => (
            <line key={ra} x1={toX(ra)} x2={toX(ra)} y1={0} y2={H} />
          ))}
          {[20, 10, 0, -10, -20].map((dec) => (
            <line key={dec} x1={0} x2={W} y1={toY(dec)} y2={toY(dec)} />
          ))}
        </g>

        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={radius(s.mag)}
            fill="var(--color-paper)"
            opacity={s.name ? 0.95 : 0.25 + (6.2 - s.mag) * 0.12}
          />
        ))}

        {/* Camera frame. It tracks the pointer directly so it always lines
            up with the centroid rings computed for the same position. */}
        <g transform={`translate(${center.x - half} ${center.y - half})`}>
          <rect width={FOV} height={FOV} fill="var(--color-accent)" fillOpacity={0.05} stroke="var(--color-accent)" strokeWidth={1.25} />
          {/* corner ticks, like a viewfinder */}
          <g stroke="var(--color-accent)" strokeWidth={2.5}>
            <path d={`M0 14 V0 H14 M${FOV - 14} 0 H${FOV} V14 M${FOV} ${FOV - 14} V${FOV} H${FOV - 14} M14 ${FOV} H0 V${FOV - 14}`} fill="none" />
          </g>
          <g stroke="var(--color-accent)" strokeOpacity={0.5} strokeWidth={1}>
            <line x1={half - 6} x2={half + 6} y1={half} y2={half} />
            <line x1={half} x2={half} y1={half - 6} y2={half + 6} />
          </g>
        </g>

        {/* Step 1: a centroid ring on every star in frame */}
        {centroids.map((s, i) => (
          <circle
            key={`c-${i}-${s.x.toFixed(1)}`}
            cx={s.x}
            cy={s.y}
            r={radius(s.mag) + 3.5}
            fill="none"
            stroke="var(--color-paper-dim)"
            strokeOpacity={0.55}
            strokeWidth={0.75}
          />
        ))}

        {/* Step 2: the matched pattern, redrawn whenever the match changes */}
        <g key={matchKey}>
          {edges.map(([a, b]) => (
            <motion.line
              key={`${a.name}-${b.name}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--color-accent)"
              strokeWidth={1}
              strokeOpacity={solved ? 0.85 : 0.35}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
          {matched.map((s) => (
            <g key={s.name}>
              <circle cx={s.x} cy={s.y} r={radius(s.mag) + 5} fill="none" stroke="var(--color-accent)" strokeWidth={1.25} />
              <text
                x={s.x + radius(s.mag) + 8}
                y={labelY.get(s.name)}
                className="font-mono"
                fontSize={10}
                letterSpacing="0.08em"
                fill="var(--color-accent)"
              >
                {s.name.toUpperCase()}
              </text>
            </g>
          ))}
        </g>
      </svg>

      <div aria-live="polite" className="grid grid-cols-1 border-t border-ink-800 sm:grid-cols-3">
        <Stage index="01" label="Centroid" value={`${centroids.length} stars`} />
        <Stage index="02" label="Identify" value={`${matched.length} matched`} active={matched.length > 0} />
        <Stage
          index="03"
          label="Attitude"
          value={solved ? `${formatRa(toRa(center.x))} · ${formatDec(toDec(center.y))}` : 'No attitude'}
          active={solved}
          note={solved ? undefined : `Needs ${MIN_MATCHES}+ catalog stars`}
        />
      </div>
    </div>
  )
}

function Stage({
  index,
  label,
  value,
  active = true,
  note,
}: {
  index: string
  label: string
  value: string
  active?: boolean
  note?: string
}) {
  return (
    <div className="border-ink-800 px-5 py-3 sm:py-4 not-last:border-b sm:not-last:border-r sm:not-last:border-b-0">
      <span className="font-mono text-[0.5625rem] tracking-[0.12em] text-paper-dim/60 uppercase">
        {index} · {label}
      </span>
      <p className={`mt-1 font-mono text-sm tabular ${active ? 'text-accent' : 'text-paper-dim'}`}>{value}</p>
      {note && <p className="mt-0.5 font-mono text-[0.5625rem] text-paper-dim/60 uppercase">{note}</p>}
    </div>
  )
}
