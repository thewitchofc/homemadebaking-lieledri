import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react'
import { gaEvent } from '../analytics'
import {
  GREETING_CARD_PRODUCT_ID,
  ROLLS_PACK_SIZE,
  buildCartWhatsAppMessage,
  canSendCartWhatsAppOrder,
  cartDisplayItemCount,
  cartItemCount,
  cartLineTotal,
  catalogProducts,
  crumbleCookiesQtyInCart,
  sumRollsDraft,
  type CartState,
} from '../catalog'

type CartRootState = {
  cart: CartState
  /** יחידות מגולגלות בטיוטת מארז נוכחי (מקסימום 12, אז מיזוג לעגלה ואיפוס) */
  rollsDraft: CartState
  /** טקסט לכרטיס ברכה (עד 50 תווים) כשמוצר כרטיס בעגלה */
  greetingCardText: string
}

type Action =
  | { type: 'SET_QTY'; productId: number; nextQty: number }
  | { type: 'HYDRATE'; payload: CartRootState }
  | { type: 'SET_GREETING'; text: string }

function cartRootsEqual(a: CartRootState, b: CartRootState): boolean {
  return (
    JSON.stringify(a.cart) === JSON.stringify(b.cart) &&
    JSON.stringify(a.rollsDraft) === JSON.stringify(b.rollsDraft) &&
    a.greetingCardText === b.greetingCardText
  )
}

function mergeRollsDraftIntoCart(cart: CartState, draft: CartState): CartState {
  const next = { ...cart }
  for (const p of catalogProducts) {
    if (p.category !== 'rolls') continue
    const q = draft[p.id]
    if (q && q > 0) next[p.id] = (next[p.id] ?? 0) + q
  }
  return next
}

function sumDraft(draft: CartState): number {
  return sumRollsDraft(draft, catalogProducts)
}

/** סך יחידות בכל שורות (עגלה + טיוטת מגולגלות) — עולה רק כשמוסיפים, לא במיזוג מארז לעגלה */
function totalOrderUnits(root: CartRootState): number {
  let sum = 0
  for (const p of catalogProducts) {
    sum += root.cart[p.id] ?? 0
    sum += root.rollsDraft[p.id] ?? 0
  }
  return sum
}

function reducer(state: CartRootState, action: Action): CartRootState {
  if (action.type === 'HYDRATE') return action.payload
  if (action.type === 'SET_GREETING') {
    return { ...state, greetingCardText: action.text.slice(0, 50) }
  }
  if (action.type !== 'SET_QTY') return state
  const { productId, nextQty: raw } = action
  const n = Math.max(0, Math.min(99, Math.floor(raw)))
  const product = catalogProducts.find((p) => p.id === productId)
  if (!product) return state

  if (product.category !== 'rolls') {
    const capped = productId === GREETING_CARD_PRODUCT_ID ? Math.min(1, n) : n
    const cart = { ...state.cart }
    if (capped === 0) {
      delete cart[productId]
      if (productId === GREETING_CARD_PRODUCT_ID) {
        return { ...state, cart, greetingCardText: '' }
      }
      return { ...state, cart }
    }
    cart[productId] = capped
    return { ...state, cart }
  }

  const cartQ = state.cart[productId] ?? 0
  const draftQ = state.rollsDraft[productId] ?? 0
  const total = cartQ + draftQ
  if (n === total) return state

  if (n > total) {
    const add = n - total
    const dSum = sumDraft(state.rollsDraft)
    const room = ROLLS_PACK_SIZE - dSum
    const applied = Math.min(add, room)
    if (applied <= 0) return state
    const newDraft = { ...state.rollsDraft }
    const newDq = draftQ + applied
    if (newDq <= 0) delete newDraft[productId]
    else newDraft[productId] = newDq
    const newSum = sumDraft(newDraft)
    if (newSum === ROLLS_PACK_SIZE) {
      return {
        ...state,
        cart: mergeRollsDraftIntoCart(state.cart, newDraft),
        rollsDraft: {},
      }
    }
    return { ...state, rollsDraft: newDraft }
  }

  let rem = total - n
  const newDraft = { ...state.rollsDraft }
  const newCart = { ...state.cart }
  const dq = draftQ
  const cq = cartQ
  if (dq >= rem) {
    const nd = dq - rem
    if (nd <= 0) delete newDraft[productId]
    else newDraft[productId] = nd
  } else {
    rem -= dq
    delete newDraft[productId]
    const nc = cq - rem
    if (nc <= 0) delete newCart[productId]
    else newCart[productId] = nc
  }
  return { ...state, cart: newCart, rollsDraft: newDraft }
}

