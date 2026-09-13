import { useEffect, useRef } from 'react'
import mantaImg from '../assets/manta.webp'

/** The four quilled-ocean backdrops, keyed so a band and its manta
 *  anchor can never drift apart. */
export type Backdrop = 'light' | 'wave' | 'deep' | 'curl'

interface DividerProps {
  image: string
  /** Which backdrop this band shows — picks the manta anchor & phases. */
  backdrop: Backdrop
}

/**
 * Manta anchor per backdrop, in IMAGE coordinates (u,v = fraction of the
 * artwork's width/height), hand-picked over each painting's open water:
 * light → centre of the light shafts, wave → pale lagoon upper-left,
 * deep → middle of the canyon, curl → still water inside the curl.
 * `face` points the manta toward the open water. The render loop maps
 * these through the object-fit:cover crop (natural size 1920×1078), so
 * the manta stays glued to its spot in the painting at any viewport
 * size and any scroll position.
 */
const SPOTS: Record<Backdrop, { u: number; v: number; face: 1 | -1 }> = {
  light: { u: 0.4, v: 0.45, face: 1 },
  wave: { u: 0.3, v: 0.42, face: 1 },
  deep: { u: 0.47, v: 0.42, face: -1 },
  curl: { u: 0.52, v: 0.46, face: -1 },
}

/** Per-backdrop motion/wave phase offset. */
const SEED: Record<Backdrop, number> = { light: 0, wave: 1, deep: 2, curl: 3 }

/** Natural size of the backdrop art, for the cover-crop math. */
const ART_W = 1920
const ART_H = 1078

/**
 * One smooth wave line across the band's edge, as an SVG fill path in a
 * 1440×72 viewBox (stretched to the band width). `top` fills from the
 * top edge down to the curve, otherwise from the bottom edge up. `off`
 * shifts the curve so a second layer can peek out beneath — two layers
 * read as stacked quilling paper strips. `phase` varies the waveform
 * per band.
 */
function wavePath(phase: number, top: boolean, off: number): string {
  const W = 1440
  const H = 72
  const amp = 15
  const lambda = 560
  const mid = (top ? 30 : 42) + (top ? off : -off)
  const yAt = (x: number) => mid + Math.sin((x / lambda) * Math.PI * 2 + phase) * amp
  const pts: Array<[number, number]> = []
  for (let x = 0; x <= W; x += 48) pts.push([x, yAt(x)])
  // quadratic smoothing through segment midpoints
  let d = `M0 ${top ? 0 : H} L${pts[0][0]} ${pts[0][1].toFixed(1)}`
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2
    const my = (pts[i][1] + pts[i + 1][1]) / 2
    d += ` Q${pts[i][0]} ${pts[i][1].toFixed(1)} ${mx} ${my.toFixed(1)}`
  }
  const [lx, ly] = pts[pts.length - 1]
  d += ` L${lx} ${ly.toFixed(1)} L${W} ${top ? 0 : H} Z`
  return d
}

/**
 * Full-bleed quilled-ocean band between project sections, in the same
 * spirit as the hero: each band's manta rests at an anchor spot over
 * the painting's open water and simply drifts — a slow wander and
 * gentle rise/fall, no deformation — while the backdrop does the heavy
 * parallax against the scroll. Wavy paper edges (two-layer quilling
 * strips) top and tail the band so it doesn't read as a plain rectangle.
 */
