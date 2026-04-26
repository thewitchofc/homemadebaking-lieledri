import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getArticleBySlug } from '../articlesData'
import { DocumentMeta } from '../components/DocumentMeta'
import { defaultWaMessage, site } from '../siteConfig'
import { WaButton } from '../components/WaButton'
import {
  sectionBodyClass,
  sectionDescClass,
  sectionInner,
  sectionShell,
  sectionTitleClass,
  sectionTitleToContentClass,
} from '../sectionLayout'

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const article = slug ? getArticleBySlug(slug) : undefined

  if (!article) {
    return <Navigate to="/articles" replace />
  }

  return (
    <main id="main" className="pb-16">
      <DocumentMeta title={`${article.title} | ${site.brandHe}`} description={article.excerpt} />
      <article className={`border-b border-cream-dark/50 bg-cream-dark/20 ${sectionShell}`}>
        <div className={`${sectionInner} max-w-3xl`}>
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-gold-deep underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
          >
            <ArrowRight className="size-4 rotate-180" aria-hidden />
            חזרה לכל המאמרים
          </Link>
          <h1 className={`${sectionTitleClass} ${sectionTitleToContentClass}`}>{article.title}</h1>
          <p className={`${sectionDescClass} mt-2`}>{article.excerpt}</p>
        </div>
      </article>

      <section className={sectionShell} aria-labelledby="article-body-heading">
        <div className={`${sectionInner} max-w-3xl`}>
          <h2 id="article-body-heading" className="sr-only">
            תוכן המאמר
          </h2>
          <div className={sectionBodyClass}>
            <div className="prose-article flex flex-col gap-6 text-base leading-relaxed text-ink sm:text-lg">
              {article.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="rounded-2xl border border-cream-dark bg-cream p-6 text-center sm:p-8">
              <p className={sectionTitleClass}>רוצים לתאם קינוח לתאריך שלכם?</p>
              <p className={`${sectionDescClass} ${sectionTitleToContentClass}`}>
                נקודת איסוף: {site.pickupAddress} · ימי אספקה טיפוסיים: {site.orderDays}
              </p>
              <div
                className={`${sectionBodyClass} ${sectionTitleToContentClass} items-center sm:flex-row sm:justify-center`}
              >
                <WaButton message={defaultWaMessage}>שלחו הודעה בוואטסאפ</WaButton>
                <Link
                  to="/order"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-cocoa/25 px-6 py-3 text-sm font-semibold text-ink transition hover:border-gold-deep hover:text-gold-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
                >
                  לתפריט המתוקים
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
