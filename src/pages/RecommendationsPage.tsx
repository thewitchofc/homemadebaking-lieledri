import { Link } from 'react-router-dom'
import { defaultWaMessage } from '../siteConfig'
import { recommendationPhotoUrls } from '../recommendationsPhotos'
import { WaButton } from '../components/WaButton'

export default function RecommendationsPage() {
  return (
    <main id="main" className="pb-16">
      <section className="border-b border-cream-dark/50 bg-cream-dark/25 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="font-display text-3xl font-medium text-ink sm:text-4xl">המלצות</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
            צילומי מסך אמיתיים מסטוריז, מגולגלות ומארזים מהלקוחות. תודה על האמון והאהבה.
          </p>
        </div>
      </section>

      <section
        className="border-y border-cream-dark/35 bg-cream py-8 sm:py-12 lg:py-16"
        aria-label="תמונות המלצות מלקוחות"
      >
        <div className="mx-auto max-w-6xl px-3 sm:px-6">
          <ul className="mx-auto grid w-full max-w-xs grid-cols-2 gap-2 min-[400px]:max-w-sm sm:max-w-none sm:gap-4 md:gap-5 lg:grid-cols-3 lg:gap-5">
            {recommendationPhotoUrls.map((src, i) => (
              <li key={src} className="min-w-0">
                <figure className="w-full min-w-0 overflow-hidden rounded-lg ring-1 ring-gold/45 ring-offset-2 ring-offset-cream-dark/95 sm:rounded-xl sm:ring-offset-[3px]">
                  <div className="relative aspect-[9/16] w-full overflow-hidden">
                    <img
                      src={src}
                      alt={`המלצת לקוח, מגולגלות, תמונה ${i + 1} מתוך ${recommendationPhotoUrls.length}`}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                      width={1080}
                      height={1920}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <p className="text-sm text-ink-muted">
          רוצים להצטרף למזמינים המרוצים? הזמינו בוואטסאפ או{' '}
          <Link to="/order" className="font-semibold text-gold-deep underline-offset-2 hover:underline">
            עברו לתפריט המתוקים
          </Link>
          .
        </p>
        <WaButton message={defaultWaMessage} className="mt-6">
          דברו איתי בוואטסאפ
        </WaButton>
      </section>
    </main>
  )
}
