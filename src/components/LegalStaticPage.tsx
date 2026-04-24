import type { ReactNode } from 'react'
import { DocumentMeta } from './DocumentMeta'

type LegalStaticPageProps = {
  metaTitle: string
  metaDescription: string
  h1: string
  intro?: string
  children: ReactNode
}

export function LegalStaticPage({ metaTitle, metaDescription, h1, intro, children }: LegalStaticPageProps) {
  return (
    <>
      <DocumentMeta title={metaTitle} description={metaDescription} />
      <main id="main" className="pb-16">
        <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          <header className="border-b border-cream-dark/50 pb-8">
            <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{h1}</h1>
            {intro ? (
              <p className="mt-4 text-sm leading-relaxed text-ink sm:text-base">{intro}</p>
            ) : null}
          </header>
          <div className="legal-prose mt-8 space-y-6 text-base leading-relaxed text-ink sm:text-lg">
            {children}
          </div>
        </article>
      </main>
    </>
  )
}
