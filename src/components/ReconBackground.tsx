import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'

/**
 * Dynamic "reconnaissance survey" background.
 *
 * A slowly drifting topographic contour field with coordinate ticks and a
 * roaming target reticle. Instead of wandering aimlessly, the reticle now
 * cruises to a point, *locks on*, and surfaces a themed high-severity finding
 * (a small HUD callout on a leader line) before moving on — nodding to the
 * platform's offensive-recon DNA while staying editorial and subtle.
 */

type Finding = { code: string; cvss: number }

/** Top 20 most notorious CVEs, 2021–2026 — CISA KEV / joint advisories & industry coverage. */
const TOP_CVE_FINDINGS: Finding[] = [
  { code: 'CVE-2021-44228', cvss: 10.0 }, // Log4Shell
  { code: 'CVE-2021-26855', cvss: 9.8 }, // ProxyLogon
  { code: 'CVE-2021-34473', cvss: 9.8 }, // ProxyShell
  { code: 'CVE-2021-34527', cvss: 8.8 }, // PrintNightmare
  { code: 'CVE-2021-40539', cvss: 9.8 }, // Zoho ManageEngine
  { code: 'CVE-2022-1388', cvss: 9.8 }, // F5 BIG-IP
  { code: 'CVE-2022-22965', cvss: 9.8 }, // Spring4Shell
  { code: 'CVE-2022-26134', cvss: 9.8 }, // Confluence OGNL
  { code: 'CVE-2022-41082', cvss: 8.8 }, // ProxyNotShell
  { code: 'CVE-2023-0669', cvss: 7.2 }, // GoAnywhere
  { code: 'CVE-2023-20198', cvss: 10.0 }, // Cisco IOS XE
  { code: 'CVE-2023-22515', cvss: 10.0 }, // Confluence auth bypass
  { code: 'CVE-2023-34362', cvss: 9.8 }, // MOVEit
  { code: 'CVE-2023-3519', cvss: 9.8 }, // Citrix NetScaler
  { code: 'CVE-2023-4966', cvss: 9.4 }, // Citrix Bleed
  { code: 'CVE-2023-46747', cvss: 9.8 }, // ColdFusion
  { code: 'CVE-2024-1709', cvss: 10.0 }, // ConnectWise ScreenConnect
  { code: 'CVE-2024-3094', cvss: 10.0 }, // XZ Utils backdoor
  { code: 'CVE-2024-3400', cvss: 10.0 }, // PAN-OS
  { code: 'CVE-2025-53770', cvss: 9.8 }, // ToolShell / SharePoint
]

const scoreOf = (f: Finding) => f.cvss

const pickFinding = () => TOP_CVE_FINDINGS[Math.floor(Math.random() * TOP_CVE_FINDINGS.length)]

type Lock = {
  ax: number
  ay: number
  side: 'left' | 'right'
  up: boolean
  finding: Finding
}

