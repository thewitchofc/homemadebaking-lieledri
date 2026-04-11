import { describe, expect, it } from 'vitest'
import {
  ROLLS_PACK_SIZE,
  canSendCartWhatsAppOrder,
  cartOrderTotalWithDraft,
  catalogProducts,
  crumblePackIssueDescription,
  getCartDisplayCount,
  getNextCheckoutDateForWeekday,
  getNextCheckoutDeliveryDateIso,
  isValidCheckoutDeliveryDate,
  isValidCrumblePackTotal,
  isValidRollsPackTotal,
  mergeCartWhatsAppWithCheckoutDelivery,
  rollsPackIssueDescription,
  type CartState,
} from './catalog'

const products = catalogProducts

/** מזהים יציבים מהקטלוג הקיים */
const ROLL_A = 1
const ROLL_B = 2
const COOKIE = 3
const CRUMBLE_A = 14
const CRUMBLE_B = 12
const CAKE = 4

describe('getCartDisplayCount', () => {
  it('מחזיר 0 לעגלה וטיוטה ריקים', () => {
    expect(getCartDisplayCount({}, {}, products)).toBe(0)
  })

  it('סופר מוצר שאינו מגולגלות כיחידה אחת', () => {
    const cart: CartState = { [COOKIE]: 1 }
    expect(getCartDisplayCount(cart, {}, products)).toBe(1)
  })

  it('מגולגלות: 12 יחידות בעגלה נספרות כמארז אחד', () => {
    const cart: CartState = { [ROLL_A]: 12 }
    expect(getCartDisplayCount(cart, {}, products)).toBe(1)
  })

  it('מגולגלות: 24 יחידות = 2 מארזים בתצוגה', () => {
    const cart: CartState = { [ROLL_A]: 24 }
    expect(getCartDisplayCount(cart, {}, products)).toBe(2)
  })

  it('מגולגלות: 11 יחידות — אין מארז שלם, ספירת מארזים 0', () => {
    const cart: CartState = { [ROLL_A]: 11 }
    expect(getCartDisplayCount(cart, {}, products)).toBe(0)
  })

  it('טיוטת מגולגלות עם יחידה אחת מוסיפה 1 לתצוגה (מארז בתהליך)', () => {
    const draft: CartState = { [ROLL_A]: 1 }
    expect(getCartDisplayCount({}, draft, products)).toBe(1)
  })

  it('שילוב: עוגיה + מארז מגולגלות + טיוטה', () => {
    const cart: CartState = { [COOKIE]: 2, [ROLL_A]: 12 }
    const draft: CartState = { [ROLL_A]: 3 }
    expect(getCartDisplayCount(cart, draft, products)).toBe(2 + 1 + 1)
  })

  it('כמות 0 לא נספרת', () => {
    const cart: CartState = { [COOKIE]: 0, [ROLL_A]: 0 }
    expect(getCartDisplayCount(cart, {}, products)).toBe(0)
  })

  it('מקסימום 99 מגולגלות — ספירת מארזים תואמת floor(q/12)', () => {
    const cart: CartState = { [ROLL_A]: 99 }
    expect(getCartDisplayCount(cart, {}, products)).toBe(Math.floor(99 / 12))
  })
})

describe('cartOrderTotalWithDraft', () => {
  it('מחזיר 0 לעגלה וטיוטה ריקים', () => {
    expect(cartOrderTotalWithDraft({}, {}, products)).toBe(0)
  })

  it('מחשב עוגיות לפי מחיר למארז × כמות', () => {
    const cart: CartState = { [COOKIE]: 2 }
    const p = products.find((x) => x.id === COOKIE)!
    expect(cartOrderTotalWithDraft(cart, {}, products)).toBe(p.price * 2)
  })

  it('מגולגלות בעגלה: מחיר פרופורציונלי ל־12', () => {
    const cart: CartState = { [ROLL_A]: 12 }
    const p = products.find((x) => x.id === ROLL_A)!
    expect(cartOrderTotalWithDraft(cart, {}, products)).toBe(p.price)
  })

  it('מגולגלות בטיוטה בלבד — אותו חישוב פרופורציה', () => {
    const draft: CartState = { [ROLL_A]: 6 }
    const p = products.find((x) => x.id === ROLL_A)!
    expect(cartOrderTotalWithDraft({}, draft, products)).toBe(Math.round((6 * p.price) / ROLLS_PACK_SIZE))
  })

  it('שילוב עגלה + טיוטה מגולגלות', () => {
    const p = products.find((x) => x.id === ROLL_A)!
    const cart: CartState = { [COOKIE]: 1, [ROLL_A]: 12 }
    const draft: CartState = { [ROLL_A]: 6 }
    const cookie = products.find((x) => x.id === COOKIE)!
    const expected =
      cookie.price * 1 + p.price + Math.round((6 * p.price) / ROLLS_PACK_SIZE)
    expect(cartOrderTotalWithDraft(cart, draft, products)).toBe(expected)
  })

  it('עוגה וקראמבל לפי מחיר ליחידה', () => {
    const cart: CartState = { [CAKE]: 1, [CRUMBLE_A]: 4 }
    const cake = products.find((x) => x.id === CAKE)!
    const cr = products.find((x) => x.id === CRUMBLE_A)!
    expect(cartOrderTotalWithDraft(cart, {}, products)).toBe(cake.price + cr.price * 4)
  })
})

