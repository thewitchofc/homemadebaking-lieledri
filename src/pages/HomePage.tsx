import { useLayoutEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Cake, Clock, Heart, Sparkles, Star, Truck } from 'lucide-react'
import {
  defaultWaMessage,
  site,
  siteImages,
  siteSeo,
  whatsappLink,
} from '../siteConfig'
import { DocumentMeta } from '../components/DocumentMeta'
import { HomeHero } from '../components/HomeHero'
import {
  premiumActionButtonClass,
  sectionBodyClass,
  sectionDescClass,
  sectionInner,
  sectionShell,
  sectionTitleClass,
  sectionTitleToContentClass,
} from '../sectionLayout'

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
      <div className="relative min-h-[100svh] overflow-hidden bg-cream">
        <div
          className="pointer-events-none absolute top-[-15%] left-1/2 h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-white/30 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[url('/noise.png')] bg-repeat opacity-[0.04] mix-blend-multiply"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.6),transparent_60%)] opacity-[0.06]"
          aria-hidden
        />
        <div className="relative z-10">
      <DocumentMeta title={siteSeo.defaultTitle} description={siteSeo.defaultDescription} />
      <HomeHero>
        <div className="flex flex-col items-center gap-4 text-ink md:gap-6">
          <div className="text-center" lang="en" dir="ltr">
            <h1 className="m-0 font-didone text-[clamp(2rem,8vw,4rem)] font-semibold uppercase leading-none tracking-[0.08em] text-ink antialiased drop-shadow-sm sm:tracking-[0.1em] md:text-[clamp(2.75rem,6.5vw,5.25rem)] lg:text-[clamp(3.25rem,5.5vw,5.75rem)]">
              {heroWordmark}
            </h1>
            <p className="m-0 mt-1 font-script text-[clamp(2rem,7vw,3.5rem)] font-normal leading-none text-gold-deep drop-shadow-sm md:mt-2 md:text-[clamp(2.5rem,6vw,4.5rem)] lg:text-[clamp(2.85rem,5vw,4.85rem)]">
              {site.brandEn}
            </p>
          </div>
          <h2 className="font-hero text-[clamp(1.2rem,3.4vw,1.85rem)] font-medium leading-snug text-ink/95 text-balance antialiased drop-shadow-sm md:text-[clamp(1.35rem,2.6vw,2.15rem)] lg:text-[clamp(1.45rem,2.2vw,2.35rem)]">
            קינוחי בוטיק ביתיים בעבודת יד עם חומרי גלם הכי איכותיים וטריים בשבילכם.
          </h2>
        </div>
      </HomeHero>

      <section
        id="home-intro"
        className="scroll-mt-24 border-b border-cream-dark/50 bg-cream py-10 md:py-12"
        aria-labelledby="home-intro-heading"
      >
        <div className={`${sectionInner} max-w-3xl text-center`}>
          <h2 id="home-intro-heading" className={sectionTitleClass}>
            מידע על השירות ותפריט המתוקים
          </h2>
          <div className="mt-3 flex flex-col gap-3 sm:mt-4 sm:gap-4">
          <p className="text-base leading-snug text-ink-muted sm:text-lg sm:leading-relaxed">
            השירות, קינוחים ומארזים בהתאמה אישית לשולחן שלכם.
          </p>
          <p className="text-base leading-snug text-gold-deep sm:text-lg sm:leading-relaxed">
            היתרון המרכזי, חומרי גלם איכותיים, עקביות בטעם וליווי נעים עד הרגע שאתם נוגעים בקינוח.
          </p>
          <div className="flex justify-center pt-0.5">
            <Link
              to="/order"
              className={`${premiumActionButtonClass} min-h-11 w-full max-w-[min(100%,280px)] justify-center text-center sm:min-h-12`}
            >
              לתפריט המתוקים
            </Link>
          </div>
          </div>
        </div>
      </section>

      <section
        id="why"
        className="scroll-mt-24 border-b border-cream-dark/50 bg-cream py-10 md:py-12"
      >
        <div className={`${sectionInner} mx-auto flex max-w-3xl flex-col items-center gap-2.5 text-center sm:gap-3`}>
          <div className="h-px w-20 bg-gold/45" aria-hidden />
          <h2 className={sectionTitleClass}>קינוח טוב לא אמור להסתבך</h2>
          <div className="mt-1 w-full sm:mt-2">
          <p className="text-base leading-snug text-ink sm:text-lg sm:leading-relaxed">
            אתם מקבלים סדר, שקיפות ותוצאה שמרגישה מפנקת, בלי להתפשר על טריות או על אסתטיקה. אני כאן
            כדי לחסוך לכם את הכאב ראש של ״מה מזמינים ואיך״, ולהביא לשולחן משהו שכולם זוכרים.
          </p>
          </div>
        </div>
      </section>

      <section
        id="about-liel"
        className={`scroll-mt-24 border-b border-cream-dark/50 bg-cream-dark/25 ${sectionShell}`}
        aria-labelledby="about-liel-heading"
      >
        <div className={sectionInner}>
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <div className="flex min-w-0 flex-col gap-6">
              <header className="flex flex-col gap-2">
                <h2 id="about-liel-heading" className={sectionTitleClass}>
                  מאחורי כל מגש.
                </h2>
                <p className={sectionDescClass}>קצת לפני שמזמינים</p>
              </header>
              <div className={`${sectionBodyClass} ${sectionTitleToContentClass}`}>
              <div className="mx-0 h-px w-14 bg-gold" aria-hidden />
              <p className="text-base font-medium leading-relaxed text-ink sm:text-lg">
                היי.
                <br />
                אני ליאל, כבר שבע שנים בתחום האפייה הביתית.
                <br />
                שבע שנים של התרגשות, למידה והרבה קמח על השיש. זה מסע שמתפתח כל יום: אני לומדת טכניקות חדשות,
                בוחנת טעמים ומעדכנת את עצמי כל הזמן, כדי שהקינוחים שאתם מקבלים לא ירגישו ״עוד אותו דבר״.
              </p>
              <p className="text-base leading-relaxed text-ink-muted sm:text-lg">
                בשבילי אפייה ביתית היא לא רק מתכון, זה להקשיב למה שאתם אוהבים, לחדש את התפריט
                ולהרחיב את המתוק שעל השולחן: מגולגלות, קראמבל, עוגות שכבות ומארזים שמספרים סיפור.
                כל הזמנה היא הזדמנות להפתיע אתכם ברעיון טרי, בגימור נקי ובטעם שמרגיש מיוחד גם ביום רגיל.
              </p>
              <p className="rounded-2xl border border-gold/35 bg-cream/90 px-5 py-4 text-sm leading-relaxed text-ink sm:text-base">
                <span className="font-semibold text-gold-deep">מה מניע אותי?</span>{' '}
                הרצון לראות אתכם פותחים את הקופסה ומחייכים, ולדעת שהשקעתי באותו קינוח בדיוק כמו
                שהייתי רוצה שיגיע אליי לשולחן.
              </p>
              </div>
            </div>
            <div className="mx-auto w-full max-w-xs lg:mx-0 lg:max-w-[28rem]">
              <div className="overflow-hidden rounded-2xl border border-cream-dark/50 bg-cream shadow-md shadow-cocoa/10 ring-1 ring-gold/20">
                <img
                  src={siteImages.lielPortrait}
                  alt="ליאל אדרי, אפייה ביתית"
                  width={900}
                  height={1200}
                  className="h-auto max-h-[32rem] w-full object-cover object-top"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`bg-cream-dark/40 ${sectionShell}`} aria-labelledby="benefits-heading">
        <div className={sectionInner}>
          <h2 id="benefits-heading" className={`text-center ${sectionTitleClass}`}>
            מה תקבלו יחד איתי
          </h2>
          <ul className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${sectionTitleToContentClass}`}>
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
                <div className="flex min-w-0 flex-col gap-2">
                  <h3 className="font-semibold text-ink">{item.title}</h3>
                  <p className="text-sm leading-relaxed">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`bg-cream ${sectionShell}`}>
        <div className={sectionInner}>
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className={sectionTitleClass}>אמון שנבנה מטעם ומהגשה</h2>
              <div className={`${sectionBodyClass} ${sectionTitleToContentClass}`}>
              <p className="text-base leading-relaxed text-ink">
                הלקוחות שלי חוזרים כשיש חגיגה, כי אפשר לסמוך שהמארז יגיע מסודר, יפה וטעים.
                אני משקיעה בפרטים הקטנים, איזון מתיקות, מרקם נעים, ומראה שמצלם מעולה גם בטלפון.
              </p>
              <ul className="flex flex-col gap-6 text-sm text-ink">
                <li className="flex items-center gap-2">
                  <Sparkles className="size-4 shrink-0 text-gold-deep" strokeWidth={2} aria-hidden />
                  <span>המלצות חוזרות על מגולגלות וקראמבל, טעמים שמכירים ואוהבים.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="size-4 shrink-0 text-gold-deep" strokeWidth={2} aria-hidden />
                  <span>התאמות למארזים לאירועים, לפי כמות מוזמנים ותקציב.</span>
                </li>
              </ul>
              <p>
                <Link
                  to="/recommendations"
                  className="text-sm font-semibold text-gold-deep underline-offset-2 hover:underline"
                >
                  לקריאת המלצות מלקוחות
                </Link>
              </p>
              </div>
            </div>
            <blockquote className="flex flex-col gap-4 rounded-2xl border border-cream-dark bg-cream-dark/30 p-8 font-display text-xl italic leading-relaxed text-ink sm:text-2xl">
              <span>״כשהקינוח נכון, כל שאר הערב מרגיש יותר מיוחד.״</span>
              <footer className="font-sans text-sm font-normal not-italic text-ink-muted">
                ליאל אדרי, אפייה ביתית
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section id="how" className={`relative scroll-mt-24 bg-[#ebe6e0] ${sectionShell}`}>
        <div className={`relative z-10 ${sectionInner}`}>
          <h2 className={`text-center ${sectionTitleClass}`}>איך זה עובד</h2>
          <ol className={`grid gap-6 md:grid-cols-3 ${sectionTitleToContentClass}`}>
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
                className="relative flex flex-col items-center gap-4 rounded-2xl border border-cream-dark bg-cream p-6 text-center"
              >
                <span className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-cocoa font-display text-xl font-semibold text-gold">
                  {s.step}
                </span>
                <h3 className="font-semibold text-ink">{s.title}</h3>
                <p className="text-sm leading-relaxed">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative bg-cocoa py-20 text-center text-cream">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-semibold md:text-3xl">
            בואו נבנה יחד את הקינוח לרגע שלכם
          </h2>
          <p className="mt-3 text-sm text-cream/80">
            ליווי אישי, התאמה מדויקת, ותוצאה שאי אפשר לשכוח
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/order"
              className="rounded-full bg-cream px-5 py-2.5 text-sm font-medium text-cocoa transition hover:opacity-90"
            >
              לתפריט המלא
            </Link>
            <a
              href={whatsappLink(defaultWaMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-cream/40 px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-cream/10"
            >
              שליחת הודעה בוואטסאפ
            </a>
          </div>
        </div>
      </section>

      </div>
      </div>
    </main>
  )
}
