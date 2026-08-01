import { useEffect, useRef } from 'react'

type StarColor = 'indigo' | 'violet' | 'cyan' | 'amber'

interface StarNode {
  x: number
  y: number
  vx: number
  vy: number
  baseVx: number
  baseVy: number
  phase: number
  twinkleSpeed: number
  color: StarColor
}

interface FarStar {
  x: number
  y: number
  radius: number
  phase: number
  twinkleSpeed: number
  color: StarColor
}

interface ShootingStar {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: StarColor
}

interface Asteroid {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  rotation: number
  spin: number
}

interface Rocket {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: StarColor
}

const NODE_COUNT = 46
const FAR_STAR_COUNT = 110
const ASTEROID_COUNT = 5
const LINK_DISTANCE = 140
const GRAVITY_RADIUS = 200
const GRAVITY_STRENGTH = 0.035
const PILOT_THRUST = 500
const PILOT_DRAG = 2.4
const PILOT_MAX_SPEED = 130
const PILOT_ORBIT_RADIUS = 55
const PILOT_ORBIT_ENTER = 70
const PILOT_ORBIT_EXIT = 110
const PILOT_ORBIT_ANGULAR_SPEED = 1.6

const PALETTE: Record<StarColor, { dark: string; light: string }> = {
  indigo: { dark: '129, 140, 248', light: '99, 102, 241' },
  violet: { dark: '167, 139, 250', light: '139, 92, 246' },
  cyan: { dark: '103, 232, 249', light: '34, 211, 238' },
  amber: { dark: '252, 211, 77', light: '245, 158, 11' },
}

function pickColor(): StarColor {
  const roll = Math.random()
  if (roll < 0.4) return 'indigo'
  if (roll < 0.65) return 'violet'
  if (roll < 0.85) return 'cyan'
  return 'amber'
}

