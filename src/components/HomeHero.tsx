import type { ReactNode } from 'react'
import { sectionInner, sectionShell } from '../sectionLayout'

const HERO_BG = '/images/hero.jpg'

type HomeHeroProps = {
  children: ReactNode
}

export function HomeHero({ children }: HomeHeroProps) {
  return (
    <section
      className={`flex min-h-[100svh] w-full items-center justify-center overflow-hidden ${sectionShell}`}
      aria-label="פתיחה"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${HERO_BG}')` }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'rgba(255,255,255,0.6)' }}
        aria-hidden
      />
      <div
        className={`relative z-10 flex w-full flex-col items-center justify-center text-center ${sectionInner}`}
      >
        {children}
      </div>
    </section>
  )
}