export function ParallaxDivider({ image, backdrop }: DividerProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const mantaRef = useRef<HTMLImageElement>(null)
  // [top tint, top face, bottom tint, bottom face] — animated every frame
  const waveRefs = useRef<Array<SVGPathElement | null>>([null, null, null, null])

  useEffect(() => {
    const root = rootRef.current
    if (!root || !imgRef.current || !mantaRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const seed = SEED[backdrop]
    let raf = 0

    const render = (now: number) => {
      const rect = root.getBoundingClientRect()
      const vh = window.innerHeight
      const bandW = rect.width
      const bandH = rect.height
      // progress 0 → band enters at bottom, 1 → fully exited top
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)))
      // backdrop is 170% tall; sweep most of the overflow for strong parallax
      const ty = (progress - 0.5) * -0.55 * bandH
      const t = now / 1000

      const img = imgRef.current
      if (img) {
        img.style.transform = `translate3d(0, ${ty}px, 0)`
      }

      const manta = mantaRef.current
      if (manta) {
        const spot = SPOTS[backdrop]
        // object-fit: cover — scale to fill bandW × 1.7·bandH, centre crop
        const scale = Math.max(bandW / ART_W, (bandH * 1.7) / ART_H)
        const cropX = (ART_W * scale - bandW) / 2
        // slow wander around the anchor, tiny tilt with the rise/fall —
        // same feel as the hero's bob, no scale/flap distortion
        const driftX = Math.sin(t * 0.24 + seed * 5.1) * 20
        const driftY = Math.cos(t * 0.3 + seed * 3.7) * 16
        const tilt = Math.sin(t * 0.3 + seed * 3.7) * 2
        const depth = (progress - 0.5) * 30
        // anchor is the manta's centre; translate positions its top-left,
        // so subtract half its rendered box (width clamp 200–400px, art 1200×1019)
        const mw = Math.min(400, Math.max(200, bandW * 0.24))
        const mh = mw * (1019 / 1200)
        const x = spot.u * ART_W * scale - cropX - mw / 2 + driftX
        const y = -0.35 * bandH + spot.v * ART_H * scale - mh / 2 + ty + driftY + depth
        manta.style.transform =
          `translate3d(${x}px, ${y}px, 0)` +
          ` rotate(${tilt * spot.face}deg) scaleX(${spot.face})`
      }

      // living water: the paper-wave edges slowly drift, top and bottom
      // in opposite directions, so the band never sits still
      const [topTint, topFace, botTint, botFace] = waveRefs.current
      if (topTint && topFace && botTint && botFace) {
        const wp = t * 0.22
        topTint.setAttribute('d', wavePath(phase + 0.5 + wp, true, 16))
        topFace.setAttribute('d', wavePath(phase + wp, true, 0))
        botTint.setAttribute('d', wavePath(phase + 1.7 - wp, false, 16))
        botFace.setAttribute('d', wavePath(phase + 2.4 - wp, false, 0))
      }
    }

    // rAF only while the band is on screen — no idle spinning
    const loop = (now: number) => {
      render(now)
      raf = requestAnimationFrame(loop)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && raf === 0) {
          raf = requestAnimationFrame(loop)
        } else if (!entry.isIntersecting && raf !== 0) {
          cancelAnimationFrame(raf)
          raf = 0
        }
      },
      { rootMargin: '10% 0px' },
    )
    observer.observe(root)
    return () => {
      observer.disconnect()
      if (raf !== 0) cancelAnimationFrame(raf)
    }
  }, [backdrop])

  const phase = SEED[backdrop] * 2.3

  return (
    <div className="divider" ref={rootRef} aria-hidden="true">
      <div className="divider__frame">
        <img ref={imgRef} className="divider__bg" src={image} alt="" loading="lazy" />
        <img ref={mantaRef} className="divider__manta" src={mantaImg} alt="" loading="lazy" />
      </div>
      {/* two-layer wavy paper edges; the artwork slides in behind them */}
      <svg className="divider__wave divider__wave--top" viewBox="0 0 1440 72" preserveAspectRatio="none">
        <path ref={(el) => { waveRefs.current[0] = el }} d={wavePath(phase + 0.5, true, 16)} fill="var(--wave-tint)" />
        <path ref={(el) => { waveRefs.current[1] = el }} d={wavePath(phase, true, 0)} fill="var(--bg)" />
      </svg>
      <svg className="divider__wave divider__wave--bottom" viewBox="0 0 1440 72" preserveAspectRatio="none">
        <path ref={(el) => { waveRefs.current[2] = el }} d={wavePath(phase + 1.7, false, 16)} fill="var(--wave-tint)" />
        <path ref={(el) => { waveRefs.current[3] = el }} d={wavePath(phase + 2.4, false, 0)} fill="var(--bg)" />
      </svg>
    </div>
  )
}
