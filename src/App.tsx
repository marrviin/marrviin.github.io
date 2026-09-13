import { Fragment } from 'react'
import { Hero } from './components/Hero'
import { ProjectShowcase } from './components/ProjectShowcase'
import { ParallaxDivider } from './components/ParallaxDivider'
import { Footer } from './components/Footer'
import { LanguageToggle } from './components/LanguageToggle'
import { projects } from './data/projects'
import dividerLight from './assets/backdrops/divider-light.webp'
import dividerWave from './assets/backdrops/divider-wave.webp'
import dividerDeep from './assets/backdrops/divider-deep.webp'
import dividerCurl from './assets/backdrops/divider-curl.webp'
import type { Backdrop } from './components/ParallaxDivider'

/** Backdrop per band position — image and manta anchor travel together. */
const dividers: ReadonlyArray<{ image: string; backdrop: Backdrop }> = [
  { image: dividerLight, backdrop: 'light' },
  { image: dividerWave, backdrop: 'wave' },
  { image: dividerDeep, backdrop: 'deep' },
  { image: dividerCurl, backdrop: 'curl' },
]

export default function App() {
  return (
    <>
      <header className="topbar">
        <a className="topbar__wordmark" href="/">
          marrviin
        </a>
        <LanguageToggle />
      </header>
      <main>
        <Hero />
        {projects.map((p, i) => (
          <Fragment key={p.name}>
            <ProjectShowcase project={p} index={i} />
            {i < projects.length - 1 && (
              <ParallaxDivider
                image={dividers[i % dividers.length].image}
                backdrop={dividers[i % dividers.length].backdrop}
              />
            )}
          </Fragment>
        ))}
      </main>
      <Footer />
    </>
  )
}