type OrderCartContextValue = {
  cart: CartState
  rollsDraft: CartState
  rollsDraftTotal: number
  setQty: (productId: number, nextQty: number) => void
  /** ספירה לתצוגה: מגולגלות = מארזים (÷12), לא יחידות בודדות */
  itemsInCart: number
  /** עגלה צפה / סרגל תחתון — רק כשיש פריטים בעגלה (לא טיוטת מגולגלות לבד) */
  showCartChrome: boolean
  cartTotal: number
  cartWaMessage: string
  crumbleCookiesQty: number
  canSendCartWhatsApp: boolean
  greetingCardText: string
  setGreetingCardText: (text: string) => void
}

const OrderCartContext = createContext<OrderCartContextValue | null>(null)

const initialRoot: CartRootState = { cart: {}, rollsDraft: {}, greetingCardText: '' }

/** מפתח localStorage — גרסה בשם המפתח; ערך: { v, cart, rollsDraft } */
const CART_STORAGE_KEY = 'cart_v1'

const catalogIds = new Set(catalogProducts.map((p) => p.id))

function sanitizeCartRecord(raw: unknown): CartState {
  const out: CartState = {}
  try {
    if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return out
    for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
      const id = Number(key)
      if (!Number.isInteger(id) || !catalogIds.has(id)) continue
      if (typeof val !== 'number' || !Number.isFinite(val)) continue
      let q = Math.floor(val)
      if (id === GREETING_CARD_PRODUCT_ID) q = Math.min(1, q)
      if (q < 1 || q > 99) continue
      out[id] = q
    }
  } catch {
    return out
  }
  return out
}

function sanitizeRollsDraft(cart: CartState): CartState {
  const out: CartState = {}
  for (const idStr of Object.keys(cart)) {
    const id = Number(idStr)
    const p = catalogProducts.find((x) => x.id === id)
    if (p?.category === 'rolls') {
      const q = cart[id]
      if (q !== undefined && q >= 1 && q <= 99) out[id] = q
    }
  }
  return out
}

function readPersistedRoot(): CartRootState | null {
  try {
    if (typeof localStorage === 'undefined') return null
    const json = localStorage.getItem(CART_STORAGE_KEY)
    if (json === null || json === '') return null
    const data = JSON.parse(json) as unknown
    if (data === null || typeof data !== 'object' || Array.isArray(data)) return null
    const obj = data as Record<string, unknown>
    if (obj.v !== 1) return null
    const cart = sanitizeCartRecord(obj.cart)
    const rollsDraft = sanitizeRollsDraft(sanitizeCartRecord(obj.rollsDraft))
    const greetingCardText =
      typeof obj.greetingCardText === 'string' ? obj.greetingCardText.slice(0, 50) : ''
    return { cart, rollsDraft, greetingCardText }
  } catch {
    return null
  }
}

function persistRoot(root: CartRootState): void {
  try {
    if (typeof localStorage === 'undefined') return
    const payload = JSON.stringify({
      v: 1,
      cart: root.cart,
      rollsDraft: root.rollsDraft,
      greetingCardText: root.greetingCardText,
    })
    localStorage.setItem(CART_STORAGE_KEY, payload)
  } catch {
    /* quota / מצב פרטי */
  }
}

