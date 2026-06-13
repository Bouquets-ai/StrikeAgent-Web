import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import { useApp } from '../context/AppContext'
import { ROOT } from '../data/products'

const TITLE = ROOT.title // "AI for offensive security"

export default function Hero() {
  const { t } = useApp()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scope = rootRef.current
    if (!scope) return

    const lines = scope.querySelectorAll<HTMLElement>('[data-line]')
    const rises = scope.querySelectorAll<HTMLElement>('[data-rise]')

    if (reduce) {
      lines.forEach((l) => {
        l.style.opacity = '1'
        l.style.transform = 'none'
      })
      rises.forEach((r) => {
        r.style.opacity = '1'
        r.style.transform = 'none'
      })
      return
    }

    animate(lines, {
      opacity: [0, 1],
      y: [{ from: '0.4em' }],
      duration: 1100,
      delay: stagger(140, { start: 120 }),
      ease: 'out(4)',
    })

    animate(rises, {
      opacity: [0, 1],
      y: [{ from: 18 }],
      duration: 900,
      delay: stagger(120, { start: 520 }),
      ease: 'out(4)',
    })
  }, [])

  return (
    <section id="top" className="relative flex min-h-screen items-center pt-16">
      <div ref={rootRef} className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="max-w-4xl">
          <div data-rise className="eyebrow mb-6 flex items-center gap-3 opacity-0">
            <span className="inline-block h-px w-8 bg-[var(--color-primary)]" />
            {t('hero.tag')}
            <span className="font-mono text-[var(--color-muted-soft)]">/ {ROOT.version}</span>
          </div>

          <h1
            className="font-display text-[clamp(2.6rem,7.5vw,5.8rem)] font-medium leading-[1.12] tracking-[-0.015em] text-[var(--color-ink)]"
            aria-label={TITLE}
          >
            <span data-line className="block opacity-0">
              AI for <span className="text-[var(--color-primary)]">offensive</span>
            </span>
            <span data-line className="block opacity-0">
              security
            </span>
          </h1>

          <p
            data-rise
            className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-body)] opacity-0 sm:text-xl"
          >
            {t('hero.lede')}
          </p>

          <div data-rise className="mt-10 flex flex-wrap items-center gap-4 opacity-0">
            <a
              href="#linkage"
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-active)]"
            >
              {t('hero.cta1')}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#core"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-hairline)] px-6 py-3 text-sm font-medium text-[var(--color-body-strong)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              {t('hero.cta2')}
            </a>
          </div>

          <div
            data-rise
            className="mono-label mt-14 flex flex-wrap gap-x-8 gap-y-2 opacity-0"
          >
            <span>RED · BLUE · CTF · POST-EXPLOIT</span>
            <span>Skill · CLI · Coder · MAP · RAGKB · VulnDB</span>
          </div>
        </div>
      </div>
    </section>
  )
}
