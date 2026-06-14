import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createTimeline } from 'animejs'
import { useApp } from '../context/AppContext'

type Bi = { en: string; zh: string }

const ACCENT = 'var(--color-primary)'
const ERR = 'var(--color-error)'

/* -------------------------------------------------------------------------- */
/*  Attack Brain — the loop it actually runs                                   */
/* -------------------------------------------------------------------------- */

const STAGES: { label: Bi; note: Bi }[] = [
  { label: { en: 'Assess', zh: '研判' }, note: { en: 'read the current state', zh: '看清打到哪一步' } },
  { label: { en: 'Plan', zh: '规划' }, note: { en: 'pick the next move', zh: '定下一步打什么' } },
  { label: { en: 'Strike', zh: '调度' }, note: { en: 'hand it to a capability', zh: '把活派给能力' } },
  { label: { en: 'Review', zh: '复盘' }, note: { en: 'fold the result back', zh: '结果回灌决策' } },
]

// ring node centers (viewBox 300×300), clockwise from top
const NODES = [
  { x: 150, y: 40 },
  { x: 260, y: 150 },
  { x: 150, y: 260 },
  { x: 40, y: 150 },
]

function BrainLoop() {
  const { tx } = useApp()
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setStep((s) => (s + 1) % STAGES.length), 1600)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 300 300" className="h-auto w-full max-w-[270px]" role="img" aria-label="Attack brain decision loop">
        {/* loop track */}
        <circle cx={150} cy={150} r={110} fill="none" stroke="var(--color-hairline)" strokeWidth={1.2} />
        <circle cx={150} cy={150} r={110} fill="none" stroke={ACCENT} strokeWidth={1.4} className="flow-line" opacity={0.5} />

        {/* hub */}
        <circle cx={150} cy={150} r={46} fill="var(--color-surface-card)" stroke="var(--color-hairline)" strokeWidth={1.2} />
        <circle className="core-pulse" cx={150} cy={150} r={20} fill="none" stroke={ACCENT} strokeWidth={1.4} />

        {/* spoke — points at the active stage, eases around the loop */}
        <g
          style={{
            transform: `rotate(${step * 90}deg)`,
            transformOrigin: '150px 150px',
            transformBox: 'view-box',
            transition: 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <line x1={150} y1={104} x2={150} y2={66} stroke={ACCENT} strokeWidth={2} strokeLinecap="round" />
          <circle cx={150} cy={66} r={3.5} fill={ACCENT} />
        </g>

        {/* core dot */}
        <circle cx={150} cy={150} r={6} fill={ACCENT} />
        <text x={150} y={166} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={8} letterSpacing="0.12em" fill="var(--color-muted)">
          ATKBRAIN
        </text>

        {/* stage chips */}
        {STAGES.map((s, i) => {
          const n = NODES[i]
          const active = i === step
          return (
            <g key={s.label.en} style={{ transition: 'opacity 0.3s ease' }} opacity={active ? 1 : 0.78}>
              <rect
                x={n.x - 36}
                y={n.y - 16}
                width={72}
                height={32}
                rx={9}
                fill={active ? 'color-mix(in srgb, var(--color-primary) 12%, var(--color-canvas))' : 'var(--color-surface-card)'}
                stroke={active ? ACCENT : 'var(--color-hairline)'}
                strokeWidth={active ? 1.6 : 1.2}
                style={{ transition: 'stroke 0.3s ease, fill 0.3s ease' }}
              />
              <text
                x={n.x}
                y={n.y + 5}
                textAnchor="middle"
                fontFamily="var(--font-display)"
                fontSize={15}
                fill={active ? 'var(--color-ink)' : 'var(--color-muted)'}
                style={{ transition: 'fill 0.3s ease' }}
              >
                {tx(s.label)}
              </text>
            </g>
          )
        })}
      </svg>

      <p className="mono-label mt-5 text-center">
        <span style={{ color: ACCENT }}>{tx(STAGES[step].label)}</span>
        <span className="mx-2 text-[var(--color-muted-soft)]">·</span>
        {tx(STAGES[step].note)}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Code Audit — scan, flag the sink, trace the taint back to its source       */
/* -------------------------------------------------------------------------- */

const LINE_H = 26
const PAD_Y = 18
// source = user bytes (line 0), tainted stream = line 3, sink = readObject (line 5)
const SRC_LINE = 0
const SINK_LINE = 5
const SWEEP = 5 * LINE_H

function CodeScan() {
  const { tx } = useApp()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const q = <T extends Element>(sel: string) => root.querySelector<T>(sel)!
    const findings = [
      q('[data-flag="src"]'),
      q('[data-flag="danger"]'),
      q('[data-danger-bg]'),
      q('[data-flag="sink"]'),
    ]
    const trace = q<HTMLElement>('[data-trace]')
    const scan = q<HTMLElement>('[data-scan]')

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      findings.forEach((el) => ((el as HTMLElement).style.opacity = '1'))
      trace.style.transform = 'scaleY(1)'
      scan.style.opacity = '0'
      return
    }

    const tl = createTimeline({ loop: true })
    tl.add(
      scan,
      {
        translateY: [0, SWEEP],
        opacity: [
          { to: 1, duration: 220 },
          { to: 1, duration: 1280 },
          { to: 0, duration: 300 },
        ],
        duration: 1800,
        ease: 'linear',
      },
      0,
    )
    tl.add(q<HTMLElement>('[data-flag="src"]'), { opacity: [0, 1], duration: 320 }, 620)
    tl.add(trace, { scaleY: [0, 1], duration: 620, ease: 'out(3)' }, 980)
    tl.add([q<HTMLElement>('[data-flag="danger"]'), q<HTMLElement>('[data-danger-bg]')], { opacity: [0, 1], duration: 320 }, 1100)
    tl.add(q<HTMLElement>('[data-flag="sink"]'), { opacity: [0, 1], duration: 320 }, 1480)
    // hold, then clear for the next pass
    tl.add(findings, { opacity: 0, duration: 460 }, 3300)
    tl.add(trace, { scaleY: 0, duration: 460 }, 3300)

    return () => {
      tl.pause()
    }
  }, [])

  const top = (i: number) => PAD_Y + i * LINE_H

  const Tag = ({ flag, color, children }: { flag: string; color: string; children: ReactNode }) => (
    <span
      data-flag={flag}
      className="ml-3 inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[10px] tracking-wide"
      style={{ background: `color-mix(in srgb, ${color} 16%, transparent)`, color, opacity: 0 }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {children}
    </span>
  )

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-hairline)] bg-[var(--color-dark)]">
      {/* title bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="font-mono text-xs text-[var(--color-on-dark-soft)]">OrderService.java</span>
        <span className="font-mono text-[10px] tracking-wide text-[var(--color-on-dark-soft)]">StrikeAgent-Coder</span>
      </div>

      {/* code body */}
      <div ref={rootRef} className="relative px-4 font-mono text-[12.5px]" style={{ paddingTop: PAD_Y, paddingBottom: PAD_Y }}>
        {/* scan line */}
        <div
          data-scan
          className="pointer-events-none absolute left-0 right-0"
          style={{ top: PAD_Y, height: LINE_H, background: `linear-gradient(color-mix(in srgb, ${ACCENT} 18%, transparent), transparent)`, borderTop: `1px solid ${ACCENT}`, opacity: 0 }}
        />

        {/* taint trace in the gutter */}
        <div
          data-trace
          className="pointer-events-none absolute"
          style={{
            left: 6,
            top: top(SRC_LINE) + LINE_H / 2,
            width: 2,
            height: (SINK_LINE - SRC_LINE) * LINE_H,
            background: ACCENT,
            transformOrigin: 'top',
            transform: 'scaleY(0)',
            borderRadius: 2,
          }}
        />

        <CodeRow n={1}>
          <span style={{ color: 'var(--color-teal)' }}>byte[]</span>
          <C>{' '}</C>
          <span style={{ color: ACCENT }}>body</span>
          <C>{' = '}</C>
          <span className="text-[var(--color-on-dark-soft)]">readBody</span>
          <C>{'(req);'}</C>
          <Tag flag="src" color={ACCENT}>request bytes</Tag>
        </CodeRow>
        <CodeRow n={2} />
        <CodeRow n={3}>
          <span className="text-[var(--color-on-dark-soft)]">var</span>
          <C>{' ois = '}</C>
          <span className="text-[var(--color-on-dark-soft)]">new</span>
          <C>{' '}</C>
          <span style={{ color: 'var(--color-teal)' }}>ObjectInputStream</span>
          <C>{'('}</C>
        </CodeRow>
        <CodeRow n={4} danger>
          <C>{'    '}</C>
          <span className="text-[var(--color-on-dark-soft)]">new</span>
          <C>{' '}</C>
          <span style={{ color: 'var(--color-teal)' }}>ByteArrayInputStream</span>
          <C>{'('}</C>
          <span style={{ color: ACCENT }}>body</span>
          <C>{'));'}</C>
          <Tag flag="danger" color={ERR}>untrusted stream</Tag>
        </CodeRow>
        <CodeRow n={5} />
        <CodeRow n={6}>
          <span style={{ color: 'var(--color-teal)' }}>Object</span>
          <C>{' o = '}</C>
          <span className="text-[var(--color-on-dark-soft)]">ois</span>
          <C>{'.readObject();'}</C>
          <Tag flag="sink" color={ERR}>deserialize → RCE</Tag>
        </CodeRow>

        <p className="mono-label mt-4 pl-1 text-[var(--color-on-dark-soft)]">
          {tx({ en: 'taint traced: bytes → readObject', zh: '污点链路：字节流 → 反序列化' })}
        </p>
      </div>
    </div>
  )
}