export default function ReconBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useApp()
  const [lock, setLock] = useState<Lock | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const R = 60 // reticle radius
    const OFF_X = R + 30 // callout leader length (horizontal)
    const OFF_Y = R + 22 // callout leader length (vertical)
    const reticle = { x: width * 0.74, y: height * 0.42 }
    const goal = { x: width * 0.74, y: height * 0.42 }

    const INK = theme === 'dark' ? '250, 246, 239' : '20, 20, 19'
    const CORAL = theme === 'dark' ? '224, 138, 107' : '204, 120, 92'

    // ---- motion state machine: travel -> dwell(lock) -> travel ----------
    let phase: 'travel' | 'dwell' = 'travel'
    let dwellStart = 0
    const anchor = { ax: 0, ay: 0 }

    const pickGoal = () => {
      // bias to the right/center so it stays off the left-aligned hero copy.
      // keep a minimum jump distance so consecutive locks aren't cramped.
      const minJump = Math.min(width, height) * 0.4
      let nx = goal.x
      let ny = goal.y
      for (let i = 0; i < 16; i++) {
        nx = width * (0.32 + Math.random() * 0.62)
        ny = height * (0.16 + Math.random() * 0.64)
        if (Math.hypot(nx - reticle.x, ny - reticle.y) > minJump) break
      }
      goal.x = nx
      goal.y = ny
    }

    const CHIP_W = 210
    const CHIP_H = 50
    const TEXT_SELECTOR = 'h1,h2,h3,h4,h5,h6,p,span,a,li,button,strong,em,label,code,small'

    // does a viewport rect overlap any real body text? (sample a small grid)
    const rectHitsText = (left: number, top: number, w: number, h: number) => {
      const cols = 4
      const rows = 3
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = left + (w * i) / cols
          const y = top + (h * j) / rows
          if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) continue
          const el = document.elementFromPoint(x, y)
          const textEl = el?.closest(TEXT_SELECTOR)
          if (textEl && (textEl.textContent?.trim().length ?? 0) > 0) return true
        }
      }
      return false
    }

    // find a callout placement that stays on screen AND clears body text
    const placeCallout = () => {
      const M = 12
      const prefSide: 'left' | 'right' = reticle.x + OFF_X + CHIP_W < width - 16 ? 'right' : 'left'
      const prefUp = reticle.y + OFF_Y + CHIP_H > height - 16
      const otherSide = prefSide === 'right' ? 'left' : 'right'
      const combos: Array<{ side: 'left' | 'right'; up: boolean }> = [
        { side: prefSide, up: prefUp },
        { side: otherSide, up: prefUp },
        { side: prefSide, up: !prefUp },
        { side: otherSide, up: !prefUp },
      ]
      for (const c of combos) {
        const ax = reticle.x + (c.side === 'left' ? -OFF_X : OFF_X)
        const ay = reticle.y + (c.up ? -OFF_Y : OFF_Y)
        const left = c.side === 'left' ? ax - CHIP_W : ax
        const top = c.up ? ay - CHIP_H : ay
        const onScreen =
          left >= M && left + CHIP_W <= width - M && top >= M && top + CHIP_H <= height - M
        if (!onScreen) continue
        if (rectHitsText(left, top, CHIP_W, CHIP_H)) continue
        return { ax, ay, side: c.side, up: c.up }
      }
      return null
    }

    const enterDwell = (now: number) => {
      phase = 'dwell'
      dwellStart = now
      const spot = placeCallout()
      if (!spot) {
        // every placement would cover real text — lock on, but hide the callout
        setLock(null)
        return
      }
      anchor.ax = spot.ax
      anchor.ay = spot.ay
      setLock({ ax: spot.ax, ay: spot.ay, side: spot.side, up: spot.up, finding: pickFinding() })
    }

    const leaveDwell = () => {
      phase = 'travel'
      setLock(null)
      pickGoal()
    }

    // ---- drawing --------------------------------------------------------
    const drawContours = (t: number) => {
      const layers = 13
      const step = 14
      for (let i = 0; i < layers; i++) {
        const base = (height / (layers - 1)) * i
        const amp = 26 + (i % 3) * 12
        const speed = 0.00018 + (i % 4) * 0.00004
        const freq = 0.0042 + (i % 5) * 0.0006
        const phaseOff = i * 0.7
        const accent = i % 4 === 0
        ctx.beginPath()
        for (let x = -20; x <= width + 20; x += step) {
          const y =
            base +
            Math.sin(x * freq + t * speed + phaseOff) * amp +
            Math.sin(x * freq * 0.5 - t * speed * 1.6 + phaseOff) * amp * 0.4
          if (x === -20) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = accent ? `rgba(${CORAL}, 0.10)` : `rgba(${INK}, 0.045)`
        ctx.lineWidth = accent ? 1.1 : 0.8
        ctx.stroke()
      }
    }

    const drawTicks = () => {
      const gap = 96
      ctx.strokeStyle = `rgba(${INK}, 0.05)`
      ctx.lineWidth = 1
      for (let x = gap; x < width; x += gap) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, 6)
        ctx.moveTo(x, height - 6)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = gap; y < height; y += gap) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(6, y)
        ctx.moveTo(width - 6, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
    }

    const drawReticle = (t: number, locked: boolean) => {
      ctx.save()
      ctx.translate(reticle.x, reticle.y)

      // idle breathing pulse (gentler than the lock-on burst)
      const pulse = (t % 1600) / 1600
      ctx.strokeStyle = `rgba(${CORAL}, ${0.32 * (1 - pulse)})`
      ctx.lineWidth = 1.3
      ctx.beginPath()
      ctx.arc(0, 0, R * (0.7 + pulse * 0.6), 0, Math.PI * 2)
      ctx.stroke()

      const main = locked ? 0.85 : 0.7
      ctx.strokeStyle = `rgba(${CORAL}, ${main})`
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(0, 0, R, 0, Math.PI * 2)
      ctx.stroke()
      ctx.strokeStyle = `rgba(${CORAL}, ${locked ? 0.6 : 0.5})`
      ctx.beginPath()
      ctx.arc(0, 0, R * 0.5, 0, Math.PI * 2)
      ctx.stroke()

      // rotating corner ticks
      ctx.save()
      ctx.rotate(((t % 12000) / 12000) * Math.PI * 2)
      ctx.strokeStyle = `rgba(${CORAL}, 0.6)`
      ctx.lineWidth = 1.5
      const tick = 12
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2)
        ctx.beginPath()
        ctx.moveTo(R + 6, 0)
        ctx.lineTo(R + 6 + tick, 0)
        ctx.stroke()
      }
      ctx.restore()

      // cross-hairs (dashed when locked, for a targeting-frame feel)
      ctx.save()
      ctx.strokeStyle = `rgba(${CORAL}, 0.55)`
      ctx.lineWidth = 1.3
      if (locked) ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(-R - 14, 0)
      ctx.lineTo(-R + 10, 0)
      ctx.moveTo(R - 10, 0)
      ctx.lineTo(R + 14, 0)
      ctx.moveTo(0, -R - 14)
      ctx.lineTo(0, -R + 10)
      ctx.moveTo(0, R - 10)
      ctx.lineTo(0, R + 14)
      ctx.stroke()
      ctx.restore()

      // lock-on targeting brackets — four L-shaped corners frame the point
      if (locked) {
        const br = R + 16
        const corner = 16
        ctx.strokeStyle = `rgba(${CORAL}, 0.9)`
        ctx.lineWidth = 2
        const corners: [number, number, number, number][] = [
          [-br, -br, 1, 1],
          [br, -br, -1, 1],
          [-br, br, 1, -1],
          [br, br, -1, -1],
        ]
        corners.forEach(([cx, cy, sx, sy]) => {
          ctx.beginPath()
          ctx.moveTo(cx + corner * sx, cy)
          ctx.lineTo(cx, cy)
          ctx.lineTo(cx, cy + corner * sy)
          ctx.stroke()
        })
      }

      // center dot
      ctx.fillStyle = `rgba(${CORAL}, 0.95)`
      ctx.beginPath()
      ctx.arc(0, 0, 3, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    const drawLockRing = (p: number) => {
      const r = R + p * 30
      ctx.strokeStyle = `rgba(${CORAL}, ${0.55 * (1 - p)})`
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(reticle.x, reticle.y, r, 0, Math.PI * 2)
      ctx.stroke()
    }

    let raf = 0
    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height)
      drawTicks()
      drawContours(now)

      reticle.x += (goal.x - reticle.x) * 0.07
      reticle.y += (goal.y - reticle.y) * 0.07
      const dist = Math.hypot(goal.x - reticle.x, goal.y - reticle.y)

      if (phase === 'travel' && dist < 5) enterDwell(now)
      else if (phase === 'dwell' && now - dwellStart > 2600) leaveDwell()

      drawReticle(now, phase === 'dwell')

      if (phase === 'dwell') {
        const dt = now - dwellStart
        if (dt < 720) drawLockRing(dt / 720)
      }

      raf = requestAnimationFrame(render)
    }

    if (reduce) {
      // single static frame with one finding revealed
      reticle.x = width * 0.7
      reticle.y = height * 0.4
      goal.x = reticle.x
      goal.y = reticle.y
      ctx.clearRect(0, 0, width, height)
      drawTicks()
      drawContours(0)
      drawReticle(0, true)
      const spot = placeCallout()
      if (spot) {
        anchor.ax = spot.ax
        anchor.ay = spot.ay
        setLock({ ax: spot.ax, ay: spot.ay, side: spot.side, up: spot.up, finding: pickFinding() })
      }
    } else {
      pickGoal()
      raf = requestAnimationFrame(render)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [theme])

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10" />
      <Callout lock={lock} />
    </>
  )
}

