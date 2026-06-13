import { useEffect, useRef } from 'react'
import { animate, createTimeline, createMotionPath } from 'animejs'
import { useApp } from '../context/AppContext'
import { capabilities, type Capability, type Domain } from '../data/products'

const atkBrain = capabilities.find((c) => c.code === 'StrikeAgent-AtkBrain')
const domains: Domain[] = atkBrain?.domains ?? []
const DOMAIN_COLORS = ['#c64545', '#4f7fc6', '#7a5dc6', '#caa017']

const byCode = (code: string) => capabilities.find((c) => c.code === code) as Capability

// supply shelf — recon + knowledge + capability products that feed the brain
const SUPPLY = [
  'StrikeAgent-MAP',
  'StrikeAgent-RAGKB',
  'StrikeAgent-VulnDB',
  'StrikeAgent-Skill',
  'StrikeAgent-Coder',
].map(byCode)
const SUPPLY_LEFT = [48, 252, 456, 660, 864]
const SUPPLY_CX = SUPPLY_LEFT.map((x) => x + 94)

// vertical centers of the four domain product cards
const ROWS = [168, 228, 288, 348]

const CALL = 'M190,268 L290,268'
const ENABLE = 'M992,245 C992,115 992,75 540,75 L240,75 C150,75 115,145 115,245'
const DISPATCH = ROWS.map((y) => `M460,268 C530,268 530,${y} 600,${y}`)
const CONVERGE = ROWS.map((y) => `M875,${y} C915,${y} 915,268 945,268`)
const FEED = SUPPLY_CX.map((cx) => `M${cx},470 C${cx},405 375,395 375,296`)

