import { useState, type CSSProperties } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useOrderCart } from '../contexts/OrderCartContext'
import { defaultWaMessage, site, siteImages, whatsappLink } from '../siteConfig'
import { InstagramIcon } from './InstagramIcon'
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
  'relative flex size-12 touch-manipulation items-center justify-center rounded-full border border-cream/50 bg-cocoa text-cream shadow-lg shadow-cocoa/35 transition hover:scale-105 hover:bg-gold-deep hover:shadow-xl active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep sm:size-[3.75rem]'

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
  const { pathname } = useLocation()
  const { showCartChrome } = useOrderCart()
  const isCheckout = pathname === '/checkout'
  const isOrder = pathname === '/order'
  const isRecommendations = pathname === '/recommendations'
  const compactFooter = isOrder || isRecommendations
  const footerBottomPad =
    isOrder && showCartChrome
      ? 'pb-[max(7.75rem,calc(env(safe-area-inset-bottom)+6.75rem))] sm:pb-[max(9.25rem,calc(env(safe-area-inset-bottom)+7.75rem))]'
      : compactFooter
        ? 'pb-4 sm:pb-5'
        : 'pb-8'

  return (
    <div className="layout bg-cream text-ink-muted">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
      >
        דלג לתוכן
      </a>

      <header
        className={`header sticky top-0 z-50 border-b border-cream-dark/80 bg-cream/90 backdrop-blur-md${isCheckout ? ' border-b-0' : ''}`}
      >
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:gap-4 sm:px-6 sm:py-3">
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
                <HeaderWordmark className="max-w-[min(420px,72vw)] text-base leading-none sm:max-w-[min(420px,78vw)] sm:text-xl md:text-2xl lg:text-3xl xl:text-[2.35rem]" />
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

              <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <WaButton
                  message={defaultWaMessage}
                  className="!gap-1.5 !py-2 !px-3 !text-xs !shadow-md sm:!gap-2 sm:!py-2.5 sm:!px-4 sm:!text-sm sm:!shadow-lg sm:!px-6 [&_svg]:!size-4 sm:[&_svg]:!size-[1.35rem]"
                >
                  וואטסאפ
                </WaButton>
                <button
                  type="button"
                  className="rounded-full border border-cream-dark p-2 text-ink sm:p-2.5 md:hidden"
                  onClick={() => setMenuOpen(true)}
                  aria-expanded={menuOpen}
                  aria-label="פתח תפריט"
                >
                  <Menu className="size-[1.05rem] sm:size-5" />
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
          className={`fixed inset-y-0 left-0 z-[70] w-[min(100%,min(280px,88vw))] transform border-r border-cream-dark bg-cream shadow-2xl transition-transform duration-300 ease-out sm:w-[min(100%,320px)] md:hidden ${
            !isCheckout && menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between gap-2 border-b border-cream-dark px-3 py-2.5 sm:px-4 sm:py-3">
            <div className="flex min-w-0 flex-col items-center justify-center text-center" dir="ltr">
              <LatinWordmark className="max-w-[min(180px,50vw)] text-sm leading-none sm:max-w-[min(200px,55vw)] sm:text-base" />
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="rounded-full p-1.5 text-ink sm:p-2"
              aria-label="סגור תפריט"
            >
              <X className="size-4 sm:size-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-0.5 p-3 sm:gap-1 sm:p-4" aria-label="ניווט נייד">
            {mainNav.map((n) =>
              n.to.startsWith('/#') ? (
                <Link
                  key={n.id}
                  to={n.to}
                  className="rounded-lg px-2.5 py-2 text-sm font-medium text-ink sm:px-3 sm:py-3 sm:text-base"
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
                    `rounded-lg px-2.5 py-2 text-sm font-medium sm:px-3 sm:py-3 sm:text-base ${isActive ? 'bg-cream-dark/40 text-ink' : 'text-ink'}`
                  }
                >
                  {n.label}
                </NavLink>
              ),
            )}
            <WaButton
              message={defaultWaMessage}
              className="mt-3 w-full !py-2.5 !px-4 !text-sm sm:mt-4 sm:!py-3.5 sm:!text-[15px]"
            >
              דברו איתי בוואטסאפ
            </WaButton>
          </nav>
        </div>
      </header>

      <Outlet />

      {!isCheckout ? (
        <div
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[85] flex flex-col gap-2 sm:gap-3"
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
      <footer className={`border-t border-cream-dark bg-cream text-ink ${footerBottomPad}`}>
        <div
          className={[
            'mx-auto flex max-w-6xl flex-col items-center justify-between px-4 text-center md:flex-row md:items-center md:text-right',
            compactFooter
              ? 'gap-3 py-4 md:gap-5 md:py-3'
              : 'gap-6 py-8 md:gap-8 md:py-6',
          ].join(' ')}
          dir="rtl"
        >
          <div
            className={['flex flex-col items-center md:items-start', compactFooter ? 'gap-1' : 'gap-2'].join(' ')}
          >
            <h2 className="m-0">
              <Link
                to="/"
                dir="ltr"
                lang="en"
                className="inline-flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
                aria-label={`עמוד הבית, ${site.brandHe}`}
              >
                <LatinWordmark
                  className={
                    compactFooter
                      ? 'text-base leading-none sm:text-lg'
                      : 'text-xl leading-none sm:text-2xl'
                  }
                />
              </Link>
            </h2>
            <p
              className={[
                'm-0 font-script leading-none text-gold-deep/90',
                compactFooter ? 'text-xs sm:text-sm' : 'text-sm sm:text-base',
              ].join(' ')}
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
            className={[
              'inline-flex items-center gap-1.5 font-medium text-ink-muted transition hover:text-gold-deep',
              compactFooter ? 'text-xs' : 'gap-2 text-sm',
            ].join(' ')}
          >
            <InstagramIcon
              className={compactFooter ? 'size-3.5 shrink-0 sm:size-4' : 'size-4 shrink-0 sm:size-[1.125rem]'}
              aria-hidden
            />
            <span dir="ltr">{site.instagramHandle}</span>
          </a>

          <nav
            className={[
              'flex flex-wrap items-center justify-center gap-y-1 md:justify-end',
              compactFooter ? 'gap-x-3 text-xs' : 'gap-x-4 text-sm',
            ].join(' ')}
            aria-label="מסמכים משפטיים"
          >
            <Link
              to="/terms"
              className="font-medium text-ink underline-offset-4 transition hover:text-gold-deep hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
            >
              תנאים
            </Link>
            <Link
              to="/privacy-policy"
              className="font-medium text-ink underline-offset-4 transition hover:text-gold-deep hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
            >
              פרטיות
            </Link>
            <Link
              to="/allergens"
              className="font-medium text-ink underline-offset-4 transition hover:text-gold-deep hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
            >
              אלרגנים
            </Link>
          </nav>

          {compactFooter ? (
            <div
              className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] leading-tight text-ink-muted sm:text-[11px] md:justify-end"
              dir="ltr"
            >
              <span className="tabular-nums">© {new Date().getFullYear()}</span>
              <span className="text-ink/25" aria-hidden>
                ·
              </span>
              <img
                src={site.devLogoMark}
                alt="THE WITCH, Web & App Development"
                width={256}
                height={256}
                className="h-4 w-auto shrink-0 rounded object-contain opacity-85 sm:h-[1.125rem]"
                loading="lazy"
                decoding="async"
              />
              <span className="max-w-[9.5rem] sm:max-w-none">{site.devCreditSubtitle}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 md:items-end">
              <p className="m-0 text-xs text-ink-muted/80" dir="ltr">
                © {new Date().getFullYear()}
              </p>
              <div className="flex items-center justify-center gap-2 md:justify-end">
                <img
                  src={site.devLogoMark}
                  alt="THE WITCH, Web & App Development"
                  width={256}
                  height={256}
                  className="h-5 w-auto shrink-0 rounded object-contain opacity-90 sm:h-6"
                  loading="lazy"
                  decoding="async"
                />
                <span className="max-w-[11rem] text-xs leading-snug text-ink-muted md:text-end">
                  {site.devCreditHeading} · {site.devCreditSubtitle}
                </span>
              </div>
            </div>
          )}
        </div>
      </footer>
      ) : null}
    </div>
  )
}
