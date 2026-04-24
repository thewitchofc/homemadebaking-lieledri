import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { DocumentMeta } from '../components/DocumentMeta'
import { articles } from '../articlesData'
import { site } from '../siteConfig'
import { defaultWaMessage } from '../siteConfig'
import { WaButton } from '../components/WaButton'

export default function ArticlesPage() {
  return (
    <main id="main" className="pb-16">
      <DocumentMeta
        title={`מאמרים וטיפים | ${site.brandHe}`}
        description="מאמרים קצרים על בחירת קינוחים, אריזה לאירוע והזמנה נכונה — מאתר האפייה הביתית של ליאל אדרי."
      />
      <section className="border-b border-cream-dark/50 bg-cream-dark/25 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="font-display text-3xl font-medium text-ink sm:text-4xl">מאמרים וטיפים</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
            רעיונות, מדריכים קצרים ומידע שיעזרו לכם לבחור נכון, במיוחד אם אתם מראשון לציון והסביבה
            ומחפשים קינוח בוטיק ביתי בהזמנה אישית.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16" aria-label="רשימת מאמרים">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {articles.map((a) => (
            <li key={a.slug}>
              <article className="flex h-full flex-col rounded-2xl border border-cream-dark/80 bg-cream p-6 shadow-sm transition hover:border-gold/40 hover:shadow-md">
                <BookOpen className="mb-3 size-9 text-gold-deep/80" strokeWidth={1.25} aria-hidden />
                <h2 className="font-display text-lg font-medium leading-snug text-ink sm:text-xl">
                  <Link
                    to={`/articles/${a.slug}`}
                    className="rounded-sm text-ink transition hover:text-gold-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
                  >
                    {a.title}
                  </Link>
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{a.excerpt}</p>
                <Link
                  to={`/articles/${a.slug}`}
                  className="mt-5 inline-flex rounded-sm text-sm font-semibold text-gold-deep underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
                >
                  לקריאת המאמר
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <p className="text-sm text-ink-muted">
          מוכנים להזמין?{' '}
          <Link
            to="/order"
            className="rounded-sm font-semibold text-gold-deep underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
          >
            עברו לתפריט המתוקים
          </Link>{' '}
          או שיחה ישירה בוואטסאפ.
        </p>
        <WaButton message={defaultWaMessage} className="mt-6">
          דברו איתי בוואטסאפ
        </WaButton>
      </section>
    </main>
  )
}
