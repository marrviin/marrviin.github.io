import { useLang } from '../i18n/language-context'
import { publishedProjects as projects } from '../data/projects'
import submarineImg from '../assets/submarine.webp'

/**
 * Static two-layer quilled wave seam for the footer's top edge — same
 * strip math as the divider edges, but at rest (the footer is a place
 * to stop moving). `off` offsets the second layer so it peeks beneath.
 */
function waveSeam(off: number): string {
  const W = 1440
  const H = 72
  const amp = 15
  const lambda = 560
  const mid = 42 - off
  const pts: Array<[number, number]> = []
  for (let x = 0; x <= W; x += 48)
    pts.push([x, mid + Math.sin((x / lambda) * Math.PI * 2 + 1.3) * amp])
  let d = `M0 ${H} L${pts[0][0]} ${pts[0][1].toFixed(1)}`
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2
    const my = (pts[i][1] + pts[i + 1][1]) / 2
    d += ` Q${pts[i][0]} ${pts[i][1].toFixed(1)} ${mx} ${my.toFixed(1)}`
  }
  const [lx, ly] = pts[pts.length - 1]
  return d + ` L${lx} ${ly.toFixed(1)} L${W} ${H} Z`
}

export function Footer() {
  const { t } = useLang()
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-[#050f18] pt-12 pb-16 text-ink-muted">
      {/* quilled seam between the page and the footer */}
      <svg
        className="pointer-events-none absolute bottom-full left-0 block h-[clamp(38px,7vh,72px)] w-full"
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path className="fill-wave-tint" d={waveSeam(16)} />
        <path className="fill-[#050f18]" d={waveSeam(0)} />
      </svg>

      <div className="mx-auto grid w-[min(1120px,92vw)] grid-cols-[1.4fr_1fr_1fr] gap-[clamp(2rem,5vw,4rem)] max-ocean:grid-cols-1 max-ocean:gap-8">
        <div>
          <p className="font-display text-[1.3rem] font-bold tracking-[0.02em] text-ink">
            marrviin
          </p>
          <p className="mt-[0.55rem] text-[0.82rem] text-ink-faint">
            © {year} Marvin Pan · {t.footer.rights}
          </p>
          <img
            className="footer-sub mt-4 block w-[min(230px,70%)] animate-sub-hover [filter:drop-shadow(0_16px_24px_rgba(0,8,16,0.45))]"
            src={submarineImg}
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
        </div>

        <nav aria-label={t.footer.nav}>
          <p className="mb-4 text-[0.78rem] font-medium tracking-[0.18em] text-accent uppercase">
            {t.footer.nav}
          </p>
          <ul className="grid gap-[0.55rem] text-[0.92rem]">
            {projects.map((p, i) => (
              <li key={p.name}>
                {p.repo ? (
                  <a
                    className="transition-colors duration-300 hover:text-accent"
                    href={p.repo}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {p.name} ↗
                  </a>
                ) : (
                  <a
                    className="transition-colors duration-300 hover:text-accent"
                    href={`#project-${i}`}
                  >
                    {p.name}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-4 text-[0.78rem] font-medium tracking-[0.18em] text-accent uppercase">
            {t.footer.elsewhere}
          </p>
          <ul className="grid gap-[0.55rem] text-[0.92rem]">
            <li>
              <a
                className="transition-colors duration-300 hover:text-accent"
                href="https://github.com/marrviin"
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>
            </li>
            <li>
              <a
                className="transition-colors duration-300 hover:text-accent"
                href="https://github.com/marrviin/marrviin.github.io"
                target="_blank"
                rel="noreferrer"
              >
                {t.footer.siteSource} ↗
              </a>
            </li>
            <li>
              <button
                type="button"
                className="cursor-pointer text-ink-muted transition-colors duration-300 hover:text-accent"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                {t.footer.top} ↑
              </button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