function C({ children }: { children: ReactNode }) {
  return <span style={{ color: 'var(--color-on-dark)' }}>{children}</span>
}

function CodeRow({ n, danger, children }: { n: number; danger?: boolean; children?: ReactNode }) {
  return (
    <div className="relative flex items-center whitespace-pre" style={{ height: LINE_H }}>
      {danger && (
        <span
          data-danger-bg
          className="pointer-events-none absolute -left-4 right-0 rounded-sm"
          style={{ top: 1, bottom: 1, background: `color-mix(in srgb, ${ERR} 12%, transparent)`, borderLeft: `2px solid ${ERR}`, opacity: 0 }}
        />
      )}
      <span className="relative z-10 mr-4 w-4 select-none text-right font-mono text-[var(--color-on-dark-soft)]">{n}</span>
      <span className="relative z-10">{children}</span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Section                                                                    */
/* -------------------------------------------------------------------------- */

function Points({ items }: { items: Bi[] }) {
  const { tx } = useApp()
  return (
    <ul className="mt-5 space-y-2.5">
      {items.map((it) => (
        <li key={it.en} className="flex gap-3 text-[var(--color-body)]">
          <span className="mt-2.5 h-px w-4 flex-none bg-[var(--color-primary)]" />
          <span className="leading-relaxed">{tx(it)}</span>
        </li>
      ))}
    </ul>
  )
}

const BRAIN_POINTS: Bi[] = [
  { en: 'Plans the path on its own, instead of waiting for orders one line at a time.', zh: '自己规划攻击路径，而不是等你一条条下指令。' },
  { en: 'Hands the right job to the right capability for the state it is in.', zh: '按当前态势，把对的活交给对的能力。' },
  { en: 'Runs a closed loop — every result feeds the next call, until it lands or the path is ruled out.', zh: '闭环运行——每次结果都喂回下一步，直到拿下或确认此路不通。' },
]

const CODER_POINTS: Bi[] = [
  { en: 'Marks dangerous calls and suspect patterns down to the line.', zh: '把危险调用和可疑写法标到具体行。' },
  { en: 'Traces from the sink back to the entry point and rebuilds the path.', zh: '从触发点回溯到入口，还原可利用链路。' },
  { en: 'Findings you can rerun: where it is, how it flows, what sets it off.', zh: '结论可复现：在哪、怎么流、什么触发。' },
]

export default function Core() {
  const { tx } = useApp()
  return (
    <section id="core" className="border-b border-[var(--color-hairline)] bg-[var(--color-surface-soft)]">
      <div className="mx-auto max-w-7xl px-5 py-[clamp(3rem,7vh,5rem)] sm:px-8">
        {/* lead */}
        <div className="max-w-2xl" data-reveal-group="110">
          <p className="reveal eyebrow mb-4">{tx({ en: 'The core', zh: '核心' })}</p>
          <h2 className="reveal font-display text-4xl tracking-tight text-[var(--color-ink)] sm:text-5xl">
            {tx({ en: 'The two that do the real work', zh: '真正干活的，是这两块' })}
          </h2>
          <p className="reveal mt-4 text-[var(--color-body)]">
            {tx({
              en: 'Everything else maps the ground or stores what we already know. The judgment and the hands-on work come down to two: the brain that decides, and the auditor that reads code.',
              zh: '其它模块负责测绘地形、沉淀知识。真正做判断、真正动手的，是两块——下决策的攻击大脑，和读代码的审计工具。',
            })}
          </p>
        </div>

        {/* feature — Attack Brain (text left, visual right) */}
        <div className="mt-[clamp(2.25rem,5.5vh,4.5rem)] grid items-center gap-8 lg:grid-cols-2 lg:gap-14" data-reveal-group="130">
          <div className="reveal" data-reveal="left">
            <p className="mono-label">01 · StrikeAgent-AtkBrain</p>
            <h3 className="mt-2 font-display text-2xl text-[var(--color-ink)] sm:text-3xl">
              {tx({ en: 'Attack Brain', zh: '攻击大脑' })}
            </h3>
            <p className="mt-4 max-w-xl leading-relaxed text-[var(--color-body)]">
              {tx({
                en: 'A penetration-testing agent, not a chat box. It reads where the engagement stands, decides what to hit next and how, hands the job to a capability, then reads what comes back and decides again.',
                zh: '一个渗透测试智能体，不是聊天框。它看清当前打到哪一步，自己决定下一步打什么、怎么打，把活派给具体能力，拿到回传再决定下一步。',
              })}
            </p>
            <Points items={BRAIN_POINTS} />
          </div>
          <div className="reveal rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6 sm:p-8" data-reveal="right">
            <BrainLoop />
          </div>
        </div>

        {/* feature — Code Audit (visual left, text right) */}
        <div className="mt-[clamp(2.25rem,5.5vh,4.5rem)] grid items-center gap-8 lg:grid-cols-2 lg:gap-14" data-reveal-group="130">
          <div className="reveal lg:order-2" data-reveal="right">
            <p className="mono-label">02 · StrikeAgent-Coder</p>
            <h3 className="mt-2 font-display text-2xl text-[var(--color-ink)] sm:text-3xl">
              {tx({ en: 'Code Audit', zh: '代码审计' })}
            </h3>
            <p className="mt-4 max-w-xl leading-relaxed text-[var(--color-body)]">
              {tx({
                en: 'It reads source the way an auditor does — flags the dangerous call, then walks backward to find what data reaches it and how, and leaves you a chain you can reproduce instead of a vague "might be risky".',
                zh: '它像审计员一样读源码——盯住危险调用，再往回走，查清是什么数据、怎么流到这里的，给你一条能复现的链路，而不是一句“可能有风险”。',
              })}
            </p>
            <Points items={CODER_POINTS} />
          </div>
          <div className="reveal lg:order-1" data-reveal="left">
            <CodeScan />
          </div>
        </div>
      </div>
    </section>
  )
}
