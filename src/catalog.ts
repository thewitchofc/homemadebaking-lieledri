import { legacySiteImage } from './siteConfig'

export type ProductCategory = 'rolls' | 'cookies' | 'crumbleCookies' | 'giantCrumbleDesign' | 'cakes'

export const categoryOrder: ProductCategory[] = [
  'rolls',
  'cookies',
  'crumbleCookies',
  'cakes',
  'giantCrumbleDesign',
]

/** כרטיס ברכה — לא בתפריט המתוקים; נוסף/נערך רק במסך סיכום הזמנה */
export const GREETING_CARD_PRODUCT_ID = 99

/** גדלי מארז קראמבל (סך הכל בעגלה חייב להתפרק ל־4a+6b) */
export const CRUMBLE_PACK_SIZES = [4, 6] as const

/** מארז מגולגלות = 12 יחידות בסך הכל; אפשר לערבב טעמים, לא חייבים 12 מאותו טעם */
export const ROLLS_PACK_SIZE = 12

/** הסבר קצר בדף הזמנה — מעל גריד קראמבל */
export const CRUMBLE_PACK_ORDER_HINT_HE =
  'בונים מארז לפי סך יחידות בעגלה מחיר למארז: 4 ב־₪80 · 6 ב־₪120.'

export const categoryLabels: Record<ProductCategory, { title: string; subtitle?: string }> = {
  rolls: {
    title: 'מגולגלות',
    subtitle: 'ניתן לערבב טעמים',
  },
  cookies: {
    title: 'עוגיות במארז',
    subtitle: 'קוקיז מיוחדות ומארזים',
  },
  crumbleCookies: {
    title: 'עוגיות קראמבל',
    subtitle: 'ניתן לערבב טעמים',
  },
  giantCrumbleDesign: {
    title: 'עוגות בעיצוב אישי',
    subtitle: 'עוגות וקראמבל ענקית בהתאמה אישית לאירוח וחגיגות',
  },
  cakes: {
    title: 'עוגות',
    subtitle: 'עוגות שכבות ומלבניות לשולחן',
  },
}

export type CatalogProduct = {
  id: number
  title: string
  /**
   * שורת הקשר קצרה מתחת לשם — רק למוצרים שנבחרו ידנית בקטלוג (לא בכל הכרטיסים).
   * אם חסר – הכרטיס נשאר נקי מתחת לכותרת.
   */
  cardSubtitle?: string
  /** הדגשה ויזואלית עדינה בכרטיס (1–2 מובילים; בלי טקסט נוסף) */
  featured?: boolean
  desc: string
  price: number
  priceLabel: string
  imageFile: string
  category: ProductCategory
  /** זום על התמונה (מעל object-cover) כדי למלא את הריבוע ולצמצם שוליים לבנים במקור */
  imageCoverZoom?: number
  /** מיקום object-position (CSS), למשל center 44%, מעלה/מזיז את המוקד בריבוע */
  imageCoverObjectPosition?: string
  /** שיקוף אופקי של התמונה בכרטיס (למשל כיוון הטקסטורה / הדקור) */
  imageMirrorHorizontal?: boolean
}

