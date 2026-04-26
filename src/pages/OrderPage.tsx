import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import {
  ROLLS_PACK_SIZE,
  cartDisplayItemCount,
  cartOrderTotalWithDraft,
  cartPackIssueScrollTargetId,
  catalogProducts,
  crumbleCookiesQtyInCart,
  isValidCrumblePackTotal,
  rollsQtyInCart,
} from '../catalog'
import { gaEvent } from '../analytics'
import { useOrderCart } from '../contexts/OrderCartContext'
import { DocumentMeta } from '../components/DocumentMeta'
import { defaultWaMessage, site } from '../siteConfig'
import { ProductCatalog } from '../components/ProductCatalog'
import { WaButton } from '../components/WaButton'
import { sectionBodyClass, sectionInner, sectionShell, sectionTitleToContentClass } from '../sectionLayout'

const orderCategories = [
  { id: 'greeting-card-row', label: 'כרטיס ברכה' },
  { id: 'catalog-rolls', label: 'מגולגלות' },
  { id: 'catalog-cookies', label: 'עוגיות' },
  { id: 'catalog-crumbleCookies', label: 'קראמבל' },
  { id: 'catalog-cakes', label: 'עוגות' },
  { id: 'catalog-giantCrumbleDesign', label: 'עוגות בעיצוב אישי' },
] as const

/** יישור גלילה לעוגנים מתחת ל־header + סרגל קטגוריות */
const orderSectionScrollMtClass =
  'scroll-mt-[calc(var(--header-h)+var(--order-subnav-h)+0.75rem)]'

