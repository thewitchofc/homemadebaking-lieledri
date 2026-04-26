import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type PointerEventHandler,
} from 'react'
import { Link } from 'react-router-dom'
import { Cake, Minus, Plus, ShoppingCart, Star, Truck, type LucideIcon } from 'lucide-react'
import {
  GREETING_CARD_PRODUCT_ID,
  ROLLS_PACK_SIZE,
  catalogProducts,
  catalogQuickPickProducts,
  categoryLabels,
  categoryOrder,
  catalogImageUrl,
  CRUMBLE_PACK_ORDER_HINT_HE,
  crumbleCookiesQtyInCart,
  crumblePackIssueDescription,
  isValidCrumblePackTotal,
  isValidRollsPackTotal,
  rollsPackIssueDescription,
  rollsQtyInCart,
  sumRollsDraft,
  type CartState,
  type CatalogProduct,
  type ProductCategory,
} from '../catalog'
import {
  premiumActionButtonClass,
  sectionDescClass,
  sectionShell,
  sectionTitleClass,
} from '../sectionLayout'

const catalogPlusFocusClass =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep'

const catalogPlusButtonClass = `
  relative isolate flex h-8 w-8 shrink-0 touch-manipulation items-center justify-center
  overflow-hidden rounded-full bg-cocoa text-cream
  sm:h-9 sm:w-9
  transition-all duration-200
  hover:scale-105 active:scale-95
  disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100
  ${catalogPlusFocusClass}
`.replace(/\s+/g, ' ').trim()

/** כפתור + על הכרטיס (מובייל: 7×7; מ־sm: מעל התמונה) */
const catalogPlusOnCardClass = `
  absolute top-2 right-2 z-20 isolate
  flex h-7 w-7 shrink-0 touch-manipulation items-center justify-center
  overflow-hidden rounded-full bg-cocoa text-cream text-xs
  sm:left-2 sm:right-auto sm:top-2 sm:h-9 sm:w-9 sm:text-base
  transition
  hover:scale-110 active:scale-95 max-sm:hover:scale-100
  disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100
  ${catalogPlusFocusClass}
`.replace(/\s+/g, ' ').trim()

function CatalogPlusButton({
  visual = 'default',
  className = '',
  children,
  disabled,
  onPointerDown,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { visual?: 'default' | 'onCard' }) {
  const [rippleKey, setRippleKey] = useState<number | null>(null)
  const clearRipple = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (clearRipple.current) window.clearTimeout(clearRipple.current)
    }
  }, [])

  const handlePointerDown: PointerEventHandler<HTMLButtonElement> = (e) => {
    if (!disabled) {
      if (clearRipple.current) window.clearTimeout(clearRipple.current)
      setRippleKey(Date.now())
      clearRipple.current = window.setTimeout(() => {
        setRippleKey(null)
        clearRipple.current = null
      }, 500)
    }
    onPointerDown?.(e)
  }

  const baseClass = visual === 'onCard' ? catalogPlusOnCardClass : catalogPlusButtonClass
  const rippleClass =
    visual === 'onCard'
      ? 'bg-white/30 motion-safe:animate-[plus-ripple_0.48s_ease-out_forwards]'
      : 'bg-cream/35 motion-safe:animate-[plus-ripple_0.48s_ease-out_forwards]'

  return (
    <button
      type="button"
      className={`${baseClass} ${className}`.trim()}
      {...rest}
      disabled={disabled}
      onPointerDown={handlePointerDown}
    >
      {rippleKey != null ? (
        <span
          key={rippleKey}
          className={`pointer-events-none absolute inset-0 z-0 rounded-full ${rippleClass}`}
          aria-hidden
        />
      ) : null}
      <span className="relative z-10 flex items-center justify-center">{children}</span>
    </button>
  )
}

