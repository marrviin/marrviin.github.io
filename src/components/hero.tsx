import { useEffect, useRef } from 'react'
import { useLang } from '../i18n/language-context'
import { FadeImg } from './fade-img'
import { WaveStrips } from './wave-strips'

/**
 * Site hero: quilled-ocean frame backdrop, quilled manta floating above,
 * and the owner's name + positioning line at the center. Pointer position
 * drives a lerped parallax (backdrop and manta drift in opposite
 * directions); scroll fades the copy. All transforms are GPU-composited.
 *
 * The parallax refs write `style.transform` imperatively — no translate/
 * rotate/scale utilities may land on those elements (Tailwind's independent
 * translate/rotate/scale properties compose with `transform` instead of
 * being overridden).
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
    <section
      className="relative flex min-h-svh items-center overflow-hidden bg-bg max-ocean:items-start"
      ref={rootRef}
    >
      <div className="night-veil absolute inset-[-3%] will-change-transform" ref={bgRef}>
        <FadeImg
          className="img-fade hero-kenburns h-full w-full animate-kenburns object-cover [filter:brightness(1.05)_saturate(1.02)]"
          src="/images/hero-ocean.webp"
          width={1920}
          height={1079}
          fetchPriority="high"
          decoding="async"
          alt=""
          aria-hidden="true"
        />
        <div className="hero-light pointer-events-none absolute inset-0 z-[1] animate-light-drift bg-[radial-gradient(42rem_30rem_at_22%_30%,rgba(214,240,255,0.85),transparent_65%),radial-gradient(50rem_36rem_at_78%_72%,rgba(190,230,250,0.7),transparent_65%)] mix-blend-soft-light" />
      </div>

      <div
        className="absolute top-1/2 right-[6.5vw] mt-[-4%] w-[min(46vw,620px)] [filter:brightness(0.82)_saturate(0.85)_drop-shadow(0_30px_44px_rgba(0,8,16,0.55))_drop-shadow(0_0_26px_rgba(96,205,235,0.2))] will-change-transform max-ocean:top-auto max-ocean:right-[-20vw] max-ocean:bottom-[12vh] max-ocean:mt-0 max-ocean:w-[85vw] max-ocean:[filter:brightness(0.82)_saturate(0.85)_drop-shadow(0_18px_26px_rgba(0,8,16,0.45))_drop-shadow(0_0_18px_rgba(96,205,235,0.16))]"
        ref={mantaRef}
      >
        <img
          className="hero-manta w-full animate-manta"
          src="/images/manta.webp"
          width={1200}
          height={1019}
          decoding="async"
          alt=""
          aria-hidden="true"
        />
      </div>

      <div
        className="relative z-[1] flex-1 will-change-[transform,opacity] max-ocean:w-full"
        ref={contentRef}
      >
        <div className="mx-auto w-[min(780px,92vw)] max-ocean:pt-28">
          <h1 className="title-sheen font-display text-[clamp(2.4rem,5.8vw,4.4rem)] leading-[1.02] font-bold tracking-[-0.03em]">
            Welcome to marrviin.github.io
          </h1>
          <WaveStrips className="wave-strips reveal-blur mt-[1.7rem] block w-[172px] overflow-visible" />
        </div>
      </div>

      <a
        className="hero-scroll absolute bottom-4 left-1/2 z-[1] -translate-x-1/2 animate-bob text-xl text-paper-edge [text-shadow:0_1px_8px_rgba(12,51,77,0.5)]"
        href="#project-0"
        aria-label="Scroll to first project"
      >
        {t.site.scroll}
      </a>
    </section>
  )
}
