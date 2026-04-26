import type { ReactNode } from 'react'
import { DocumentMeta } from './DocumentMeta'
import { sectionDescClass, sectionInner, sectionShell, sectionTitleToContentClass } from '../sectionLayout'

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
        <article className={`${sectionShell} ${sectionInner} max-w-3xl`}>
          <div className="flex flex-col gap-6">
            <header className="border-b border-cream-dark/50 pb-6">
              <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{h1}</h1>
              {intro ? <p className={`${sectionDescClass} ${sectionTitleToContentClass}`}>{intro}</p> : null}
            </header>
            <div
              className={`legal-prose flex flex-col gap-6 text-base leading-relaxed text-ink sm:text-lg ${sectionTitleToContentClass}`}
            >
              {children}
            </div>
          </div>
        </article>
      </main>
    </>
  )
}
