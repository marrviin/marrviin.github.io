import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { en, type Dict } from './en'
import { zh } from './zh'

type Lang = 'en' | 'zh'

const STORAGE_KEY = 'preferred-lang'
const dictionaries: Record<Lang, Dict> = { en, zh }

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'zh') return saved
  } catch {
    // storage unavailable (e.g. private mode) — fall through
  }
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

const LanguageContext = createContext<{
  lang: Lang
  t: Dict
  toggle: () => void
} | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // ignore — persistence is best-effort
    }
  }, [lang])

  const toggle = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'zh' : 'en'))
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, t: dictionaries[lang], toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