/** ~20–30% מהמוצרים; עריכה ידנית לפי מובילים / ביקוש (לא אוטומטי) */
export const catalogProducts: CatalogProduct[] = [
  {
    id: 1,
    category: 'rolls',
    title: 'נוטלה דובאי',
    featured: true,
    desc: '',
    price: 79,
    priceLabel: '12 יחידות במארז',
    imageFile: 'megulgalot-nutella-dubai.png',
  },
  {
    id: 2,
    category: 'rolls',
    title: 'קקאו קינדר',
    desc: '',
    price: 79,
    priceLabel: '12 יחידות במארז',
    imageFile: 'megulgalot-roll.png',
  },
  {
    id: 15,
    category: 'rolls',
    title: 'נוטלה קינדר',
    desc: '',
    price: 79,
    priceLabel: '12 יחידות במארז',
    imageFile: 'megulgalot-nutella-kinder.png',
  },
  {
    id: 16,
    category: 'rolls',
    title: 'קורנפלקס שוקולד לבן',
    desc: '',
    price: 79,
    priceLabel: '12 יחידות במארז',
    imageFile: 'megulgalot-cornflakes-white.png',
  },
  {
    id: 3,
    category: 'cookies',
    title: "קופסת קראמבל'ס בינוני",
    desc: '',
    price: 69,
    priceLabel: '5 עוגיות במארז',
    imageFile: 'crumbls-binyoni.png',
  },
  {
    id: 7,
    category: 'cookies',
    title: 'עוגיית אמסטרדם דובאי',
    featured: true,
    desc: '',
    price: 69,
    priceLabel: '5 עוגיות במארז',
    imageFile: 'amsterdam-dubai-cookie.png',
    imageMirrorHorizontal: true,
  },
  {
    id: 14,
    category: 'crumbleCookies',
    title: 'קראמבל דובאי פיסטוק',
    featured: true,
    desc: '',
    price: 20,
    priceLabel: '',
    imageFile: 'crumble-11.png',
  },
  {
    id: 12,
    category: 'crumbleCookies',
    title: 'קראמבל אוריאו',
    desc: '',
    price: 20,
    priceLabel: '',
    imageFile: 'crumble-17.png',
  },
  {
    id: 17,
    category: 'crumbleCookies',
    title: 'קראמבל קורנפלקס שוקולד לבן',
    desc: '',
    price: 20,
    priceLabel: '',
    imageFile: 'crumble-9.png',
  },
  {
    id: 13,
    category: 'crumbleCookies',
    title: 'קראמבל הרשיז',
    desc: '',
    price: 20,
    priceLabel: '',
    imageFile: 'crumble-10.png',
  },
  {
    id: 10,
    category: 'crumbleCookies',
    title: 'קראמבל נוטלה',
    desc: '',
    price: 20,
    priceLabel: '',
    imageFile: 'crumble-12.png',
  },
  {
    id: 11,
    category: 'crumbleCookies',
    title: 'קראמבל שוקולד לבן',
    desc: '',
    price: 20,
    priceLabel: '',
    imageFile: 'crumble-13.png',
  },
  {
    id: 9,
    category: 'crumbleCookies',
    title: 'קראמבל קינדר',
    desc: '',
    price: 20,
    priceLabel: '',
    imageFile: 'crumble-14.png',
  },
  {
    id: 18,
    category: 'giantCrumbleDesign',
    title: 'קראמבל ענקית בעיצוב אישי',
    featured: true,
    desc: 'קראמבל ענקית עם עיצוב אישי ליום הולדת, אירוע והפתעה מיוחדת.',
    price: 149,
    priceLabel: 'ליחידה',
    imageFile: 'crumble-giant-personalized.png',
  },
  {
    id: 19,
    category: 'giantCrumbleDesign',
    title: 'עוגת יום הולדת מעוצבת',
    desc: 'עוגת יום הולדת מעוצבת אישית — טקסט, צבעים וסגנון לפי בקשה.',
    price: 149,
    priceLabel: 'ליחידה',
    imageFile: 'cake-birthday-designed.png',
  },
  {
    id: 4,
    category: 'cakes',
    title: 'עוגה מלבנית ביסקוויטים הרשיז',
    desc: 'שכבות של ביסקוויטים, קרם שמנת, שוקולד לבן אוריאו ומעל שכבת הרשיז',
    price: 69,
    priceLabel: 'ליחידה',
    imageFile: 'cake-hershey-biscuits-box.png',
    imageMirrorHorizontal: true,
  },
  {
    id: 5,
    category: 'cakes',
    title: "עוגה מלבנית גבינה וקראנץ' קורנפלקס",
    desc: 'שכבות של ביסקוויטים, קרם גבינה עשיר ומעל פתיתי קורנפלקס',
    price: 69,
    priceLabel: 'ליחידה',
    imageFile: 'cake-cheese-cornflakes-box.png',
    imageMirrorHorizontal: true,
  },
  {
    id: 6,
    category: 'cakes',
    title: 'עוגת ארבע שכבות',
    cardSubtitle: 'עוגת שכבות – מהנפוצות',
    desc: 'שכבת עוגת שוקולד, מוס שוקולד, עוגת שוקולד, טופ של נוטלה קראנץ',
    price: 69,
    priceLabel: 'ליחידה',
    imageFile: 'cake-four-layers-box.png',
    imageMirrorHorizontal: true,
  },
  {
    id: 8,
    category: 'cakes',
    title: 'עוגת שוקולד שכבות עם טופ נוטלה וסוכריות',
    desc: 'שכבות שוקולד אווריריות, קרם שוקולד שמנת, שכבת עוגה נוספת, טופ נוטלה וסוכריות צבעוניות',
    price: 79,
    priceLabel: 'ליחידה',
    imageFile: 'cake-chocolate-nutella-sprinkles-round.png',
  },
  {
    id: GREETING_CARD_PRODUCT_ID,
    category: 'cookies',
    title: 'כרטיס ברכה',
    desc: 'נוסף לאריזה. בסיום ההזמנה ניתן לכתוב ברכה קצרה (עד 50 תווים).',
    price: 1,
    priceLabel: 'לכרטיס',
    imageFile: 'greeting-card.svg',
  },
]

