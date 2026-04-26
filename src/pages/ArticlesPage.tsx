import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { DocumentMeta } from '../components/DocumentMeta'
import { articles } from '../articlesData'
import { site } from '../siteConfig'
import { defaultWaMessage } from '../siteConfig'
import { WaButton } from '../components/WaButton'
import {
  sectionBodyClass,
  sectionDescClass,
  sectionInner,
  sectionShell,
  sectionTitleClass,
  sectionTitleToContentClass,
} from '../sectionLayout'

export default function ArticlesPage() {
  return (
    <main id="main" className="pb-16">
      <DocumentMeta
        title={`מאמרים וטיפים | ${site.brandHe}`}
        description="מאמרים קצרים על בחירת קינוחים, אריזה לאירוע והזמנה נכונה — מאתר האפייה הביתית של ליאל אדרי."
      />
      <section className={`border-b border-cream-dark/50 bg-cream-dark/25 ${sectionShell}`}>
        <div className={`${sectionInner} max-w-3xl text-center`}>
          <h1 className={sectionTitleClass}>מאמרים וטיפים</h1>
          <p className={`${sectionDescClass} mt-2 mx-auto max-w-2xl leading-relaxed`}>
            רעיונות, מדריכים קצרים ומידע שיעזרו לכם לבחור נכון, במיוחד אם אתם מראשון לציון והסביבה
            ומחפשים קינוח בוטיק ביתי בהזמנה אישית.
          </p>
        </div>
      </section>

      <section className={sectionShell} aria-labelledby="articles-list-heading">
        <div className={sectionInner}>
        <h2 id="articles-list-heading" className={sectionTitleClass}>
          כל המאמרים
        </h2>
        <ul className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-2 ${sectionTitleToContentClass}`}>
          {articles.map((a) => (
            <li key={a.slug}>
              <article className="flex h-full flex-col gap-4 rounded-2xl border border-cream-dark/80 bg-cream p-6 shadow-sm transition hover:border-gold/40 hover:shadow-md">
                <BookOpen className="size-9 text-gold-deep/80" strokeWidth={1.25} aria-hidden />
                <h2 className="font-display text-lg font-medium leading-snug text-ink sm:text-xl">
                  <Link
                    to={`/articles/${a.slug}`}
                    className="rounded-sm text-ink transition hover:text-gold-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
                  >
                    {a.title}
                  </Link>
                </h2>
                <p className="flex-1 text-sm leading-relaxed text-ink-muted">{a.excerpt}</p>
                <Link
                  to={`/articles/${a.slug}`}
                  className="inline-flex rounded-sm text-sm font-semibold text-gold-deep underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
                >
                  לקריאת המאמר
                </Link>
              </article>
            </li>
          ))}
        </ul>
        </div>
      </section>

      <section className={sectionShell} aria-labelledby="articles-cta-heading">
        <div className={`${sectionInner} max-w-xl text-center`}>
        <h2 id="articles-cta-heading" className={sectionTitleClass}>
          מוכנים להזמין?
        </h2>
        <div className={`${sectionBodyClass} ${sectionTitleToContentClass} items-center`}>
        <p className={sectionDescClass}>
          <Link
            to="/order"
            className="rounded-sm font-semibold text-gold-deep underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
          >
            עברו לתפריט המתוקים
          </Link>{' '}
          או שיחה ישירה בוואטסאפ.
        </p>
        <WaButton message={defaultWaMessage}>
          דברו איתי בוואטסאפ
        </WaButton>
        </div>
        </div>
      </section>
    </main>
  )
}
