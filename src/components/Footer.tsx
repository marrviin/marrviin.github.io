import { useLang } from '../i18n/LanguageContext'

export function Footer() {
  const { t } = useLang()
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <p>
          © {year} Marvin Pan · {t.footer.rights}
        </p>
        <p className="footer__meta">
          {t.footer.built} · <a href="https://github.com/marrviin" target="_blank" rel="noreferrer">GitHub ↗</a>
        </p>
      </div>
    </footer>
  )
}
