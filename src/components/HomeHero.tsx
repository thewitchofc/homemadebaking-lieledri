import type { ReactNode } from 'react'

const HERO_BG = '/images/hero.jpg'

type HomeHeroProps = {
  children: ReactNode
}

export function HomeHero({ children }: HomeHeroProps) {
  return (
    <section
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden border-b border-cream-dark/60"
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
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-5 pb-24 pt-16 text-center sm:px-8 sm:pt-20">
        {children}
      </div>
    </section>
  )
}
