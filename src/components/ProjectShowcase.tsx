import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react'
import type { Project } from '../data/projects'
import { useLang } from '../i18n/LanguageContext'
import { useReveal } from '../hooks/useReveal'

/** Fine pointer + motion allowed — gates the tilt/magnetic flourishes. */
function useFancyPointer() {
  const ok = useRef(false)
  useEffect(() => {
    ok.current =
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])
  return ok
}

/** Shared pointer handlers: 3D tilt + sheen position on a card. */
function useCardTilt(fancy: ReturnType<typeof useFancyPointer>) {
  return {
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      if (!fancy.current) return
      const el = e.currentTarget
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`)
      el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`)
      el.style.transform =
        `perspective(1100px) rotateY(${((px - 0.5) * 7).toFixed(2)}deg)` +
        ` rotateX(${((0.5 - py) * 7).toFixed(2)}deg)`
    },
    onPointerLeave: (e: PointerEvent<HTMLElement>) => {
      e.currentTarget.style.transform = ''
    },
  }
}

/** Link button with a slight magnetic pull toward the pointer. */
function MagnetLink({
  fancy,
  className,
  href,
  children,
}: {
  fancy: ReturnType<typeof useFancyPointer>
  className?: string
  href: string
  children: ReactNode
}) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noreferrer"
      onPointerMove={(e) => {
        if (!fancy.current) return
        const r = e.currentTarget.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        e.currentTarget.style.transform = `translate(${(dx * 0.12).toFixed(1)}px, ${(dy * 0.22).toFixed(1)}px)`
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.transform = ''
      }}
    >
      {children}
    </a>
  )
}

/** Small decorative quilling spiral (inline SVG). */
export function Coil({ className }: { className?: string }) {
  const turns = 3.2
  const steps = 90
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * turns * Math.PI * 2
    const r = 2.2 * theta
    const x = 50 + Math.cos(theta) * r
    const y = 50 + Math.sin(theta) * r
    d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1)
  }
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d={d} stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
  )
}

interface ShowcaseProps {
  project: Project
  index: number
}

/**
 * One full-screen showcase per project: oversized index + name, tagline,
 * optional highlights, tech tags, links, and an optional language-aware
 * app screenshot. Layout mirrors on every second section. Projects
 * without a screenshot get a typographic panel with a quilling coil.
 */
export function ProjectShowcase({ project, index }: ShowcaseProps) {
  const { t, lang } = useLang()
  const ref = useReveal<HTMLElement>()
  const fancy = useFancyPointer()
  const tilt = useCardTilt(fancy)

  return (
    <section id={`project-${index}`} className="showcase reveal" ref={ref}>
      <div className="showcase__inner">
        <div className="showcase__text">
          <span className="showcase__index" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h2 className="showcase__name">{project.name}</h2>
          <p className="showcase__tagline">{project.tagline[lang]}</p>
          {project.highlights && (
            <ul className="showcase__list">
              {project.highlights[lang].map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
          <ul className="showcase__tech">
            {project.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <div className="showcase__links">
            {project.website && (
              <MagnetLink fancy={fancy} className="btn btn--solid" href={project.website}>
                {t.project.links.website} ↗
              </MagnetLink>
            )}
            {project.download && (
              <MagnetLink fancy={fancy} className="btn" href={project.download}>
                {t.project.links.download} ↓
              </MagnetLink>
            )}
            {project.repo && (
              <MagnetLink fancy={fancy} className="btn" href={project.repo}>
                {t.project.links.source} ↗
              </MagnetLink>
            )}
          </div>
        </div>

        <div className="showcase__visual">
          {project.shot ? (
            <figure className="showcase__shot" {...tilt}>
              <img src={project.shot[lang]} alt={`${project.name} ${lang === 'zh' ? '应用界面' : 'app UI'}`} loading="lazy" />
            </figure>
          ) : (
            <div className="showcase__panel" aria-hidden="true" {...tilt}>
              <Coil className="showcase__coil" />
              <span className="showcase__initial">{project.name.charAt(0)}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
