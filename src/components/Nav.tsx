import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { ROOT } from '../data/products'

const links: { id: string; key: Parameters<ReturnType<typeof useApp>['t']>[0] }[] = [
  { id: 'linkage', key: 'nav.agent' },
  { id: 'core', key: 'nav.core' },
]

export default function Nav() {
  const { t, theme, lang, toggleTheme, toggleLang } = useApp()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScrollWin = () => setScrolled(window.scrollY > 24)
    onScrollWin()
    window.addEventListener('scroll', onScrollWin, { passive: true })
    return () => window.removeEventListener('scroll', onScrollWin)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-[var(--color-hairline)] bg-[color-mix(in_srgb,var(--color-canvas)_82%,transparent)] backdrop-blur-md'
          : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="group flex items-baseline gap-2">
          <span className="font-display text-xl tracking-tight text-[var(--color-ink)]">
            Strike<span className="text-[var(--color-primary)]">Agent</span>
          </span>
          <span className="stamp hidden rounded px-1.5 py-0.5 text-[10px] sm:inline-block">
            {ROOT.version}
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
            >
              {t(l.key)}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLang}
            aria-label={t('a11y.lang')}
            className="flex h-9 items-center rounded-full border border-[var(--color-hairline)] px-3 font-mono text-xs font-medium text-[var(--color-body)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            {lang === 'en' ? '中文' : 'EN'}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={t('a11y.theme')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-hairline)] text-[var(--color-body)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </nav>
    </header>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}
