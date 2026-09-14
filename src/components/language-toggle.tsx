import { useLang } from '../i18n/language-context'

export function LanguageToggle() {
  const { lang, toggle } = useLang()

  return (
    <button
      type="button"
      className="inline-flex cursor-pointer items-center gap-[0.35rem] rounded-full border border-edge bg-[rgba(7,24,38,0.55)] px-[0.9rem] py-[0.45rem] font-body text-[0.85rem] tracking-[0.04em] text-ink-faint backdrop-blur-[10px] transition-colors duration-300 hover:border-accent"
      onClick={toggle}
      aria-label={lang === 'en' ? 'Switch to Chinese' : '切换到英文'}
    >
      <span className={lang === 'en' ? 'text-accent' : ''}>EN</span>
      <span className="opacity-40">/</span>
      <span className={lang === 'zh' ? 'text-accent' : ''}>中</span>
    </button>
  )
}
