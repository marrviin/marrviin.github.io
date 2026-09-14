import { Fragment } from 'react'
import { Hero } from './components/hero'
import { ProjectShowcase } from './components/project-showcase'
import { ParallaxDivider } from './components/parallax-divider'
import { Footer } from './components/footer'
import { LanguageToggle } from './components/language-toggle'
import { WaveStrips } from './components/wave-strips'
import { useLang } from './i18n/language-context'
import { publishedProjects } from './data/projects'
import dividerLight from './assets/backdrops/divider-light.webp'
import dividerWave from './assets/backdrops/divider-wave.webp'
import dividerDeep from './assets/backdrops/divider-deep.webp'
import dividerCurl from './assets/backdrops/divider-curl.webp'
import type { Backdrop } from './components/parallax-divider'

/** Backdrop per band position — image and manta anchor travel together. */
const dividers: ReadonlyArray<{ image: string; backdrop: Backdrop }> = [
  { image: dividerLight, backdrop: 'light' },
  { image: dividerWave, backdrop: 'wave' },
  { image: dividerDeep, backdrop: 'deep' },
  { image: dividerCurl, backdrop: 'curl' },
]

export default function App() {
  const { t } = useLang()
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-[1.1rem]">
        <a
          className="rounded-full border border-edge bg-[rgba(7,24,38,0.55)] px-[0.9rem] py-2 font-display text-[1.05rem] font-bold tracking-[0.02em] text-ink backdrop-blur-[10px]"
          href="/"
        >
          marrviin
        </a>
        <LanguageToggle />
      </header>
      <main>
        <Hero />
        {publishedProjects.map((p, i) => (
          <Fragment key={p.name}>
            <ProjectShowcase project={p} index={i} />
            {/* a divider trails every showcase, so the page always closes
                with a band before the footer */}
            <ParallaxDivider
              image={dividers[i % dividers.length].image}
              backdrop={dividers[i % dividers.length].backdrop}
            />
          </Fragment>
        ))}

        {/* quiet coda between the last band and the footer — a hint that
            more is on the way, with room to breathe around it */}
        <section className="flex min-h-[580px] flex-col items-center justify-center px-6 pt-8 pb-[clamp(4rem,10vh,7rem)] text-center">
          <WaveStrips className="wave-strips block w-[118px] overflow-visible opacity-75" />
          <p className="mt-[1.4rem] text-[clamp(0.95rem,1.5vw,1.1rem)] tracking-[0.05em] text-ink-faint">
            {t.site.more}
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}
