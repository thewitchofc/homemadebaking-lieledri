import { DocumentMeta } from '../components/DocumentMeta'
import { site } from '../siteConfig'
import { sectionInner, sectionShell, sectionTitleClass, sectionTitleToContentClass } from '../sectionLayout'
import { recommendationCards } from '../recommendationsPhotos'

const photoCardClass = 'overflow-hidden rounded-2xl border border-cocoa/15 ring-1 ring-cocoa/10'

export default function RecommendationsPage() {
  return (
    <>
      <DocumentMeta
        title={`המלצות מלקוחות | ${site.brandHe}`}
        description={`תמונות המלצות מלקוחות — ${site.brandHe}.`}
      />
      <main
        id="main"
        className="relative z-[1] overflow-x-hidden bg-cream"
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
          className="pointer-events-none fixed bottom-0 left-0 right-0 top-[var(--header-h)] z-0 bg-[url('/noise.png')] bg-repeat opacity-[0.035] mix-blend-multiply"
          aria-hidden
        />

        <div className="relative z-10 overflow-x-hidden">
        <header className={`border-b border-cocoa/12 ${sectionShell}`}>
          <div className={`${sectionInner} max-w-3xl text-center`}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep/90 sm:text-sm">
              {site.brandEn}
            </p>
            <h1 className={`${sectionTitleClass} mt-2`}>המלצות מלקוחות</h1>
          </div>
        </header>

        <section className={sectionShell} aria-labelledby="recommendations-gallery-heading">
          <div className={sectionInner}>
          <h2 id="recommendations-gallery-heading" className={sectionTitleClass}>
            גלריית תמונות
          </h2>
          <ul
            className={`grid grid-cols-2 gap-2.5 sm:gap-4 md:gap-6 lg:grid-cols-3 ${sectionTitleToContentClass}`}
          >
            {recommendationCards.map((item, i) => (
              <li
                key={item.src}
                className="min-w-0 w-full lg:mx-auto lg:max-w-[17rem]"
              >
                <article className={photoCardClass}>
                  {/** במובייל: 2 עמודות + יחס נמוך יותר כדי שייכנסו כמה המלצות במסך; בדסקטופ נשאר פורמט סטוריז */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden lg:aspect-[9/16]">
                    <img
                      src={item.src}
                      alt={`תמונת המלצה ${i + 1} מתוך ${recommendationCards.length}`}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                      width={1080}
                      height={1920}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </article>
              </li>
            ))}
          </ul>
          </div>
        </section>
        </div>
      </main>
    </>
  )
}
