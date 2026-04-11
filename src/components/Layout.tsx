import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Menu, ShoppingCart, X } from 'lucide-react'
import { cartPackIssueScrollTargetId, catalogProducts } from '../catalog'
import { useOrderCart } from '../contexts/OrderCartContext'
import { defaultWaMessage, site, siteImages, whatsappLink } from '../siteConfig'
import { InstagramIcon } from './InstagramIcon'
import { WaButton } from './WaButton'
import { WhatsAppIcon } from './WhatsAppIcon'

const mainNav: { id: string; to: string; label: string; end?: boolean }[] = [
  { id: 'home', to: '/', label: 'דף בית', end: true },
  { id: 'why', to: '/#why', label: 'למה אנחנו' },
  { id: 'articles', to: '/articles', label: 'מאמרים', end: true },
  { id: 'recommendations', to: '/recommendations', label: 'המלצות', end: true },
  { id: 'order-cta', to: '/order', label: 'תפריט מתוקים', end: true },
]

function navClassName(isActive: boolean) {
  return [
    'text-sm font-medium transition',
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
function HeaderWordmark({ className = '' }: { className?: string }) {
  const full = site.logoWordmarkLatin
  const splitAtI = full.endsWith('I') ? { before: full.slice(0, -1) } : null

  return (
    <span
      lang="en"
      className={`inline-flex flex-nowrap items-center gap-[0.12em] font-didone font-medium uppercase tracking-[0.14em] text-ink antialiased ${className}`}
    >
      {splitAtI ? (
        <>
          <span className="leading-none">{splitAtI.before}</span>
          <span className="inline-flex items-center gap-[0.1em] leading-none">
            <span className="inline-block leading-none">I</span>
            <img
              src={siteImages.headerWhiskMark}
              alt=""
              width={48}
              height={48}
              decoding="async"
              className="h-[1.48em] w-auto shrink-0 -translate-x-[0.14em] bg-transparent object-contain"
              aria-hidden
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
  const { cart, itemsInCart, showCartChrome, cartWaMessage, canSendCartWhatsApp } = useOrderCart()

  return (
    <div className="layout bg-cream text-ink-muted">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
      >
        דלג לתוכן
      </a>

      <header className="header sticky top-0 z-50 border-b border-cream-dark/80 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:gap-4 sm:px-6 sm:py-3">
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
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-cream-dark p-2.5 text-ink transition hover:border-gold hover:text-gold-deep md:inline-flex"
              aria-label={`אינסטגרם ${site.instagramHandle}`}
            >
              <InstagramIcon className="size-5" />
            </a>
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
        </div>

        {menuOpen && (
          <div
            className="fixed inset-0 z-[60] bg-ink/40 md:hidden"
            role="presentation"
            onClick={() => setMenuOpen(false)}
          />
        )}
        <div
          className={`fixed inset-y-0 left-0 z-[70] w-[min(100%,min(280px,88vw))] transform border-r border-cream-dark bg-cream shadow-2xl transition-transform duration-300 ease-out sm:w-[min(100%,320px)] md:hidden ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
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

      {/* אייקונים צפים ימין למטה: עגלה למעלה (מעל וואטסאפ), ואז וואטסאפ, אינסטגרם */}
      <div
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[85] flex flex-col gap-2 sm:gap-3"
        aria-label={
          showCartChrome
            ? 'קיצורי דרך לעגלה, לוואטסאפ ולאינסטגרם'
            : 'קיצורי דרך לוואטסאפ ולאינסטגרם'
        }
      >
        {showCartChrome &&
          (canSendCartWhatsApp ? (
            <a
              href={whatsappLink(cartWaMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={floatBtnClass}
              aria-label={`שליחת הזמנה בוואטסאפ (${itemsInCart} פריטים בעגלה)`}
            >
              <ShoppingCart className="size-6 stroke-[2px] sm:size-8" aria-hidden />
              <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-gold px-0.5 text-[10px] font-bold leading-none text-cocoa">
                {itemsInCart > 99 ? '99+' : itemsInCart}
              </span>
            </a>
          ) : (
            <button
              type="button"
              className={`${floatBtnClass} opacity-[0.72] hover:scale-100 hover:bg-cocoa`}
              aria-label="התאימו כמויות למארזים, קראמבל 4/6 או מגולגלות 12 לפני שליחה"
              title="סך קראמבל חייב להתאים למארזי 4 או 6; סך מגולגלות (מכל הטעמים ביחד) חייב להתחלק ב־12, אפשר לערבב טעמים."
              onClick={() => {
                const id = cartPackIssueScrollTargetId(cart, catalogProducts)
                document.getElementById(id ?? 'catalog-crumbleCookies')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <ShoppingCart className="size-6 stroke-[2px] sm:size-8" aria-hidden />
              <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-gold px-0.5 text-[10px] font-bold leading-none text-cocoa">
                {itemsInCart > 99 ? '99+' : itemsInCart}
              </span>
            </button>
          ))}
        <a
          href={whatsappLink(defaultWaMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className={floatBtnClass}
          aria-label="שליחת הודעה בוואטסאפ"
        >
          <WhatsAppIcon className="size-6 sm:size-8" />
        </a>
        <a
          href={site.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={floatBtnClass}
          aria-label={`אינסטגרם ${site.instagramHandle}`}
        >
          <InstagramIcon className="size-6 sm:size-8" />
        </a>
      </div>

      <footer className="border-t border-cream-dark bg-cream py-8 text-center text-xs text-ink-muted sm:text-sm">
        <div className="flex flex-col items-center gap-1.5" dir="ltr">
          <LatinWordmark className="text-xl leading-none sm:text-2xl lg:text-3xl xl:text-[2.35rem]" />
          <span className="font-script text-[1.75rem] font-normal leading-none text-gold-deep sm:text-[2.25rem] lg:text-[2.75rem] xl:text-[3.1rem]">
            {site.brandEn}
          </span>
        </div>
        <div className="mt-6 flex flex-col items-center gap-2 border-t border-cream-dark/40 pt-6 text-center sm:mt-8 sm:gap-2.5 sm:pt-8">
          <p className="text-sm font-semibold text-gold sm:text-base" dir="rtl">
            {site.devCreditHeading}
          </p>
          <p className="text-sm font-semibold text-[#1e3d2e] sm:text-base" dir="rtl">
            {site.devCreditSubtitle}
          </p>
          <img
            src={site.devLogoMark}
            alt="THE WITCH, Web & App Development"
            width={72}
            height={72}
            className="mt-2 h-auto w-[min(72px,32vw)] max-w-full rounded-lg object-contain shadow-sm shadow-ink/10"
            loading="lazy"
            decoding="async"
          />
          <p className="mt-2 text-center text-xs text-ink-muted sm:text-sm">
            © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}
