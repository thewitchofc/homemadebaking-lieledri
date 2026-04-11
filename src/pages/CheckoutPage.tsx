import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import { he } from 'date-fns/locale'
import { MessageCircle, Plus } from 'lucide-react'
import 'react-datepicker/dist/react-datepicker.min.css'
import {
  buildCartWhatsAppMessage,
  cartOrderTotalWithDraft,
  catalogProducts,
  crumblePackIssueDescription,
  getCartDisplayCount,
  getCartPreviewLines,
  getNextCheckoutDateForWeekday,
  getNextCheckoutDeliveryDateIso,
  isValidCrumblePackTotal,
  isValidRollsPackTotal,
  mergeCartWhatsAppWithCheckoutDelivery,
  rollsPackCountInCart,
  rollsPackIssueDescription,
  rollsQtyInCart,
  type CartState,
  type CatalogProduct,
  type CheckoutDeliveryMethod,
  type ProductCategory,
} from '../catalog'
import { gaEvent } from '../analytics'
import { useOrderCart } from '../contexts/OrderCartContext'
import { whatsappLink } from '../siteConfig'

/** עד 3 מובילים ל־upsell: קודם קטגוריות שלא בעגלה, אחר כך אותה לוגיקת השלמה כמו קודם */
const CHECKOUT_UPSELL_PRODUCT_IDS = [1, 7, 14] as const
const UPSELL_MAX = 3

function filterCheckoutDate(date: Date): boolean {
  const day = date.getDay()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date >= today && (day === 3 || day === 4 || day === 5)
}

function isoToLocalDate(iso: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return new Date(NaN)
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
}

