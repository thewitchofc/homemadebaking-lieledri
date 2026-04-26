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
import {
  premiumActionButtonClass,
  sectionBodyClass,
  sectionInner,
  sectionShell,
  sectionTitleToContentClass,
} from '../sectionLayout'

const orderCategories = [
  { id: 'greeting-card-row', label: 'כרטיס ברכה' },
  { id: 'catalog-rolls', label: 'מגולגלות' },
  { id: 'catalog-cookies', label: 'עוגיות' },
  { id: 'catalog-crumbleCookies', label: 'קראמבל' },
  { id: 'catalog-cakes', label: 'עוגות' },
  { id: 'catalog-giantCrumbleDesign', label: 'עוגות בעיצוב אישי' },
  { id: 'order-steps', label: 'איך מזמינים' },
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
      className={`relative z-[1] min-h-0 bg-[linear-gradient(180deg,#f7f3ee_0%,#efe7df_100%)] ${
        showCartChrome
          ? 'pb-[max(6.5rem,calc(env(safe-area-inset-bottom)+5.25rem))] sm:pb-24'
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
        className="pointer-events-none fixed bottom-0 left-0 right-0 top-[var(--header-h)] z-0 bg-[linear-gradient(180deg,rgba(247,243,238,0.14)_0%,transparent_28%,transparent_72%,rgba(239,231,223,0.22)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed bottom-0 left-0 right-0 top-[var(--header-h)] z-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(42,32,26,0.045)_100%)]"
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
        <div className="flex touch-pan-x gap-1 overflow-x-auto no-scrollbar px-2 py-2 scroll-smooth [-webkit-overflow-scrolling:touch] sm:flex-wrap sm:justify-center sm:overflow-x-visible sm:px-3 sm:py-3">
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
                  relative shrink-0 touch-manipulation whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium
                  transition-all duration-300
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cocoa/40
                  active:scale-[0.98]
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
        id="order-steps"
        data-category-section
        className={`scroll-mt-[100px] ${orderSectionScrollMtClass} border-b border-cream-dark/40 bg-cream ${sectionShell}`}
      >
        <div className={sectionInner}>
          <h2 className="text-center font-display text-lg font-semibold tracking-tight text-ink sm:text-2xl">
            איך מזמינים
          </h2>
          <ol className={`grid gap-6 sm:grid-cols-3 ${sectionTitleToContentClass}`}>
            {[
              {
                step: '1',
                title: 'לבנות הזמנה בסל',
                desc: 'בוחרים מוצרים, כמויות וטעמים, ומרכיבים את ההזמנה בעגלה בעמוד תפריט המתוקים.',
              },
              {
                step: '2',
                title: 'לשלוח את ההזמנה',
                desc: 'כשהכל מוכן, שולחים את סיכום העגלה בוואטסאפ ישירות ממסך תפריט המתוקים.',
              },
              {
                step: '3',
                title: 'פתרון',
                desc: 'מקבלים אישור והזמנה מסודרת, נשאר רק לחכות לקינוח.',
              },
            ].map((s) => (
              <li
                key={s.step}
                className="flex flex-col gap-4 rounded-xl border border-cream-dark bg-cream p-4 text-center shadow-sm sm:p-4"
              >
                <span className="mx-auto flex size-10 shrink-0 items-center justify-center rounded-full bg-cocoa font-display text-lg font-semibold text-gold">
                  {s.step}
                </span>
                <h3 className="text-sm font-semibold text-ink sm:text-base">{s.title}</h3>
                <p className="text-sm text-ink-muted sm:text-base">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

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
          className="fixed inset-x-0 bottom-0 z-[55] rounded-t-xl border-t border-cream-dark/45 bg-cream pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
          role="status"
          aria-live="polite"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-2 ps-4 pe-[max(1rem,calc(env(safe-area-inset-right)+4.25rem))] sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pe-24">
            <p className="min-w-0 truncate text-center font-display text-base font-semibold tabular-nums text-ink sm:text-start sm:text-lg md:text-xl">
              סה״כ להזמנה ₪{cartBarOrderTotal}
            </p>
            {canProceedToCheckout ? (
              <Link
                to="/checkout"
                className={`${premiumActionButtonClass} min-h-11 w-full shrink-0 justify-center ps-5 pe-4 sm:w-auto sm:pe-5`}
              >
                <span>לסיום ההזמנה</span>
                <ShoppingCart className="size-[1.1rem] shrink-0 opacity-90 sm:size-5" strokeWidth={2} aria-hidden />
              </Link>
            ) : (
              <button
                type="button"
                className="inline-flex min-h-11 w-full shrink-0 touch-manipulation items-center justify-center rounded-full border border-cream-dark/80 bg-cream-dark/45 px-4 py-2 text-sm font-semibold text-ink/90 transition active:bg-cream-dark/65 sm:w-auto"
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
            <p className="mt-1.5 px-4 pb-0.5 text-center text-sm font-medium text-ink/90">
              {hasRollsPackMismatch
                ? `יש להשלים מארז מגולגלות ל־${ROLLS_PACK_SIZE} יחידות (או מכפלות של ${ROLLS_PACK_SIZE}) לפני מעבר לסל.`
                : hasCrumblePackMismatch
                  ? 'יש להתאים את כמות קראמבל למארזי 4 ו־6 בלבד (למשל 4, 6, 8, 10, 12…; לא 5, 7, 9).'
                  : 'מעולה, ההזמנה התחילה. אפשר להוסיף עוד משהו קטן.'}
            </p>
          ) : null}
        </div>
      ) : null}
    </main>
  )
}