export default function OrderPage() {
  const { cart, rollsDraft, rollsDraftTotal, setQty, showCartChrome, canSendCartWhatsApp } = useOrderCart()

  useEffect(() => {
    gaEvent('view_catalog')
  }, [])

  /** מבטל נעילת overflow שנשארה ממסכים אחרים כדי לאפשר גלילה בתפריט */
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    html.style.removeProperty('overflow')
    body.style.removeProperty('overflow')
    return () => {
      html.style.removeProperty('overflow')
      body.style.removeProperty('overflow')
    }
  }, [])

  const cartBarOrderTotal = cartOrderTotalWithDraft(cart, rollsDraft, catalogProducts)
  const cartBarLineCount = cartDisplayItemCount(cart, catalogProducts)
  const rollsTotalSelected = rollsQtyInCart(cart, catalogProducts) + rollsDraftTotal
  const hasRollsPackMismatch = rollsTotalSelected > 0 && rollsTotalSelected % ROLLS_PACK_SIZE !== 0
  const crumbleQtyInCart = crumbleCookiesQtyInCart(cart, catalogProducts)
  const hasCrumblePackMismatch = crumbleQtyInCart > 0 && !isValidCrumblePackTotal(crumbleQtyInCart)
  const canProceedToCheckout = canSendCartWhatsApp && !hasRollsPackMismatch

  const navRef = useRef<HTMLElement>(null)
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [activeCategory, setActiveCategory] = useState('')

  const scrollToCategory = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return

    const offset = 100
    const y = el.getBoundingClientRect().top + window.scrollY - offset

    window.scrollTo({
      top: y,
      behavior: 'smooth',
    })
  }, [])

  useEffect(() => {
    const el = btnRefs.current[activeCategory]
    if (!el) return

    el.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [activeCategory])

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll<HTMLElement>('[data-category-section]')
      let current = ''

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= 140) {
          current = section.id
        }
      })

      if (current) setActiveCategory(current)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <main
      id="main"
      className={`relative z-[1] min-h-0 bg-cream ${
        showCartChrome
          ? 'pb-[max(4rem,calc(env(safe-area-inset-bottom)+3.5rem))] sm:pb-24'
          : 'pb-[env(safe-area-inset-bottom)]'
      }`}
    >
      <div
        className="pointer-events-none fixed bottom-0 left-0 right-0 top-[var(--header-h)] z-0"
        aria-hidden
      >
        <img
          src="/order-menu-countertop.png?v=1"
          sizes="100vw"
          alt=""
          width={1024}
          height={682}
          className="h-full w-full object-cover object-center opacity-[0.88]"
          decoding="async"
          fetchPriority="low"
        />
      </div>
      <div
        className="pointer-events-none fixed bottom-0 left-0 right-0 top-[var(--header-h)] z-0 bg-[radial-gradient(ellipse_at_center,rgba(255,252,248,0.28)_0%,rgba(255,252,248,0.08)_42%,transparent_62%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed bottom-0 left-0 right-0 top-[var(--header-h)] z-0 bg-[url('/noise.png')] bg-repeat opacity-[0.025] mix-blend-multiply"
        aria-hidden
      />

      <div className="relative z-10 min-h-0">
      <DocumentMeta
        title={`תפריט מתוקים | ${site.brandHe}`}
        description={`מגולגלות, עוגיות, קראמבל, עוגות ומארזים — הזמנה דרך האתר וסיום בוואטסאפ. נקודת איסוף: ${site.pickupAddress}. משלוח ל${site.deliveryFeeCenterArea} בתיאום.`}
      />

      <nav
        ref={navRef}
        className="sticky top-[var(--header-h)] z-40 border-b border-cream-dark/40 bg-white/90 backdrop-blur-sm"
        aria-label="ניווט קטגוריות בתפריט המתוקים"
      >
        <div className="flex touch-pan-x gap-2 overflow-x-auto px-3 py-2.5 no-scrollbar scroll-smooth [-webkit-overflow-scrolling:touch] sm:flex-wrap sm:justify-center sm:gap-2.5 sm:overflow-x-visible sm:px-4 sm:py-3">
          {orderCategories.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                ref={(el) => {
                  btnRefs.current[cat.id] = el
                }}
                data-category-id={cat.id}
                aria-current={isActive ? true : undefined}
                onClick={() => scrollToCategory(cat.id)}
                className={`
                  relative shrink-0 touch-manipulation whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium
                  transition-all duration-300
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cocoa/40
                  active:scale-[0.98]
                  sm:px-4 sm:py-2 sm:text-sm
                  ${isActive ? 'text-cream' : 'text-ink/70 hover:text-ink'}
                `}
              >
                {isActive ? (
                  <span
                    className="absolute inset-0 z-0 rounded-full bg-cocoa transition-all duration-300"
                    aria-hidden
                  />
                ) : null}
                <span className="relative z-10">{cat.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      <div className="overflow-x-clip">
      <section className={`border-b border-cream-dark/40 bg-white/25 ${sectionShell}`}>
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-display text-lg font-semibold tracking-tight text-ink sm:text-2xl">
            תפריט מתוקים
          </h1>
        </div>
      </section>

      <div
        id="order-catalog"
        className={`scroll-mt-[100px] ${orderSectionScrollMtClass} border-b border-cream-dark/40 bg-white/20`}
      >
        <div className="flex flex-col gap-6 sm:gap-10">
          <ProductCatalog
            className="bg-transparent"
            dense
            cart={cart}
            rollsDraft={rollsDraft}
            onChangeQty={setQty}
            sectionScrollMtClass={orderSectionScrollMtClass}
          />
          <div className="mx-auto max-w-6xl px-4 pb-2 text-center md:px-6">
            <Link
              to="/"
              className="inline-flex min-h-11 w-full touch-manipulation items-center justify-center px-2 text-sm font-semibold text-gold-deep underline-offset-4 hover:underline active:text-gold sm:min-h-0 sm:w-auto"
            >
              לעמוד הבית
            </Link>
          </div>
        </div>
      </div>

      <section
        id="order-details"
        data-category-section
        className={`scroll-mt-[100px] ${orderSectionScrollMtClass} border-t border-cream-dark/40 ${sectionShell}`}
      >
        <div className={sectionInner}>
          <div className="grid items-center gap-6 md:grid-cols-2">
            <div>
              <h2 className="font-display text-lg font-semibold tracking-tight text-ink sm:text-2xl">
                פרטים ואיסוף
              </h2>
              <div className={`${sectionBodyClass} ${sectionTitleToContentClass}`}>
              <p className="text-sm text-ink sm:text-base">
                ימי הזמנה: <strong className="text-ink">{site.orderDays}</strong>
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-4 text-sm text-ink sm:text-base">
                <span className="min-w-0 max-w-full leading-snug">
                  <strong className="text-ink">איסוף</strong> {site.pickupAddress} · {site.pickupWindowFri} ·{' '}
                  {site.pickupWindowWedThu} · משבצת בסיום הזמנה
                </span>
                <span className="min-w-0 max-w-full leading-snug">
                  <strong className="text-ink">משלוח</strong> {site.deliveryFeeCenterArea} ₪{site.deliveryFeeCenterShekels}{' '}
                  בתיאום — יתווסף לסיכום בהמשך
                </span>
              </div>
              </div>
            </div>

            <div id="order-send" data-category-section className={`scroll-mt-[100px] ${orderSectionScrollMtClass}`}>
              <div className="rounded-xl border border-cream-dark/50 bg-cream/90 px-4 py-5 text-center shadow-sm sm:px-5">
                <h3 className="font-display text-lg font-semibold tracking-tight text-ink sm:text-2xl">
                  מוכנים לטעימה הבאה?
                </h3>
                <div className={`${sectionBodyClass} ${sectionTitleToContentClass} items-center`}>
                <WaButton
                  message={defaultWaMessage}
                  className="!min-h-0 w-full !px-4 !py-2 !text-sm sm:mx-auto sm:w-auto sm:max-w-xs [&_svg]:size-4"
                >
                  שלחו הודעה עכשיו
                </WaButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      </div>
      </div>

      {showCartChrome ? (
        <div
          id="order-cart-bar"
          className="fixed bottom-0 left-0 right-0 z-40 flex flex-col border-t border-cream-dark/40 bg-white/95 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-sm"
          role="status"
          aria-live="polite"
        >
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
            <p className="min-w-0 flex-1 truncate text-sm font-medium tabular-nums text-ink">
              סה״כ להזמנה ₪{cartBarOrderTotal}
            </p>
            {canProceedToCheckout ? (
              <Link
                to="/checkout"
                className="inline-flex shrink-0 touch-manipulation items-center justify-center gap-1.5 rounded-full bg-cocoa px-4 py-2 text-sm font-medium text-cream transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep active:scale-[0.98]"
              >
                <span className="max-sm:hidden">לסיום ההזמנה</span>
                <span className="sm:hidden">לסיום</span>
                <ShoppingCart className="size-3.5 shrink-0 opacity-90" strokeWidth={2} aria-hidden />
              </Link>
            ) : (
              <button
                type="button"
                className="inline-flex shrink-0 touch-manipulation items-center justify-center rounded-full bg-cocoa px-4 py-2 text-sm font-medium text-cream transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep active:scale-[0.98]"
                onClick={() => {
                  const id = hasRollsPackMismatch
                    ? 'catalog-rolls'
                    : cartPackIssueScrollTargetId(cart, catalogProducts)
                  document.getElementById(id ?? 'catalog-crumbleCookies')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                התאימו מארזים
              </button>
            )}
          </div>
          {cartBarLineCount > 0 ? (
            <p className="mt-1.5 line-clamp-2 text-center text-[11px] font-medium leading-snug text-ink/80">
              {hasRollsPackMismatch
                ? `יש להשלים מארז מגולגלות ל־${ROLLS_PACK_SIZE} יחידות (או מכפלות של ${ROLLS_PACK_SIZE}) לפני מעבר לסל.`
                : hasCrumblePackMismatch
                  ? 'יש להתאים את כמות קראמבל למארזי 4 ו־6 בלבד (למשל 4, 6, 8, 10, 12…; לא 5, 7, 9).'
                  : 'מעולה — אפשר להמשיך להוסיף או לעבור לסיום.'}
            </p>
          ) : null}
        </div>
      ) : null}
    </main>
  )
}