/** השלמת רשימת ״הכי מוזמנים״ עד 3 מוצרים (אחרי כל ה־featured) */
const CATALOG_QUICK_PICK_EXTRA_IDS: number[] = [7, 3]

/**
 * 2–3 מומלצים לבלוק ״הכי מוזמנים״: קודם `featured`, השלמה לפי מזהים קבועים.
 */
export function catalogQuickPickProducts(): CatalogProduct[] {
  const out: CatalogProduct[] = []
  const seen = new Set<number>()
  for (const p of catalogProducts) {
    if (p.featured && !seen.has(p.id)) {
      out.push(p)
      seen.add(p.id)
    }
  }
  for (const id of CATALOG_QUICK_PICK_EXTRA_IDS) {
    if (out.length >= 3) break
    if (seen.has(id)) continue
    const p = catalogProducts.find((x) => x.id === id)
    if (p) {
      out.push(p)
      seen.add(id)
    }
  }
  return out.slice(0, 3)
}

/** תמונות מקומיות ללא טקסט שרוף (חיתוך תחתון מהגרסה באתר הישן) */
const catalogLocalImage: Record<string, string> = {
  'megulgalot-roll.png': '/catalog/megulgalot-roll.png?v=2',
  'megulgalot-cornflakes-white.png': '/catalog/megulgalot-cornflakes-white.png?v=1',
  'megulgalot-nutella-kinder.png': '/catalog/megulgalot-nutella-kinder.png?v=3',
  'megulgalot-nutella-dubai.png': '/catalog/megulgalot-nutella-dubai.png?v=1',
  'ITEM1(2).jpeg': '/catalog/item1.jpg',
  'ITEM2.jpeg': '/catalog/item2.jpg',
  'ITEM3.jpeg': '/catalog/item3.jpg',
  'crumbls-binyoni.png': '/catalog/crumbls-binyoni.png?v=1',
  'cake-hershey-biscuits-box.png': '/catalog/cake-hershey-biscuits-box.png?v=1',
  'cake-cheese-cornflakes-box.png': '/catalog/cake-cheese-cornflakes-box.png?v=1',
  'cake-four-layers-box.png': '/catalog/cake-four-layers-box.png?v=1',
  'amsterdam-dubai-cookie.png': '/catalog/amsterdam-dubai-cookie.png?v=1',
  'cake-chocolate-nutella-sprinkles-round.png': '/catalog/cake-chocolate-nutella-sprinkles-round.png?v=1',
  'crumble-9.png': '/catalog/crumble-9.png?v=5',
  'crumble-10.png': '/catalog/crumble-10.png?v=5',
  'crumble-11.png': '/catalog/crumble-11.png?v=5',
  'crumble-12.png': '/catalog/crumble-12.png?v=5',
  'crumble-13.png': '/catalog/crumble-13.png?v=5',
  'crumble-14.png': '/catalog/crumble-14.png?v=5',
  'crumble-17.png': '/catalog/crumble-17.png?v=5',
  'crumble-giant-personalized.png': '/catalog/crumble-giant-personalized.png?v=4',
  'cake-birthday-designed.png': '/catalog/cake-birthday-designed.png?v=1',
  'greeting-card.svg': '/catalog/greeting-card.svg?v=2',
}

