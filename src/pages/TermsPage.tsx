import { LegalStaticPage } from '../components/LegalStaticPage'
import { site } from '../siteConfig'

export default function TermsPage() {
  return (
    <LegalStaticPage
      metaTitle={`תנאי שימוש | ${site.brandHe}`}
      metaDescription="תנאי שימוש באתר ההזמנות של ליאל אדרי: הזמנות, תשלומים, איסוף ומשלוח, וביטולים."
      h1="תנאי שימוש"
      intro="שימוש באתר מהווה הסכמה לתנאים הבאים. מומלץ לקרוא לפני ביצוע הזמנה."
    >
      <section aria-labelledby="terms-service">
        <h2 id="terms-service" className="font-display text-xl font-semibold text-ink">
          אופי השירות
        </h2>
        <p>
          האתר מציג תפריט מתוקים ומחירים מעודכנים ככל האפשר. המוצרים נאפים בעבודת יד; ייתכנו הבדלים קלים בין תמונה
          למוצר בפועל (גודל צבע, עיטור), ללא פגיעה באיכות הטעם ובסטנדרט האריזה.
        </p>
      </section>

      <section aria-labelledby="terms-order">
        <h2 id="terms-order" className="font-display text-xl font-semibold text-ink">
          ביצוע הזמנה
        </h2>
        <p>
          הזמנה נחשבת מוצעת עד לאישור מפורש בוואטסאפ (או ערוץ אחר שיוסכם). יש לוודא פרטי תאריך, שעה, כתובת
          ומספר טלפון נכונים. טעות בפרטים עלולה לעכב או לבטל אספקה.
        </p>
      </section>

      <section aria-labelledby="terms-price">
        <h2 id="terms-price" className="font-display text-xl font-semibold text-ink">
          מחירים ותשלום
        </h2>
        <p>
          המחירים באתר הם לפני אישור סופי. תוספת משלוח למרכז הארץ ({site.deliveryFeeCenterShekels} ₪) חלה כאשר נבחר
          משלוח, כפי שמוצג בעמוד התשלום. אמצעי התשלום (אשראי, ביט, מזומן לשליח וכו׳) יתואמו בהודעה ולפי המדיניות
          בעת האספקה.
        </p>
      </section>

      <section aria-labelledby="terms-pickup">
        <h2 id="terms-pickup" className="font-display text-xl font-semibold text-ink">
          איסוף ומשלוח
        </h2>
        <p>
          איסוף עצמי מתבצע מהכתובת {site.pickupAddress} בימים ושעות שפורסמו באתר. משלוחים מתואמים לחלון זמן — יש
          להגיע או להיות זמינים בטלפון בזמן שנקבע.
        </p>
      </section>

      <section aria-labelledby="terms-cancel">
        <h2 id="terms-cancel" className="font-display text-xl font-semibold text-ink">
          ביטולים ושינויים
        </h2>
        <p>
          ביטול או שינוי תאריך יש לבצע בהקדם האפשרי בוואטסאפ. קרוב למועד האספקה ייתכן שחלק מהתשלום יחויב או שלא
          נוכל לבטל — זה יוסכם בגובה החן לפי מצב ההזמנה והעבודה שבוצעה.
        </p>
      </section>

      <section aria-labelledby="terms-liability">
        <h2 id="terms-liability" className="font-display text-xl font-semibold text-ink">
          הגבלת אחריות
        </h2>
        <p>
          השימוש באתר הוא על אחריות המשתמש. לא נישא באחריות לנזק עקיף הנובע מאיחור של גורמי שליחות חיצוניים או
          מאירועים שאינם בשליטתנו, למעט רשלנות חמורה כהגדרתה בדין.
        </p>
      </section>
    </LegalStaticPage>
  )
}
