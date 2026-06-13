import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { t as translate, type I18nKey, type Lang, type Theme } from '../i18n'

type AppContextValue = {
  lang: Lang
  theme: Theme
  toggleLang: () => void
  toggleTheme: () => void
  t: (key: I18nKey) => string
  /** Pick the right side of a bilingual `{ en, zh }` value. */
  tx: (value: { en: string; zh: string }) => string
}

const AppContext = createContext<AppContextValue | null>(null)

const LANG_KEY = 'strikeagent.lang'
const THEME_KEY = 'strikeagent.theme'

function readStored<T extends string>(key: string, fallback: T, allowed: readonly T[]): T {
  if (typeof window === 'undefined') return fallback
  const v = window.localStorage.getItem(key) as T | null
  return v && allowed.includes(v) ? v : fallback
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => readStored(LANG_KEY, 'en', ['en', 'zh']))
  const [theme, setTheme] = useState<Theme>(() => readStored(THEME_KEY, 'light', ['light', 'dark']))

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    root.style.colorScheme = theme
    window.localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en')
    window.localStorage.setItem(LANG_KEY, lang)
  }, [lang])

  const toggleLang = useCallback(() => setLang((l) => (l === 'en' ? 'zh' : 'en')), [])
  const toggleTheme = useCallback(() => setTheme((th) => (th === 'light' ? 'dark' : 'light')), [])

  const value = useMemo<AppContextValue>(
    () => ({
      lang,
      theme,
      toggleLang,
      toggleTheme,
      t: (key) => translate(key, lang),
      tx: (v) => v[lang],
    }),
    [lang, theme, toggleLang, toggleTheme],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within <AppProvider>')
  return ctx
}