export function catalogImageUrl(file: string): string {
  const local = catalogLocalImage[file]
  if (local) return local
  return legacySiteImage(file)
}

/** מצב עגלה: מזהה מוצר → כמות */
export type CartState = Record<number, number>

export function crumbleCookiesQtyInCart(cart: CartState, products: CatalogProduct[]): number {
  return products
    .filter((p) => p.category === 'crumbleCookies')
    .reduce((s, p) => s + (cart[p.id] ?? 0), 0)
}

export function rollsQtyInCart(cart: CartState, products: CatalogProduct[]): number {
  return products
    .filter((p) => p.category === 'rolls')
    .reduce((s, p) => s + (cart[p.id] ?? 0), 0)
}

/** סך יחידות מגולגלות בטיוטת מארז (לפני מיזוג לעגלה) */
export function sumRollsDraft(draft: CartState, products: CatalogProduct[]): number {
  return products
    .filter((p) => p.category === 'rolls')
    .reduce((s, p) => s + (draft[p.id] ?? 0), 0)
}

/** כמה מארזי 12 הושלמו בעגלה (יחידות מגולגלות / 12) */
export function rollsPackCountInCart(cart: CartState, products: CatalogProduct[]): number {
  const q = rollsQtyInCart(cart, products)
  if (q < 1) return 0
  return Math.floor(q / ROLLS_PACK_SIZE)
}

/** מחיר לשורה בעגלה (מגולגלות: מחיר המארז פרופורציונלי ל־12 יחידות) */
export function cartLinePriceForProduct(p: CatalogProduct, qty: number): number {
  if (qty < 1) return 0
  if (p.category === 'rolls') return Math.round((qty * p.price) / ROLLS_PACK_SIZE)
  return qty * p.price
}

/**
 * ספירת "פריטים" לתצוגה: מגולגלות נספרות כמארזים (כל 12 יחידות = 1), שאר הקטגוריות לפי כמות בשורה
 */
export function cartDisplayItemCount(cart: CartState, products: CatalogProduct[]): number {
  const nonRolls = products
    .filter((p) => p.category !== 'rolls')
    .reduce((s, p) => s + (cart[p.id] ?? 0), 0)
  return nonRolls + rollsPackCountInCart(cart, products)
}

/**
 * מונה תצוגה אחיד (טוסט, סרגל עגלה): `cartDisplayItemCount` + מארז מגולגלות בטיוטה (אם יש)
 */
export function getCartDisplayCount(
  cart: CartState,
  rollsDraft: CartState,
  products: CatalogProduct[],
): number {
  return cartDisplayItemCount(cart, products) + (sumRollsDraft(rollsDraft, products) > 0 ? 1 : 0)
}

export type CartPreviewLine = {
  productId: number
  title: string
  qty: number
}

/** שורות תצוגה לסיכום לפני שליחה: עגלה + טיוטת מגולגלות, לפי סדר הקטלוג */
export function getCartPreviewLines(
  cart: CartState,
  rollsDraft: CartState | undefined,
  products: CatalogProduct[],
): CartPreviewLine[] {
  const draft = rollsDraft ?? {}
  const lines: CartPreviewLine[] = []
  for (const p of products) {
    const c = cart[p.id] ?? 0
    const d = p.category === 'rolls' ? (draft[p.id] ?? 0) : 0
    const q = c + d
    if (q > 0) lines.push({ productId: p.id, title: p.title, qty: q })
  }
  return lines
}

/** סך קראמבל תקין = סכום של מארזי 4 ו־6 בלבד (למשל 4, 6, 8, 10…, לא 5 או 7) */
export function isValidCrumblePackTotal(total: number): boolean {
  if (total < 1) return false
  const [pack4, pack6] = CRUMBLE_PACK_SIZES
  for (let sixes = 0; sixes * pack6 <= total; sixes++) {
    const rest = total - sixes * pack6
    if (rest % pack4 === 0) return true
  }
  return false
}

function nextValidCrumblePackTotalUp(from: number, max = 99): number {
  for (let n = from; n <= max; n++) {
    if (isValidCrumblePackTotal(n)) return n
  }
  return from
}

