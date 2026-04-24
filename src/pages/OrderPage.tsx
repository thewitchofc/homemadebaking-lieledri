import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import {
  cartDisplayItemCount,
  cartOrderTotalWithDraft,
  cartPackIssueScrollTargetId,
  catalogProducts,
} from '../catalog'
import { gaEvent } from '../analytics'
import { useOrderCart } from '../contexts/OrderCartContext'
import { DocumentMeta } from '../components/DocumentMeta'
import { defaultWaMessage, site } from '../siteConfig'
import { ProductCatalog } from '../components/ProductCatalog'
import { WaButton } from '../components/WaButton'

const orderNav = [
  { href: '#greeting-card-row', label: 'כרטיס ברכה' },
  { href: '#catalog-rolls', label: 'מגולגלות' },
  { href: '#catalog-cookies', label: 'עוגיות' },
  { href: '#catalog-crumbleCookies', label: 'קראמבל' },
  { href: '#catalog-cakes', label: 'עוגות' },
  { href: '#order-steps', label: 'איך מזמינים' },
  { href: '#order-send', label: 'שליחה בוואטסאפ' },
  { href: '#order-details', label: 'פרטים ואיסוף' },
]

export default function OrderPage() {
  const { cart, rollsDraft, setQty, showCartChrome, canSendCartWhatsApp } = useOrderCart()

  useEffect(() => {
    gaEvent('view_catalog')
  }, [])

  const cartBarOrderTotal = cartOrderTotalWithDraft(cart, rollsDraft, catalogProducts)
  const cartBarLineCount = cartDisplayItemCount(cart, catalogProducts)

  const categoryNavRef = useRef<HTMLElement>(null)
  const [activeNavHref, setActiveNavHref] = useState(() => {
    const h = typeof window !== 'undefined' ? window.location.hash : ''
    return orderNav.some((n) => n.href === h) ? h : orderNav[0].href
  })

  useEffect(() => {
    const updateActive = () => {
      const threshold = categoryNavRef.current?.getBoundingClientRect().bottom ?? 120
      let current = orderNav[0].href
      for (const item of orderNav) {
        const el = document.getElementById(item.href.slice(1))
        if (!el) continue
        if (el.getBoundingClientRect().top <= threshold + 2) {
          current = item.href
        }
      }
      setActiveNavHref((prev) => (prev === current ? prev : current))
    }
    updateActive()
    window.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', updateActive, { passive: true })
    window.addEventListener('hashchange', updateActive)
    return () => {
      window.removeEventListener('scroll', updateActive)
      window.removeEventListener('resize', updateActive)
      window.removeEventListener('hashchange', updateActive)
    }
  }, [])

  return (
    <main
      id="main"
      className={`relative z-[1] overflow-x-hidden bg-[linear-gradient(180deg,#f7f3ee_0%,#efe7df_100%)] ${
        showCartChrome
          ? 'pb-[max(5.25rem,calc(env(safe-area-inset-bottom)+4.25rem))] sm:pb-20'
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

      <div className="relative z-10">
      <DocumentMeta
        title={`תפריט מתוקים | ${site.brandHe}`}
        description={`מגולגלות, עוגיות, קראמבל, עוגות ומארזים — הזמנה דרך האתר וסיום בוואטסאפ. נקודת איסוף: ${site.pickupAddress}. משלוח ל${site.deliveryFeeCenterArea} בתיאום.`}
      />
      <section className="border-b border-cream-dark/40 bg-white/25 py-4 backdrop-blur-[1px] sm:py-5">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">תפריט מתוקים</h1>
          <p className="mx-auto mt-2 max-w-lg text-xs text-ink-muted sm:text-sm">
            הזמנה מהרשימה למטה — בחירת קטגוריה מהניווט.
          </p>
        </div>
      </section>

      <nav
        ref={categoryNavRef}
        className="sticky top-[var(--header-h)] z-40 mt-1 mb-1.5 border-b border-cream-dark/45 bg-white/80 py-2 backdrop-blur-sm"
        aria-label="ניווט קטגוריות בתפריט המתוקים"
      >
        <div className="mx-auto max-w-6xl px-3 sm:px-6">
          <ul className="flex snap-x snap-mandatory gap-1 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:justify-center sm:gap-1.5 sm:pb-1 [&::-webkit-scrollbar]:hidden">
            {orderNav.map((item) => {
              const isActive = activeNavHref === item.href
              return (
                <li key={item.href} className="shrink-0 snap-center">
                  <a
                    href={item.href}
                    aria-current={isActive ? 'location' : undefined}
                    className={[
                      'inline-flex min-h-9 touch-manipulation items-center justify-center rounded-full border px-3 py-1.5 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep sm:min-h-0',
                      isActive
                        ? 'border-cocoa bg-cocoa text-cream hover:border-cocoa hover:bg-cocoa hover:text-cream'
                        : 'border-cream-dark/60 bg-cream/90 text-ink hover:border-gold-deep hover:text-gold-deep active:bg-cream-dark/45',
                    ].join(' ')}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      <section id="order-catalog" className="scroll-mt-36 border-b border-cream-dark/40 bg-white/20 py-5 backdrop-blur-[1px] sm:py-6">
        <ProductCatalog
          className="bg-transparent pb-2"
          dense
          cart={cart}
          rollsDraft={rollsDraft}
          onChangeQty={setQty}
        />
        <p className="mt-3 text-center">
          <Link
            to="/"
            className="inline-flex min-h-11 touch-manipulation items-center justify-center px-2 text-sm font-semibold text-gold-deep underline-offset-4 hover:underline active:text-gold sm:min-h-0"
          >
            לעמוד הבית
          </Link>
        </p>
      </section>

      <section id="order-steps" className="scroll-mt-36 border-b border-cream-dark/40 bg-cream py-5 sm:py-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-display text-xl font-medium text-ink sm:text-2xl">איך מזמינים</h2>
          <ol className="mt-4 grid gap-3 sm:grid-cols-3 sm:gap-4">
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
                className="rounded-xl border border-cream-dark bg-cream p-4 text-center shadow-sm sm:p-4"
              >
                <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-cocoa font-display text-lg font-semibold text-gold">
                  {s.step}
                </span>
                <h3 className="mt-3 font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="order-send" className="scroll-mt-36 py-6 md:py-8">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="rounded-xl border border-cream-dark/50 bg-cream/90 px-4 py-5 text-center shadow-sm sm:px-5">
            <p className="font-display text-xl text-ink md:text-2xl">מוכנים לטעימה הבאה?</p>
            <p className="mx-auto mt-2 max-w-md text-xs text-ink-muted sm:text-sm">שורה בוואטסאפ — חוזרים אליכם.</p>
            <WaButton
              message={defaultWaMessage}
              className="mt-4 !min-h-0 w-full max-w-xs !px-4 !py-2 !text-sm sm:mx-auto [&_svg]:size-4"
            >
              שלחו הודעה עכשיו
            </WaButton>
          </div>
        </div>
      </section>

      <section id="order-details" className="scroll-mt-36 border-t border-cream-dark/40 py-4 sm:py-5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="font-display text-base font-medium text-ink sm:text-lg">פרטים ואיסוף</h2>
          <p className="mt-1 text-xs text-ink-muted sm:text-sm">
            ימי הזמנה: <strong className="text-ink">{site.orderDays}</strong>
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink-muted">
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
      </section>

      </div>

      {showCartChrome ? (
        <div
          id="order-cart-bar"
          className="fixed inset-x-0 bottom-0 z-[55] rounded-t-xl border-t border-cream-dark/45 bg-cream/95 pt-3 backdrop-blur-sm pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          role="status"
          aria-live="polite"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 ps-4 pe-[max(1rem,calc(env(safe-area-inset-right)+4.25rem))] sm:pe-24">
            <p className="min-w-0 truncate font-display text-lg font-semibold tabular-nums text-ink sm:text-xl">
              סה״כ להזמנה ₪{cartBarOrderTotal}
            </p>
            {canSendCartWhatsApp ? (
              <div className="inline-flex shrink-0 items-stretch overflow-hidden rounded-full border border-cream/40 bg-cocoa text-cream shadow-sm">
                <Link
                  to="/checkout"
                  className="inline-flex min-h-11 touch-manipulation items-center justify-center px-4 py-2 text-sm font-semibold text-cream transition hover:bg-gold-deep active:opacity-90"
                >
                  לסיום ההזמנה
                </Link>
                <span
                  className="pointer-events-none flex items-center justify-center border-s border-cream/30 px-2.5 sm:px-3"
                  aria-hidden
                >
                  <ShoppingCart className="size-[1.1rem] shrink-0 sm:size-5" strokeWidth={2} />
                </span>
              </div>
            ) : (
              <button
                type="button"
                className="inline-flex min-h-11 shrink-0 touch-manipulation items-center justify-center rounded-full border border-cream-dark/80 bg-cream-dark/45 px-4 py-2 text-sm font-semibold text-ink-muted transition active:bg-cream-dark/65"
                onClick={() => {
                  const id = cartPackIssueScrollTargetId(cart, catalogProducts)
                  document.getElementById(id ?? 'catalog-crumbleCookies')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                התאימו מארזים
              </button>
            )}
          </div>
          {cartBarLineCount > 0 ? (
            <p className="mt-2 px-4 text-center text-sm text-ink/70">
              מעולה, ההזמנה התחילה. אפשר להוסיף עוד משהו קטן.
            </p>
          ) : null}
        </div>
      ) : null}
    </main>
  )
}
