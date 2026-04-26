import { LegalStaticPage } from '../components/LegalStaticPage'
import { sectionTitleClass, sectionTitleToContentClass } from '../sectionLayout'
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
      <div role="region" aria-labelledby="pp-scope" className="flex flex-col">
        <h2 id="pp-scope" className={sectionTitleClass}>
          מי אחראית למידע
        </h2>
        <p className={sectionTitleToContentClass}>
          האתר משמש כערוץ תצוגה והזמנה לשירותי אפייה ביתית של {site.brandHe} ({site.brandEn}). פנייה בוואטסאפ או
          השארת פרטים בטופס ההזמנה מהווה יצירת קשר עסקי מול בעלת העסק.
        </p>
      </div>

      <div role="region" aria-labelledby="pp-collect" className="flex flex-col">
        <h2 id="pp-collect" className={sectionTitleClass}>
          איזה מידע נאסף
        </h2>
        <ul className={`flex list-disc flex-col gap-6 ps-5 ${sectionTitleToContentClass}`}>
          <li>פרטים שתמסרו בטופס או בוואטסאפ לצורך תיאום הזמנה (למשל שם, טלפון, כתובת למשלוח, הערות לאירוע).</li>
          <li>נתוני שימוש טכניים בסיסיים שעשויים להיאסף אוטומטית (כגון כתובת IP, סוג דפדפן) באמצעות כלי אנליטיקה אם הם מופעלים באתר.</li>
        </ul>
      </div>

      <div role="region" aria-labelledby="pp-use" className="flex flex-col">
        <h2 id="pp-use" className={sectionTitleClass}>
          למה משתמשים במידע
        </h2>
        <p className={sectionTitleToContentClass}>
          המידע משמש לתיאום אספקה, חישוב מחירים, יצירת קשר לגבי ההזמנה, שיפור השירות ועמידה בדרישות חוק במידת הצורך.
          לא נשתמש בפרטים לדיוור פרסומי אלא אם ביקשתם זאת במפורש.
        </p>
      </div>

      <div role="region" aria-labelledby="pp-retention" className="flex flex-col">
        <h2 id="pp-retention" className={sectionTitleClass}>
          שמירה ואבטחה
        </h2>
        <p className={sectionTitleToContentClass}>
          הודעות וואטסאפ נשמרות לפי מדיניות הפלטפורמה של וואטסאפ. אנו נוהגים זהירות בטיפול בפרטים אישיים ומגבילים גישה
          למי שזקוק להם לצורך מילוי ההזמנה בלבד.
        </p>
      </div>

      <div role="region" aria-labelledby="pp-rights" className="flex flex-col">
        <h2 id="pp-rights" className={sectionTitleClass}>
          זכויותיכם
        </h2>
        <p className={sectionTitleToContentClass}>
          בהתאם לדין החל, ניתן לפנות בבקשה לעיון, תיקון או מחיקת מידע אישי שנשמר אצלנו, ככל שהדבר חל עליכם. לפניות:
          וואטסאפ דרך הקישור באתר או טלפון{' '}
          <PhoneDisplay className="font-medium text-ink hover:text-gold-deep" />.
        </p>
      </div>

      <div role="region" aria-labelledby="pp-changes" className="flex flex-col">
        <h2 id="pp-changes" className={sectionTitleClass}>
          עדכונים
        </h2>
        <p className={sectionTitleToContentClass}>
          ייתכנו שינויים במדיניות זו מעת לעת. תאריך עדכון אחרון יוצג בעמוד זה כאשר יבוצע שינוי מהותי.
        </p>
      </div>
    </LegalStaticPage>
  )
}
