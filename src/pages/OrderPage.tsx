import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Home, ShoppingBag } from 'lucide-react'
import {
  cartDisplayItemCount,
  cartOrderTotalWithDraft,
  cartPackIssueScrollTargetId,
  catalogProducts,
} from '../catalog'
import { gaEvent } from '../analytics'
import { useOrderCart } from '../contexts/OrderCartContext'
import { defaultWaMessage, site } from '../siteConfig'
import { ProductCatalog } from '../components/ProductCatalog'
import { WaButton } from '../components/WaButton'

const orderNav = [
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
      className={`relative ${showCartChrome ? 'pb-[max(5.75rem,calc(env(safe-area-inset-bottom)+4.75rem))] sm:pb-24' : 'pb-[env(safe-area-inset-bottom)]'}`}
    >
      <section className="border-b border-cream-dark/50 bg-cream-dark/20 py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h1 className="font-display text-3xl font-medium text-ink sm:text-4xl">תפריט מתוקים</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-ink-muted sm:text-base">
            כל מה שצריך כדי להזמין, במקום אחד. בחרו נושא מתפריט המתוקים למטה.
          </p>
        </div>
      </section>

      <nav
        ref={categoryNavRef}
        className="sticky top-[var(--header-h)] z-40 mt-2 mb-2 border-b border-cream-dark/45 bg-white/80 py-2 backdrop-blur-sm"
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
                      'inline-flex min-h-9 touch-manipulation items-center justify-center rounded-full border px-3 py-1.5 text-xs font-medium transition sm:min-h-0',
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

      <section id="order-catalog" className="scroll-mt-36 border-b border-cream-dark/40 bg-cream-dark/20 py-12 sm:py-16">
        <ProductCatalog
          className="bg-cream-dark/20 pb-2"
          dense
          cart={cart}
          rollsDraft={rollsDraft}
          onChangeQty={setQty}
        />
        <p className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex min-h-11 touch-manipulation items-center justify-center px-2 text-sm font-semibold text-gold-deep underline-offset-4 hover:underline active:text-gold sm:min-h-0"
          >
            לעמוד הבית
          </Link>
        </p>
      </section>

      <section id="order-steps" className="scroll-mt-36 border-b border-cream-dark/40 bg-cream py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-display text-2xl font-medium text-ink">איך מזמינים</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
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
                className="rounded-2xl border border-cream-dark bg-cream p-6 text-center shadow-sm"
              >
                <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-cocoa font-display text-xl font-semibold text-gold">
                  {s.step}
                </span>
                <h3 className="mt-3 font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="order-send" className="scroll-mt-36 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-3xl border border-cream-dark bg-cream shadow-sm">
            <div className="mx-auto flex max-w-lg flex-col items-center bg-cream-dark/25 p-8 text-center sm:p-10">
              <p className="font-display text-xl text-ink sm:text-2xl">מוכנים לטעימה הבאה?</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                שורה אחת בוואטסאפ, ואני חוזרת אליכם עם כל מה שצריך.
              </p>
              <WaButton message={defaultWaMessage} className="mt-6 w-full max-w-sm">
                שלחו הודעה עכשיו
              </WaButton>
            </div>
          </div>
        </div>
      </section>

      <section id="order-details" className="scroll-mt-36 border-t border-cream-dark/40 bg-cream py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-medium text-ink">פרטים ואיסוף</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
            ניתן להזמין לימי <strong className="text-ink">{site.orderDays}</strong> בלבד.
          </p>
          <ul className="mt-6 space-y-5 text-sm sm:text-base">
            <li className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cocoa/10 text-gold-deep">
                <Home className="size-5" strokeWidth={2} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-ink">איסוף עצמי</p>
                <p className="text-ink-muted">{site.pickupAddress}</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cocoa/10 text-gold-deep">
                <ShoppingBag className="size-5" strokeWidth={2} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-ink">משלוח</p>
                <p className="text-ink-muted">בתיאום מראש, נתאם יחד בוואטסאפ.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

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
              <Link
                to="/checkout"
                className="inline-flex min-h-11 shrink-0 touch-manipulation items-center justify-center rounded-full border border-cream/40 bg-cocoa px-4 py-2 text-sm font-semibold text-cream transition hover:bg-gold-deep active:opacity-90"
              >
                לסיום ההזמנה
              </Link>
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
              מעולה, ההזמנה התחילה 🛒 אפשר להוסיף עוד משהו קטן 😉
            </p>
          ) : null}
        </div>
      ) : null}
    </main>
  )
}