describe('isValidCrumblePackTotal', () => {
  it('דוחה סכומים מתחת ל־1', () => {
    expect(isValidCrumblePackTotal(0)).toBe(false)
    expect(isValidCrumblePackTotal(-1)).toBe(false)
  })

  it('מאשר 4, 6 ושילובי 4/6 תקינים', () => {
    expect(isValidCrumblePackTotal(4)).toBe(true)
    expect(isValidCrumblePackTotal(6)).toBe(true)
    expect(isValidCrumblePackTotal(8)).toBe(true)
    expect(isValidCrumblePackTotal(10)).toBe(true)
    expect(isValidCrumblePackTotal(12)).toBe(true)
    expect(isValidCrumblePackTotal(18)).toBe(true)
  })

  it('דוחה סכומים שלא נפרקים ל־4a+6b', () => {
    expect(isValidCrumblePackTotal(1)).toBe(false)
    expect(isValidCrumblePackTotal(2)).toBe(false)
    expect(isValidCrumblePackTotal(3)).toBe(false)
    expect(isValidCrumblePackTotal(5)).toBe(false)
    expect(isValidCrumblePackTotal(7)).toBe(false)
    expect(isValidCrumblePackTotal(9)).toBe(false)
    expect(isValidCrumblePackTotal(11)).toBe(false)
  })
})

describe('isValidRollsPackTotal', () => {
  it('מאשר 0', () => {
    expect(isValidRollsPackTotal(0)).toBe(true)
  })

  it('מאשר כפולות של 12', () => {
    expect(isValidRollsPackTotal(12)).toBe(true)
    expect(isValidRollsPackTotal(24)).toBe(true)
    expect(isValidRollsPackTotal(96)).toBe(true)
  })

  it('דוחה חיוביים שאינם מכפלה של 12', () => {
    expect(isValidRollsPackTotal(1)).toBe(false)
    expect(isValidRollsPackTotal(11)).toBe(false)
    expect(isValidRollsPackTotal(13)).toBe(false)
    expect(isValidRollsPackTotal(23)).toBe(false)
  })
})

describe('חוקי מארזים מול עגלה (אינטגרציה)', () => {
  it('canSendCartWhatsAppOrder דוחה עגלה ריקה', () => {
    expect(canSendCartWhatsAppOrder({}, products)).toBe(false)
  })

  it('מאשר הזמנה עם קראמבל תקין בלבד', () => {
    const cart: CartState = { [CRUMBLE_A]: 4 }
    expect(canSendCartWhatsAppOrder(cart, products)).toBe(true)
  })

  it('דוחה קראמבל בסך לא תקין', () => {
    const cart: CartState = { [CRUMBLE_A]: 3, [CRUMBLE_B]: 2 }
    expect(canSendCartWhatsAppOrder(cart, products)).toBe(false)
  })

  it('דוחה מגולגלות שלא מתחלקות ב־12', () => {
    const cart: CartState = { [ROLL_A]: 12, [ROLL_B]: 1 }
    expect(canSendCartWhatsAppOrder(cart, products)).toBe(false)
  })

  it('מאשר שילוב קראמבל תקין + מגולגלות תקינות', () => {
    const cart: CartState = { [CRUMBLE_A]: 6, [ROLL_A]: 12 }
    expect(canSendCartWhatsAppOrder(cart, products)).toBe(true)
  })
})

