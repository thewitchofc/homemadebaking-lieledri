import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import { he } from 'date-fns/locale'
import { ArrowRight, MessageCircle } from 'lucide-react'
import 'react-datepicker/dist/react-datepicker.min.css'
import {
  buildCartWhatsAppMessage,
  cartOrderTotalWithDraft,
  catalogProducts,
  cartLinePriceForProduct,
  checkoutTimeSlotRangeLabel,
  crumblePackIssueDescription,
  getCartPreviewLines,
  getNextCheckoutDateForWeekday,
  getNextCheckoutDeliveryDateIso,
  isValidCrumblePackTotal,
  isValidPreferredTimeSlotStartForIso,
  isValidRollsPackTotal,
  mergeCartWhatsAppWithCheckoutDelivery,
  GREETING_CARD_PRODUCT_ID,
  preferredTimeSlotStartsForCheckoutIso,
  rollsPackCountInCart,
  rollsPackIssueDescription,
  rollsQtyInCart,
  type CartState,
  type CheckoutDeliveryMethod,
} from '../catalog'
import { gaEvent } from '../analytics'
import { useOrderCart } from '../contexts/OrderCartContext'
import { DocumentMeta } from '../components/DocumentMeta'
import { site, siteSeo, whatsappLink } from '../siteConfig'
import {
  premiumActionButtonClass,
  sectionBodyClass,
  sectionDescClass,
  sectionInner,
  sectionShell,
  sectionTitleClass,
  sectionTitleToContentClass,
} from '../sectionLayout'

type PaymentMethod = 'card' | 'bit_paybox' | 'cash'

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

function mergedCartForWhatsApp(cart: CartState, rollsDraft: CartState): CartState {
  const out: CartState = { ...cart }
  for (const p of catalogProducts) {
    if (p.category !== 'rolls') continue
  const c = cart[p.id] ?? 0
    const d = rollsDraft[p.id] ?? 0
    const q = c + d
    if (q > 0) out[p.id] = q
    else delete out[p.id]
  }
  return out
}

function digitsOnly(s: string): string {
  return s.replace(/\D/g, '')
}

function isValidPhoneIL(raw: string): boolean {
  const d = digitsOnly(raw)
  if (d.length < 9) return false
  if (d.length > 12) return false
  return true
}

function isValidEmailOptional(s: string): boolean {
  const t = s.trim()
  if (t === '') return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)
}

const inputClass =
  'mt-1 w-full rounded-xl border border-cream-dark/70 bg-white px-3.5 py-3 text-sm text-ink shadow-sm transition placeholder:text-ink/35 focus:border-gold-deep focus:outline-none focus:ring-1 focus:ring-gold-deep/30'

const labelClass = 'text-sm font-medium text-ink'

const paymentLabels: Record<PaymentMethod, string> = {
  card: 'אשראי',
  bit_paybox: 'ביט / פייבוקס',
  cash: 'מזומן לשליח',
}

const checkoutCardClass = 'rounded-2xl border border-cream-dark/40 bg-white p-6'