function localDateToIso(d: Date): string {
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${mo}-${day}`
}

/** react-datepicker מעביר ‎EEEE לפי ה־locale; עם ‎he השמות בעברית, באנגלית כגיבוי */
function formatCheckoutWeekDayLabel(day: string): string {
  const map: Record<string, string> = {
    Sunday: 'א',
    Monday: 'ב',
    Tuesday: 'ג',
    Wednesday: 'ד',
    Thursday: 'ה',
    Friday: 'ו',
    Saturday: 'ש',
    'יום ראשון': 'א',
    'יום שני': 'ב',
    'יום שלישי': 'ג',
    'יום רביעי': 'ד',
    'יום חמישי': 'ה',
    'יום שישי': 'ו',
    'יום שבת': 'ש',
  }
  return map[day] || day
}

function lineQtyOnCheckout(
  p: CatalogProduct,
  cart: CartState,
  rollsDraft: CartState,
): number {
  const c = cart[p.id] ?? 0
  if (p.category === 'rolls') return c + (rollsDraft[p.id] ?? 0)
  return c
}

function categoriesPresentInOrder(
  cart: CartState,
  rollsDraft: CartState,
  products: CatalogProduct[],
): Set<ProductCategory> {
  const set = new Set<ProductCategory>()
  for (const p of products) {
    if (lineQtyOnCheckout(p, cart, rollsDraft) > 0) set.add(p.category)
  }
  return set
}

export default function CheckoutPage() {
  const { cart, rollsDraft, canSendCartWhatsApp, crumbleCookiesQty, setQty } = useOrderCart()

  const [deliveryMethod, setDeliveryMethod] = useState<CheckoutDeliveryMethod | null>(null)
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null)

  useLayoutEffect(() => {
    if (!canSendCartWhatsApp || deliveryDate !== null) return
    setDeliveryDate(getNextCheckoutDeliveryDateIso())
  }, [canSendCartWhatsApp, deliveryDate])

  const checkoutViewTracked = useRef(false)
  const checkoutEnteredAtRef = useRef<number | null>(null)
  const sendWhatsappClickedRef = useRef(false)
  /** ערכי תצוגה אחרונים ל־checkout_abandon (מעודכן בכל רינדור עם עגלה) */
  const checkoutAbandonMetricsRef = useRef({ items_count: 0, value: 0 })

  const cartPreviewLines = useMemo(
    () => getCartPreviewLines(cart, rollsDraft, catalogProducts),
    [cart, rollsDraft],
  )
  const orderCount = getCartDisplayCount(cart, rollsDraft, catalogProducts)
  const orderTotal = cartOrderTotalWithDraft(cart, rollsDraft, catalogProducts)
  const rollsQty = rollsQtyInCart(cart, catalogProducts)
  const rollsPacksInCart = rollsPackCountInCart(cart, catalogProducts)

  const upsellProducts = useMemo(() => {
    const eligible = (p: CatalogProduct) =>
      lineQtyOnCheckout(p, cart, rollsDraft) < 2

    const categoriesInCart = categoriesPresentInOrder(cart, rollsDraft, catalogProducts)

    const list: CatalogProduct[] = []
    const ids = new Set<number>()

    const addIf = (p: CatalogProduct | undefined, complementaryOnly: boolean) => {
      if (!p || ids.has(p.id) || !eligible(p)) return
      if (complementaryOnly && categoriesInCart.has(p.category)) return
      list.push(p)
      ids.add(p.id)
    }

    for (const id of CHECKOUT_UPSELL_PRODUCT_IDS) {
      addIf(catalogProducts.find((x) => x.id === id), true)
      if (list.length >= UPSELL_MAX) return list
    }
    for (const p of catalogProducts) {
      if (list.length >= UPSELL_MAX) break
      addIf(p, true)
    }

    for (const id of CHECKOUT_UPSELL_PRODUCT_IDS) {
      addIf(catalogProducts.find((x) => x.id === id), false)
      if (list.length >= UPSELL_MAX) return list
    }
    for (const p of catalogProducts) {
      if (list.length >= UPSELL_MAX) break
      addIf(p, false)
    }

    return list
  }, [cart, rollsDraft])

  useEffect(() => {
    if (cartPreviewLines.length < 1 || checkoutViewTracked.current) return
    checkoutViewTracked.current = true
    gaEvent('view_checkout')
  }, [cartPreviewLines.length])

  useEffect(() => {
    if (cartPreviewLines.length < 1) return

    checkoutEnteredAtRef.current = Date.now()

    return () => {
      if (sendWhatsappClickedRef.current) return
      const start = checkoutEnteredAtRef.current
      if (start == null) return
      const duration = Date.now() - start
      if (duration <= 300) return
      const { items_count, value } = checkoutAbandonMetricsRef.current
      gaEvent('checkout_abandon', {
        duration_ms: duration,
        items_count,
        value,
      })
    }
    // רק סיבוב הרכבה הראשון עם עגלה — שינוי שורות בעמוד אינו נטישה
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (cartPreviewLines.length > 0) {
    checkoutAbandonMetricsRef.current = {
      items_count: orderCount,
      value: orderTotal,
    }
  }

  if (cartPreviewLines.length === 0) {
    return <Navigate to="/order" replace />
  }

  const checkoutReadyForWa =
    canSendCartWhatsApp && deliveryMethod !== null && deliveryDate !== null

  const selectedDeliveryDate = useMemo(
    () => (deliveryDate ? isoToLocalDate(deliveryDate) : null),
    [deliveryDate],
  )

  const segmentClass = (active: boolean) =>
    [
      'min-h-11 flex-1 touch-manipulation rounded-xl border px-4 py-2.5 text-sm font-semibold transition',
      active
        ? 'border-cocoa bg-cocoa text-cream shadow-sm'
        : 'border-cream-dark/80 bg-cream text-ink hover:bg-cream-dark/35 active:scale-[0.99]',
    ].join(' ')

  return (
    <main id="main" className="relative pb-[max(6rem,calc(env(safe-area-inset-bottom)+3rem))]">
      <section className="border-b border-cream-dark/50 bg-cream-dark/20 py-10 sm:py-14">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <h1 className="font-display text-3xl font-medium text-ink sm:text-4xl">ההזמנה שלך</h1>
          <p className="mt-1 text-sm text-ink/70">בדיקה לפני שליחת ההזמנה</p>
        </div>
      </section>

      <section className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-14">
        <ul className="divide-y divide-cream-dark/60 rounded-2xl border border-cream-dark bg-cream px-5 py-2 shadow-sm">
          {cartPreviewLines.map((line) => (
            <li
              key={line.productId}
              className="flex items-baseline justify-between gap-4 py-4 text-sm text-ink/90 first:pt-3 last:pb-3 sm:text-base"
            >
              <span className="min-w-0 flex-1 leading-snug">{line.title}</span>
              <span className="shrink-0 tabular-nums text-ink/80">×{line.qty}</span>
            </li>
          ))}
        </ul>

        {upsellProducts.length > 0 ? (
          <div className="mt-6">
            <h2 className="mb-2 text-sm font-semibold text-ink">השלמה להזמנה</h2>
            <p className="mt-1 text-xs text-ink/60">פריט קטן נוסף להזמנה</p>
            <div className="flex flex-wrap gap-2">
              {upsellProducts.map((p) => {
                const q = lineQtyOnCheckout(p, cart, rollsDraft)
                return (
                  <div
                    key={p.id}
                    className="flex min-w-0 max-w-full flex-[1_1_8.5rem] items-center gap-2 rounded-xl border border-cream-dark/70 bg-cream-dark/20 px-2.5 py-2 sm:flex-[1_1_10rem]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-snug text-ink">{p.title}</p>
                      <p className="mt-0.5 text-xs tabular-nums text-ink/70">
                        ₪{p.price}
                        {p.priceLabel ? (
                          <span className="text-ink/55"> · {p.priceLabel}</span>
                        ) : null}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`הוספה: ${p.title}`}
                      disabled={q >= 99}
                      onClick={() => setQty(p.id, q + 1)}
                      className="flex size-8 shrink-0 touch-manipulation items-center justify-center rounded-lg border border-cream-dark/80 bg-cream text-ink shadow-sm transition hover:bg-cream-dark/40 hover:shadow active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Plus className="size-4" strokeWidth={2.5} aria-hidden />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-8 space-y-3 rounded-2xl border border-cream-dark/80 bg-cream-dark/25 px-6 py-6">
          {orderCount >= 1 ? (
            <p className="text-sm text-ink/70">סה״כ {orderCount} פריטים</p>
          ) : null}
          {orderTotal > 0 ? (
            <p className="font-display text-lg font-semibold text-ink sm:text-xl">
              סה״כ להזמנה ₪{orderTotal}
            </p>
          ) : null}
          {rollsPacksInCart > 0 ? (
            <p className="text-xs text-ink-muted sm:text-sm">
              מארזי מגולגלות בעגלה: {rollsPacksInCart}
            </p>
          ) : null}
        </div>

        {crumbleCookiesQty > 0 && !isValidCrumblePackTotal(crumbleCookiesQty) ? (
          <p className="mt-6 rounded-xl border border-gold-deep/50 bg-gold/15 px-4 py-3 text-sm leading-relaxed text-ink">
            {crumblePackIssueDescription(crumbleCookiesQty)}
          </p>
        ) : null}
        {rollsQty > 0 && !isValidRollsPackTotal(rollsQty) ? (
          <p className="mt-4 rounded-xl border border-gold-deep/50 bg-gold/15 px-4 py-3 text-sm leading-relaxed text-ink">
            {rollsPackIssueDescription(rollsQty)}
          </p>
        ) : null}

        {canSendCartWhatsApp ? (
          <div className="mt-8 space-y-5 rounded-2xl border border-cream-dark/80 bg-cream-dark/25 px-6 py-6">
            <div>
              <h2 className="text-sm font-semibold text-ink">אופן קבלה</h2>
              <p className="mt-1 text-xs text-ink/60">בחרו איסוף עצמי או משלוח</p>
              <div className="mt-3 flex gap-2" role="group" aria-label="אופן קבלה">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={segmentClass(deliveryMethod === 'pickup')}
                >
                  איסוף עצמי
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('delivery')}
                  className={segmentClass(deliveryMethod === 'delivery')}
                >
                  משלוח
                </button>
              </div>
              <p className="mt-3 text-xs text-ink/55">הזמנה תאושר בוואטסאפ לאחר השליחה</p>
            </div>
            <div>
              <label htmlFor="checkout-delivery-date" className="text-sm font-semibold text-ink">
                תאריך רצוי
              </label>
              <p className="mt-1 text-xs text-ink/60">לא ניתן לבחור תאריך בעבר.</p>
              <p className="mt-2 text-xs font-medium text-ink/80">בחרו יום נוח:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(
                  [
                    { dow: 3 as const, label: 'רביעי הקרוב' },
                    { dow: 4 as const, label: 'חמישי' },
                    { dow: 5 as const, label: 'שישי' },
                  ] as const
                ).map(({ dow, label }) => {
                  const iso = getNextCheckoutDateForWeekday(dow)
                  const active = deliveryDate === iso
                  return (
                    <button
                      key={dow}
                      type="button"
                      onClick={() => setDeliveryDate(iso)}
                      className={[
                        'touch-manipulation rounded-lg border px-3 py-2 text-sm font-medium transition',
                        active
                          ? 'border-cocoa bg-cocoa text-cream'
                          : 'border-cream-dark/70 bg-cream text-ink hover:bg-cream-dark/35',
                      ].join(' ')}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
              <div className="mt-2 [&_.react-datepicker-wrapper]:w-full" dir="rtl">
                <DatePicker
                  id="checkout-delivery-date"
                  selected={selectedDeliveryDate}
                  onChange={(date: Date | null) => {
                    if (!date) {
                      setDeliveryDate(null)
                      return
                    }
                    setDeliveryDate(localDateToIso(date))
                  }}
                  filterDate={filterCheckoutDate}
                  locale={he}
                  calendarStartDay={0}
                  formatWeekDay={formatCheckoutWeekDayLabel}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="בחר תאריך"
                  wrapperClassName="w-full"
                  className="w-full rounded-xl border border-cream-dark/80 bg-white px-4 py-3 text-sm text-ink shadow-sm"
                  calendarClassName="!font-sans"
                  popperClassName="z-50"
                  showPopperArrow={false}
                  autoComplete="off"
                />
              </div>
              <p className="mt-2 text-xs text-ink/55">ניתן לבחור ימים רביעי–שישי בלבד</p>
            </div>
          </div>
        ) : null}

        {canSendCartWhatsApp ? (
          <>
            <p className="mb-2 mt-8 text-center text-xs text-ink/60">
              שליחה עכשיו תשמור מקום למשלוח השבוע
            </p>
            <button
              type="button"
              disabled={!checkoutReadyForWa}
              onClick={() => {
                if (deliveryMethod === null || deliveryDate === null) return
                console.log(deliveryMethod, deliveryDate)
                sendWhatsappClickedRef.current = true
                gaEvent('send_whatsapp', {
                  value: orderTotal,
                  currency: 'ILS',
                })
                const baseMessage = buildCartWhatsAppMessage(cart, catalogProducts)
                const finalMessage = mergeCartWhatsAppWithCheckoutDelivery(
                  baseMessage,
                  deliveryMethod,
                  deliveryDate,
                )
                window.open(whatsappLink(finalMessage), '_blank', 'noopener,noreferrer')
              }}
              className="inline-flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-full border border-cream/40 bg-cocoa px-6 py-3.5 text-base font-semibold text-cream shadow-md transition hover:bg-gold-deep active:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg"
            >
              <MessageCircle className="size-5 shrink-0" aria-hidden />
              שליחה לוואטסאפ
            </button>
          </>
        ) : (
          <p className="mt-8 text-center text-sm text-ink-muted">
            להמשך שליחה — חזרה לתפריט והתאמת כמויות למארזים: קראמבל (4/6) או מגולגלות (12).
          </p>
        )}

        <p className="mt-6 text-center">
          <Link
            to="/order"
            className="text-sm font-semibold text-gold-deep underline-offset-4 hover:underline"
          >
            הוספת פריטים להזמנה
          </Link>
        </p>
      </section>
    </main>
  )
}
