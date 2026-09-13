import { useEffect, useRef } from 'react'
import oceanFrame from '../assets/backdrops/hero-ocean.webp'
import mantaImg from '../assets/manta.webp'
import { useLang } from '../i18n/LanguageContext'

/**
 * Site hero: quilled-ocean frame backdrop, quilled manta floating above,
 * and the owner's name + positioning line at the center. Pointer position
 * drives a lerped parallax (backdrop and manta drift in opposite
 * directions); scroll fades the copy. All transforms are GPU-composited.
 */
export function Hero() {
  const { t } = useLang()
  const rootRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const mantaRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let targetX = 0
    let targetY = 0
    let x = 0
    let y = 0

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX / window.innerWidth - 0.5
      targetY = e.clientY / window.innerHeight - 0.5
    }

    const loop = () => {
      x += (targetX - x) * 0.05
      y += (targetY - y) * 0.05
      const scrollY = window.scrollY
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${x * -10}px, ${y * -8 + scrollY * 0.15}px, 0)`
      }
      if (mantaRef.current) {
        mantaRef.current.style.transform = `translate3d(${x * 28}px, ${y * 22 - scrollY * 0.08}px, 0) rotate(${x * 2.4}deg)`
      }
      if (contentRef.current) {
        contentRef.current.style.transform = `translate3d(0, ${scrollY * 0.3}px, 0)`
        contentRef.current.style.opacity = String(Math.max(0, 1 - scrollY / 500))
      }
      raf = requestAnimationFrame(loop)
    }

    root.addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(loop)
    return () => {
      root.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="hero" ref={rootRef}>
      <div className="hero__bg" ref={bgRef}>
        <img src={oceanFrame} alt="" aria-hidden="true" />
        <div className="hero__light" />
      </div>

      <div className="hero__manta" ref={mantaRef}>
        <img src={mantaImg} alt="" aria-hidden="true" />
      </div>

      <div className="hero__content" ref={contentRef}>
        <div className="hero__inner">
          <p className="hero__kicker reveal-blur">{t.site.kicker}</p>
          <h1 className="hero__title">marrviin</h1>
          <p className="hero__tagline reveal-blur">{t.site.tagline}</p>
        </div>
      </div>

      <a className="hero__scroll" href="#project-0" aria-label="Scroll to first project">
        {t.site.scroll}
      </a>
    </section>
  )
}