function drawAsteroidPath(ctx: CanvasRenderingContext2D, radius: number) {
  const points = 7
  ctx.beginPath()
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2
    const jitter = 0.7 + ((i * 37) % 5) / 10
    const px = Math.cos(angle) * radius * jitter
    const py = Math.sin(angle) * radius * jitter
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
}

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
    let isDark = darkQuery.matches

    let width = window.innerWidth
    let height = window.innerHeight

    const nebulaCanvas = document.createElement('canvas')
    const nebulaCtx = nebulaCanvas.getContext('2d')

    const drawRingedPlanet = () => {
      if (!nebulaCtx) return
      const cx = width * 0.88
      const cy = height * 0.1
      const radius = Math.min(width, height) * 0.1
      const bodyRgb = isDark ? '167, 139, 250' : '139, 92, 246'
      const tilt = -0.35
      const ringRx = radius * 1.7
      const ringScaleY = 0.32

      // back half of the ring, occluded by the planet body drawn after it
      nebulaCtx.save()
      nebulaCtx.translate(cx, cy)
      nebulaCtx.rotate(tilt)
      nebulaCtx.scale(1, ringScaleY)
      nebulaCtx.strokeStyle = `rgba(${bodyRgb}, ${isDark ? 0.28 : 0.12})`
      nebulaCtx.lineWidth = 9
      nebulaCtx.beginPath()
      nebulaCtx.arc(0, 0, ringRx, Math.PI, Math.PI * 2)
      nebulaCtx.stroke()
      nebulaCtx.restore()

      // Punch out the disk footprint so the back ring can't bleed through
      // the planet body, regardless of how translucent the body fill is.
      nebulaCtx.save()
      nebulaCtx.globalCompositeOperation = 'destination-out'
      nebulaCtx.beginPath()
      nebulaCtx.arc(cx, cy, radius, 0, Math.PI * 2)
      nebulaCtx.fillStyle = 'rgba(0, 0, 0, 1)'
      nebulaCtx.fill()
      nebulaCtx.restore()

      const bodyGradient = nebulaCtx.createRadialGradient(
        cx - radius * 0.35,
        cy - radius * 0.35,
        radius * 0.1,
        cx,
        cy,
        radius,
      )
      bodyGradient.addColorStop(0, `rgba(${bodyRgb}, ${isDark ? 0.85 : 0.4})`)
      bodyGradient.addColorStop(1, `rgba(${bodyRgb}, ${isDark ? 0.4 : 0.16})`)
      nebulaCtx.fillStyle = bodyGradient
      nebulaCtx.beginPath()
      nebulaCtx.arc(cx, cy, radius, 0, Math.PI * 2)
      nebulaCtx.fill()

      const moonX = cx + radius * 1.15
      const moonY = cy + radius * 1.5
      const moonR = radius * 0.18
      const moonGradient = nebulaCtx.createRadialGradient(
        moonX - moonR * 0.3,
        moonY - moonR * 0.3,
        moonR * 0.1,
        moonX,
        moonY,
        moonR,
      )
      moonGradient.addColorStop(0, `rgba(226, 232, 240, ${isDark ? 0.32 : 0.16})`)
      moonGradient.addColorStop(1, `rgba(226, 232, 240, ${isDark ? 0.05 : 0.02})`)
      nebulaCtx.fillStyle = moonGradient
      nebulaCtx.beginPath()
      nebulaCtx.arc(moonX, moonY, moonR, 0, Math.PI * 2)
      nebulaCtx.fill()

      // front half of the ring, drawn on top of the planet body
      nebulaCtx.save()
      nebulaCtx.translate(cx, cy)
      nebulaCtx.rotate(tilt)
      nebulaCtx.scale(1, ringScaleY)
      nebulaCtx.strokeStyle = `rgba(${bodyRgb}, ${isDark ? 0.42 : 0.18})`
      nebulaCtx.lineWidth = 9
      nebulaCtx.beginPath()
      nebulaCtx.arc(0, 0, ringRx, 0, Math.PI)
      nebulaCtx.stroke()
      nebulaCtx.restore()
    }

    const drawSecondaryPlanet = () => {
      if (!nebulaCtx) return
      const cx = width * 0.07
      const cy = height * 0.85
      const radius = Math.min(width, height) * 0.055
      const rgb = isDark ? '103, 232, 249' : '34, 211, 238'
      const gradient = nebulaCtx.createRadialGradient(
        cx - radius * 0.3,
        cy - radius * 0.3,
        radius * 0.1,
        cx,
        cy,
        radius,
      )
      gradient.addColorStop(0, `rgba(${rgb}, ${isDark ? 0.42 : 0.18})`)
      gradient.addColorStop(1, `rgba(${rgb}, ${isDark ? 0.08 : 0.03})`)
      nebulaCtx.fillStyle = gradient
      nebulaCtx.beginPath()
      nebulaCtx.arc(cx, cy, radius, 0, Math.PI * 2)
      nebulaCtx.fill()
    }

    const drawNebula = () => {
      if (!nebulaCtx) return
      nebulaCanvas.width = width
      nebulaCanvas.height = height
      nebulaCtx.clearRect(0, 0, width, height)

      const bandAlpha = isDark ? 0.55 : 0.2
      const maxDim = Math.max(width, height)
      const spots: Array<{ x: number; y: number; r: number; color: StarColor }> = [
        { x: width * 0.08, y: height * 0.12, r: maxDim * 0.34, color: 'indigo' },
        { x: width * 0.3, y: height * 0.38, r: maxDim * 0.3, color: 'violet' },
        { x: width * 0.62, y: height * 0.22, r: maxDim * 0.32, color: 'cyan' },
        { x: width * 0.85, y: height * 0.5, r: maxDim * 0.28, color: 'indigo' },
        { x: width * 0.45, y: height * 0.72, r: maxDim * 0.3, color: 'violet' },
        { x: width * 0.15, y: height * 0.85, r: maxDim * 0.26, color: 'amber' },
      ]

      nebulaCtx.filter = 'blur(90px)'
      for (const spot of spots) {
        const rgb = PALETTE[spot.color][isDark ? 'dark' : 'light']
        const gradient = nebulaCtx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, spot.r)
        gradient.addColorStop(0, `rgba(${rgb}, ${bandAlpha})`)
        gradient.addColorStop(1, `rgba(${rgb}, 0)`)
        nebulaCtx.fillStyle = gradient
        nebulaCtx.beginPath()
        nebulaCtx.arc(spot.x, spot.y, spot.r, 0, Math.PI * 2)
        nebulaCtx.fill()
      }
      nebulaCtx.filter = 'none'

      drawRingedPlanet()
      drawSecondaryPlanet()

      const vignette = nebulaCtx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        maxDim * 0.75,
      )
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)')
      vignette.addColorStop(1, `rgba(0, 0, 0, ${isDark ? 0.58 : 0.17})`)
      nebulaCtx.fillStyle = vignette
      nebulaCtx.fillRect(0, 0, width, height)
    }

    let farStars: FarStar[] = []
    const spawnFarStars = () => {
      farStars = Array.from({ length: FAR_STAR_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.5 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.3 + Math.random() * 0.8,
        color: pickColor(),
      }))
    }

    let asteroids: Asteroid[] = []
    const spawnAsteroids = () => {
      asteroids = Array.from({ length: ASTEROID_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        radius: 2 + Math.random() * 2.5,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.15,
      }))
    }

    const onThemeChange = (event: MediaQueryListEvent) => {
      isDark = event.matches
      drawNebula()
    }
    darkQuery.addEventListener('change', onThemeChange)

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      drawNebula()
      spawnFarStars()
      spawnAsteroids()
    }
    resize()
    window.addEventListener('resize', resize)

    const nodes: StarNode[] = Array.from({ length: NODE_COUNT }, () => {
      const baseVx = (Math.random() - 0.5) * 0.15
      const baseVy = (Math.random() - 0.5) * 0.15
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: baseVx,
        vy: baseVy,
        baseVx,
        baseVy,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.4 + Math.random() * 1.1,
        color: pickColor(),
      }
    })

    const mouse = { x: -9999, y: -9999 }
    const onMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX
      mouse.y = event.clientY
    }
    const onMouseLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)

    const pilot = { x: width / 2, y: height / 2, vx: 0, vy: 0 }
    const pilotAngle = { current: -Math.PI / 2 }
    const pilotOrbit = { active: false, angle: Math.random() * Math.PI * 2 }

    let shootingStars: ShootingStar[] = []
    let nextShootingStarAt = performance.now() + 3000 + Math.random() * 4000
    let rockets: Rocket[] = []
    let nextRocketAt = performance.now() + 8000 + Math.random() * 6000
    let lastTime = performance.now()
    let frame: number

    const draw = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05)
      lastTime = time

      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(nebulaCanvas, 0, 0, width, height)

      for (const star of farStars) {
        const twinkle = reduceMotion
          ? 0.4
          : 0.5 + 0.5 * Math.sin(time * 0.001 * star.twinkleSpeed + star.phase)
        const rgb = PALETTE[star.color][isDark ? 'dark' : 'light']
        ctx.fillStyle = `rgba(${rgb}, ${0.1 + twinkle * 0.25})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      const rockColor = isDark ? '100, 116, 139' : '71, 85, 105'
      for (const rock of asteroids) {
        if (!reduceMotion) {
          rock.x += rock.vx
          rock.y += rock.vy
          rock.rotation += rock.spin * dt
          if (rock.x < -10) rock.x = width + 10
          if (rock.x > width + 10) rock.x = -10
          if (rock.y < -10) rock.y = height + 10
          if (rock.y > height + 10) rock.y = -10
        }
        ctx.save()
        ctx.translate(rock.x, rock.y)
        ctx.rotate(rock.rotation)
        ctx.fillStyle = `rgba(${rockColor}, 0.3)`
        drawAsteroidPath(ctx, rock.radius)
        ctx.fill()
        ctx.restore()
      }

      const lineColor = isDark ? '148, 163, 184' : '100, 116, 139'

      for (const node of nodes) {
        if (!reduceMotion) {
          const md = Math.hypot(node.x - mouse.x, node.y - mouse.y)
          if (md < GRAVITY_RADIUS && md > 0.01) {
            const pull = (1 - md / GRAVITY_RADIUS) * GRAVITY_STRENGTH
            node.vx += ((mouse.x - node.x) / md) * pull
            node.vy += ((mouse.y - node.y) / md) * pull
          } else {
            node.vx += (node.baseVx - node.vx) * 0.02
            node.vy += (node.baseVy - node.vy) * 0.02
          }
          node.vx *= 0.97
          node.vy *= 0.97
          node.x += node.vx
          node.y += node.vy
          if (node.x < 0 || node.x > width) node.vx *= -1
          if (node.y < 0 || node.y > height) node.vy *= -1
          node.x = Math.max(0, Math.min(width, node.x))
          node.y = Math.max(0, Math.min(height, node.y))
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < LINK_DISTANCE) {
            ctx.strokeStyle = `rgba(${lineColor}, ${(1 - dist / LINK_DISTANCE) * 0.12})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }

        const node = nodes[i]
        const md = Math.hypot(node.x - mouse.x, node.y - mouse.y)
        if (md < GRAVITY_RADIUS) {
          const rgb = PALETTE[node.color][isDark ? 'dark' : 'light']
          ctx.strokeStyle = `rgba(${rgb}, ${(1 - md / GRAVITY_RADIUS) * 0.35})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      }

      for (const node of nodes) {
        const twinkle = reduceMotion
          ? 0.6
          : 0.5 + 0.5 * Math.sin(time * 0.001 * node.twinkleSpeed + node.phase)
        const md = Math.hypot(node.x - mouse.x, node.y - mouse.y)
        const boost = md < GRAVITY_RADIUS ? (1 - md / GRAVITY_RADIUS) * 0.45 : 0
        const rgb = PALETTE[node.color][isDark ? 'dark' : 'light']
        ctx.fillStyle = `rgba(${rgb}, ${0.25 + twinkle * 0.35 + boost})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, 1.6, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!reduceMotion) {
        if (time > nextShootingStarAt && shootingStars.length < 2) {
          const goingRight = Math.random() > 0.5
          const speed = 7 + Math.random() * 3
          const angle = Math.PI / 5 + Math.random() * 0.3
          shootingStars.push({
            x: goingRight ? -20 : width + 20,
            y: Math.random() * height * 0.4,
            vx: (goingRight ? 1 : -1) * speed * Math.cos(angle),
            vy: speed * Math.sin(angle),
            life: 0,
            maxLife: 1,
            color: pickColor(),
          })
          nextShootingStarAt = time + 7000 + Math.random() * 9000
        }

        shootingStars = shootingStars.filter((s) => s.life < s.maxLife)
        for (const s of shootingStars) {
          s.life += dt
          s.x += s.vx
          s.y += s.vy
          const alpha = Math.max(0, 1 - s.life / s.maxLife)
          const tailX = s.x - s.vx * 6
          const tailY = s.y - s.vy * 6
          const rgb = PALETTE[s.color][isDark ? 'dark' : 'light']
          const gradient = ctx.createLinearGradient(tailX, tailY, s.x, s.y)
          gradient.addColorStop(0, `rgba(${rgb}, 0)`)
          gradient.addColorStop(1, `rgba(${rgb}, ${alpha * 0.9})`)
          ctx.strokeStyle = gradient
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(tailX, tailY)
          ctx.lineTo(s.x, s.y)
          ctx.stroke()
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
          ctx.beginPath()
          ctx.arc(s.x, s.y, 1.4, 0, Math.PI * 2)
          ctx.fill()
        }

        if (time > nextRocketAt && rockets.length < 1) {
          const fromLeft = Math.random() > 0.5
          const speed = 55 + Math.random() * 25
          const angle = (Math.random() - 0.5) * 0.4 - (fromLeft ? 0 : Math.PI)
          rockets.push({
            x: fromLeft ? -30 : width + 30,
            y: height * (0.25 + Math.random() * 0.5),
            vx: Math.cos(angle) * speed * (fromLeft ? 1 : -1),
            vy: Math.sin(angle) * speed,
            life: 0,
            maxLife: 6,
            color: pickColor(),
          })
          nextRocketAt = time + 22000 + Math.random() * 18000
        }

        rockets = rockets.filter((r) => r.life < r.maxLife)
        for (const r of rockets) {
          r.life += dt
          r.x += r.vx * dt
          r.y += r.vy * dt
          const fadeIn = Math.min(r.life / 0.6, 1)
          const fadeOut = Math.min((r.maxLife - r.life) / 0.6, 1)
          const alpha = Math.max(0, Math.min(fadeIn, fadeOut))
          const rgb = PALETTE[r.color][isDark ? 'dark' : 'light']

          ctx.save()
          ctx.translate(r.x, r.y)
          ctx.rotate(Math.atan2(r.vy, r.vx))

          const rocketFlicker = 0.85 + 0.15 * Math.sin(time * 0.03 + r.x)
          const rocketFlameLen = 10 * rocketFlicker
          const flameGradient = ctx.createLinearGradient(-6, 0, -6 - rocketFlameLen, 0)
          flameGradient.addColorStop(0, `rgba(${rgb}, ${alpha * 0.85 * rocketFlicker})`)
          flameGradient.addColorStop(1, `rgba(${rgb}, 0)`)
          ctx.fillStyle = flameGradient
          ctx.beginPath()
          ctx.moveTo(-6, -2)
          ctx.lineTo(-6 - rocketFlameLen, 0)
          ctx.lineTo(-6, 2)
          ctx.closePath()
          ctx.fill()

          ctx.fillStyle = `rgba(226, 232, 240, ${alpha})`
          ctx.beginPath()
          ctx.ellipse(0, 0, 6, 2.2, 0, 0, Math.PI * 2)
          ctx.fill()

          ctx.fillStyle = `rgba(${rgb}, ${alpha})`
          ctx.beginPath()
          ctx.moveTo(6, 0)
          ctx.lineTo(3, -2.2)
          ctx.lineTo(3, 2.2)
          ctx.closePath()
          ctx.fill()

          ctx.restore()
        }

        // Companion pilot: seeks the cursor with thrust + drag, then orbits it
        // once close instead of locking onto the exact point. Thrust scales with
        // how aligned the current heading is with the target, so it accelerates
        // when flying straight and eases off while turning.
        const hasTarget = mouse.x > -1000
        if (hasTarget) {
          const rawDist = Math.hypot(mouse.x - pilot.x, mouse.y - pilot.y)
          if (!pilotOrbit.active && rawDist < PILOT_ORBIT_ENTER) pilotOrbit.active = true
          if (pilotOrbit.active && rawDist > PILOT_ORBIT_EXIT) pilotOrbit.active = false

          let targetX = mouse.x
          let targetY = mouse.y
          if (pilotOrbit.active) {
            pilotOrbit.angle += PILOT_ORBIT_ANGULAR_SPEED * dt
            targetX = mouse.x + Math.cos(pilotOrbit.angle) * PILOT_ORBIT_RADIUS
            targetY = mouse.y + Math.sin(pilotOrbit.angle) * PILOT_ORBIT_RADIUS
          }

          const dx = targetX - pilot.x
          const dy = targetY - pilot.y
          const dist = Math.hypot(dx, dy) || 1
          const dirX = dx / dist
          const dirY = dy / dist

          const speed = Math.hypot(pilot.vx, pilot.vy)
          const alignment = speed > 1 ? (pilot.vx / speed) * dirX + (pilot.vy / speed) * dirY : 1
          const thrustScale = 0.55 + 0.45 * Math.max(0, alignment)
          pilot.vx += dirX * PILOT_THRUST * thrustScale * dt
          pilot.vy += dirY * PILOT_THRUST * thrustScale * dt

          if (alignment < 0.4) {
            const turnDrag = (0.4 - alignment) * 2.2
            pilot.vx -= pilot.vx * turnDrag * dt
            pilot.vy -= pilot.vy * turnDrag * dt
          }

          if (dist > 2) {
            pilotAngle.current = Math.atan2(dy, dx)
          }
        } else {
          pilotOrbit.active = false
        }
        pilot.vx -= pilot.vx * PILOT_DRAG * dt
        pilot.vy -= pilot.vy * PILOT_DRAG * dt
        const pilotSpeed = Math.hypot(pilot.vx, pilot.vy)
        if (pilotSpeed > PILOT_MAX_SPEED) {
          pilot.vx = (pilot.vx / pilotSpeed) * PILOT_MAX_SPEED
          pilot.vy = (pilot.vy / pilotSpeed) * PILOT_MAX_SPEED
        }
        pilot.x += pilot.vx * dt
        pilot.y += pilot.vy * dt

        const pilotRgb = PALETTE.indigo[isDark ? 'dark' : 'light']
        const pilotFlicker = 0.85 + 0.15 * Math.sin(time * 0.035)
        const flameLen = (5 + (Math.min(pilotSpeed, PILOT_MAX_SPEED) / PILOT_MAX_SPEED) * 7) * pilotFlicker

        ctx.save()
        ctx.translate(pilot.x, pilot.y)
        ctx.rotate(pilotAngle.current)

        const pilotFlame = ctx.createLinearGradient(-6, 0, -6 - flameLen, 0)
        pilotFlame.addColorStop(0, `rgba(${pilotRgb}, ${0.7 * pilotFlicker})`)
        pilotFlame.addColorStop(1, `rgba(${pilotRgb}, 0)`)
        ctx.fillStyle = pilotFlame
        ctx.beginPath()
        ctx.moveTo(-6, -2.4)
        ctx.lineTo(-6 - flameLen, 0)
        ctx.lineTo(-6, 2.4)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = `rgba(${pilotRgb}, 0.75)`
        ctx.beginPath()
        ctx.moveTo(-5, -3)
        ctx.lineTo(-9, -6.5)
        ctx.lineTo(-6.5, -3)
        ctx.closePath()
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(-5, 3)
        ctx.lineTo(-9, 6.5)
        ctx.lineTo(-6.5, 3)
        ctx.closePath()
        ctx.fill()

        ctx.fillStyle = 'rgba(226, 232, 240, 0.8)'
        ctx.beginPath()
        ctx.ellipse(0, 0, 7, 3, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(${pilotRgb}, 0.85)`
        ctx.beginPath()
        ctx.moveTo(10, 0)
        ctx.lineTo(3.5, -3)
        ctx.lineTo(3.5, 3)
        ctx.closePath()
        ctx.fill()

        ctx.restore()
      }

      frame = requestAnimationFrame(draw)
    }

    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      darkQuery.removeEventListener('change', onThemeChange)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 bg-white dark:bg-slate-950">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
