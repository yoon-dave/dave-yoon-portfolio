import { useEffect, useRef } from 'react'

// Engineering-paper dots behind the whole page, anchored to the document so
// they scroll with the content and stay centered on the layout. A second,
// darker layer is masked to a soft circle around the cursor.
const GRID = 24

const dots = (alpha: number) => `radial-gradient(circle, rgba(35, 32, 28, ${alpha}) 1px, transparent 1.4px)`

export default function DotGrid() {
  const spotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const spot = spotRef.current
    if (!spot) return
    let raf = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        spot.style.setProperty('--x', `${e.pageX}px`)
        spot.style.setProperty('--y', `${e.pageY}px`)
      })
    }
    window.addEventListener('pointermove', onMove)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: dots(0.09),
          backgroundSize: `${GRID}px ${GRID}px`,
          backgroundPosition: '50% 0',
          // Fade out toward the left and right edges of the window.
          maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        }}
      />
      <div
        ref={spotRef}
        className="absolute inset-0"
        style={{
          backgroundImage: dots(0.28),
          backgroundSize: `${GRID}px ${GRID}px`,
          backgroundPosition: '50% 0',
          maskImage: 'radial-gradient(180px circle at var(--x, -999px) var(--y, -999px), black, transparent)',
        }}
      />
    </div>
  )
}