function nextValidCrumblePackTotalDown(from: number): number {
  for (let n = from; n >= 1; n--) {
    if (isValidCrumblePackTotal(n)) return n
  }
  return 0
}

/** טקסט קצר כשהכמות בעגלה לא מתאימה למארזי 4/6, null אם אין בעיה */
export function crumblePackIssueDescription(qty: number): string | null {
  if (qty < 1 || isValidCrumblePackTotal(qty)) return null
  if (qty < 4) {
    return `יש בעגלה ${qty} עוגיות קראמבל, נדרש יעד של 4 או 6 (או 8, 10, 12… רק שילובי מארזים של 4 ו־6).`
  }
  const up = nextValidCrumblePackTotalUp(qty)
  const down = nextValidCrumblePackTotalDown(qty)
  const add = up !== qty && up <= 99 ? `להוסיף ${up - qty} כדי להגיע ל־${up}` : ''
  const rem = down >= 4 ? `להפחית ${qty - down} כדי להגיע ל־${down}` : ''
  const fix = add && rem ? `${add}, או ${rem}` : add || rem
  return `יש בעגלה ${qty} עוגיות קראמבל, לא ניתן לסכום הזה במארזי 4/6. ${fix}.`
}

/** סך מגולגלות תקין: 0 או מכפלה של 12 (מכל הטעמים יחד) */
export function isValidRollsPackTotal(total: number): boolean {
  if (total === 0) return true
  return total % ROLLS_PACK_SIZE === 0
}

function nextValidRollsPackTotalUp(from: number, max = 99): number {
  if (from < 1) return ROLLS_PACK_SIZE
  const ceil = Math.ceil(from / ROLLS_PACK_SIZE) * ROLLS_PACK_SIZE
  return ceil <= max ? ceil : from
}

function nextValidRollsPackTotalDown(from: number): number {
  return Math.floor(from / ROLLS_PACK_SIZE) * ROLLS_PACK_SIZE
}

/** טקסט כשסך המגולגלות בעגלה לא מתחלק ב־12, null אם אין בעיה */
export function rollsPackIssueDescription(qty: number): string | null {
  if (qty < 1 || isValidRollsPackTotal(qty)) return null
  if (qty < ROLLS_PACK_SIZE) {
    const add = ROLLS_PACK_SIZE - qty
    return `יש בעגלה ${qty} יחידות מגולגלות (מכל הטעמים יחד), נדרש סכום מתחלק ב־${ROLLS_PACK_SIZE} (12, 24…). אפשר לערבב טעמים: להוסיף עוד ${add} יחידות בכל שילוב כדי להגיע ל־${ROLLS_PACK_SIZE}.`
  }
  const up = nextValidRollsPackTotalUp(qty)
  const down = nextValidRollsPackTotalDown(qty)
  const add = up !== qty && up <= 99 ? `להוסיף ${up - qty} כדי להגיע ל־${up}` : ''
  const rem =
    down >= ROLLS_PACK_SIZE
      ? `להפחית ${qty - down} כדי להגיע ל־${down}`
      : `להפחית ${qty} כדי להסיר את המגולגלות מהעגלה`
  const fix = add && down >= ROLLS_PACK_SIZE ? `${add}, או ${rem}` : add || rem
  return `יש בעגלה ${qty} יחידות מגולגלות (מכל הטעמים יחד), הסכום הזה לא מתאים למארז של ${ROLLS_PACK_SIZE}. אפשר לערבב בין טעמים; ${fix}.`
}

/** לאן לגלול כשהעגלה לא עומדת בכללי מארז (קראמבל קודם, אחר כך מגולגלות) */
export function cartPackIssueScrollTargetId(
  cart: CartState,
  products: CatalogProduct[],
): 'catalog-crumbleCookies' | 'catalog-rolls' | null {
  const crumble = crumbleCookiesQtyInCart(cart, products)
  if (crumble > 0 && !isValidCrumblePackTotal(crumble)) return 'catalog-crumbleCookies'
  const rolls = rollsQtyInCart(cart, products)
  if (rolls > 0 && !isValidRollsPackTotal(rolls)) return 'catalog-rolls'
  return null
}

