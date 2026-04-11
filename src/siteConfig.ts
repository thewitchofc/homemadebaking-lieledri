/**
 * התאימו כאן לכל פרויקט חדש, שם מותג, טלפון והודעת וואטסאפ ברירת מחדל.
 * For reuse: copy this file and replace values (see also contentPlaceholders.ts).
 */
export const site = {
  brandHe: 'ליאל אדרי',
  /** שם בלוגו באנגלית (כותרת ראשית בניווט) */
  brandLogoLatin: 'Liel Edri',
  /** מילת מותג לטינית במקום תמונת לוגו, פונט תצוגה (Assistant), לא כתב מסולסל */
  logoWordmarkLatin: 'LIEL EDRI',
  brandEn: 'Homemade Baking',
  /** לתצוגה בלי מקפים (נוח ל־RTL) */
  phoneDisplay: '054 319 3330',
  /** לקישור חיוג ישיר */
  phoneTel: '+972543193330',
  /** מספר לוואטסאפ בלי + ובלי 0 ראשון */
  waDigits: '972543193330',
  instagramUrl: 'https://www.instagram.com/liel.edri1/',
  instagramHandle: '@liel.edri1',
  pickupAddress: 'הקלרנית 10, ראשון לציון',
  orderDays: 'רביעי, חמישי ושישי',
  /** כותרת בלוק קרדיט הפיתוח (זהוב) */
  devCreditHeading: 'קרדיט פיתוח',
  /** תת־כותרת (ירוק) */
  devCreditSubtitle: 'עיצוב ופיתוח אתר',
  /** לוגו סטודיו The Witch, קובץ ב־public/ */
  devLogoMark: '/the-witch-dev-logo.png?v=1',
} as const

export function whatsappLink(message: string): string {
  const q = encodeURIComponent(message)
  return `https://wa.me/${site.waDigits}?text=${q}`
}

export const defaultWaMessage =
  'היי ליאל, אשמח לשמוע פרטים על קינוחים בהזמנה אישית ותאריכי אספקה. תודה!'

/**
 * תמונות מהאתר המקורי, הקבצים מוגשים מ־Vercel כמו ב־liel-edri-baking.vercel.app
 * (אותם שמות קבצים כמו בקוד האתר הישן: ITEM1(2).jpeg וכו׳).
 * אם תעבירו דומיין/תשתית, העתיקו את קבצי ה־jpeg ל־public/ או עדכנו כאן את הבסיס.
 */
export const legacySiteMediaBase = 'https://liel-edri-baking.vercel.app'

export function legacySiteImage(filename: string): string {
  return `${legacySiteMediaBase}/${encodeURIComponent(filename)}`
}

/** תמונות אתר (Hero וכו׳). תמונות מוצרים, ראו catalog.ts */
export const siteImages = {
  logo: 'https://dolevatik.github.io/Liel-Edri-Baking/logo1.png',
  /** רקע Hero, מגולגלות (תמונה אנכית; מיקום object-bottom בדף הבית) */
  heroBackdrop: '/hero-swirl-cookies.png',
  /** מטרפה PNG שקוף, סרגל עליון (מ־public/logo-whisk-mark.png) */
  headerWhiskMark: '/logo-whisk-mark.png?v=2',
  /** פורטרט ליאל, דף הבית, מקטע אודות */
  lielPortrait: '/liel-portrait.png?v=1',
} as const

