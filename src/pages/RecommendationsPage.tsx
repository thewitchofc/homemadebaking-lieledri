import { Link } from 'react-router-dom'
import { Quote, Star } from 'lucide-react'
import { DocumentMeta } from '../components/DocumentMeta'
import { defaultWaMessage, site } from '../siteConfig'
import { recommendationCards } from '../recommendationsPhotos'
import { WaButton } from '../components/WaButton'

const testimonialCardClass =
  'flex h-full flex-col overflow-hidden bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6'

export default function RecommendationsPage() {
  return (
    <>
      <DocumentMeta
        title={`המלצות מלקוחות | ${site.brandHe}`}
        description="המלצות מילוליות ותמונות אמיתיות מלקוחות על מארזי קינוחים ומגולגלות — Homemade Baking של ליאל אדרי."
      />
      <main
        id="main"
        className="relative z-[1] overflow-x-hidden bg-[linear-gradient(180deg,#f7f3ee_0%,#efe7df_100%)]"
      >
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 top-[var(--header-h)] z-0"
          aria-hidden
        >
          <img
            src="/recommendations-countertop.png?v=1"
            sizes="100vw"
            alt=""
            width={1024}
            height={682}
            className="h-full w-full object-cover object-center"
            decoding="async"
            fetchPriority="low"
          />
        </div>
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 top-[var(--header-h)] z-0 bg-[radial-gradient(ellipse_at_center,rgba(255,252,248,0.42)_0%,rgba(255,252,248,0.12)_42%,transparent_62%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 top-[var(--header-h)] z-0 bg-[linear-gradient(180deg,rgba(247,243,238,0.25)_0%,transparent_28%,transparent_72%,rgba(239,231,223,0.35)_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 top-[var(--header-h)] z-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(42,32,26,0.08)_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 top-[var(--header-h)] z-0 bg-[url('/noise.png')] bg-repeat opacity-[0.035] mix-blend-multiply"
          aria-hidden
        />

        <div className="relative z-10 overflow-x-hidden pb-8 pt-6 sm:pb-10 sm:pt-8 lg:pt-10">
        <header className="mx-auto max-w-3xl border-b border-stone-200/40 px-4 pb-8 text-center sm:px-6 sm:pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep/90 sm:text-sm">
            {site.brandEn}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-[2.5rem]">
            המלצות מלקוחות
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink sm:mt-5 sm:text-lg">
            צילומים אמיתיים מהסטוריז, לצד מילים של מזמינים שנהנו מהמגולגלות והמארזים. תודה על האמון.
          </p>
        </header>

        <section
          className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12"
          aria-label="המלצות ותמונות מלקוחות"
        >
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 xl:grid-cols-3 xl:gap-8">
            {recommendationCards.map((item, i) => (
              <li key={item.src} className="min-w-0">
                <article className={testimonialCardClass}>
                  <div className="relative mx-auto aspect-[9/16] w-full max-w-[14.5rem] overflow-hidden rounded-xl ring-1 ring-stone-200/60 sm:max-w-[15.5rem]">
                    <img
                      src={item.src}
                      alt={`תמונת לקוח — ${item.author}, ${i + 1} מתוך ${recommendationCards.length}`}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                      width={1080}
                      height={1920}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <Quote
                    className="mt-6 size-9 shrink-0 text-gold-deep/45"
                    strokeWidth={1.25}
                    aria-hidden
                  />
                  <blockquote className="mt-3 min-w-0 flex-1">
                    <p className="text-base font-normal leading-relaxed text-ink sm:text-lg">{item.quote}</p>
                  </blockquote>
                  <footer className="mt-6 flex items-center gap-3 border-t border-stone-200/55 pt-6">
                    <div
                      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cocoa/12 to-cocoa/6 font-display text-sm font-semibold text-cocoa ring-1 ring-stone-200/50"
                      aria-hidden
                    >
                      {item.initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-ink">{item.author}</p>
                      <div
                        className="mt-1.5 flex gap-0.5 text-gold-deep"
                        aria-label="חמש כוכבים מתוך חמש"
                      >
                        {Array.from({ length: 5 }, (_, si) => (
                          <Star
                            key={si}
                            className="size-4 fill-gold-deep stroke-gold-deep"
                            strokeWidth={1}
                            aria-hidden
                          />
                        ))}
                      </div>
                    </div>
                  </footer>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-xl px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 text-center sm:px-6 sm:pb-2">
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6">
            <p className="text-base leading-relaxed text-ink sm:text-lg">
              רוצים להצטרף למזמינים המרוצים? הזמינו בוואטסאפ או{' '}
              <Link
                to="/order"
                className="rounded-sm font-semibold text-gold-deep underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
              >
                עברו לתפריט המתוקים
              </Link>
              .
            </p>
            <WaButton message={defaultWaMessage} className="mt-7">
              דברו איתי בוואטסאפ
            </WaButton>
          </div>
        </section>
        </div>
      </main>
    </>
  )
}