function Callout({ lock }: { lock: Lock | null }) {
  const { tx } = useApp()
  const lastRef = useRef<Lock | null>(null)
  if (lock) lastRef.current = lock
  const cur = lock ?? lastRef.current
  const shown = !!lock

  const f = cur?.finding
  const sevColor = 'var(--color-error)'
  const score = f ? scoreOf(f) : 0
  const title = f ? tx({ en: 'CRITICAL VULNERABILITY DETECTED', zh: '发现严重漏洞' }) : ''

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {cur && (
        <div
          className="absolute"
          style={{
            left: cur.ax,
            top: cur.ay,
            transform: `translate(${cur.side === 'left' ? '-100%' : '0'}, ${cur.up ? '-100%' : '0'})`,
          }}
        >
          <div
            className="w-[210px]"
            style={{
              opacity: shown ? 1 : 0,
              transform: shown ? 'translateY(0)' : 'translateY(4px)',
              transition: 'opacity 0.4s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
              transitionDelay: shown ? '0.18s' : '0s',
            }}
          >
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="h-2 w-2 flex-none rounded-[2px]" style={{ background: sevColor }} />
              <span className="font-mono text-[9px] font-medium uppercase tracking-[0.08em]" style={{ color: sevColor }}>
                {title}
              </span>
            </div>
            <div className="mt-1 whitespace-nowrap font-mono text-[11px] tracking-wide text-[var(--color-body-strong)]">
              CVSS {score.toFixed(1)} · {cur.finding.code}
            </div>
            <div
              className="mt-2 h-1.5 w-full overflow-hidden rounded-full"
              style={{ background: 'color-mix(in srgb, var(--color-hairline) 70%, transparent)' }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: shown ? `${(score / 10) * 100}%` : '0%',
                  background: 'linear-gradient(90deg, var(--color-error), var(--color-primary))',
                  transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                  transitionDelay: shown ? '0.3s' : '0s',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
