import { useEffect, useState, type CSSProperties } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { defaultWaMessage, site, siteImages, whatsappLink } from '../siteConfig'
import { InstagramIcon } from './InstagramIcon'
import { sectionLightAfterDarkTopFadeClass } from '../sectionLayout'
import { IntroVideoComponent } from './IntroVideoComponent'
import { WaButton } from './WaButton'
import { WhatsAppIcon } from './WhatsAppIcon'

const mainNav: { id: string; to: string; label: string; end?: boolean }[] = [
  { id: 'home', to: '/', label: 'דף בית', end: true },
  { id: 'articles', to: '/articles', label: 'מאמרים', end: true },
  { id: 'recommendations', to: '/recommendations', label: 'המלצות', end: true },
  { id: 'order-cta', to: '/order', label: 'תפריט מתוקים', end: true },
]

function navClassName(isActive: boolean) {
  return [
    'rounded-sm text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep',
    isActive ? 'text-gold-deep' : 'text-ink-muted hover:text-gold-deep',
  ].join(' ')
}

const floatBtnClass =
  'relative flex size-12 touch-manipulation items-center justify-center rounded-full border border-cream/50 bg-cocoa text-cream transition hover:scale-105 hover:bg-gold-deep active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep sm:size-[3.75rem]'

function LatinWordmark({ className = '' }: { className?: string }) {
  return (
    <span
      lang="en"
      className={`font-didone font-medium uppercase tracking-[0.14em] text-ink antialiased ${className}`}
    >
      {site.logoWordmarkLatin}
    </span>
  )
}