describe('crumblePackIssueDescription', () => {
  it('מחזיר null כשאין בעיה או אין קראמבל', () => {
    expect(crumblePackIssueDescription(0)).toBe(null)
    expect(crumblePackIssueDescription(4)).toBe(null)
    expect(crumblePackIssueDescription(12)).toBe(null)
  })

  it('מחזיר טקסט לסכום לא תקין', () => {
    expect(crumblePackIssueDescription(5)).toContain('5')
    expect(crumblePackIssueDescription(5)).toContain('קראמבל')
  })
})

describe('rollsPackIssueDescription', () => {
  it('מחזיר null כשאין בעיה', () => {
    expect(rollsPackIssueDescription(0)).toBe(null)
    expect(rollsPackIssueDescription(12)).toBe(null)
  })

  it('מחזיר טקסט כשסך לא מתחלק ב־12', () => {
    expect(rollsPackIssueDescription(5)).toContain('5')
    expect(rollsPackIssueDescription(5)).toContain('12')
  })
})

describe('isValidCheckoutDeliveryDate', () => {
  it('דוחה תאריך בעבר', () => {
    expect(isValidCheckoutDeliveryDate('1990-06-06')).toBe(false)
  })

  it('דוחה יום שלא רביעי–שישי (דוגמה: שלישי עתידי)', () => {
    expect(isValidCheckoutDeliveryDate('2030-01-08')).toBe(false)
  })

  it('מאשר רביעי–שישי עתידיים', () => {
    expect(isValidCheckoutDeliveryDate('2030-01-09')).toBe(true)
    expect(isValidCheckoutDeliveryDate('2030-01-10')).toBe(true)
    expect(isValidCheckoutDeliveryDate('2030-01-11')).toBe(true)
  })

  it('דוחה שבת', () => {
    expect(isValidCheckoutDeliveryDate('2030-01-12')).toBe(false)
  })

  it('דוחה מחרוזת שאינה ‎YYYY-MM-DD', () => {
    expect(isValidCheckoutDeliveryDate('')).toBe(false)
    expect(isValidCheckoutDeliveryDate('01-01-2030')).toBe(false)
  })
})

describe('mergeCartWhatsAppWithCheckoutDelivery', () => {
  it('מוסיף אופן קבלה ושורת תאריך לפני סה״כ משוער', () => {
    const base = `פתיחה\n\nפריט ×1 ₪5\n\nסה״כ משוער: ₪5\n\nנשמח לתאם איסוף/משלוח ותאריך. תודה!`
    const out = mergeCartWhatsAppWithCheckoutDelivery(base, 'pickup', '2030-01-09')
    expect(out.indexOf('איסוף עצמי')).toBeLessThan(out.indexOf('סה״כ משוער'))
    expect(out).toContain('איסוף עצמי')
    expect(out).toContain('ל־09/01/2030')
    expect(out).toContain('נשמח לתאם איסוף')
  })

  it('משלוח ופורמט ל־DD/MM/YYYY', () => {
    const base = `x\n\nסה״כ משוער: ₪12\n\nסוף`
    const out = mergeCartWhatsAppWithCheckoutDelivery(base, 'delivery', '2030-01-10')
    expect(out).toContain('משלוח')
    expect(out).toContain('ל־10/01/2030')
    expect(out).not.toContain('שיטת קבלה')
  })
})

describe('getNextCheckoutDeliveryDateIso', () => {
  it('מחזיר תאריך תקין ‎YYYY-MM-DD', () => {
    const iso = getNextCheckoutDeliveryDateIso()
    expect(/^\d{4}-\d{2}-\d{2}$/.test(iso)).toBe(true)
    expect(isValidCheckoutDeliveryDate(iso)).toBe(true)
  })
})

describe('getNextCheckoutDateForWeekday', () => {
  function isoWeekday(iso: string): number {
    const [y, m, d] = iso.split('-').map(Number)
    return new Date(y, m - 1, d).getDay()
  }

  it('מחזיר תאריך עתידי ביום המבוקש (3–5) ותקף ל־checkout', () => {
    for (const dow of [3, 4, 5] as const) {
      const iso = getNextCheckoutDateForWeekday(dow)
      expect(isValidCheckoutDeliveryDate(iso)).toBe(true)
      expect(isoWeekday(iso)).toBe(dow)
    }
  })
})