/** האם מותר לשלוח את העגלה לוואטסאפ, מארזי קראמבל ומגולגלות תקינים אם יש מהסוג */
export function canSendCartWhatsAppOrder(cart: CartState, products: CatalogProduct[]): boolean {
  if (cartItemCount(cart) < 1) return false
  const crumble = crumbleCookiesQtyInCart(cart, products)
  if (crumble > 0 && !isValidCrumblePackTotal(crumble)) return false
  const rolls = rollsQtyInCart(cart, products)
  if (rolls > 0 && !isValidRollsPackTotal(rolls)) return false
  return true
}

export function waMessageForProduct(p: CatalogProduct, qty = 0): string {
  const q = Math.max(1, qty || 1)
  const line = q > 1 ? `${q}× ${p.title}` : p.title
  if (p.category === 'cookies') {
    return `היי ליאל, אשמח לפרטים על ${line}. מחיר למארז ₪${p.price} (${p.priceLabel})`
  }
  if (p.category === 'rolls') {
    return `היי ליאל, אשמח לפרטים על ${line}. מחיר למארז ₪${p.price} (${p.priceLabel})`
  }
  const sub = q * p.price
  const packNote = p.priceLabel.trim() ? ` (${p.priceLabel})` : ''
  return `היי ליאל, אשמח לפרטים על ${line}. מחיר ליחידה ₪${p.price}${packNote}, סה״כ לשורה ₪${sub}`
}

export function cartLineTotal(cart: CartState, products: CatalogProduct[]): number {
  return products.reduce((sum, p) => sum + cartLinePriceForProduct(p, cart[p.id] ?? 0), 0)
}

/** סכום משוער לעגלה + טיוטת מגולגלות (מחיר פרופורציונלי ל־12 יח׳, כמו בעגלה) */
export function cartOrderTotalWithDraft(
  cart: CartState,
  rollsDraft: CartState,
  products: CatalogProduct[],
): number {
  const fromCart = cartLineTotal(cart, products)
  const fromRollsDraft = products
    .filter((p) => p.category === 'rolls')
    .reduce((sum, p) => sum + cartLinePriceForProduct(p, rollsDraft[p.id] ?? 0), 0)
  return fromCart + fromRollsDraft
}

export function cartItemCount(cart: CartState): number {
  return Object.values(cart).reduce((a, b) => a + b, 0)
}

/** סיום הודעת עגלה לפני בחירת תאריך/אופן ב־checkout (למשל מקיצור העגלה) */
export const CART_WA_GENERIC_CLOSING_LINE = 'נשמח לתאם איסוף/משלוח ותאריך. תודה!'

/** אחרי בחירה ב־checkout — מחליף את השורה הגנרית */
export const CART_WA_CHECKOUT_SELECTED_CLOSING_LINE =
  'הפרטים נבחרו באתר (אופן קבלה, תאריך ושעה). מחכים לאישור. תודה!'

/** הודעת וואטסאפ לכל העגלה (רק מוצרים עם כמות &gt; 0) */
export function buildCartWhatsAppMessage(cart: CartState, products: CatalogProduct[]): string {
  const lines: string[] = ['היי ליאל, אשמח להזמין:', '']
  let total = 0
  for (const p of products) {
    const q = cart[p.id] ?? 0
    if (q < 1) continue
    const sub = cartLinePriceForProduct(p, q)
    total += sub
    lines.push(`${p.title} ×${q} ₪${sub}`)
  }

  lines.push('')
  lines.push(`סה״כ משוער: ₪${total}`)
  lines.push('')
  lines.push(CART_WA_GENERIC_CLOSING_LINE)
  return lines.join('\n')
}

export type CheckoutDeliveryMethod = 'pickup' | 'delivery'

function parseLocalDateFromIso(iso: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return new Date(NaN)
  const y = Number(m[1])
  const mo = Number(m[2])
  const d = Number(m[3])
  return new Date(y, mo - 1, d)
}

const CHECKOUT_SLOT_STEP_MIN = 30

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function minutesToHHmm(total: number): string {
  return `${pad2(Math.floor(total / 60))}:${pad2(total % 60)}`
}

