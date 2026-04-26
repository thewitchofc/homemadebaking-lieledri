import { LegalStaticPage } from '../components/LegalStaticPage'
import { sectionTitleClass, sectionTitleToContentClass } from '../sectionLayout'
import { site } from '../siteConfig'

export default function AllergensPage() {
  return (
    <LegalStaticPage
      metaTitle={`הצהרת אלרגנים | ${site.brandHe}`}
      metaDescription="מידע על אלרגנים וחומרי גלם במוצרי האפייה של ליאל אדרי — לפני הזמנה לאירועים ולרגישים."
      h1="הצהרת אלרגנים"
      intro="המוצרים מיוצרים במטבח ביתי שבו מעובדים חיטה, ביצים, חלב, אגוזים, בוטנים, סויה ושאר מרכיבים נפוצים. אין אחריות למוצר נקי לחלוטין משאריות אלרגנים."
    >
      <div role="region" aria-labelledby="al-general" className="flex flex-col">
        <h2 id="al-general" className={sectionTitleClass}>
          סביבת הייצור
        </h2>
        <p className={sectionTitleToContentClass}>
          המאפים והקינוחים של {site.brandHe} נאפים בסביבה ביתית שאינה מנותקת מאלרגנים. גם כאשר מתכון מסוים אינו
          מכיל רכיב מסוים (למשל אגוזים), קיימת סכנה סבירה לזיהום צולבני מכלי עבודה, משטחים או אריזות.
        </p>
      </div>

      <div role="region" aria-labelledby="al-common" className="flex flex-col">
        <h2 id="al-common" className={sectionTitleClass}>
          אלרגנים נפוצים במתכונים
        </h2>
        <ul className={`flex list-disc flex-col gap-6 ps-5 ${sectionTitleToContentClass}`}>
          <li>גלוטן (חיטה ודגנים)</li>
          <li>ביצים ומוצרי חלב</li>
          <li>סויה (למשל בשוקולד או תוספים מסחריים)</li>
          <li>אגוזים, בוטנים וזרעים</li>
          <li>שומשום וחרדל</li>
        </ul>
      </div>

      <div role="region" aria-labelledby="al-order" className="flex flex-col">
        <h2 id="al-order" className={sectionTitleClass}>
          לפני הזמנה
        </h2>
        <p className={sectionTitleToContentClass}>
          אם יש לכם או לאורחים רגישות חמורה (אנאפילקסיה), מומלץ לא להסתמך על אתר זה בלבד — יש לפרט בוואטסאפ את
          כל האיסורים, ולבקש אישור מפורש האם ניתן לספק גרסה מתאימה או שיש להימנע לחלוטין מהזמנה.
        </p>
      </div>

      <div role="region" aria-labelledby="al-label" className="flex flex-col">
        <h2 id="al-label" className={sectionTitleClass}>
          אריזה ותוויות
        </h2>
        <p className={sectionTitleToContentClass}>
          כאשר ניתן, יצוינו רכיבים עיקריים על גבי האריזה או בליווי ההזמנה. עם זאת, רשימה באתר אינה מחליפה בדיקה
          אישית לכל מוצר בעת האיסוף או המשלוח.
        </p>
      </div>
    </LegalStaticPage>
  )
}
