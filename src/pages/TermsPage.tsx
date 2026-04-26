import { LegalStaticPage } from '../components/LegalStaticPage'
import { sectionTitleClass, sectionTitleToContentClass } from '../sectionLayout'
import { site } from '../siteConfig'

export default function TermsPage() {
  return (
    <LegalStaticPage
      metaTitle={`תנאי שימוש | ${site.brandHe}`}
      metaDescription="תנאי שימוש באתר ההזמנות של ליאל אדרי: הזמנות, תשלומים, איסוף ומשלוח, וביטולים."
      h1="תנאי שימוש"
      intro="שימוש באתר מהווה הסכמה לתנאים הבאים. מומלץ לקרוא לפני ביצוע הזמנה."
    >
      <div role="region" aria-labelledby="terms-service" className="flex flex-col">
        <h2 id="terms-service" className={sectionTitleClass}>
          אופי השירות
        </h2>
        <p className={sectionTitleToContentClass}>
          האתר מציג תפריט מתוקים ומחירים מעודכנים ככל האפשר. המוצרים נאפים בעבודת יד; ייתכנו הבדלים קלים בין תמונה
          למוצר בפועל (גודל צבע, עיטור), ללא פגיעה באיכות הטעם ובסטנדרט האריזה.
        </p>
      </div>

      <div role="region" aria-labelledby="terms-order" className="flex flex-col">
        <h2 id="terms-order" className={sectionTitleClass}>
          ביצוע הזמנה
        </h2>
        <p className={sectionTitleToContentClass}>
          הזמנה נחשבת מוצעת עד לאישור מפורש בוואטסאפ (או ערוץ אחר שיוסכם). יש לוודא פרטי תאריך, שעה, כתובת
          ומספר טלפון נכונים. טעות בפרטים עלולה לעכב או לבטל אספקה.
        </p>
      </div>

      <div role="region" aria-labelledby="terms-price" className="flex flex-col">
        <h2 id="terms-price" className={sectionTitleClass}>
          מחירים ותשלום
        </h2>
        <p className={sectionTitleToContentClass}>
          המחירים באתר הם לפני אישור סופי. תוספת משלוח למרכז הארץ ({site.deliveryFeeCenterShekels} ₪) חלה כאשר נבחר
          משלוח, כפי שמוצג בעמוד התשלום. אמצעי התשלום (אשראי, ביט, מזומן לשליח וכו׳) יתואמו בהודעה ולפי המדיניות
          בעת האספקה.
        </p>
      </div>

      <div role="region" aria-labelledby="terms-pickup" className="flex flex-col">
        <h2 id="terms-pickup" className={sectionTitleClass}>
          איסוף ומשלוח
        </h2>
        <p className={sectionTitleToContentClass}>
          איסוף עצמי מתבצע מהכתובת {site.pickupAddress} בימים ושעות שפורסמו באתר. משלוחים מתואמים לחלון זמן — יש
          להגיע או להיות זמינים בטלפון בזמן שנקבע.
        </p>
      </div>

      <div role="region" aria-labelledby="terms-cancel" className="flex flex-col">
        <h2 id="terms-cancel" className={sectionTitleClass}>
          ביטולים ושינויים
        </h2>
        <p className={sectionTitleToContentClass}>
          ביטול או שינוי תאריך יש לבצע בהקדם האפשרי בוואטסאפ. קרוב למועד האספקה ייתכן שחלק מהתשלום יחויב או שלא
          נוכל לבטל — זה יוסכם בגובה החן לפי מצב ההזמנה והעבודה שבוצעה.
        </p>
      </div>

      <div role="region" aria-labelledby="terms-liability" className="flex flex-col">
        <h2 id="terms-liability" className={sectionTitleClass}>
          הגבלת אחריות
        </h2>
        <p className={sectionTitleToContentClass}>
          השימוש באתר הוא על אחריות המשתמש. לא נישא באחריות לנזק עקיף הנובע מאיחור של גורמי שליחות חיצוניים או
          מאירועים שאינם בשליטתנו, למעט רשלנות חמורה כהגדרתה בדין.
        </p>
      </div>
    </LegalStaticPage>
  )
}
