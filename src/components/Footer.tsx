import { useApp } from '../context/AppContext'
import { ROOT } from '../data/products'

export default function Footer() {
  const { t } = useApp()
  return (
    <footer className="border-t border-[var(--color-hairline)] bg-[var(--color-surface-soft)]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8" data-reveal-group="100">
        <div className="reveal flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="font-display text-2xl text-[var(--color-ink)]">
              Strike<span className="text-[var(--color-primary)]">Agent</span>
            </div>
            <p className="mt-2 max-w-md text-sm text-[var(--color-body)]">{t('footer.tagline')}</p>
          </div>
          <div className="text-sm text-[var(--color-muted)] sm:text-right">
            <div className="font-mono">{ROOT.version}</div>
            <div className="mt-1">{t('footer.rights')}</div>
            <div className="mt-2">
              <span className="mono-label">{t('footer.author')}</span>{' '}
              <a
                href="https://github.com/Bouquets-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[var(--color-body-strong)] underline decoration-[var(--color-hairline)] underline-offset-4 transition-colors hover:text-[var(--color-primary)] hover:decoration-[var(--color-primary)]"
              >
                Bouquets-ai
              </a>
            </div>
          </div>
        </div>
        <div className="reveal mt-10 border-t border-[var(--color-hairline)] pt-6">
          <p className="mono-label">{ROOT.title}</p>
        </div>
      </div>
    </footer>
  )
}
