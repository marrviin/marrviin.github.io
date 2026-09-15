import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import type { Project } from '../data/projects'
import { useLang } from '../i18n/language-context'
import { useReveal } from '../hooks/use-reveal'
import { FadeImg } from './fade-img'
import { IconDownload, IconGithub, IconLaunch } from './icons'

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

/** Shared pointer handlers: 3D tilt + sheen position on a card. The
 *  transform is written imperatively — no transform utilities on the card. */
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
      <path className="stroke-accent" d={d} strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
  )
}

/**
 * A stack of app screenshots styled as overlapping paper cards. Click /
 * Enter sends the top card to the back of the deck and the next one
 * slides up — the layered offsets are pure CSS transitions, so the
 * shuffle reads as one fluid motion. Falls back to a single framed
 * screenshot when there's only one shot.
 */
function ShotDeck({
  name,
  shots,
  lang,
}: {
  name: string
  shots: readonly string[]
  lang: 'en' | 'zh'
}) {
  const [top, setTop] = useState(0)
  const n = shots.length
  const advance = () => setTop((v) => (v + 1) % n)

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      advance()
    }
  }

  if (n === 1) {
    return (
      <figure className="sheen relative overflow-hidden rounded-[14px] border border-edge bg-panel shadow-paper">
        <FadeImg
          className="img-fade block aspect-video w-full object-cover object-top"
          src={shots[0]}
          width={1440}
          height={810}
          alt={`${name} ${lang === 'zh' ? '应用界面' : 'app UI'}`}
          loading="lazy"
        />
      </figure>
    )
  }

  return (
    <div className="grid justify-items-center gap-[0.9rem]">
      <div
        className="relative aspect-video w-full cursor-pointer outline-none [-webkit-tap-highlight-color:transparent] focus-visible:rounded-[14px] focus-visible:shadow-[0_0_0_2px_var(--color-accent)]"
        role="button"
        tabIndex={0}
        onClick={advance}
        onKeyDown={onKeyDown}
        aria-label={`${name} ${lang === 'zh' ? '截图，点击切换' : 'screenshots, click to shuffle'}`}
      >
        {shots.map((s, i) => {
          // layers from the top: 0 = front card, 1 = next beneath, …
          const off = (i - top + n) % n
          return (
            <figure
              key={i}
              className="shot-deck__card sheen absolute inset-0 overflow-hidden rounded-[14px] border border-edge bg-panel shadow-paper transition-[transform,filter] duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
              data-off={Math.min(off, 2)}
              style={{ zIndex: n - off }}
            >
              <FadeImg
                className="img-fade h-full w-full object-cover object-top"
                src={s}
                width={1440}
                height={810}
                alt={`${name} ${lang === 'zh' ? '应用界面' : 'app UI'} ${i + 1}`}
                loading="lazy"
              />
            </figure>
          )
        })}
      </div>
      <div className="flex gap-[0.45rem]" aria-hidden="true">
        {shots.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-[background-color,scale] duration-300 ${
              i === top ? 'scale-125 bg-accent' : 'bg-[rgba(140,210,235,0.3)]'
            }`}
          />
        ))}
      </div>
    </div>
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
  // the hero section is nth-of-type(1), so even-index showcases mirror
  const mirrored = index % 2 === 0

  return (
    <section
      id={`project-${index}`}
      className="reveal relative flex min-h-svh [scroll-margin-top:2.5rem] items-center bg-bg py-[clamp(4rem,8vw,6rem)]"
      ref={ref}
    >
      <div
        className={`mx-auto grid w-[min(1160px,92vw)] items-center gap-[clamp(2.5rem,6vw,5rem)] max-ocean:grid-cols-1 ${
          mirrored ? 'grid-cols-[0.95fr_1.05fr]' : 'grid-cols-[1.05fr_0.95fr]'
        }`}
      >
        <div className={mirrored ? 'order-2 max-ocean:order-none' : ''}>
          <span
            className="block font-display text-[clamp(3.6rem,7vw,6rem)] leading-none font-bold text-transparent [-webkit-text-stroke:2px_rgba(79,196,232,0.35)]"
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <h2 className="mt-[0.6rem] font-display text-[clamp(2.4rem,5vw,4rem)] font-bold tracking-[-0.02em] text-accent-deep">
            {project.name}
          </h2>
          <p className="mt-[1.1rem] max-w-[34em] text-[clamp(1rem,1.4vw,1.15rem)] text-ink-muted">
            {project.tagline[lang]}
          </p>
          {project.highlights && (
            <ul className="mt-[1.8rem] grid gap-[0.9rem]">
              {project.highlights[lang].map((h) => (
                <li
                  key={h}
                  className="relative pl-[1.6rem] text-[1.02rem] text-ink-muted before:absolute before:top-[0.42em] before:left-0 before:size-[0.85rem] before:rounded-full before:border-[3px] before:border-accent before:opacity-70"
                >
                  {h}
                </li>
              ))}
            </ul>
          )}
          <ul className="mt-[1.8rem] flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li
                key={s}
                className="rounded-full border border-edge bg-[rgba(13,40,58,0.6)] px-[0.85rem] py-[0.3rem] font-mono text-[0.75rem] text-ink-muted"
              >
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-[0.8rem]">
            {project.website && (
              <MagnetLink
                fancy={fancy}
                className="inline-flex items-center gap-2 rounded-full border border-accent bg-accent px-6 py-[0.7rem] text-[0.9rem] font-medium text-on-accent transition-colors duration-300 hover:border-[#7ad5f1] hover:bg-[#7ad5f1] [&>svg]:shrink-0 [&>svg]:opacity-85 hover:[&>svg]:opacity-100"
                href={project.website}
              >
                <IconLaunch />
                {t.project.links.website}
              </MagnetLink>
            )}
            {project.download && (
              <MagnetLink
                fancy={fancy}
                className="inline-flex items-center gap-2 rounded-full border border-edge bg-[rgba(13,40,58,0.65)] px-6 py-[0.7rem] text-[0.9rem] text-ink transition-colors duration-300 hover:border-accent [&>svg]:shrink-0 [&>svg]:opacity-85 hover:[&>svg]:opacity-100"
                href={project.download}
              >
                <IconDownload />
                {t.project.links.download}
              </MagnetLink>
            )}
            {project.repo && (
              <MagnetLink
                fancy={fancy}
                className="inline-flex items-center gap-2 rounded-full border border-edge bg-[rgba(13,40,58,0.65)] px-6 py-[0.7rem] text-[0.9rem] text-ink transition-colors duration-300 hover:border-accent [&>svg]:shrink-0 [&>svg]:opacity-85 hover:[&>svg]:opacity-100"
                href={project.repo}
              >
                <IconGithub />
                {t.project.links.source}
              </MagnetLink>
            )}
          </div>
        </div>

        <div className="[perspective:1100px] max-ocean:max-w-[520px]">
          {project.shots ? (
            <ShotDeck name={project.name} shots={project.shots} lang={lang} />
          ) : (
            <div
              className="sheen relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[14px] border border-edge bg-[linear-gradient(150deg,#10314a_0%,#0b2438_60%,rgba(9,28,44,0.55)_100%)] shadow-paper transition-transform duration-[180ms] will-change-transform"
              aria-hidden="true"
              {...tilt}
            >
              <Coil className="showcase-coil absolute w-[72%] animate-coil-spin opacity-[0.16]" />
              <span className="font-display text-[clamp(5rem,10vw,8.5rem)] font-bold text-accent-deep opacity-85">
                {project.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