/** חלון התחלה–סיום בדקות מהחצות לפי תאריך checkout (רביעי–שישי בלבד) */
export function checkoutPickupWindowMinutes(iso: string): { start: number; end: number } | null {
  const d = parseLocalDateFromIso(iso)
  if (Number.isNaN(d.getTime())) return null
  const dow = d.getDay()
  if (dow === 3 || dow === 4) return { start: 16 * 60, end: 20 * 60 }
  if (dow === 5) return { start: 10 * 60, end: 16 * 60 }
  return null
}

/** זמני התחלה לבחירה (משבצות של ‎30 דק׳) לפי תאריך */
export function preferredTimeSlotStartsForCheckoutIso(
  iso: string,
  stepMinutes: number = CHECKOUT_SLOT_STEP_MIN,
): string[] {
  const w = checkoutPickupWindowMinutes(iso)
  if (!w || stepMinutes < 5) return []
  const out: string[] = []
  for (let t = w.start; t + stepMinutes <= w.end; t += stepMinutes) {
    out.push(minutesToHHmm(t))
  }
  return out
}

/** תווית טווח משבצת: סיום–התחלה ‎(HH:mm–HH:mm) מתוך זמן התחלה */
export function checkoutTimeSlotRangeLabel(
  startHHmm: string,
  stepMinutes: number = CHECKOUT_SLOT_STEP_MIN,
): string | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(startHHmm.trim())
  if (!m) return null
  const h = Number(m[1])
  const mi = Number(m[2])
  if (!Number.isFinite(h) || !Number.isFinite(mi) || mi < 0 || mi > 59 || h < 0 || h > 23) {
    return null
  }
  const startTotal = h * 60 + mi
  const endTotal = startTotal + stepMinutes
  return `${minutesToHHmm(endTotal)}–${pad2(h)}:${pad2(mi)}`
}

export function isValidPreferredTimeSlotStartForIso(iso: string, startHHmm: string): boolean {
  return preferredTimeSlotStartsForCheckoutIso(iso).includes(startHHmm.trim())
}

/** תאריך ‎YYYY-MM-DD מקומי — לא בעבר (לפי יום מקומי) ורק רביעי–שישי */
export function isValidCheckoutDeliveryDate(iso: string): boolean {
  const pick = parseLocalDateFromIso(iso)
  if (Number.isNaN(pick.getTime())) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  pick.setHours(0, 0, 0, 0)
  if (pick < today) return false
  const dow = pick.getDay()
  return dow === 3 || dow === 4 || dow === 5
}

