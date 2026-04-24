import { LegalStaticPage } from '../components/LegalStaticPage'
import { site } from '../siteConfig'

export default function AllergensPage() {
  return (
    <LegalStaticPage
      metaTitle={`הצהרת אלרגנים | ${site.brandHe}`}
      metaDescription="מידע על אלרגנים וחומרי גלם במוצרי האפייה של ליאל אדרי — לפני הזמנה לאירועים ולרגישים."
      h1="הצהרת אלרגנים"
      intro="המוצרים מיוצרים במטבח ביתי שבו מעובדים חיטה, ביצים, חלב, אגוזים, בוטנים, סויה ושאר מרכיבים נפוצים. אין אחריות למוצר נקי לחלוטין משאריות אלרגנים."
    >
      <section aria-labelledby="al-general">
        <h2 id="al-general" className="font-display text-xl font-semibold text-ink">
          סביבת הייצור
        </h2>
        <p>
          המאפים והקינוחים של {site.brandHe} נאפים בסביבה ביתית שאינה מנותקת מאלרגנים. גם כאשר מתכון מסוים אינו
          מכיל רכיב מסוים (למשל אגוזים), קיימת סכנה סבירה לזיהום צולבני מכלי עבודה, משטחים או אריזות.
        </p>
      </section>

      <section aria-labelledby="al-common">
        <h2 id="al-common" className="font-display text-xl font-semibold text-ink">
          אלרגנים נפוצים במתכונים
        </h2>
        <ul className="list-disc space-y-2 ps-5">
          <li>גלוטן (חיטה ודגנים)</li>
          <li>ביצים ומוצרי חלב</li>
          <li>סויה (למשל בשוקולד או תוספים מסחריים)</li>
          <li>אגוזים, בוטנים וזרעים</li>
          <li>שומשום וחרדל</li>
        </ul>
      </section>

      <section aria-labelledby="al-order">
        <h2 id="al-order" className="font-display text-xl font-semibold text-ink">
          לפני הזמנה
        </h2>
        <p>
          אם יש לכם או לאורחים רגישות חמורה (אנאפילקסיה), מומלץ לא להסתמך על אתר זה בלבד — יש לפרט בוואטסאפ את
          כל האיסורים, ולבקש אישור מפורש האם ניתן לספק גרסה מתאימה או שיש להימנע לחלוטין מהזמנה.
        </p>
      </section>

      <section aria-labelledby="al-label">
        <h2 id="al-label" className="font-display text-xl font-semibold text-ink">
          אריזה ותוויות
        </h2>
        <p>
          כאשר ניתן, יצוינו רכיבים עיקריים על גבי האריזה או בליווי ההזמנה. עם זאת, רשימה באתר אינה מחליפה בדיקה
          אישית לכל מוצר בעת האיסוף או המשלוח.
        </p>
      </section>
    </LegalStaticPage>
  )
}
