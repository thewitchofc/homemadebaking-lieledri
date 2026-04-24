import { useMemo } from 'react'
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

function GreetingCardCatalogRow({
  cart,
  onChangeQty,
}: {
  cart: CartState
  onChangeQty: (productId: number, nextQty: number) => void
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
  const stepPlus =
    'flex h-8 w-8 shrink-0 touch-manipulation items-center justify-center rounded-full border border-cocoa/35 bg-cocoa text-cream shadow-sm enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 md:transition md:enabled:hover:bg-gold-deep'

  return (
    <div
      id="greeting-card-row"
      className="mx-auto mb-5 max-w-md scroll-mt-36 px-4 sm:mb-6 sm:max-w-lg sm:px-6"
    >
      <article className="flex w-full items-center gap-2.5 rounded-xl border border-gold-deep/15 bg-cream/45 px-2.5 py-2 shadow-sm shadow-cocoa/[0.04] backdrop-blur-sm sm:gap-3 sm:px-3 sm:py-2.5">
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
                <button
                  type="button"
                  aria-label={`הוספת ${p.title} להזמנה`}
                  onClick={() => bump(1)}
                  className={`${stepPlus} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep`}
                >
                  <Plus className="size-3.5" strokeWidth={2} aria-hidden />
                </button>
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
                  <button
                    type="button"
                    aria-label="כבר נוסף — כרטיס אחד בלבד"
                    disabled
                    className={`${stepPlus} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep`}
                  >
                    <Plus className="size-3.5" strokeWidth={2} aria-hidden />
                  </button>
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
  const h3 = dense
    ? 'font-display text-xl font-medium text-ink sm:text-2xl'
    : 'font-display text-2xl font-medium text-ink sm:text-3xl'
  const priceL = dense
    ? 'font-display text-xl font-medium text-ink sm:text-2xl'
    : 'font-display text-2xl font-medium text-ink sm:text-3xl'
  const priceN = dense
    ? 'font-display text-xl font-semibold text-ink sm:text-2xl'
    : 'font-display text-2xl font-semibold text-ink sm:text-3xl'
  const priceLbl = dense ? 'text-sm text-ink-muted sm:text-base' : 'text-base text-ink-muted sm:text-lg'

  return (
    <div
      id={`catalog-${category}`}
      className={`scroll-mt-32 border-t border-cream-dark/70 first:border-t-0 first:pt-0 ${
        dense ? 'pt-5 sm:pt-6' : 'pt-10'
      } ${className}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-4 sm:gap-y-1">
          <h3 id={`heading-${category}`} className={h3}>
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
          <p className={`mt-1 text-ink-muted ${dense ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}`}>
            {subtitle}
          </p>
        ) : null}
      </div>
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
  const showFullCookie = p.category === 'cookies' || p.category === 'crumbleCookies'
  const isCookiesCategory = p.category === 'cookies'
  const isCrumbleCategory = p.category === 'crumbleCookies'
  const hasDesc = p.desc.trim().length > 0

  /** כרטיס בלי מתיחת גובה וריווח מת — עוגיות ומגולגלות (אין תיאור + מונה צמוד לכותרת) */
  const compactCard = p.category === 'cookies' || p.category === 'rolls'

  const stepMinusClassName =
    'flex h-9 w-9 shrink-0 touch-manipulation items-center justify-center rounded-lg border border-cream-dark/80 bg-cream text-ink enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-35 sm:h-10 sm:w-10 md:transition md:enabled:hover:border-gold-deep md:enabled:hover:text-gold-deep'

  const stepPlusClassName =
    'flex h-9 w-9 shrink-0 touch-manipulation items-center justify-center rounded-full border border-cocoa/40 bg-cocoa text-cream shadow-sm enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10 md:transition md:enabled:hover:bg-gold-deep'

  const bumpQty = (delta: number) => {
    if (!onChangeQty) return
    if (p.id === GREETING_CARD_PRODUCT_ID && delta > 0 && qty >= 1) return
    const next = Math.max(0, Math.min(99, qty + delta))
    onChangeQty(p.id, next)
  }

  const cardFrame = p.featured
    ? 'border border-gold-deep/40 bg-gradient-to-b from-gold/[0.09] to-cream shadow-md md:transition md:hover:shadow-md'
    : 'border border-cream-dark bg-cream shadow-sm md:transition md:hover:shadow-md'

  return (
    <article
      className={`product-card group flex h-full w-full flex-col overflow-hidden rounded-xl sm:rounded-2xl ${cardFrame}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-cream-dark/20 sm:aspect-[4/3] sm:rounded-t-2xl">
        {showFullCookie ? (
          <div className="absolute inset-0 overflow-hidden rounded-t-xl sm:rounded-t-2xl md:transition md:duration-500 md:ease-out">
            <img
              src={catalogImageUrl(p.imageFile)}
              alt={p.title}
              className={`product-card-media ${
                isCrumbleCategory ? 'rounded-2xl' : 'rounded-t-2xl'
              }`}
              style={
                p.imageMirrorHorizontal
                  ? { transform: 'scaleX(-1)', transformOrigin: 'center center' }
                  : undefined
              }
              width={600}
              height={450}
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : (
          <div className="absolute inset-0 overflow-hidden rounded-t-xl sm:rounded-t-2xl md:transition md:duration-500 md:ease-out">
            <img
              src={catalogImageUrl(p.imageFile)}
              alt={p.title}
              className={`product-card-media rounded-t-2xl${isSideCakeFix ? ' side-cake-fix' : ''}`}
              style={rollCakeImgStyle}
              width={600}
              height={450}
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
      </div>
      <div
        className={`flex min-h-0 flex-1 flex-col ${dense ? 'p-2.5 sm:p-4' : 'p-3 sm:p-5'}`}
      >
        <div
          className={p.category === 'rolls' ? 'border-b border-cream-dark/50 pb-1.5 sm:pb-2' : undefined}
        >
          <h4
            className={`font-display font-semibold text-ink ${dense ? 'text-sm sm:text-lg' : 'text-sm sm:text-xl'}`}
          >
            {p.title}
          </h4>
          {p.cardSubtitle ? (
            <p className="mt-0.5 text-xs leading-snug text-ink/70 sm:mt-1 sm:text-sm">{p.cardSubtitle}</p>
          ) : null}
        </div>
        {hasDesc ? (
          <p
            className={`mt-1.5 leading-relaxed text-ink-muted sm:mt-2 ${dense ? 'text-xs sm:text-sm' : 'text-xs sm:text-sm'} ${compactCard ? '' : 'flex-1'}`}
          >
            {p.desc}
          </p>
        ) : (
          <div className="min-h-0 flex-1" aria-hidden />
        )}

        {p.category !== 'rolls' ? (
          <div
            className={`flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 border-b border-cream-dark/50 pb-1.5 sm:gap-x-2 sm:gap-y-1 sm:pb-3 ${
              isCookiesCategory
                ? 'mt-1.5 sm:mt-2'
                : hasDesc
                  ? 'mt-2 sm:mt-3'
                  : 'mt-2.5 sm:mt-4'
            }`}
          >
            <span className="text-xs font-medium text-ink-muted sm:text-sm">
              {p.id === GREETING_CARD_PRODUCT_ID ? 'תוספת' : isCookiesCategory ? 'מחיר למארז' : 'מחיר ליחידה'}
            </span>
            <span className="font-display text-base font-semibold tracking-tight text-ink sm:text-xl md:text-2xl">
              ₪{p.price}
            </span>
            {p.priceLabel ? (
              <span className="text-[11px] text-ink-muted sm:text-sm">({p.priceLabel})</span>
            ) : null}
          </div>
        ) : null}

        {orderMode ? (
          <div
            className={`flex min-w-0 items-center justify-center gap-1 rounded-lg border border-cream-dark/90 bg-cream-dark/35 p-1 sm:gap-2 sm:rounded-xl sm:p-1.5 ${compactCard ? 'mt-2 sm:mt-2.5' : 'mt-2.5 sm:mt-4'}`}
          >
            {qty < 1 ? (
              <button
                type="button"
                aria-label={`הוספה לסל — ${p.title}`}
                onClick={() => bumpQty(1)}
                className={`${stepPlusClassName} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep`}
              >
                <Plus className="size-4 sm:size-5" strokeWidth={2} aria-hidden />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  aria-label={`הפחת כמות — ${p.title}`}
                  onClick={() => bumpQty(-1)}
                  className={`${stepMinusClassName} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep`}
                >
                  <Minus className="size-4 sm:size-5" strokeWidth={2} aria-hidden />
                </button>
                <span
                  className="min-w-[2.25rem] shrink-0 text-center font-display text-sm font-semibold tabular-nums text-ink sm:min-w-[2.5rem] sm:text-lg"
                  aria-live="polite"
                >
                  {qty}
                </span>
                <button
                  type="button"
                  aria-label={`הוספת כמות — ${p.title}`}
                  disabled={qty >= 99}
                  onClick={() => bumpQty(1)}
                  className={`${stepPlusClassName} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep`}
                >
                  <Plus className="size-4 sm:size-5" strokeWidth={2} aria-hidden />
                </button>
              </>
            )}
          </div>
        ) : (
          <Link
            to="/order"
            className={`inline-flex w-full max-w-full touch-manipulation items-center justify-center gap-1 rounded-lg bg-cocoa px-2.5 py-1.5 text-center text-xs font-medium text-cream shadow-sm active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep sm:gap-1.5 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm md:transition md:hover:scale-[1.02] md:hover:shadow-md ${compactCard ? 'mt-2 sm:mt-2.5' : 'mt-2.5 sm:mt-4'}`}
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
    <div className="mx-auto mb-4 max-w-6xl px-4 sm:px-6" aria-label="המלצות מהירות">
      <p className="text-sm leading-relaxed text-ink/70">
        <span className="block">לא בטוחים מה לבחור?</span>
        <span className="block">הכי מוזמנים:</span>
      </p>
      <ul className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
        {picks.map((p) => {
          const q = lineQty(p)
          return (
            <li
              key={p.id}
              className="flex min-w-0 flex-[1_1_auto] items-center gap-2 rounded-xl border border-cream-dark/40 bg-white/60 px-3 py-2 sm:max-w-[min(100%,18rem)]"
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
                onClick={() => onChangeQty(p.id, q + 1)}
                className="flex size-8 shrink-0 touch-manipulation items-center justify-center rounded-lg border border-cream-dark/70 bg-cream text-ink shadow-sm active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 md:transition md:hover:bg-cream-dark/35"
              >
                <Plus className="size-4" strokeWidth={2.5} aria-hidden />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function CatalogTrustStrip({ dense }: { dense?: boolean }) {
  const items: { Icon: LucideIcon; label: string }[] = [
    { Icon: Star, label: 'הלקוחות לא מפסיקים להזמין' },
    { Icon: Truck, label: 'משלוח מהיר עד הבית' },
    { Icon: Cake, label: 'נאפה טרי בהזמנה אישית' },
  ]
  return (
    <ul
      className={`mx-auto flex w-full max-w-6xl list-none flex-wrap items-center justify-center rounded-xl border border-white/40 bg-white/50 text-center shadow-sm backdrop-blur-sm md:flex-nowrap ${
        dense
          ? 'mb-5 mt-2 gap-x-4 gap-y-1.5 px-3 py-1.5 md:mb-5 md:mt-2 md:gap-x-5 md:px-4 md:py-2'
          : 'mb-10 mt-3 gap-x-7 gap-y-2.5 px-4 py-2 md:mt-4 md:mb-11 md:gap-x-10 md:gap-y-0 md:px-6 md:py-3'
      }`}
      aria-label="יתרונות המותג"
    >
      {items.map(({ Icon, label }) => (
        <li
          key={label}
          className={`inline-flex items-center gap-1.5 font-sans font-medium leading-snug text-ink md:whitespace-nowrap ${
            dense ? 'text-xs md:text-sm' : 'gap-2 text-sm md:text-base'
          }`}
        >
          <Icon
            className={`shrink-0 text-gold-deep ${dense ? 'size-4' : 'size-[18px]'}`}
            strokeWidth={2}
            aria-hidden
          />
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

  return (
    <div className={className}>
      {intro ? (
        <p className="mx-auto mb-12 max-w-3xl text-center text-sm leading-relaxed text-ink-muted sm:text-base">
          {intro}
        </p>
      ) : null}

      {onChangeQty ? <GreetingCardCatalogRow cart={cartSafe} onChangeQty={onChangeQty} /> : null}

      {onChangeQty ? (
        <CatalogQuickPickStrip
          cart={cartSafe}
          rollsDraft={rollsDraft}
          onChangeQty={onChangeQty}
        />
      ) : null}

      <CatalogTrustStrip dense={dense} />

      {categoryOrder.map((cat) => {
        const items = catalogProducts.filter(
          (x) => x.category === cat && x.id !== GREETING_CARD_PRODUCT_ID,
        )
        if (items.length === 0) return null
        return (
          <section key={cat} aria-labelledby={`heading-${cat}`}>
            <CategoryDivider category={cat} dense={dense} />
            {cat === 'rolls' && rollsDraftHint ? (
              <div className="mx-auto max-w-6xl px-4 pb-3 sm:px-6">
                <p
                  id="rolls-draft-hint"
                  className="rounded-xl border border-cocoa/25 bg-cream-dark/40 px-4 py-3 text-sm leading-relaxed text-ink"
                >
                  {rollsDraftHint}
                </p>
              </div>
            ) : null}
            {cat === 'rolls' && rollsPackHint ? (
              <div className="mx-auto max-w-6xl px-4 pb-3 sm:px-6">
                <p
                  id="rolls-cart-hint"
                  className="rounded-xl border border-gold-deep/50 bg-gold/15 px-4 py-3 text-sm leading-relaxed text-ink"
                >
                  {rollsPackHint}
                </p>
              </div>
            ) : null}
            {cat === 'crumbleCookies' && crumblePackHint ? (
              <div className="mx-auto max-w-6xl px-4 pb-3 sm:px-6">
                <p
                  id="crumble-cart-hint"
                  className="rounded-xl border border-gold-deep/50 bg-gold/15 px-4 py-3 text-sm leading-relaxed text-ink"
                >
                  {crumblePackHint}
                </p>
              </div>
            ) : null}
            <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${dense ? 'pb-3 sm:pb-4' : 'pb-4 sm:pb-6'}`}>
              <div
                className={
                  dense
                    ? cat === 'rolls'
                      ? 'grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-2.5 md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-3'
                      : 'grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-2.5 md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-3'
                    : cat === 'rolls'
                      ? 'grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5'
                      : 'grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:gap-6'
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
  )
}
