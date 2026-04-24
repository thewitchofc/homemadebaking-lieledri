import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getArticleBySlug } from '../articlesData'
import { DocumentMeta } from '../components/DocumentMeta'
import { defaultWaMessage, site } from '../siteConfig'
import { WaButton } from '../components/WaButton'

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const article = slug ? getArticleBySlug(slug) : undefined

  if (!article) {
    return <Navigate to="/articles" replace />
  }

  return (
    <main id="main" className="pb-16">
      <DocumentMeta title={`${article.title} | ${site.brandHe}`} description={article.excerpt} />
      <article className="border-b border-cream-dark/50 bg-cream-dark/20">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          <Link
            to="/articles"
            className="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-gold-deep underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
          >
            <ArrowRight className="size-4 rotate-180" aria-hidden />
            חזרה לכל המאמרים
          </Link>
          <h1 className="mt-6 font-display text-2xl font-medium leading-snug text-ink sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink sm:text-lg">{article.excerpt}</p>
        </div>
      </article>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="prose-article space-y-5 text-base leading-relaxed text-ink sm:text-lg">
          {article.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-cream-dark bg-cream p-6 text-center sm:p-8">
          <p className="font-display text-lg font-medium text-ink sm:text-xl">
            רוצים לתאם קינוח לתאריך שלכם?
          </p>
          <p className="mt-2 text-sm text-ink">
            נקודת איסוף: {site.pickupAddress} · ימי אספקה טיפוסיים: {site.orderDays}
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
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
    </main>
  )
}