function initOrderRoot(seed: CartRootState): CartRootState {
  try {
    const loaded = readPersistedRoot()
    return loaded ?? seed
  } catch {
    return seed
  }
}

export function OrderCartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialRoot, initOrderRoot)
  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  const setQty = useCallback(
    (productId: number, nextQty: number) => {
      const action = { type: 'SET_QTY' as const, productId, nextQty }
      const prevU = totalOrderUnits(state)
      const nextRoot = reducer(state, action)
      const nextU = totalOrderUnits(nextRoot)
      if (nextU > prevU) {
        gaEvent('add_to_cart', { product_id: productId })
      }
      dispatch(action)
    },
    [state],
  )

  const setGreetingCardText = useCallback((text: string) => {
    dispatch({ type: 'SET_GREETING', text })
  }, [])

  const { cart, rollsDraft, greetingCardText } = state

  useEffect(() => {
    persistRoot(state)
  }, [state])

  /** כתיבה סינכרונית לפני רקע/סגירת לשונית — מפחית איבוד אם הדפדפן קוטע לפני ה־effect */
  useEffect(() => {
    const flush = () => persistRoot(stateRef.current)
    window.addEventListener('pagehide', flush)
    return () => window.removeEventListener('pagehide', flush)
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasItems =
        Object.values(cart).some((q) => q > 0) || Object.values(rollsDraft).some((q) => q > 0)
      if (!hasItems) return
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [cart, rollsDraft])

  /** חזרה ללשונית / מטמון דפדפן / טאב אחר — מסנכרן מה־localStorage כדי שלא תאבד עגלה בזיכרון */
  useEffect(() => {
    const tryHydrateFromStorage = () => {
      const fromDisk = readPersistedRoot()
      if (!fromDisk) return
      if (cartRootsEqual(stateRef.current, fromDisk)) return
      dispatch({ type: 'HYDRATE', payload: fromDisk })
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key !== null && e.key !== CART_STORAGE_KEY) return
      tryHydrateFromStorage()
    }

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) tryHydrateFromStorage()
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') tryHydrateFromStorage()
    }

    const onFocus = () => tryHydrateFromStorage()

    window.addEventListener('storage', onStorage)
    window.addEventListener('pageshow', onPageShow)
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('pageshow', onPageShow)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const rollsDraftTotal = useMemo(() => sumRollsDraft(rollsDraft, catalogProducts), [rollsDraft])

  const itemsInCart = cartDisplayItemCount(cart, catalogProducts)
  const showCartChrome = cartItemCount(cart) > 0
  const cartTotal = useMemo(() => cartLineTotal(cart, catalogProducts), [cart])
  const cartWaMessage = useMemo(() => buildCartWhatsAppMessage(cart, catalogProducts), [cart])
  const crumbleCookiesQty = useMemo(
    () => crumbleCookiesQtyInCart(cart, catalogProducts),
    [cart],
  )
  const canSendCartWhatsApp = useMemo(
    () => canSendCartWhatsAppOrder(cart, catalogProducts),
    [cart],
  )

  const value = useMemo(
    () => ({
      cart,
      rollsDraft,
      rollsDraftTotal,
      setQty,
      itemsInCart,
      showCartChrome,
      cartTotal,
      cartWaMessage,
      crumbleCookiesQty,
      canSendCartWhatsApp,
      greetingCardText,
      setGreetingCardText,
    }),
    [
      cart,
      rollsDraft,
      rollsDraftTotal,
      setQty,
      itemsInCart,
      showCartChrome,
      cartTotal,
      cartWaMessage,
      crumbleCookiesQty,
      canSendCartWhatsApp,
      greetingCardText,
      setGreetingCardText,
    ],
  )

  return (
    <OrderCartContext.Provider value={value}>
      {children}
    </OrderCartContext.Provider>
  )
}

export function useOrderCart(): OrderCartContextValue {
  const ctx = useContext(OrderCartContext)
  if (!ctx) throw new Error('useOrderCart must be used within OrderCartProvider')
  return ctx
}