function GreetingCardCatalogRow({
  cart,
  onChangeQty,
  scrollMtClass = 'scroll-mt-36',
}: {
  cart: CartState
  onChangeQty: (productId: number, nextQty: number) => void
  scrollMtClass?: string
}) {
  const p = catalogProducts.find((x) => x.id === GREETING_CARD_PRODUCT_ID)
  if (!p) return null
  const qty = cart[p.id] ?? 0
  const bump = (delta: number) => {
    if (delta > 0 && qty >= 1) return
    onChangeQty(p.id, Math.max(0, Math.min(1, qty + delta)))
  }
  const stepMinus =
    'flex h-8 w-8 shrink-0 touch-manipulation items-center justify-center rounded-md border border-cream-dark/70 bg-cream/90 text-ink enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 md:transition md:enabled:hover:border-gold-deep md:enabled:hover:text-gold-deep'

  return (
    <div
      id="greeting-card-row"
      data-category-section
      className={`scroll-mt-[100px] mx-auto w-full max-w-md sm:max-w-lg ${scrollMtClass}`}
    >
      <article className="flex w-full items-start gap-2.5 rounded-xl bg-white/90 p-4 shadow-sm backdrop-blur-sm sm:items-center sm:gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-cream-dark/35 bg-white/80 sm:h-14 sm:w-14">
          <img
            src={catalogImageUrl(p.imageFile)}
            alt="דוגמה לכרטיס ברכה ריק עם לב"
            width={112}
            height={112}
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>
        <div className="min-w-0 flex-1 text-start">
          <h2 className="font-display text-sm font-semibold leading-tight text-ink sm:text-base">
            {p.title}
          </h2>
          <p className="mt-0.5 text-[11px] leading-snug text-ink-muted sm:text-xs">{p.desc}</p>
          <div className="mt-1.5 flex flex-wrap items-center justify-start gap-x-2 gap-y-1">
            <p className="text-xs font-semibold tabular-nums text-ink sm:text-sm">
              ₪{p.price}
              <span className="ms-1 font-normal text-ink-muted">({p.priceLabel})</span>
            </p>
            <div className="flex shrink-0 items-center gap-1">
              {qty < 1 ? (
                <CatalogPlusButton aria-label={`הוספת ${p.title} להזמנה`} onClick={() => bump(1)}>
                  <Plus className="size-3.5" strokeWidth={2} aria-hidden />
                </CatalogPlusButton>
              ) : (
                <>
                  <button
                    type="button"
                    aria-label="הסרת כרטיס ברכה"
                    onClick={() => bump(-1)}
                    className={`${stepMinus} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep`}
                  >
                    <Minus className="size-3.5" strokeWidth={2} aria-hidden />
                  </button>
                  <span className="min-w-[1.75rem] text-center font-display text-xs font-semibold tabular-nums text-ink">
                    {qty}
                  </span>
                  <CatalogPlusButton aria-label="כבר נוסף — כרטיס אחד בלבד" disabled>
                    <Plus className="size-3.5" strokeWidth={2} aria-hidden />
                  </CatalogPlusButton>
                </>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}

function CategoryDivider({
  category,
  className = '',
  dense,
}: {
  category: ProductCategory
  className?: string
  dense?: boolean
}) {
  const { title, subtitle } = categoryLabels[category]
  const rollsSample =
    category === 'rolls' ? catalogProducts.find((p) => p.category === 'rolls') : undefined
  const cookiesSample =
    category === 'cookies' ? catalogProducts.find((p) => p.category === 'cookies') : undefined
  const priceL = dense
    ? 'font-display text-xl font-medium text-ink sm:text-2xl'
    : 'font-display text-2xl font-medium text-ink sm:text-3xl'
  const priceN = dense
    ? 'font-display text-xl font-semibold text-ink sm:text-2xl'
    : 'font-display text-2xl font-semibold text-ink sm:text-3xl'
  const priceLbl = dense ? 'text-sm text-ink-muted sm:text-base' : 'text-base text-ink-muted sm:text-lg'

  return (
    <div className={`flex flex-col ${dense ? 'gap-2' : 'gap-4'} ${className}`}>
      <div
        className={`flex flex-col sm:flex-row sm:flex-wrap sm:items-baseline ${
          dense ? 'gap-2 sm:gap-x-3 sm:gap-y-1' : 'gap-4 sm:gap-x-4 sm:gap-y-2'
        }`}
      >
          <h3
            id={`heading-${category}`}
            className={
              dense
                ? 'font-display text-lg font-semibold tracking-tight text-ink sm:text-2xl'
                : sectionTitleClass
            }
          >
            {title}
          </h3>
          {rollsSample ? (
            <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-ink">
              <span className={priceL}>מחיר למארז</span>
              <span className={priceN}>₪{rollsSample.price}</span>
              {rollsSample.priceLabel ? (
                <>
                  <span className="mx-0.5 text-ink-muted/70 sm:mx-1.5" aria-hidden>
                    ·
                  </span>
                  <span className={priceLbl}>{rollsSample.priceLabel}</span>
                </>
              ) : null}
            </p>
          ) : null}
          {cookiesSample ? (
            <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-ink">
              <span className={priceL}>מחיר למארז</span>
              <span className={priceN}>₪{cookiesSample.price}</span>
              {cookiesSample.priceLabel ? (
                <>
                  <span className="mx-0.5 text-ink-muted/70 sm:mx-1.5" aria-hidden>
                    ·
                  </span>
                  <span className={priceLbl}>{cookiesSample.priceLabel}</span>
                </>
              ) : null}
            </p>
          ) : null}
        </div>
        {subtitle ? (
          <p className={dense ? 'text-sm text-ink/70 sm:text-base' : sectionDescClass}>{subtitle}</p>
        ) : null}
    </div>
  )
}

function ProductCard({
  p,
  dense,
  cart,
  rollsDraft,
  onChangeQty,
}: {
  p: CatalogProduct
  dense?: boolean
  cart?: CartState
  /** טיוטת מגולגלות (דף הזמנה); ריק אם אין */
  rollsDraft?: CartState
  onChangeQty?: (productId: number, nextQty: number) => void
}) {
  const draft = rollsDraft ?? {}
  const qty =
    p.category === 'rolls' && rollsDraft !== undefined
      ? (cart?.[p.id] ?? 0) + (draft[p.id] ?? 0)
      : (cart?.[p.id] ?? 0)
  const orderMode = Boolean(onChangeQty)
  const coverScale = p.imageCoverZoom ?? 1
  const isSideCakeFix = p.id === 4 || p.id === 6
  const rollCakeTransform = isSideCakeFix
    ? ''
    : [
        p.imageMirrorHorizontal ? 'scaleX(-1)' : '',
        coverScale !== 1 ? `scale(${coverScale})` : '',
      ]
        .filter(Boolean)
        .join(' ')
  const sideCakeVisualScale = 1.38
  const rollCakeImgStyle = isSideCakeFix
    ? {
        objectPosition: p.imageCoverObjectPosition ?? 'center center',
        transform: p.imageMirrorHorizontal
          ? `scaleX(-1) scale(${sideCakeVisualScale})`
          : `scale(${sideCakeVisualScale})`,
        transformOrigin: 'center center' as const,
      }
    : {
        objectPosition: p.imageCoverObjectPosition ?? 'center center',
        ...(rollCakeTransform
          ? { transform: rollCakeTransform, transformOrigin: 'center center' as const }
          : {}),
      }
  const showFullCookie =
    p.category === 'cookies' || p.category === 'crumbleCookies' || p.category === 'giantCrumbleDesign'
  const isCookiesCategory = p.category === 'cookies'
  const isCrumbleCategory = p.category === 'crumbleCookies'
  const isGiantCrumbleCategory = p.category === 'giantCrumbleDesign'
  /** זום בתוך המסגרת — קראמבל עגול נחתך בקצוות אם הזום גבוה מדי */
  const fullCookieZoom = isGiantCrumbleCategory
    ? 1.3
    : isCrumbleCategory
      ? 1.18
      : isCookiesCategory
        ? 1.46
        : 1
  const fullCookieImgStyle: CSSProperties | undefined =
    showFullCookie && (fullCookieZoom !== 1 || p.imageMirrorHorizontal)
      ? {
          transform: [p.imageMirrorHorizontal ? 'scaleX(-1)' : '', fullCookieZoom !== 1 ? `scale(${fullCookieZoom})` : '']
            .filter(Boolean)
            .join(' '),
          transformOrigin: 'center center',
        }
      : undefined
  const hasDesc = p.desc.trim().length > 0

  /** כרטיס בלי מתיחת גובה וריווח מת — עוגיות ומגולגלות (אין תיאור + מונה צמוד לכותרת) */
  const compactCard = p.category === 'cookies' || p.category === 'rolls'

  const stepMinusClassName =
    'flex h-9 w-9 shrink-0 touch-manipulation items-center justify-center rounded-lg border border-cream-dark/80 bg-cream text-ink enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 sm:h-10 sm:w-10 md:transition md:enabled:hover:border-gold-deep md:enabled:hover:text-gold-deep'

  const bumpQty = (delta: number) => {
    if (!onChangeQty) return
    if (p.id === GREETING_CARD_PRODUCT_ID && delta > 0 && qty >= 1) return
    const next = Math.max(0, Math.min(99, qty + delta))
    onChangeQty(p.id, next)
  }

  const featuredAccent = p.featured ? 'ring-1 ring-inset ring-gold-deep/25' : ''
  /** דף הזמנה במובייל — כרטיס קומפקטי */
  const compactOrderMobile = Boolean(dense && orderMode)

  const priceLine =
    p.category === 'rolls' ? null : (
      <p
        className={
          compactOrderMobile
            ? 'text-center text-[11px] font-normal tabular-nums leading-tight text-ink/60 sm:text-xs sm:text-ink/60'
            : dense
              ? 'text-[11px] tabular-nums text-ink/60 sm:text-xs'
              : 'text-xs text-ink/[0.69] tabular-nums sm:text-sm'
        }
      >
        <span className={compactOrderMobile ? 'hidden sm:inline' : dense ? 'text-ink/50' : 'text-ink/50'}>
          {p.id === GREETING_CARD_PRODUCT_ID
            ? 'תוספת · '
            : isCookiesCategory
              ? 'מארז · '
              : 'יחידה · '}
        </span>
        ₪{p.price}
        {p.priceLabel ? (
          <span className={compactOrderMobile ? 'text-ink/55 sm:text-ink/50' : dense ? 'text-ink/50' : 'text-ink/55'}>
            {' '}
            ({p.priceLabel})
          </span>
        ) : null}
      </p>
    )

  const mediaShell =
    compactOrderMobile
      ? 'max-sm:relative max-sm:aspect-auto max-sm:min-h-0 max-sm:shrink-0 max-sm:overflow-visible sm:aspect-square'
      : 'aspect-square'
  const mediaInner =
    compactOrderMobile
      ? 'max-sm:relative max-sm:flex max-sm:min-h-0 max-sm:items-center max-sm:justify-center max-sm:overflow-visible max-sm:py-1 sm:absolute sm:inset-0 sm:overflow-hidden'
      : 'absolute inset-0 overflow-hidden'
  const mediaFlex =
    compactOrderMobile
      ? 'max-sm:flex max-sm:min-h-0 max-sm:w-full max-sm:items-center max-sm:justify-center sm:flex sm:h-full sm:min-h-0 sm:w-full sm:items-center sm:justify-center'
      : 'flex h-full min-h-0 w-full items-center justify-center'
  const compactImg = compactOrderMobile
    ? ' max-sm:!mb-1 max-sm:!h-20 max-sm:!w-20 max-sm:!max-h-20 max-sm:!max-w-20 max-sm:!object-contain'
    : ''
  const rollImgClass = `product-card-media${isSideCakeFix ? ' side-cake-fix' : ''}${compactImg}`
  const cookieImgClass = `product-card-media${compactImg}`

  return (
    <article
      className={`product-card group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-cream-dark/40 bg-white/90 backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg ${compactOrderMobile ? 'product-card--order-compact max-sm:relative max-sm:flex max-sm:min-h-0 max-sm:flex-col max-sm:items-center max-sm:justify-between max-sm:overflow-visible max-sm:rounded-xl max-sm:border max-sm:border-cream-dark/20 max-sm:bg-white max-sm:p-2 max-sm:shadow-none max-sm:backdrop-blur-none max-sm:hover:translate-y-0 max-sm:hover:shadow-none' : ''} ${showFullCookie ? 'product-card--full-cookie' : ''}${isCrumbleCategory ? ' product-card--crumble-single' : ''} ${featuredAccent}${compactOrderMobile ? ' max-sm:!ring-0' : ''}`}
    >
      <div
        className={`relative overflow-hidden sm:aspect-[4/3] ${mediaShell} ${
          isGiantCrumbleCategory ? 'bg-white' : compactOrderMobile ? 'max-sm:bg-transparent bg-cream-dark/15' : 'bg-cream-dark/15'
        }`}
      >
        {showFullCookie ? (
          <div className={mediaInner}>
            <div
              className={`${mediaFlex} transition-transform duration-500 ease-out will-change-transform group-hover:scale-105 max-sm:group-hover:scale-100`}
            >
              <img
                src={catalogImageUrl(p.imageFile)}
                alt={p.title}
                className={cookieImgClass}
                style={fullCookieImgStyle}
                width={600}
                height={450}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        ) : (
          <div className={mediaInner}>
            <div
              className={`${mediaFlex} transition-transform duration-500 ease-out will-change-transform group-hover:scale-105 max-sm:group-hover:scale-100`}
            >
              <img
                src={catalogImageUrl(p.imageFile)}
                alt={p.title}
                className={rollImgClass}
                style={rollCakeImgStyle}
                width={600}
                height={450}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        )}
      </div>
      {orderMode && qty < 1 ? (
        <CatalogPlusButton
          visual={dense ? 'onCard' : 'default'}
          aria-label={`הוספה לסל — ${p.title}`}
          onClick={() => bumpQty(1)}
        >
          <Plus className="size-3 text-cream sm:size-3.5" strokeWidth={2} aria-hidden />
        </CatalogPlusButton>
      ) : null}
      <div
        className={`flex flex-1 flex-col ${compactOrderMobile ? 'max-sm:w-full max-sm:min-h-0 max-sm:justify-end max-sm:gap-1.5 max-sm:p-0 sm:gap-2 sm:p-3' : dense ? 'gap-2 p-2.5 sm:gap-2 sm:p-3' : 'gap-2 px-2 pb-3 pt-0 sm:gap-2.5 sm:px-3 sm:pb-4'}`}
      >
        <div
          className={`shrink-0 space-y-1 text-center ${dense ? 'px-0 py-0' : 'p-3'} ${p.category === 'rolls' ? 'border-b border-cream-dark/40 max-sm:border-0 sm:border-b' : ''}`}
        >
          <h4
            className={
              dense
                ? compactOrderMobile
                  ? 'text-xs font-medium text-ink max-sm:min-h-[32px] max-sm:text-center max-sm:leading-tight max-sm:line-clamp-2 sm:min-h-0 sm:text-sm sm:leading-normal'
                  : 'text-xs font-medium leading-snug text-ink sm:text-sm sm:leading-normal'
                : 'text-sm font-medium text-ink'
            }
          >
            {p.title}
          </h4>
          {p.cardSubtitle ? (
            <p
              className={
                compactOrderMobile
                  ? 'hidden text-[11px] leading-snug text-ink/65 sm:block sm:text-xs'
                  : dense
                    ? 'text-[11px] leading-snug text-ink/65 sm:text-xs'
                    : 'text-xs leading-snug text-ink/65'
              }
            >
              {p.cardSubtitle}
            </p>
          ) : null}
          {priceLine}
        </div>
        {hasDesc ? (
          <p
            className={`text-start leading-relaxed text-ink-muted ${dense ? 'px-0 text-sm sm:text-base' : 'px-3 text-xs sm:text-sm'} ${compactOrderMobile ? 'max-sm:hidden sm:block' : ''} ${compactOrderMobile ? (compactCard ? '' : 'sm:flex-1') : compactCard ? '' : 'flex-1'}`}
          >
            {p.desc}
          </p>
        ) : (
          <div className={`min-h-0 flex-1 ${compactOrderMobile ? 'max-sm:hidden' : ''}`} aria-hidden />
        )}

        {orderMode ? (
          qty >= 1 ? (
            <div
              className={`flex min-w-0 shrink-0 items-center justify-center gap-1 rounded-lg border border-cream-dark/90 bg-cream-dark/35 p-1 sm:gap-2 sm:rounded-xl sm:p-1.5 ${compactCard ? 'mt-1 sm:mt-1.5' : 'mt-1.5 sm:mt-2'}`}
            >
              <button
                type="button"
                aria-label={`הפחת כמות — ${p.title}`}
                onClick={() => bumpQty(-1)}
                className={`${stepMinusClassName} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep`}
              >
                <Minus className="size-3.5 sm:size-5" strokeWidth={2} aria-hidden />
              </button>
              <span
                className="min-w-[2.25rem] shrink-0 text-center font-display text-sm font-semibold tabular-nums text-ink sm:min-w-[2.5rem] sm:text-lg"
                aria-live="polite"
              >
                {qty}
              </span>
              <CatalogPlusButton
                aria-label={`הוספת כמות — ${p.title}`}
                disabled={qty >= 99}
                onClick={() => bumpQty(1)}
              >
                <Plus className="size-3.5 sm:size-5" strokeWidth={2} aria-hidden />
              </CatalogPlusButton>
            </div>
          ) : null
        ) : (
          <Link
            to="/order"
            className={`${premiumActionButtonClass} w-full justify-center sm:w-auto ${compactCard ? 'mt-1.5 sm:mt-2' : 'mt-2 sm:mt-2.5'}`}
          >
            <ShoppingCart className="size-4 shrink-0 text-cream sm:size-[18px]" strokeWidth={2} aria-hidden />
            הוספה להזמנה
          </Link>
        )}
      </div>
    </article>
  )
}

function CatalogQuickPickStrip({
  cart,
  rollsDraft,
  onChangeQty,
}: {
  cart: CartState
  rollsDraft?: CartState
  onChangeQty: (productId: number, nextQty: number) => void
}) {
  const picks = useMemo(() => catalogQuickPickProducts(), [])
  const draft = rollsDraft ?? {}

  const lineQty = (p: CatalogProduct) =>
    p.category === 'rolls' && rollsDraft !== undefined
      ? (cart[p.id] ?? 0) + (draft[p.id] ?? 0)
      : (cart[p.id] ?? 0)

  if (picks.length === 0) return null

  return (
    <div
      className="mx-auto flex w-full max-w-md flex-col gap-3 text-xs text-ink/60 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-2 sm:gap-y-1"
      aria-label="המלצות מהירות"
    >
      <p className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-center leading-snug">
        <span className="shrink-0">לא בטוחים?</span>
        <span className="text-ink/40" aria-hidden>
          ·
        </span>
        <span className="shrink-0">הכי מוזמנים:</span>
      </p>
      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-2 sm:gap-y-1">
        {picks.map((p) => {
          const q = lineQty(p)
          return (
            <div
              key={p.id}
              className="flex w-full items-center gap-2.5 rounded-lg bg-white/60 px-2 py-1.5 sm:w-auto sm:max-w-[min(100%,14rem)] sm:bg-transparent sm:px-0 sm:py-0"
            >
              <CatalogPlusButton
                aria-label={`הוספה: ${p.title}`}
                disabled={q >= 99}
                onClick={() => onChangeQty(p.id, q + 1)}
              >
                <Plus className="size-3.5" strokeWidth={2.5} aria-hidden />
              </CatalogPlusButton>
              <span className="min-w-0 flex-1 text-start text-[11px] leading-snug sm:max-w-[12rem] sm:truncate sm:text-xs" title={p.title}>
                {p.title}
                <span className="ms-0.5 tabular-nums text-ink/50">₪{p.price}</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CatalogTrustStrip({ dense }: { dense?: boolean }) {
  const items: { Icon: LucideIcon; label: string }[] = [
    { Icon: Star, label: 'הלקוחות לא מפסיקים להזמין' },
    { Icon: Truck, label: 'משלוח מהיר עד הבית' },
    { Icon: Cake, label: 'נאפה טרי בהזמנה אישית' },
  ]
  if (dense) {
    return (
      <ul
        className="mt-3 flex list-none flex-col items-center gap-2.5 px-1 text-center text-[11px] leading-snug text-ink/55 sm:mt-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-2 sm:gap-y-1 sm:px-0 sm:text-xs"
        aria-label="יתרונות המותג"
      >
        {items.map(({ Icon, label }) => (
          <li key={label} className="inline-flex max-w-[min(100%,22rem)] items-center justify-center gap-1.5 sm:max-w-none">
            <Icon className="size-3 shrink-0 text-gold-deep/70" strokeWidth={2} aria-hidden />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    )
  }
  return (
    <ul
      className="flex w-full list-none flex-wrap items-center justify-center gap-x-6 gap-y-4 rounded-xl border border-white/40 bg-white/80 px-4 py-3 text-center shadow-sm md:flex-nowrap md:gap-x-8 md:gap-y-0 md:px-6 md:py-3"
      aria-label="יתרונות המותג"
    >
      {items.map(({ Icon, label }) => (
        <li
          key={label}
          className="inline-flex items-center gap-2 font-sans text-sm font-medium leading-snug text-ink md:whitespace-nowrap md:text-base"
        >
          <Icon className="size-[18px] shrink-0 text-gold-deep" strokeWidth={2} aria-hidden />
          {label}
        </li>
      ))}
    </ul>
  )
}

type ProductCatalogProps = {
  /** טקסט מבוא מעל הקטלוג */
  intro?: string
  /** כרטיסים צפופים יותר (דף הזמנה) */
  dense?: boolean
  className?: string
  /** scroll-margin לעוגני קטגוריות (מתחת ל־header + סרגל דביק) */
  sectionScrollMtClass?: string
  /** דף הזמנה: עגלה ו־+/- */
  cart?: CartState
  /** טיוטת מארז מגולגלות (12 → מיזוג אוטומטי לעגלה) */
  rollsDraft?: CartState
  onChangeQty?: (productId: number, nextQty: number) => void
}

export function ProductCatalog({
  intro,
  dense,
  className = '',
  sectionScrollMtClass,
  cart,
  rollsDraft,
  onChangeQty,
}: ProductCatalogProps) {
  const cartSafe = cart ?? {}
  const crumbleQty = crumbleCookiesQtyInCart(cartSafe, catalogProducts)
  const crumblePackIssue =
    Boolean(onChangeQty) && crumbleQty > 0 && !isValidCrumblePackTotal(crumbleQty)
  const crumblePackHint = crumblePackIssue ? crumblePackIssueDescription(crumbleQty) : null
  const rollsQty = rollsQtyInCart(cartSafe, catalogProducts)
  const rollsPackIssue =
    Boolean(onChangeQty) && rollsQty > 0 && !isValidRollsPackTotal(rollsQty)
  const rollsPackHint = rollsPackIssue ? rollsPackIssueDescription(rollsQty) : null
  const draftSafe = rollsDraft ?? {}
  const rollsDraftSum = sumRollsDraft(draftSafe, catalogProducts)
  const rollsDraftHint =
    Boolean(onChangeQty) &&
    rollsDraft !== undefined &&
    rollsDraftSum > 0 &&
    rollsDraftSum < ROLLS_PACK_SIZE
      ? `בונים מארז: ${rollsDraftSum}/${ROLLS_PACK_SIZE} יחידות. בהשלמה ל־${ROLLS_PACK_SIZE} המארז יתווסף אוטומטית לעגלה והבחירה תתאפס.`
      : null

  const categoriesWithItems = categoryOrder.filter((cat) =>
    catalogProducts.some((x) => x.category === cat && x.id !== GREETING_CARD_PRODUCT_ID),
  )

  return (
    <div className={`flex flex-col ${className}`}>
      {onChangeQty ? (
        <div className="mx-auto max-w-4xl space-y-5 px-4 sm:space-y-4">
          {intro ? (
            <p className="mx-auto max-w-3xl text-center text-sm leading-relaxed text-ink-muted sm:text-base">
              {intro}
            </p>
          ) : null}
          <GreetingCardCatalogRow
            cart={cartSafe}
            onChangeQty={onChangeQty}
            scrollMtClass={sectionScrollMtClass}
          />
          <CatalogQuickPickStrip
            cart={cartSafe}
            rollsDraft={rollsDraft}
            onChangeQty={onChangeQty}
          />
          <CatalogTrustStrip dense={dense} />
        </div>
      ) : (
        <div className="space-y-4">
          {intro ? (
            <p className="mx-auto max-w-3xl px-4 text-center text-sm leading-relaxed text-ink-muted sm:px-6 sm:text-base">
              {intro}
            </p>
          ) : null}
          <CatalogTrustStrip dense={dense} />
        </div>
      )}

      <div
        className={`mx-auto max-w-6xl px-4 md:px-6 ${onChangeQty ? 'mt-6 sm:mt-10' : 'mt-6'}`}
      >
      {categoriesWithItems.map((cat, idx) => {
        const items = catalogProducts.filter(
          (x) => x.category === cat && x.id !== GREETING_CARD_PRODUCT_ID,
        )
        const isFirst = idx === 0
        const categorySectionY = dense ? 'py-6 sm:py-10 md:py-10' : sectionShell
        return (
          <section
            key={cat}
            id={`catalog-${cat}`}
            data-category-section
            aria-labelledby={`heading-${cat}`}
            className={`relative ${categorySectionY} scroll-mt-[100px] ${sectionScrollMtClass ?? ''} border-b border-cream-dark/40 bg-white/10 ${
              isFirst ? '' : 'border-t border-cream-dark/50'
            }`}
          >
            <div className={`flex w-full flex-col ${dense ? 'gap-4' : 'gap-6'}`}>
              <CategoryDivider category={cat} dense={dense} />
              {cat === 'rolls' && rollsDraftHint ? (
                <p
                  id="rolls-draft-hint"
                  className="rounded-xl border-2 border-gold-deep/60 bg-gold/15 px-4 py-3 text-sm font-semibold leading-relaxed text-cocoa shadow-sm"
                >
                  {rollsDraftHint}
                </p>
              ) : null}
              {cat === 'rolls' && rollsPackHint ? (
                <p
                  id="rolls-cart-hint"
                  className="rounded-xl border border-gold-deep/50 bg-gold/15 px-4 py-3 text-sm leading-relaxed text-ink"
                >
                  {rollsPackHint}
                </p>
              ) : null}
              {cat === 'crumbleCookies' && onChangeQty && !crumblePackHint ? (
                <p
                  id="crumble-pack-order-hint"
                  className="rounded-xl border-2 border-gold-deep/60 bg-gold/15 px-4 py-3 text-sm font-semibold leading-relaxed text-cocoa shadow-sm"
                >
                  {CRUMBLE_PACK_ORDER_HINT_HE}
                </p>
              ) : null}
              {cat === 'crumbleCookies' && crumblePackHint ? (
                <p
                  id="crumble-cart-hint"
                  className="rounded-xl border border-gold-deep/50 bg-gold/15 px-4 py-3 text-sm leading-relaxed text-ink"
                >
                  {crumblePackHint}
                </p>
              ) : null}
              <div
                className={
                  dense
                    ? 'grid grid-cols-2 gap-2 px-2 sm:grid-cols-3 sm:gap-x-3 sm:gap-y-3 sm:px-0 lg:grid-cols-4'
                    : cat === 'rolls'
                      ? 'grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5'
                      : 'grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:gap-6'
                }
              >
                {items.map((p) => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    dense={dense}
                    cart={cart}
                    rollsDraft={cat === 'rolls' ? rollsDraft : undefined}
                    onChangeQty={onChangeQty}
                  />
                ))}
              </div>
            </div>
          </section>
        )
      })}
      </div>
    </div>
  )
}
