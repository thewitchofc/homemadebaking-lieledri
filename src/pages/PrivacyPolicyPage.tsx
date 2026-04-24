import { LegalStaticPage } from '../components/LegalStaticPage'
import { PhoneDisplay } from '../components/PhoneDisplay'
import { site } from '../siteConfig'

export default function PrivacyPolicyPage() {
  return (
    <LegalStaticPage
      metaTitle={`מדיניות פרטיות | ${site.brandHe}`}
      metaDescription="מדיניות הפרטיות של אתר ההזמנות של ליאל אדרי: איסוף מידע, שימוש, אבטחה ויצירת קשר."
      h1="מדיניות פרטיות"
      intro="המסמך מתאר בקצרה אילו פרטים עלולים להישמר בעת שימוש באתר ובוואטסאפ, וכיצד משתמשים בהם בהקשר של הזמנת קינוחים."
    >
      <section aria-labelledby="pp-scope">
        <h2 id="pp-scope" className="font-display text-xl font-semibold text-ink">
          מי אחראית למידע
        </h2>
        <p>
          האתר משמש כערוץ תצוגה והזמנה לשירותי אפייה ביתית של {site.brandHe} ({site.brandEn}). פנייה בוואטסאפ או
          השארת פרטים בטופס ההזמנה מהווה יצירת קשר עסקי מול בעלת העסק.
        </p>
      </section>

      <section aria-labelledby="pp-collect">
        <h2 id="pp-collect" className="font-display text-xl font-semibold text-ink">
          איזה מידע נאסף
        </h2>
        <ul className="list-disc space-y-2 ps-5">
          <li>פרטים שתמסרו בטופס או בוואטסאפ לצורך תיאום הזמנה (למשל שם, טלפון, כתובת למשלוח, הערות לאירוע).</li>
          <li>נתוני שימוש טכניים בסיסיים שעשויים להיאסף אוטומטית (כגון כתובת IP, סוג דפדפן) באמצעות כלי אנליטיקה אם הם מופעלים באתר.</li>
        </ul>
      </section>

      <section aria-labelledby="pp-use">
        <h2 id="pp-use" className="font-display text-xl font-semibold text-ink">
          למה משתמשים במידע
        </h2>
        <p>
          המידע משמש לתיאום אספקה, חישוב מחירים, יצירת קשר לגבי ההזמנה, שיפור השירות ועמידה בדרישות חוק במידת הצורך.
          לא נשתמש בפרטים לדיוור פרסומי אלא אם ביקשתם זאת במפורש.
        </p>
      </section>

      <section aria-labelledby="pp-retention">
        <h2 id="pp-retention" className="font-display text-xl font-semibold text-ink">
          שמירה ואבטחה
        </h2>
        <p>
          הודעות וואטסאפ נשמרות לפי מדיניות הפלטפורמה של וואטסאפ. אנו נוהגים זהירות בטיפול בפרטים אישיים ומגבילים גישה
          למי שזקוק להם לצורך מילוי ההזמנה בלבד.
        </p>
      </section>

      <section aria-labelledby="pp-rights">
        <h2 id="pp-rights" className="font-display text-xl font-semibold text-ink">
          זכויותיכם
        </h2>
        <p>
          בהתאם לדין החל, ניתן לפנות בבקשה לעיון, תיקון או מחיקת מידע אישי שנשמר אצלנו, ככל שהדבר חל עליכם. לפניות:
          וואטסאפ דרך הקישור באתר או טלפון{' '}
          <PhoneDisplay className="font-medium text-ink hover:text-gold-deep" />.
        </p>
      </section>

      <section aria-labelledby="pp-changes">
        <h2 id="pp-changes" className="font-display text-xl font-semibold text-ink">
          עדכונים
        </h2>
        <p>
          ייתכנו שינויים במדיניות זו מעת לעת. תאריך עדכון אחרון יוצג בעמוד זה כאשר יבוצע שינוי מהותי.
        </p>
      </section>
    </LegalStaticPage>
  )
}