/** סרגל עליון בלבד, מטרפה מיד אחרי האות I ב־EDRI (ימין הטקסט ב־LTR) */
export function HeaderWordmark({
  className = '',
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  const full = site.logoWordmarkLatin
  const splitAtI = full.endsWith('I') ? { before: full.slice(0, -1) } : null

  return (
    <span
      lang="en"
      style={style}
      className={`inline-flex flex-nowrap items-center gap-[0.12em] font-didone font-medium uppercase tracking-[0.14em] text-ink antialiased ${className}`}
    >
      {splitAtI ? (
        <>
          <span className="leading-none">{splitAtI.before}</span>
          <span className="inline-flex items-center gap-[0.1em] leading-none">
            <span className="inline-block leading-none">I</span>
            <img
              src={siteImages.headerWhiskMark}
              alt="מטרפה — חלק מהלוגו"
              width={48}
              height={48}
              decoding="async"
              className="h-[1.48em] w-auto shrink-0 -translate-x-[0.14em] bg-transparent object-contain"
            />
          </span>
        </>
      ) : (
        <span className="leading-none">{full}</span>
      )}
    </span>
  )
}

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showIntroVideo, setShowIntroVideo] = useState(false)
  const { pathname } = useLocation()
  const isCheckout = pathname === '/checkout'
  const isOrder = pathname === '/order'
  /** פוטר קומפקטי; מרווח מול סרגל עגלה קבוע נשאר ב־OrderPage על ה־main */
  const footerBottomPad = 'pb-8'
  const footerInnerClass = isOrder
    ? 'relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-4 text-center md:flex-row md:items-center md:gap-6 md:py-4 md:text-right'
    : 'relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-8 text-center md:flex-row md:items-center md:gap-8 md:py-6 md:text-right'

  useEffect(() => {
    if (pathname !== '/') {
      setShowIntroVideo(false)
      return
    }
    const hasSeen = sessionStorage.getItem('seenIntro')
    if (!hasSeen) setShowIntroVideo(true)
  }, [pathname])

  /** GA4 — צפיית עמוד בכל מעבר ניווט (SPA); אם gtag לא נטען (אין מזהה / חסימה) מתעלמים */
  useEffect(() => {
    if (typeof window === 'undefined') return
    const g = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
    if (typeof g !== 'function') return
    g('event', 'page_view', {
      page_path: pathname,
    })
  }, [pathname])

  return (
    <div className="layout bg-cream text-ink-muted">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-sm"
      >
        דלג לתוכן
      </a>

      <header
        className={`header sticky top-0 z-50 border-b border-cream-dark/80 bg-cream${isCheckout ? ' border-b-0' : ''}`}
      >
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-3 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3">
          {isCheckout ? (
            <>
              <Link
                to="/order"
                className="shrink-0 touch-manipulation rounded-lg px-2 py-1.5 text-sm font-semibold text-gold-deep underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
              >
                חזרה לתפריט
              </Link>
              <Link
                to="/"
                className="flex min-w-0 flex-1 justify-center text-center"
                dir="ltr"
                aria-label={`עמוד הבית, ${site.brandHe}`}
              >
                <HeaderWordmark className="max-w-[min(220px,48vw)] text-sm leading-none sm:text-base" />
              </Link>
              <span className="w-[5.5rem] shrink-0 sm:w-24" aria-hidden />
            </>
          ) : (
            <>
              <Link
                to="/"
                className="flex min-w-0 flex-col items-center justify-center text-center"
                dir="ltr"
                aria-label={`עמוד הבית, ${site.brandHe}`}
              >
                <HeaderWordmark className="max-w-[min(380px,62vw)] text-[0.95rem] leading-none sm:max-w-[min(420px,78vw)] sm:text-xl md:text-2xl lg:text-3xl xl:text-[2.35rem]" />
              </Link>

              <nav className="hidden items-center gap-8 md:flex" aria-label="ניווט ראשי">
                {mainNav.map((n) =>
                  n.to.startsWith('/#') ? (
                    <Link key={n.id} to={n.to} className={navClassName(false)}>
                      {n.label}
                    </Link>
                  ) : (
                    <NavLink
                      key={n.id}
                      to={n.to}
                      end={n.end}
                      className={({ isActive }) => navClassName(isActive)}
                    >
                      {n.label}
                    </NavLink>
                  ),
                )}
              </nav>

              <div className="flex shrink-0 items-center gap-2 sm:gap-2">
                <WaButton
                  message={defaultWaMessage}
                  className="!gap-1.5 !py-2 !px-3 !text-xs max-sm:[&_svg]:!size-4 sm:!gap-2 sm:!py-2.5 sm:!px-4 sm:!text-sm sm:!px-6 [&_svg]:!size-4 sm:[&_svg]:!size-[1.35rem]"
                >
                  וואטסאפ
                </WaButton>
                <button
                  type="button"
                  className="flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-full border border-cream-dark/90 bg-white/80 text-ink shadow-sm active:bg-cream-dark/30 md:hidden"
                  onClick={() => setMenuOpen(true)}
                  aria-expanded={menuOpen}
                  aria-label="פתח תפריט"
                >
                  <Menu className="size-5" strokeWidth={2} />
                </button>
              </div>
            </>
          )}
        </div>

        {!isCheckout && menuOpen && (
          <div
            className="fixed inset-0 z-[60] bg-ink/40 md:hidden"
            role="presentation"
            onClick={() => setMenuOpen(false)}
          />
        )}
        <div
          className={`fixed inset-y-0 left-0 z-[70] flex w-[min(100%,20rem)] max-w-[calc(100vw-1rem)] flex-col transform border-r border-cream-dark/60 bg-cream shadow-2xl transition-transform duration-300 ease-out sm:w-[min(100%,22rem)] md:hidden ${
            !isCheckout && menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-cream-dark/50 px-4 py-4">
            <div className="flex min-w-0 flex-1 flex-col items-start justify-center ps-1 text-start" dir="ltr">
              <LatinWordmark className="max-w-full text-base font-medium leading-tight sm:text-lg" />
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-full border border-cream-dark/70 bg-white/90 text-ink shadow-sm active:bg-cream-dark/35"
              aria-label="סגור תפריט"
            >
              <X className="size-5" strokeWidth={2} />
            </button>
          </div>
          <nav
            className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-y-contain px-4 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            aria-label="ניווט נייד"
          >
            {mainNav.map((n) =>
              n.to.startsWith('/#') ? (
                <Link
                  key={n.id}
                  to={n.to}
                  className="rounded-xl border border-transparent px-4 py-3.5 text-base font-medium leading-snug text-ink transition active:bg-cream-dark/50 sm:py-4"
                  onClick={() => setMenuOpen(false)}
                >
                  {n.label}
                </Link>
              ) : (
                <NavLink
                  key={n.id}
                  to={n.to}
                  end={n.end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl border px-4 py-3.5 text-base font-medium leading-snug transition sm:py-4 ${
                      isActive
                        ? 'border-cream-dark/50 bg-cream-dark/35 text-ink shadow-sm'
                        : 'border-transparent text-ink active:bg-cream-dark/40'
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              ),
            )}
            <div className="mt-4 border-t border-cream-dark/40 pt-4">
              <WaButton
                message={defaultWaMessage}
                className="w-full !justify-center !gap-2 !py-3.5 !px-4 !text-base !font-medium sm:!py-4 [&_svg]:!size-5"
              >
                דברו איתי בוואטסאפ
              </WaButton>
            </div>
          </nav>
        </div>
      </header>

      <Outlet />
      {showIntroVideo ? (
        <IntroVideoComponent
          onDone={() => {
            sessionStorage.setItem('seenIntro', 'true')
            setShowIntroVideo(false)
          }}
        />
      ) : null}

      {!isCheckout && !isOrder ? (
        <div
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[85] hidden flex-col gap-2 sm:flex sm:gap-3"
          aria-label="קיצור דרך לוואטסאפ"
        >
          <a
            href={whatsappLink(defaultWaMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className={floatBtnClass}
            aria-label="שליחת הודעה בוואטסאפ"
          >
            <WhatsAppIcon className="size-6 sm:size-8" />
          </a>
        </div>
      ) : null}

      {!isCheckout ? (
      <footer
        className={`relative z-20 bg-cream text-ink ${footerBottomPad}`}
      >
        <div className={sectionLightAfterDarkTopFadeClass} aria-hidden />
        <div className={footerInnerClass} dir="rtl">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <h2 className="m-0">
              <Link
                to="/"
                dir="ltr"
                lang="en"
                className="inline-flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
                aria-label={`עמוד הבית, ${site.brandHe}`}
              >
                <LatinWordmark className="text-xl leading-none sm:text-2xl" />
              </Link>
            </h2>
            <p
              className="m-0 font-script text-sm leading-none text-gold-deep/90 sm:text-base"
              dir="ltr"
              lang="en"
            >
              {site.brandEn}
            </p>
          </div>

          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink transition hover:text-gold-deep"
          >
            <InstagramIcon className="size-4 shrink-0 sm:size-[1.125rem]" aria-hidden />
            <span dir="ltr">{site.instagramHandle}</span>
          </a>

          <nav
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm md:justify-end"
            aria-label="מסמכים משפטיים"
          >
            <Link
              to="/terms"
              className="font-semibold text-ink underline-offset-4 transition hover:text-gold-deep hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
            >
              תנאים
            </Link>
            <Link
              to="/privacy-policy"
              className="font-semibold text-ink underline-offset-4 transition hover:text-gold-deep hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
            >
              פרטיות
            </Link>
            <Link
              to="/allergens"
              className="font-semibold text-ink underline-offset-4 transition hover:text-gold-deep hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
            >
              אלרגנים
            </Link>
          </nav>

          <div className="flex flex-col items-center gap-2 md:items-end">
            <p className="m-0 text-xs font-medium text-ink" dir="ltr">
              © {new Date().getFullYear()}
            </p>
            <div className="flex items-center justify-center gap-2 md:justify-end">
              <img
                src={site.devLogoMark}
                alt="THE WITCH, Web & App Development"
                width={256}
                height={256}
                className="h-5 w-auto shrink-0 rounded object-contain sm:h-6"
                loading="lazy"
                decoding="async"
              />
              <span className="max-w-[11rem] text-xs font-medium leading-snug text-ink md:text-end">
                {site.devCreditHeading} · {site.devCreditSubtitle}
              </span>
            </div>
          </div>
        </div>
      </footer>
      ) : null}
    </div>
  )
}
