import { useLayoutEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Cake, Clock, Heart, Sparkles, Star, Truck } from 'lucide-react'
import { defaultWaMessage, site, siteImages } from '../siteConfig'
import { InstagramIcon } from '../components/InstagramIcon'
import { WaButton } from '../components/WaButton'

const heroWordmark = site.logoWordmarkLatin

export default function HomePage() {
  const { pathname, hash, key } = useLocation()

  useLayoutEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      return
    }
    if (pathname === '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }
  }, [pathname, hash, key])

  return (
    <main id="main" className="page main">
      <section
        className="hero border-b border-cream-dark/60"
        style={{ backgroundImage: `url(${siteImages.heroBackdrop})` }}
      >
        <div className="overlay">
          <div className="content">
            <div className="flex flex-col items-center gap-4 text-ink sm:gap-6 md:gap-8">
              <div className="text-center" lang="en" dir="ltr">
                <h1 className="m-0 font-didone text-[clamp(2rem,8vw,4rem)] font-semibold uppercase leading-none tracking-[0.08em] text-ink antialiased sm:tracking-[0.1em] md:text-[clamp(2.75rem,6.5vw,5.25rem)] lg:text-[clamp(3.25rem,5.5vw,5.75rem)]">
                  {heroWordmark}
                </h1>
                <p className="m-0 mt-1 font-script text-[clamp(2rem,7vw,3.5rem)] font-normal leading-none text-gold-deep md:mt-2 md:text-[clamp(2.5rem,6vw,4.5rem)] lg:text-[clamp(2.85rem,5vw,4.85rem)]">
                  {site.brandEn}
                </p>
              </div>
              <h2 className="font-hero text-[clamp(1.2rem,3.4vw,1.85rem)] font-medium leading-snug text-ink/95 text-balance antialiased md:text-[clamp(1.35rem,2.6vw,2.15rem)] lg:text-[clamp(1.45rem,2.2vw,2.35rem)]">
                קינוחי בוטיק ביתיים בעבודת יד עם חומרי גלם הכי איכותיים וטריים בשבילכם.
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section
        id="home-intro"
        className="scroll-mt-24 border-b border-cream-dark/50 bg-cream pb-12 pt-8 sm:pb-16 sm:pt-10"
        aria-labelledby="home-intro-heading"
      >
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 id="home-intro-heading" className="sr-only">
            מידע על השירות ותפריט המתוקים
          </h2>
          <p className="text-base leading-relaxed text-ink-muted sm:text-lg">
            השירות, קינוחים ומארזים בהתאמה אישית לשולחן שלכם.
          </p>
          <p className="mt-3 text-base leading-relaxed text-ink-muted sm:text-lg">
            למי, משפחות, חגיגות קטנות וגדולות, ומי שרוצה להרגיש ״יוקרה ביתית״ בלי רעש.
          </p>
          <p className="mt-3 text-sm font-medium text-gold-deep sm:text-base">
            היתרון המרכזי, חומרי גלם איכותיים, עקביות בטעם וליווי נעים עד הרגע שאתם נוגעים במזלג.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <WaButton message={defaultWaMessage} className="shadow-cocoa/25">
              דברו איתי עכשיו בוואטסאפ
            </WaButton>
            <Link
              to="/order"
              className="inline-flex min-h-11 touch-manipulation items-center gap-1 px-1 py-2 text-sm font-medium text-gold-deep underline-offset-4 hover:underline active:text-gold sm:min-h-0 sm:px-0 sm:py-0"
            >
              לתפריט המתוקים
            </Link>
          </div>
          <p className="mx-auto mt-10 max-w-xs rounded-xl border border-cream-dark/60 bg-white/75 px-4 py-3 text-xs leading-snug text-ink-muted backdrop-blur-sm sm:max-w-sm sm:text-sm">
            <span className="font-semibold text-ink">פרימיום בלי פוזה.</span> טעמים מדויקים, מרקם נקי,
            מראה שמכבד את האירוע.
          </p>
        </div>
      </section>

      <section id="why" className="scroll-mt-24 border-b border-cream-dark/50 bg-cream py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-medium text-ink sm:text-4xl">
            למה לבחור דווקא בליאל?
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-gold" aria-hidden />
          <p className="mt-6 text-base leading-relaxed sm:text-lg">
            כי קינוח טוב לא אמור להסתבך. אתם מקבלים סדר, שקיפות ותוצאה שמרגישה מפנקת, בלי
            להתפשר על טריות או על אסתטיקה. אני כאן כדי לחסוך לכם את הכאב ראש של ״מה מזמינים ואיך״,
            ולהביא לשולחן משהו שכולם זוכרים.
          </p>
        </div>
      </section>

      <section
        id="about-liel"
        className="scroll-mt-24 border-b border-cream-dark/50 bg-cream-dark/25 py-14 sm:py-20"
        aria-labelledby="about-liel-heading"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
            <div className="min-w-0">
              <p className="text-sm font-medium tracking-wide text-gold-deep">קצת לפני שמזמינים</p>
              <h2
                id="about-liel-heading"
                className="mt-2 font-display text-2xl font-medium leading-tight text-ink sm:text-3xl lg:text-[2rem]"
              >
                מאחורי כל מגש.
              </h2>
              <div className="mx-0 mt-4 h-px w-14 bg-gold" aria-hidden />
              <p className="mt-6 text-base font-medium leading-relaxed text-ink sm:text-lg">
                אני כבר שנה בתחום האפייה הביתית, שנה של התרגשות, למידה והרבה קמח על השיש. זה מסע
                שמתפתח כל יום: אני לומדת טכניקות חדשות, בוחנת טעמים ומעדכנת את עצמי כל הזמן, כדי
                שהקינוחים שאתם מקבלים לא ירגישו ״עוד אותו דבר״.
              </p>
              <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
                בשבילי אפייה ביתית היא לא רק מתכון, זה להקשיב למה שאתם אוהבים, לחדש את התפריט
                ולהרחיב את המתוק שעל השולחן: מגולגלות, קראמבל, עוגות שכבות ומארזים שמספרים סיפור.
                כל הזמנה היא הזדמנות להפתיע אתכם ברעיון טרי, בגימור נקי ובטעם שמרגיש מיוחד גם ביום רגיל.
              </p>
              <p className="mt-6 rounded-2xl border border-gold/35 bg-cream/90 px-5 py-4 text-sm leading-relaxed text-ink sm:text-base">
                <span className="font-semibold text-gold-deep">מה מניע אותי?</span>{' '}
                הרצון לראות אתכם פותחים את הקופסה ומחייכים, ולדעת שהשקעתי באותו קינוח בדיוק כמו
                שהייתי רוצה שיגיע אליי לשולחן.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
              <div className="overflow-hidden rounded-2xl border border-cream-dark/50 bg-cream shadow-md shadow-cocoa/10 ring-1 ring-gold/20">
                <img
                  src={siteImages.lielPortrait}
                  alt="ליאל אדרי, אפייה ביתית"
                  width={900}
                  height={1200}
                  className="aspect-[3/4] w-full object-cover object-[center_15%] sm:object-center"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream-dark/40 py-14 sm:py-20" aria-labelledby="benefits-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="benefits-heading" className="text-center font-display text-2xl font-medium text-ink sm:text-3xl">
            מה תקבלו יחד איתי
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Clock,
                title: 'זמינות וקצב נעים',
                text: 'תשובות מהירות בוואטסאפ ותיאום תאריך ברור, בלי היסוסים.',
              },
              {
                icon: Star,
                title: 'מקצועיות ועקביות',
                text: 'מתכונים מדויקים, גימור נקי וטעם יציב מזמינה לזמינה.',
              },
              {
                icon: Heart,
                title: 'מחיר הוגן לערך',
                text: 'פרימיום אמיתי, לא ״יוקרה ריקה״. אתם יודעים מה קיבלתם.',
              },
              {
                icon: Cake,
                title: 'ניסיון בשטח',
                text: 'הרבה שולחנות שמחים מאחוריי, אני יודעת מה עובד באירוע.',
              },
              {
                icon: Truck,
                title: 'גמישות באיסוף/משלוח',
                text: 'איסוף בראשון לציון או משלוח בתיאום, לפי מה שנוח לכם.',
              },
            ].map((item) => (
              <li
                key={item.title}
                className="flex gap-4 rounded-2xl border border-cream-dark/80 bg-cream p-5 shadow-sm"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-cocoa/10 text-gold-deep">
                  <item.icon className="size-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-cream-dark/50 bg-cream py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-2xl font-medium text-ink sm:text-3xl">
                אמון שנבנה מטעם ומהגשה
              </h2>
              <p className="mt-4 text-base leading-relaxed">
                הלקוחות שלי חוזרים כשיש חגיגה, כי אפשר לסמוך שהמארז יגיע מסודר, יפה וטעים.
                אני משקיעה בפרטים הקטנים, איזון מתיקות, מרקם נעים, ומראה שמצלם מעולה גם בטלפון.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Sparkles className="size-4 shrink-0 text-gold-deep" strokeWidth={2} aria-hidden />
                  <span>המלצות חוזרות על מגולגלות וקראמבל, טעמים שמכירים ואוהבים.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="size-4 shrink-0 text-gold-deep" strokeWidth={2} aria-hidden />
                  <span>התאמות למארזים לאירועים, לפי כמות מוזמנים ותקציב.</span>
                </li>
              </ul>
              <p className="mt-6">
                <Link
                  to="/recommendations"
                  className="text-sm font-semibold text-gold-deep underline-offset-2 hover:underline"
                >
                  לקריאת המלצות מלקוחות
                </Link>
              </p>
            </div>
            <blockquote className="rounded-2xl border border-cream-dark bg-cream-dark/30 p-8 font-display text-xl italic leading-relaxed text-ink sm:text-2xl">
              ״כשהקינוח נכון, כל שאר הערב מרגיש יותר מיוחד.״
              <footer className="mt-4 font-sans text-sm font-normal not-italic text-ink-muted">
                ליאל אדרי, אפייה ביתית
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="bg-cocoa py-12 text-center text-cream sm:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <p className="font-display text-2xl font-medium sm:text-3xl">
            רוצים להרגיש את ההבדל בשולחן שלכם?
          </p>
          <p className="mt-3 text-sm text-cream/85 sm:text-base">
            שליחת הודעה קצרה — חוזרים עם אפשרויות ותאריך מתאים.
          </p>
          <div className="mt-8">
            <WaButton
              variant="light"
              message="היי ליאל, אשמח להתייעץ איתך על קינוחים למועד שלי. מה התאריכים הפנויים?"
            >
              דברו איתי בוואטסאפ
            </WaButton>
          </div>
        </div>
      </section>

      <section id="how" className="scroll-mt-24 border-t border-cream-dark/50 bg-cream-dark/30 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center font-display text-2xl font-medium text-ink sm:text-3xl">
            איך זה עובד
          </h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'לבנות הזמנה בסל',
                desc: 'בוחרים מוצרים, כמויות וטעמים, ומרכיבים את ההזמנה בעגלה בעמוד תפריט המתוקים.',
              },
              {
                step: '2',
                title: 'לשלוח את ההזמנה',
                desc: 'כשהכל מוכן, שולחים את סיכום העגלה בוואטסאפ ישירות ממסך תפריט המתוקים.',
              },
              {
                step: '3',
                title: 'פתרון',
                desc: 'מקבלים אישור והזמנה מסודרת, נשאר רק לחכות לקינוח.',
              },
            ].map((s) => (
              <li
                key={s.step}
                className="relative rounded-2xl border border-cream-dark bg-cream p-6 text-center"
              >
                <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-cocoa font-display text-xl font-semibold text-gold">
                  {s.step}
                </span>
                <h3 className="mt-4 font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-cream-dark/60 bg-cocoa py-16 text-center text-cream sm:py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <p className="font-display text-2xl font-medium leading-snug sm:text-4xl">
            בואו נבנה יחד את הקינוח שישדרג את הרגע שלכם
          </p>
          <p className="mt-4 text-sm text-cream/85 sm:text-base">
            אני כאן לליווי אישי, בלי לחץ, עם הרבה טעם.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/order"
              className="inline-flex min-h-[48px] min-w-[200px] items-center justify-center rounded-full border-2 border-cream/40 px-8 py-3 text-base font-semibold text-cream transition hover:bg-white/10"
            >
              תפריט מתוקים
            </Link>
            <WaButton
              variant="light"
              message="היי ליאל, בוא נתחיל הזמנה. זה התאריך שלי, "
              className="min-h-[48px] min-w-[200px] px-8 py-4 text-base"
            >
              פתחו שיחה בוואטסאפ
            </WaButton>
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-cream hover:bg-white/10"
            >
              <InstagramIcon className="size-5" />
              {site.instagramHandle}
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