function dateToIsoLocal(d: Date): string {
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${mo}-${day}`
}

/** היום הקרוב ביותר (כולל היום) שעומד בכללי תאריך איסוף/משלוח */
export function getNextCheckoutDeliveryDateIso(): string {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  for (let i = 0; i < 370; i++) {
    const iso = dateToIsoLocal(d)
    if (isValidCheckoutDeliveryDate(iso)) return iso
    d.setDate(d.getDate() + 1)
  }
  return dateToIsoLocal(d)
}

/** התאריך הקרוב ביותר (כולל היום) שחל ביום בשבוע נתון (3=רביעי … 5=שישי) ועומד ב־isValidCheckoutDeliveryDate */
export function getNextCheckoutDateForWeekday(targetDow: 3 | 4 | 5): string {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  for (let i = 0; i < 370; i++) {
    if (d.getDay() === targetDow) {
      const iso = dateToIsoLocal(d)
      if (isValidCheckoutDeliveryDate(iso)) return iso
    }
    d.setDate(d.getDate() + 1)
  }
  return dateToIsoLocal(d)
}

/** DD/MM/YYYY מתוך ‎YYYY-MM-DD */
function formatDeliveryDateDdMmYyyy(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return iso
  return `${m[3]}/${m[2]}/${m[1]}`
}

/** שורת סיכום בעגלה — גמיש לגרשיים עבריים/ASCII ולמספר עשרוני */
const CART_WA_SUMMARY_PATTERN =
  /\n\n(סה[״"\u05F4]כ משוער: ₪[\d]+(?:\.\d+)?)/

const WA_SUMMARY_SINGLE_LINE_RE = /^סה[״"\u05F4]כ משוער:\s*₪[\d.]+$/m

export type MergeCartWhatsAppCheckoutOptions = {
  /** ‎HH:mm — חייב להתאים ל־preferredTimeSlotStartsForCheckoutIso לפי התאריך */
  preferredTimeSlotStart?: string | null
  /** סכום מוצרים לפני משלוח (כמו cartOrderTotalWithDraft) — לעדכון סה״כ במשלוח */
  cartSubtotalShekels?: number
  /** תוספת משלוח למרכז */
  centerDeliveryFeeShekels?: number
  /** שורה אחת לפני סה״כ משוער, למשל: משלוח ל־מרכז הארץ: ₪30 */
  whatsappDeliveryFeeDescriptionLine?: string
}

function applyCheckoutSelectedClosingToWaMessage(message: string): string {
  if (!message.includes(CART_WA_GENERIC_CLOSING_LINE)) {
    return `${message.trimEnd()}\n\n${CART_WA_CHECKOUT_SELECTED_CLOSING_LINE}`
  }
  return message.replace(CART_WA_GENERIC_CLOSING_LINE, CART_WA_CHECKOUT_SELECTED_CLOSING_LINE)
}

function applyCenterDeliveryFeeToWaSummary(
  message: string,
  cartSubtotalShekels: number,
  feeShekels: number,
  feeDescriptionLine: string,
): string {
  const grand = cartSubtotalShekels + feeShekels
  const replacement = `${feeDescriptionLine}\nסה״כ משוער: ₪${grand}`
  if (WA_SUMMARY_SINGLE_LINE_RE.test(message)) {
    return message.replace(WA_SUMMARY_SINGLE_LINE_RE, replacement)
  }
  return `${message}\n\n${replacement}`
}

/** מוסיף לפני סיכום העגלה: אופן קבלה ושורת תאריך (טבעי לוואטסאפ) */
export function mergeCartWhatsAppWithCheckoutDelivery(
  baseMessage: string,
  method: CheckoutDeliveryMethod,
  dateIso: string,
  options?: MergeCartWhatsAppCheckoutOptions,
): string {
  const methodLabel = method === 'pickup' ? 'איסוף עצמי' : 'משלוח'
  const dateDdMm = formatDeliveryDateDdMmYyyy(dateIso)

  let timeBlock = ''
  const slotStart = options?.preferredTimeSlotStart?.trim()
  if (slotStart && isValidPreferredTimeSlotStartForIso(dateIso, slotStart)) {
    const range = checkoutTimeSlotRangeLabel(slotStart)
    if (range) {
      timeBlock =
        method === 'pickup'
          ? `שעה מועדפת לאיסוף: ${range}\n`
          : `שעה מועדפת לתיאום משלוח: ${range}\n`
    }
  }

  const blockBeforeSummary = `\n\n${methodLabel}\nל־${dateDdMm}\n${timeBlock}\n`

  let merged: string
  if (CART_WA_SUMMARY_PATTERN.test(baseMessage)) {
    merged = baseMessage.replace(CART_WA_SUMMARY_PATTERN, `${blockBeforeSummary}$1`)
  } else {
    const lines = baseMessage.split('\n')
    const summaryIdx = lines.findIndex((line) =>
      /^סה[״"\u05F4]כ משוער:\s*₪[\d.]+$/.test(line.trim()),
    )
    if (summaryIdx >= 0) {
      const head = lines.slice(0, summaryIdx).join('\n')
      const tail = lines.slice(summaryIdx).join('\n')
      merged = `${head}${blockBeforeSummary}${tail}`
    } else {
      merged = `${baseMessage}\n\n${methodLabel}\nל־${dateDdMm}\n${timeBlock}`
    }
  }

  if (
    method === 'delivery' &&
    options &&
    options.centerDeliveryFeeShekels != null &&
    options.centerDeliveryFeeShekels > 0 &&
    options.cartSubtotalShekels != null &&
    Number.isFinite(options.cartSubtotalShekels) &&
    (options.whatsappDeliveryFeeDescriptionLine?.trim().length ?? 0) > 0
  ) {
    merged = applyCenterDeliveryFeeToWaSummary(
      merged,
      options.cartSubtotalShekels,
      options.centerDeliveryFeeShekels,
      options.whatsappDeliveryFeeDescriptionLine!.trim(),
    )
  }

  return applyCheckoutSelectedClosingToWaMessage(merged)
}
