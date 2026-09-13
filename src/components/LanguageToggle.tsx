import { useLang } from '../i18n/LanguageContext'

export function LanguageToggle() {
  const { lang, toggle } = useLang()

  return (
    <button
      type="button"
      className="lang-toggle"
      onClick={toggle}
      aria-label={lang === 'en' ? 'Switch to Chinese' : '切换到英文'}
    >
      <span className={lang === 'en' ? 'is-active' : ''}>EN</span>
      <span className="lang-toggle__divider">/</span>
      <span className={lang === 'zh' ? 'is-active' : ''}>中</span>
    </button>
  )
}