export default function CheckoutPage() {
  const {
    cart,
    rollsDraft,
    canSendCartWhatsApp,
    crumbleCookiesQty,
    greetingCardText,
    setGreetingCardText,
  } = useOrderCart()

  const [deliveryMethod, setDeliveryMethod] = useState<CheckoutDeliveryMethod | null>(null)
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null)
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<string | null>(null)

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [street, setStreet] = useState('')
  const [houseNumber, setHouseNumber] = useState('')
  const [aptFloor, setAptFloor] = useState('')
  const [orderNotes, setOrderNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)

  const [submitAttempted, setSubmitAttempted] = useState(false)

  useLayoutEffect(() => {
    if (!canSendCartWhatsApp || deliveryDate !== null) return
    setDeliveryDate(getNextCheckoutDeliveryDateIso())
  }, [canSendCartWhatsApp, deliveryDate])

  const checkoutViewTracked = useRef(false)
  const checkoutEnteredAtRef = useRef<number | null>(null)
  const sendWhatsappClickedRef = useRef(false)
  const checkoutAbandonMetricsRef = useRef({ items_count: 0, value: 0 })

  const cartPreviewLines = useMemo(
    () => getCartPreviewLines(cart, rollsDraft, catalogProducts),
    [cart, rollsDraft],
  )
  const orderCount = useMemo(() => {
    let n = 0
    for (const line of cartPreviewLines) n += line.qty
    return n
  }, [cartPreviewLines])
  const orderTotal = cartOrderTotalWithDraft(cart, rollsDraft, catalogProducts)
  const deliveryFee = site.deliveryFeeCenterShekels
  const checkoutGrandTotal =
    deliveryMethod === 'delivery' ? orderTotal + deliveryFee : orderTotal
  const rollsQty = rollsQtyInCart(cart, catalogProducts)
  const rollsPacksInCart = rollsPackCountInCart(cart, catalogProducts)
  const hasGreetingCardInCart = (cart[GREETING_CARD_PRODUCT_ID] ?? 0) > 0

  const timeSlots = useMemo(
    () => (deliveryDate ? preferredTimeSlotStartsForCheckoutIso(deliveryDate) : []),
    [deliveryDate],
  )

  const slotDayBlurb = useMemo(() => {
    if (!deliveryDate) return ''
    const d = isoToLocalDate(deliveryDate)
    if (Number.isNaN(d.getTime())) return ''
    const dow = d.getDay()
    if (dow === 5) return `חלון זמן: ${site.pickupWindowFri}.`
    return `חלון זמן: ${site.pickupWindowWedThu}.`
  }, [deliveryDate])

  useEffect(() => {
    if (!deliveryDate) {
      setPreferredTimeSlot(null)
      return
    }
    const slots = preferredTimeSlotStartsForCheckoutIso(deliveryDate)
    setPreferredTimeSlot((prev) => (prev && slots.includes(prev) ? prev : null))
  }, [deliveryDate])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (cartPreviewLines.length > 0) {
    checkoutAbandonMetricsRef.current = {
      items_count: orderCount,
      value: checkoutGrandTotal,
    }
  }

  const selectedDeliveryDate = useMemo(
    () => (deliveryDate ? isoToLocalDate(deliveryDate) : null),
    [deliveryDate],
  )

  if (cartPreviewLines.length === 0) {
    return (
      <>
        <DocumentMeta title={siteSeo.defaultTitle} description={siteSeo.defaultDescription} />
        <Navigate to="/order" replace />
      </>
    )
  }

  const checkoutReadyForSchedule =
    deliveryMethod !== null &&
    deliveryDate !== null &&
    preferredTimeSlot != null &&
    preferredTimeSlot !== '' &&
    isValidPreferredTimeSlotStartForIso(deliveryDate, preferredTimeSlot)

  const nameOk = fullName.trim().length >= 2
  const phoneOk = isValidPhoneIL(phone)
  const emailOk = isValidEmailOptional(email)
  const addressOk =
    deliveryMethod !== 'delivery' ||
    (city.trim().length >= 1 && street.trim().length >= 1 && houseNumber.trim().length >= 1)
  const paymentOk = paymentMethod !== null

  const fieldError = (ok: boolean) => submitAttempted && !ok

  const segmentClass = (active: boolean) =>
    [
      'min-h-11 flex-1 touch-manipulation rounded-xl border px-3 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep',
      active
        ? 'border-cocoa bg-cocoa text-cream shadow-sm'
        : 'border-cream-dark/80 bg-cream text-ink hover:bg-cream-dark/35 active:scale-[0.99]',
    ].join(' ')

  const paymentCardClass = (active: boolean) =>
    [
      'flex min-h-[3.25rem] w-full touch-manipulation items-center justify-center rounded-xl border px-3 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep',
      active
        ? 'border-cocoa bg-cocoa/5 text-ink shadow-sm ring-1 ring-cocoa/25'
        : 'border-cream-dark/70 bg-white text-ink hover:border-cream-dark',
    ].join(' ')

  function appendCustomerBlock(base: string): string {
    let prefix = base.trimEnd()
    if (hasGreetingCardInCart) {
      const msg = greetingCardText.trim()
      prefix += `\n\nכרטיס ברכה — מה לכתוב בכרטיס:\n${msg || '(כרטיס ללא טקסט)'}\n`
    }
    const lines: string[] = ['', 'פרטי קשר ותשלום:', `שם מלא: ${fullName.trim()}`]
    lines.push(`טלפון: ${phone.trim()}`)
    if (email.trim()) lines.push(`אימייל: ${email.trim()}`)
    if (deliveryMethod === 'delivery') {
      lines.push(
        `כתובת למשלוח: ${city.trim()}, ${street.trim()} ${houseNumber.trim()}` +
          (aptFloor.trim() ? `, ${aptFloor.trim()}` : ''),
      )
    } else if (deliveryMethod === 'pickup') {
      lines.push(`איסוף עצמי — ${site.pickupAddress}`)
    }
    if (orderNotes.trim()) lines.push(`הערות להזמנה: ${orderNotes.trim()}`)
    if (paymentMethod) lines.push(`אמצעי תשלום: ${paymentLabels[paymentMethod]}`)
    return `${prefix}${lines.join('\n')}`
  }

  const handleSubmit = () => {
    setSubmitAttempted(true)
    if (
      !canSendCartWhatsApp ||
      deliveryMethod === null ||
      deliveryDate === null ||
      !preferredTimeSlot ||
      !isValidPreferredTimeSlotStartForIso(deliveryDate, preferredTimeSlot)
    ) {
      return
    }
    if (!nameOk || !phoneOk || !emailOk || !addressOk || !paymentOk) return

    sendWhatsappClickedRef.current = true
    gaEvent('send_whatsapp', {
      value: checkoutGrandTotal,
      currency: 'ILS',
    })
    const merged = mergedCartForWhatsApp(cart, rollsDraft)
    const baseMessage = buildCartWhatsAppMessage(merged, catalogProducts)
    const withCheckout = mergeCartWhatsAppWithCheckoutDelivery(
      baseMessage,
      deliveryMethod,
      deliveryDate,
      {
        preferredTimeSlotStart: preferredTimeSlot,
        ...(deliveryMethod === 'delivery'
          ? {
              cartSubtotalShekels: orderTotal,
              centerDeliveryFeeShekels: deliveryFee,
              whatsappDeliveryFeeDescriptionLine: `משלוח ל־${site.deliveryFeeCenterArea}: ₪${deliveryFee}`,
            }
          : {}),
      },
    )
    window.open(whatsappLink(appendCustomerBlock(withCheckout)), '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <DocumentMeta
        title={`פרטי הזמנה | ${site.brandHe}`}
        description={`סיכום עגלה, משלוח ל־${site.deliveryFeeCenterArea} בתיאום, ושליחת הזמנה לוואטסאפ לאישור — ${site.brandHe}.`}
      />
      <main
        id="main"
        className="relative z-[1] min-h-[100svh] overflow-x-hidden bg-[linear-gradient(180deg,#f7f3ee_0%,#efe7df_100%)]"
      >
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 top-[var(--header-h)] z-0"
          aria-hidden
        >
          <img
            src="/checkout-table.jpg?v=3"
            srcSet="/checkout-table.jpg?v=3 1024w, /checkout-table-4k.jpg?v=3 3840w"
            sizes="100vw"
            alt=""
            width={3840}
            height={2557}
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
          className="pointer-events-none fixed bottom-0 left-0 right-0 top-[var(--header-h)] z-0 bg-[linear-gradient(180deg,rgba(247,243,238,0.25)_0%,transparent_28%,transparent_72%,rgba(239,231,223,0.35)_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 top-[var(--header-h)] z-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(42,32,26,0.08)_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 top-[var(--header-h)] z-0 bg-[url('/noise.png')] bg-repeat opacity-[0.035] mix-blend-multiply"
          aria-hidden
        />
        <div className={`relative z-10 ${sectionShell}`}>
          <div
            className={`${sectionInner} mx-auto flex max-w-lg flex-col gap-6 pb-[max(6rem,calc(env(safe-area-inset-bottom)+3rem))]`}
          >
        <header className="flex flex-col gap-2 text-center">
          <h1 className={sectionTitleClass}>פרטי הזמנה</h1>
          <p className={`${sectionDescClass} mx-auto max-w-sm leading-relaxed`}>
            סיכום העגלה, כתובת למשלוח ואמצעי תשלום — שליחה אחת לוואטסאפ לאישור.
          </p>
        </header>

        <section className={checkoutCardClass} aria-labelledby="checkout-summary-heading">
          <h2 id="checkout-summary-heading" className={sectionTitleClass}>
            סיכום הזמנה
          </h2>
          <div className={`${sectionBodyClass} ${sectionTitleToContentClass}`}>
          <ul className="divide-y divide-cream-dark/50">
            {cartPreviewLines.map((line) => {
              const product = catalogProducts.find((p) => p.id === line.productId)
              const lineTotal = product
                ? cartLinePriceForProduct(product, line.qty)
                : 0
              return (
            <li
              key={line.productId}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3.5 first:pt-0"
                >
                  <span className="min-w-0 flex-1 text-sm font-medium leading-snug text-ink">
                    {line.title}
                  </span>
                  <span className="shrink-0 tabular-nums text-sm text-ink/75">×{line.qty}</span>
                  <span className="w-full text-end text-sm font-semibold tabular-nums text-ink sm:w-auto sm:text-start">
                    ₪{lineTotal}
                  </span>
            </li>
              )
            })}
        </ul>
          <div className="mt-4 border-t border-cream-dark/60 pt-4">
            {deliveryMethod === 'delivery' ? (
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between gap-4 tabular-nums text-ink/80">
                  <span>סה״כ מוצרים</span>
                  <span>₪{orderTotal}</span>
                </div>
                <div className="flex justify-between gap-4 tabular-nums text-ink/80">
                  <span>משלוח ({site.deliveryFeeCenterArea})</span>
                  <span>₪{deliveryFee}</span>
                </div>
                <p className="flex justify-between gap-4 pt-1 font-display text-lg font-semibold tabular-nums text-ink">
                  <span>סה״כ לתשלום</span>
                  <span>₪{checkoutGrandTotal}</span>
                      </p>
                    </div>
            ) : (
              <p className="flex justify-between gap-4 font-display text-lg font-semibold tabular-nums text-ink">
                <span>סה״כ לתשלום</span>
                <span>₪{orderTotal}</span>
              </p>
            )}
          </div>
          {orderCount >= 1 ? (
            <p className="mt-3 text-xs text-ink/50">{orderCount} יחידות בהזמנה</p>
          ) : null}
          {rollsPacksInCart > 0 ? (
            <p className="mt-1 text-xs text-ink-muted">מארזי מגולגלות בעגלה: {rollsPacksInCart}</p>
          ) : null}
        </div>
        </section>

        {crumbleCookiesQty > 0 && !isValidCrumblePackTotal(crumbleCookiesQty) ? (
          <p className="rounded-2xl border border-gold-deep/40 bg-gold/10 px-4 py-3 text-sm leading-relaxed text-ink">
            {crumblePackIssueDescription(crumbleCookiesQty)}
          </p>
        ) : null}
        {rollsQty > 0 && !isValidRollsPackTotal(rollsQty) ? (
          <p className="rounded-2xl border border-gold-deep/40 bg-gold/10 px-4 py-3 text-sm leading-relaxed text-ink">
            {rollsPackIssueDescription(rollsQty)}
          </p>
        ) : null}

        {canSendCartWhatsApp ? (
          <div className="flex flex-col gap-6">
            <section className={checkoutCardClass} aria-labelledby="checkout-schedule-heading">
              <h2 id="checkout-schedule-heading" className={sectionTitleClass}>
                אופן קבלה, תאריך ושעה
              </h2>
              <p className={`${sectionDescClass} mt-2 text-xs leading-relaxed`}>
                נדרש לתיאום איסוף או משלוח. במשלוח מתווספים ₪{deliveryFee} ל־{site.deliveryFeeCenterArea}.
              </p>
              <div className={`${sectionBodyClass} ${sectionTitleToContentClass}`}>
              <div className="flex gap-2" role="group" aria-label="אופן קבלה">
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

              <div className="mt-5">
                <label htmlFor="checkout-delivery-date" className={labelClass}>
                  תאריך
              </label>
                <p className="mt-0.5 text-xs text-ink/55">ימים רביעי–שישי בלבד</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(
                  [
                      { dow: 5 as const, label: 'שישי' },
                      { dow: 4 as const, label: 'חמישי' },
                    { dow: 3 as const, label: 'רביעי הקרוב' },
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
                          'touch-manipulation rounded-xl border px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep',
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
                    placeholderText="בחרו תאריך"
                  wrapperClassName="w-full"
                    className={`${inputClass} mt-2`}
                  calendarClassName="!font-sans"
                  popperClassName="z-50"
                  showPopperArrow={false}
                  autoComplete="off"
                />
              </div>
            </div>

              {deliveryDate && timeSlots.length > 0 ? (
                <div className="mt-5">
                  <label htmlFor="checkout-pref-time" className={labelClass}>
                    שעה מועדפת
                  </label>
                  <p className="mt-0.5 text-xs text-ink/60">{slotDayBlurb}</p>
                  <select
                    id="checkout-pref-time"
                    value={preferredTimeSlot ?? ''}
                    onChange={(e) => setPreferredTimeSlot(e.target.value || null)}
                    className={inputClass}
                  >
                    <option value="">בחרו שעה</option>
                    {timeSlots.map((t) => {
                      const label = checkoutTimeSlotRangeLabel(t)
                      return (
                        <option key={t} value={t}>
                          {label ?? t}
                        </option>
                      )
                    })}
                  </select>
          </div>
        ) : null}

              {submitAttempted && canSendCartWhatsApp && !checkoutReadyForSchedule ? (
                <p className="mt-3 text-xs text-red-800/90" role="alert">
                  יש לבחור אופן קבלה, תאריך ושעה מועדפת.
                </p>
              ) : null}
              </div>
            </section>

            <section className={checkoutCardClass} aria-labelledby="checkout-shipping-heading">
              <h2 id="checkout-shipping-heading" className={sectionTitleClass}>
                {deliveryMethod === 'delivery' ? 'פרטי משלוח' : 'פרטי קשר'}
              </h2>
              <div className={`space-y-4 ${sectionTitleToContentClass}`}>
                <div>
                  <label htmlFor="co-fullname" className={labelClass}>
                    שם מלא <span className="text-red-800/80">*</span>
                  </label>
                  <input
                    id="co-fullname"
                    name="fullName"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={inputClass}
                    placeholder="לדוגמה: תמר לוי"
                  />
                  {fieldError(!nameOk) ? (
                    <p className="mt-1 text-xs text-red-800/90">נא למלא שם מלא.</p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="co-phone" className={labelClass}>
                    טלפון <span className="text-red-800/80">*</span>
                  </label>
                  <input
                    id="co-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                    placeholder="05X-XXX-XXXX"
                  />
                  {fieldError(!phoneOk) ? (
                    <p className="mt-1 text-xs text-red-800/90">נא למלא מספר טלפון תקין.</p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="co-email" className={labelClass}>
                    אימייל <span className="text-xs font-normal text-ink/50">(אופציונלי)</span>
                  </label>
                  <input
                    id="co-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="name@example.com"
                  />
                  {fieldError(!emailOk) ? (
                    <p className="mt-1 text-xs text-red-800/90">כתובת האימייל אינה תקינה.</p>
                  ) : null}
                </div>

                {deliveryMethod === 'delivery' ? (
                  <>
                    <div>
                      <label htmlFor="co-city" className={labelClass}>
                        עיר <span className="text-red-800/80">*</span>
                      </label>
                      <input
                        id="co-city"
                        name="city"
                        autoComplete="address-level2"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={inputClass}
                      />
                      {fieldError(deliveryMethod === 'delivery' && city.trim().length < 1) ? (
                        <p className="mt-1 text-xs text-red-800/90">נא למלא עיר.</p>
                      ) : null}
                    </div>
                    <div>
                      <label htmlFor="co-street" className={labelClass}>
                        רחוב <span className="text-red-800/80">*</span>
                      </label>
                      <input
                        id="co-street"
                        name="street"
                        autoComplete="street-address"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className={inputClass}
                      />
                      {fieldError(deliveryMethod === 'delivery' && street.trim().length < 1) ? (
                        <p className="mt-1 text-xs text-red-800/90">נא למלא רחוב.</p>
                      ) : null}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="co-house" className={labelClass}>
                          מספר בית <span className="text-red-800/80">*</span>
                        </label>
                        <input
                          id="co-house"
                          name="houseNumber"
                          value={houseNumber}
                          onChange={(e) => setHouseNumber(e.target.value)}
                          className={inputClass}
                        />
                        {fieldError(
                          deliveryMethod === 'delivery' && houseNumber.trim().length < 1,
                        ) ? (
                          <p className="mt-1 text-xs text-red-800/90">נא למלא מספר בית.</p>
                        ) : null}
                      </div>
                      <div>
                        <label htmlFor="co-apt" className={labelClass}>
                          דירה / קומה
                        </label>
                        <input
                          id="co-apt"
                          name="aptFloor"
                          value={aptFloor}
                          onChange={(e) => setAptFloor(e.target.value)}
                          className={inputClass}
                          placeholder="אופציונלי"
                        />
                      </div>
                    </div>
                  </>
                ) : deliveryMethod === 'pickup' ? (
                  <p className="rounded-xl border border-cream-dark/40 bg-cream-dark/20 px-3 py-2.5 text-xs leading-relaxed text-ink/75">
                    איסוף עצמי מ־{site.pickupAddress}
                  </p>
                ) : null}

                <div>
                  <label htmlFor="co-notes" className={labelClass}>
                    הערות להזמנה
                  </label>
                  <textarea
                    id="co-notes"
                    name="orderNotes"
                    rows={3}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className={`${inputClass} resize-y min-h-[5.5rem]`}
                    placeholder="אלרגיות, הודעה לשליח…"
                  />
                </div>

                {hasGreetingCardInCart ? (
                  <div>
                    <label htmlFor="co-greeting-card" className={labelClass}>
                      מה לכתוב בכרטיס הברכה
                    </label>
                    <p className="mt-0.5 text-xs text-ink/55">עד 50 תווים</p>
                    <textarea
                      id="co-greeting-card"
                      name="greetingCardText"
                      rows={3}
                      maxLength={50}
                      value={greetingCardText}
                      onChange={(e) => setGreetingCardText(e.target.value)}
                      className={`${inputClass} resize-y min-h-[5.5rem]`}
                      placeholder="למשל: חג שמח! אוהבים מאוד…"
                    />
                    <p className="mt-1 text-end text-xs tabular-nums text-ink/45">
                      {greetingCardText.length}/50
                    </p>
                  </div>
                ) : null}
              </div>
            </section>

            <section className={checkoutCardClass} aria-labelledby="checkout-pay-heading">
              <h2 id="checkout-pay-heading" className={sectionTitleClass}>
                תשלום
              </h2>
              <p className={`${sectionDescClass} mt-2 text-xs`}>בחירת אמצעי — האישור והתשלום בוואטסאפ.</p>
              <div
                className={`flex flex-col gap-3 ${sectionTitleToContentClass}`}
                role="radiogroup"
                aria-label="אמצעי תשלום"
              >
                {(['card', 'bit_paybox', 'cash'] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={paymentMethod === key}
                    onClick={() => setPaymentMethod(key)}
                    className={paymentCardClass(paymentMethod === key)}
                  >
                    {paymentLabels[key]}
                  </button>
                ))}
              </div>
              {fieldError(!paymentOk) ? (
                <p className="mt-2 text-xs text-red-800/90">נא לבחור אמצעי תשלום.</p>
              ) : null}
            </section>

            <div className="flex flex-col gap-4">
            <button
              type="button"
              disabled={!canSendCartWhatsApp}
              onClick={handleSubmit}
              className={`${premiumActionButtonClass} min-h-11 w-full justify-center disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:opacity-45 disabled:hover:shadow-none disabled:active:scale-100`}
            >
              <MessageCircle className="size-5 shrink-0 opacity-95" aria-hidden />
              שלח הזמנה
            </button>
            <p className="text-center text-xs text-ink/55">
              ההזמנה נשלחת בוואטסאפ — נחזור אליכם לאישור ולתיאום סופי.
            </p>
            </div>
          </div>
        ) : (
          <p className={`text-center text-sm text-ink-muted ${checkoutCardClass}`}>
            להמשך — חזרו לתפריט והתאימו כמויות למארזים: קראמבל (4/6) או מגולגלות (12).
          </p>
        )}

        <p className="flex justify-center">
          <Link
            to="/order"
            className="inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-gold-deep underline-offset-4 transition hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
          >
            <ArrowRight className="size-4 rotate-180" aria-hidden />
            חזרה לתפריט מתוקים
          </Link>
        </p>
          </div>
        </div>
    </main>
    </>
  )
}