export default function AgentLinkage() {
  const { t, tx } = useApp()
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const dot = (sel: string) => svg.querySelector<SVGCircleElement>(sel)!
    const path = (sel: string) => svg.querySelector<SVGPathElement>(sel)!
    const fade = (dur: number) => [
      { to: 1, duration: Math.round(dur * 0.16) },
      { to: 1, duration: Math.round(dur * 0.68) },
      { to: 0, duration: Math.round(dur * 0.16) },
    ]
    const mp = (sel: string) => {
      const { translateX, translateY } = createMotionPath(path(sel))
      return { translateX, translateY }
    }

    const corePulse = animate(svg.querySelectorAll('.brain-pulse'), {
      scale: [0.82, 1.32],
      opacity: [0.45, 0],
      duration: 1900,
      loop: true,
      ease: 'out(3)',
    })

    const tl = createTimeline({ loop: true })

    // 1) supply feed rises into the brain (MAP first, then knowledge & capability)
    FEED.forEach((_, i) => {
      tl.add(dot(`#dot-feed-${i}`), { ...mp(`#p-feed-${i}`), opacity: fade(820), duration: 820, ease: 'inOut(2)' }, i * 150)
    })
    // 2) CLI issues the command
    tl.add(dot('#dot-call'), { ...mp('#p-call'), opacity: fade(620), duration: 620, ease: 'inOut(2)' }, 1000)
    // 3) brain dispatches the four domain products
    DISPATCH.forEach((_, i) => {
      tl.add(dot(`#dot-dispatch-${i}`), { ...mp(`#p-dispatch-${i}`), opacity: fade(760), duration: 760, ease: 'inOut(2)' }, 1600)
    })
    // 4) results converge
    CONVERGE.forEach((_, i) => {
      tl.add(dot(`#dot-converge-${i}`), { ...mp(`#p-converge-${i}`), opacity: fade(760), duration: 760, ease: 'inOut(2)' }, 2400)
    })
    // 5) enable loops back to the CLI
    tl.add(dot('#dot-enable'), { ...mp('#p-enable'), opacity: fade(1150), duration: 1150, ease: 'inOut(2)' }, 3200)
    tl.add(dot('#dot-enable'), { opacity: 0, duration: 500 }, 4350)

    return () => {
      corePulse.pause()
      tl.pause()
    }
  }, [])

  const node = (
    x: number,
    y: number,
    w: number,
    h: number,
    title: string,
    sub: string,
    opts: { accent?: string; fill?: string; mono?: boolean; titleSize?: number } = {},
  ) => (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill={opts.fill ?? 'var(--color-surface-card)'}
        stroke={opts.accent ?? 'var(--color-hairline)'}
        strokeWidth={1.4}
      />
      <text
        x={x + 16}
        y={y + (sub ? h / 2 - 2 : h / 2 + 5)}
        fontFamily={opts.mono ? 'var(--font-mono)' : 'var(--font-display)'}
        fontSize={opts.titleSize ?? (opts.mono ? 13 : 16)}
        fill="var(--color-ink)"
      >
        {title}
      </text>
      {sub && (
        <text x={x + 16} y={y + h / 2 + 14} fontFamily="var(--font-mono)" fontSize={10} fill="var(--color-muted)">
          {sub}
        </text>
      )}
    </g>
  )

  return (
    <section id="linkage" className="scroll-mt-16 bg-[var(--color-surface-soft)]">
      <div className="mx-auto flex min-h-svh max-w-7xl flex-col justify-center px-5 py-[clamp(1.25rem,3vh,2rem)] sm:px-8">
        <div className="max-w-2xl shrink-0" data-reveal-group="110">
          <p className="reveal eyebrow mb-4">{t('linkage.eyebrow')}</p>
          <h2 className="reveal font-display text-4xl tracking-tight text-[var(--color-ink)] sm:text-5xl">
            {t('linkage.title')}
          </h2>
          <p className="reveal mt-4 text-[var(--color-body)]">{t('linkage.desc')}</p>
        </div>

        <div className="reveal mt-4 flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 overflow-x-auto">
            <svg
              ref={svgRef}
              viewBox="0 0 1100 560"
              className="mx-auto block h-auto w-full max-w-5xl"
              style={{ minWidth: 480, maxHeight: 'calc(100svh - clamp(14rem, 32vh, 18rem))' }}
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="StrikeAgent end-to-end workflow"
            >
          {/* connectors */}
          <g fill="none" strokeLinecap="round">
            {FEED.map((d, i) => (
              <path key={`f${i}`} id={`p-feed-${i}`} d={d} stroke="var(--color-muted-soft)" strokeWidth={1.2} opacity={0.5} strokeDasharray="3 5" />
            ))}
            <path id="p-call" d={CALL} stroke="var(--color-primary)" strokeWidth={1.6} className="flow-line" />
            {DISPATCH.map((d, i) => (
              <path key={`d${i}`} id={`p-dispatch-${i}`} d={d} stroke={DOMAIN_COLORS[i]} strokeWidth={1.5} opacity={0.55} />
            ))}
            {CONVERGE.map((d, i) => (
              <path key={`c${i}`} id={`p-converge-${i}`} d={d} stroke={DOMAIN_COLORS[i]} strokeWidth={1.5} opacity={0.4} />
            ))}
            <path id="p-enable" d={ENABLE} stroke="var(--color-primary)" strokeWidth={1.6} className="flow-line" />
          </g>

          {/* flow labels */}
          <text x={240} y={260} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={10} fill="var(--color-primary)">
            Call
          </text>
          <text x={560} y={71} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={11} fill="var(--color-primary)">
            Enable
          </text>
          <text x={375} y={412} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={11} fill="var(--color-muted)">
            {t('linkage.supply')}
          </text>

          {/* CLI */}
          {node(40, 238, 150, 56, 'StrikeAgent-CLI', tx({ en: 'Control desk', zh: '操作指挥台' }), {
            mono: true,
            accent: 'var(--color-agent)',
          })}

          {/* Attack Brain (orchestrator, not a product) */}
          <g>
            <circle className="brain-pulse" cx={375} cy={268} r={40} fill="none" stroke="var(--color-primary)" strokeWidth={1.4} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
            {node(290, 234, 170, 62, t('linkage.brain'), '', {
              accent: 'var(--color-primary)',
              titleSize: 16,
            })}
          </g>

          {/* four domain products */}
          {domains.map((d, i) => (
            <g key={d.code}>
              {node(600, ROWS[i] - 24, 275, 48, tx(d.name), d.code, { accent: DOMAIN_COLORS[i] })}
              <text x={860} y={ROWS[i] + 2} textAnchor="end" fontFamily="var(--font-mono)" fontSize={9} fill={DOMAIN_COLORS[i]}>
                {d.field}
              </text>
            </g>
          ))}

          {/* result */}
          {node(945, 238, 95, 56, 'result', tx({ en: 'aggregated', zh: '战果汇总' }), { accent: 'var(--color-primary)', mono: true, titleSize: 13 })}

          {/* supply shelf — 5 products feeding the brain */}
          {SUPPLY.map((c, i) => (
            <g key={c.code}>{node(SUPPLY_LEFT[i], 470, 188, 58, tx(c.name), c.code, { accent: 'var(--color-agent)' })}</g>
          ))}

          {/* moving pulses */}
          {FEED.map((_, i) => (
            <circle key={`df${i}`} id={`dot-feed-${i}`} r={4.5} cx={0} cy={0} fill="var(--color-agent)" opacity={0} />
          ))}
          <circle id="dot-call" r={5} cx={0} cy={0} fill="var(--color-primary)" opacity={0} />
          {DISPATCH.map((_, i) => (
            <circle key={`dd${i}`} id={`dot-dispatch-${i}`} r={5} cx={0} cy={0} fill={DOMAIN_COLORS[i]} opacity={0} />
          ))}
          {CONVERGE.map((_, i) => (
            <circle key={`dc${i}`} id={`dot-converge-${i}`} r={5} cx={0} cy={0} fill={DOMAIN_COLORS[i]} opacity={0} />
          ))}
          <circle id="dot-enable" r={5} cx={0} cy={0} fill="var(--color-primary)" opacity={0} />
            </svg>
          </div>

          {/* legend — sits flush under the diagram */}
          <div className="mx-auto mt-1.5 flex w-full max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-1">
            <span className="mono-label">{t('linkage.products')}</span>
            {domains.map((d, i) => (
              <span key={d.code} className="flex items-center gap-2 text-sm text-[var(--color-body)]">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: DOMAIN_COLORS[i] }} />
                {tx(d.name)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
