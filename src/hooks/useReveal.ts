import { useEffect } from 'react'

/**
 * Scroll-reveal. Any element with the `.reveal` class slides + fades into place
 * the first time it enters the viewport.
 *
 * - Direction is set with `data-reveal="up" | "left" | "right"` (default up).
 * - Cascades: put `data-reveal-group` on a wrapper and its descendant `.reveal`
 *   elements get an incremental `transition-delay` (override the step in ms via
 *   `data-reveal-group="120"`), so a block's pieces glide in one after another.
 */
export function useReveal() {
  useEffect(() => {
    // assign staggered delays within each group, in document order
    document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
      const step = Number(group.dataset.revealGroup) || 90
      group.querySelectorAll<HTMLElement>('.reveal').forEach((item, i) => {
        item.style.setProperty('--reveal-delay', `${i * step}ms`)
      })
    })

    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))

    if (!('IntersectionObserver' in window) || els.length === 0) {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' },
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}
