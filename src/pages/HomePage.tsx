import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Cake, Clock, Heart, Sparkles, Star, Truck } from 'lucide-react'
import { site, siteImages, siteSeo } from '../siteConfig'
import { DocumentMeta } from '../components/DocumentMeta'
import { HomeHero } from '../components/HomeHero'
import { WaButton } from '../components/WaButton'

const heroWordmark = site.logoWordmarkLatin

/** פתיחת וילונות אחרי הסרטון (ms) — מסונכרן עם transitionDuration על הפאנלים */
const INTRO_CURTAIN_MS = 3400
/** המתנה אחרי סיום אנימציית הווילון לפני הסרת ה-overlay */
const INTRO_AFTER_CURTAIN_MS = 450
/** כניסה ויציאה של הלוגו במרכז הווידאו */
const LOGO_MOTION_MS = 2600
const LOGO_ENTER_DELAY_MS = 750
/** טשטוש הולך וגובר בשתי השניות האחרונות של ה-intro */
const INTRO_END_BLUR_LAST_SEC = 2
const INTRO_END_BLUR_MAX_PX = 16
/** טשטוש מקסימלי על שני חצאי הווידאו אחרי ramp בזמן פתיחת הווילון */
const INTRO_SPLIT_BLUR_PX = 14
/** משך עליית טשטוש הווילון (הדרגתי, לא בבום) */
const INTRO_SPLIT_BLUR_RAMP_MS = 1000

function smoothstep01(t: number): number {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

function introVideoBlurStyle(
  introEndBlurPx: number,
  splitBlurRampPx: number,
): { filter: string } | undefined {
  const reduce =
    typeof globalThis !== 'undefined' &&
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const splitPx = reduce ? 0 : splitBlurRampPx
  const total = introEndBlurPx + splitPx
  if (total <= 0) return undefined
  return { filter: `blur(${total}px)` }
}

export default function HomePage() {
  const { pathname, hash, key } = useLocation()
  const [showIntro, setShowIntro] = useState(false)
  const [split, setSplit] = useState(false)
  const [logoState, setLogoState] = useState<'hidden' | 'visible' | 'fadeOut'>('hidden')
  const [introEndBlurPx, setIntroEndBlurPx] = useState(0)
  /** 0 → INTRO_SPLIT_BLUR_PX בזמן פתיחת וילון (אנימציה הדרגתית) */
  const [splitBlurRampPx, setSplitBlurRampPx] = useState(0)
  const introFadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const logoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const logoDurationFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const videoLeftRef = useRef<HTMLVideoElement | null>(null)
  const videoRightRef = useRef<HTMLVideoElement | null>(null)
  const introBlurRaf = useRef<number | null>(null)
  const introSplitStartedRef = useRef(false)
  const introSplitWallMsRef = useRef<number | null>(null)
  /** מזהה requestVideoFrameCallback על הווידאו השמאלי — ביטול ב-cleanup */
  const introRvfcHandleRef = useRef<number>(-1)
  const introSyncRafRef = useRef<number | null>(null)

  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches
    if (isDesktop) setShowIntro(true)
    return () => {
      if (introFadeTimer.current) clearTimeout(introFadeTimer.current)
      if (logoPlayTimerRef.current) clearTimeout(logoPlayTimerRef.current)
      if (logoDurationFadeRef.current) clearTimeout(logoDurationFadeRef.current)
    }
  }, [])

  useEffect(() => {
    if (!showIntro) return
    const L = videoLeftRef.current
    const R = videoRightRef.current
    if (!L || !R) return

    const flushIntroEndBlur = () => {
      introBlurRaf.current = null
      const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) {
        setIntroEndBlurPx(0)
        return
      }
      const d = L.duration
      if (!Number.isFinite(d) || d <= 0) return
      let px = 0
      if (d <= INTRO_END_BLUR_LAST_SEC) {
        const u = Math.min(1, Math.max(0, L.currentTime / d))
        px = smoothstep01(u) * INTRO_END_BLUR_MAX_PX
      } else {
        const windowStart = d - INTRO_END_BLUR_LAST_SEC
        if (L.currentTime >= windowStart) {
          const u = Math.min(1, Math.max(0, (L.currentTime - windowStart) / INTRO_END_BLUR_LAST_SEC))
          px = smoothstep01(u) * INTRO_END_BLUR_MAX_PX
        }
      }
      setIntroEndBlurPx(px)
    }

    const scheduleIntroEndBlur = () => {
      if (introBlurRaf.current != null) return
      introBlurRaf.current = requestAnimationFrame(flushIntroEndBlur)
    }

    const curtainSec = INTRO_CURTAIN_MS / 1000
    const maybeStartCurtainWhilePlaying = () => {
      if (introSplitStartedRef.current) return
      const d = L.duration
      if (!Number.isFinite(d) || d <= 0) return
      const splitAt = Math.max(0, d - curtainSec)
      if (L.currentTime < splitAt) return
      introSplitStartedRef.current = true
      introSplitWallMsRef.current = Date.now()
      setSplit(true)
    }

    /** סנכרון ימין לשמאל — סף נמוך + פריים-אחר-פריים כדי למנוע "אחד אחד" */
    const DRIFT_MAX_SEC = 0.028
    const syncSlaveToMaster = (master: HTMLVideoElement, slave: HTMLVideoElement) => {
      if (Math.abs(slave.currentTime - master.currentTime) > DRIFT_MAX_SEC) {
        slave.currentTime = master.currentTime
      }
    }

    const runIntroFrameSync = () => {
      const L2 = videoLeftRef.current
      const R2 = videoRightRef.current
      if (!L2 || !R2) return
      syncSlaveToMaster(L2, R2)
      maybeStartCurtainWhilePlaying()
      scheduleIntroEndBlur()
    }

    const cancelRvfc = () => {
      const el = videoLeftRef.current
      if (el != null && introRvfcHandleRef.current !== -1 && 'cancelVideoFrameCallback' in el) {
        el.cancelVideoFrameCallback(introRvfcHandleRef.current)
      }
      introRvfcHandleRef.current = -1
    }

    const cancelRafSync = () => {
      if (introSyncRafRef.current != null) cancelAnimationFrame(introSyncRafRef.current)
      introSyncRafRef.current = null
    }

    const onMasterVideoFrame: VideoFrameRequestCallback = () => {
      const L2 = videoLeftRef.current
      const R2 = videoRightRef.current
      if (!L2 || !R2) return
      if (L2.paused || L2.ended) return
      runIntroFrameSync()
      introRvfcHandleRef.current = L2.requestVideoFrameCallback(onMasterVideoFrame)
    }

    const kickRvfcLoop = () => {
      cancelRvfc()
      const L2 = videoLeftRef.current
      if (L2 && !L2.paused && !L2.ended && typeof L2.requestVideoFrameCallback === 'function') {
        introRvfcHandleRef.current = L2.requestVideoFrameCallback(onMasterVideoFrame)
      }
    }

    const rafSyncLoop = () => {
      introSyncRafRef.current = null
      const L2 = videoLeftRef.current
      const R2 = videoRightRef.current
      if (!L2 || !R2 || L2.paused || L2.ended) return
      runIntroFrameSync()
      introSyncRafRef.current = requestAnimationFrame(rafSyncLoop)
    }

    const kickRafFallback = () => {
      cancelRafSync()
      const L2 = videoLeftRef.current
      if (L2 && !L2.paused && !L2.ended) {
        introSyncRafRef.current = requestAnimationFrame(rafSyncLoop)
      }
    }

    const onPlaying = () => {
      const L2 = videoLeftRef.current
      const R2 = videoRightRef.current
      if (!L2 || !R2) return
      R2.currentTime = L2.currentTime
      maybeStartCurtainWhilePlaying()
      void R2.play().catch(() => {})
      if (typeof L2.requestVideoFrameCallback === 'function') {
        kickRvfcLoop()
      } else {
        kickRafFallback()
      }
    }

    const onTimeupdateBackup = () => {
      if (introRvfcHandleRef.current !== -1 || introSyncRafRef.current != null) return
      runIntroFrameSync()
    }

    L.addEventListener('playing', onPlaying)
    L.addEventListener('timeupdate', onTimeupdateBackup)

    if (!L.paused && !L.ended) {
      R.currentTime = L.currentTime
      void R.play().catch(() => {})
      if (typeof L.requestVideoFrameCallback === 'function') {
        kickRvfcLoop()
      } else {
        kickRafFallback()
      }
    }

    return () => {
      L.removeEventListener('playing', onPlaying)
      L.removeEventListener('timeupdate', onTimeupdateBackup)
      cancelRvfc()
      cancelRafSync()
      if (introBlurRaf.current != null) cancelAnimationFrame(introBlurRaf.current)
      introBlurRaf.current = null
    }
  }, [showIntro])

  useEffect(() => {
    if (!showIntro) {
      setIntroEndBlurPx(0)
      setSplitBlurRampPx(0)
      introSplitStartedRef.current = false
      introSplitWallMsRef.current = null
    }
  }, [showIntro])

  useEffect(() => {
    if (!split) {
      setSplitBlurRampPx(0)
      return
    }
    const reduce =
      typeof globalThis !== 'undefined' &&
      globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setSplitBlurRampPx(INTRO_SPLIT_BLUR_PX)
      return
    }
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / INTRO_SPLIT_BLUR_RAMP_MS)
      setSplitBlurRampPx(INTRO_SPLIT_BLUR_PX * smoothstep01(t))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [split])

  useEffect(() => {
    if (!showIntro) return
    const html = document.documentElement
    const body = document.body
    const prevHtml = html.style.overflow
    const prevBody = body.style.overflow
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prevHtml
      body.style.overflow = prevBody
    }
  }, [showIntro])

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
      <div className="relative min-h-[100svh] overflow-hidden bg-[linear-gradient(180deg,#f7f3ee_0%,#efe7df_60%,#e9e1d8_100%)]">
        <div
          className="pointer-events-none absolute top-[-15%] left-1/2 h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-white/30 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-[-20%] right-[-10%] h-[800px] w-[800px] rounded-full bg-black/5 blur-3xl"
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
        <div className="flex flex-col items-center gap-4 text-ink sm:gap-6 md:gap-8">
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
          <p className="mt-6 text-base leading-relaxed text-ink sm:text-lg">
            היתרון המרכזי, חומרי גלם איכותיים, עקביות בטעם וליווי נעים עד הרגע שאתם נוגעים בקינוח.
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              to="/order"
              className="inline-flex min-h-[52px] min-w-[min(100%,280px)] touch-manipulation items-center justify-center rounded-full bg-gold-deep px-10 py-3.5 text-center text-base font-semibold tracking-wide text-cream shadow-lg shadow-cocoa/30 ring-2 ring-gold-deep/80 ring-offset-2 ring-offset-cream transition hover:bg-cocoa hover:ring-cocoa/60 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep active:scale-[0.98] sm:min-h-14 sm:px-12 sm:text-lg"
            >
              לתפריט המתוקים
            </Link>
          </div>
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

      <section className="my-10 border-t border-cream-dark/35 bg-[linear-gradient(180deg,#4a2e24_0%,#3b241c_100%)] py-10 text-cream md:py-14">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center sm:px-6">
          <p className="font-display text-2xl font-semibold leading-tight md:text-3xl">
            רוצים להרגיש את ההבדל בשולחן?
          </p>
          <p className="max-w-md text-sm leading-snug text-white/80">
            הודעה קצרה בוואטסאפ — חוזרים עם פרטים ותאריך מתאים.
          </p>
          <WaButton
            variant="light"
            message="היי ליאל, אשמח להתייעץ איתך על קינוחים למועד שלי. מה התאריכים הפנויים?"
            className="!min-h-0 gap-1.5 !px-5 !py-2.5 !text-sm [&_svg]:size-4"
          >
            דברו איתי בוואטסאפ
          </WaButton>
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

      <section className="my-10 border-t border-cream-dark/35 bg-[linear-gradient(180deg,#4a2e24_0%,#3b241c_100%)] py-10 text-cream md:py-14">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center sm:px-6">
          <p className="font-display text-2xl font-semibold leading-tight md:text-3xl">
            בואו נבנה יחד את הקינוח לרגע שלכם
          </p>
          <p className="max-w-md text-sm leading-snug text-white/80">ליווי אישי, בלי לחץ.</p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/order"
              className="inline-flex items-center justify-center rounded-full border border-cream/80 bg-cream px-5 py-2.5 text-sm font-semibold text-cocoa shadow-md shadow-black/10 transition hover:border-white hover:bg-white hover:text-cocoa focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep active:opacity-90"
            >
              תפריט מתוקים
            </Link>
            <WaButton
              variant="outline"
              message="היי ליאל, בוא נתחיל הזמנה. זה התאריך שלי, "
              className="!min-h-0 gap-1.5 !px-5 !py-2.5 !text-sm [&_svg]:size-4"
            >
              פתחו שיחה בוואטסאפ
            </WaButton>
          </div>
        </div>
      </section>
        </div>
      </div>
      {showIntro ? (
        <div className="fixed inset-0 z-[9999] flex" dir="ltr" aria-hidden>
          <div
            className={`relative z-10 h-full w-1/2 min-w-0 overflow-hidden bg-black transition-transform ease-[cubic-bezier(0.45,0.05,0.55,0.95)] motion-reduce:transition-none ${
              split ? '-translate-x-full' : 'translate-x-0'
            }`}
            style={{ transitionDuration: `${INTRO_CURTAIN_MS}ms` }}
          >
            <video
              ref={videoLeftRef}
              src="/intro.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              poster="/images/hero.jpg"
              className="intro-video-enter absolute inset-y-0 left-0 top-0 h-full w-[200%] max-w-none object-cover object-left will-change-[filter]"
              style={introVideoBlurStyle(introEndBlurPx, splitBlurRampPx)}
              onPlay={() => {
                if (logoPlayTimerRef.current) clearTimeout(logoPlayTimerRef.current)
                logoPlayTimerRef.current = setTimeout(() => setLogoState('visible'), LOGO_ENTER_DELAY_MS)
              }}
              onLoadedMetadata={(e) => {
                if (logoDurationFadeRef.current) clearTimeout(logoDurationFadeRef.current)
                const duration = e.currentTarget.duration
                if (!Number.isFinite(duration) || duration <= 0) return
                const leadSec = LOGO_MOTION_MS / 1000 + 0.35
                const ms = Math.max(0, (duration - leadSec) * 1000)
                logoDurationFadeRef.current = setTimeout(() => setLogoState('fadeOut'), ms)
              }}
              onEnded={() => {
                videoLeftRef.current?.pause()
                videoRightRef.current?.pause()
                if (!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
                  setIntroEndBlurPx(INTRO_END_BLUR_MAX_PX)
                }
                setLogoState('hidden')
                if (!introSplitStartedRef.current) {
                  introSplitStartedRef.current = true
                  introSplitWallMsRef.current = Date.now()
                  setSplit(true)
                }
                const started = introSplitWallMsRef.current ?? Date.now()
                const elapsed = Date.now() - started
                const wait = Math.max(
                  INTRO_AFTER_CURTAIN_MS,
                  INTRO_CURTAIN_MS - elapsed + 80,
                )
                introFadeTimer.current = setTimeout(() => {
                  setShowIntro(false)
                  setSplit(false)
                  setLogoState('hidden')
                  introSplitStartedRef.current = false
                  introSplitWallMsRef.current = null
                }, wait)
              }}
            />
          </div>
          <div
            className={`relative z-10 h-full w-1/2 min-w-0 overflow-hidden bg-black transition-transform ease-[cubic-bezier(0.45,0.05,0.55,0.95)] motion-reduce:transition-none ${
              split ? 'translate-x-full' : 'translate-x-0'
            }`}
            style={{ transitionDuration: `${INTRO_CURTAIN_MS}ms` }}
          >
            <video
              ref={videoRightRef}
              src="/intro.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              poster="/images/hero.jpg"
              className="intro-video-enter absolute inset-y-0 left-0 top-0 h-full w-[200%] max-w-none -translate-x-1/2 object-cover object-right will-change-[filter]"
              style={introVideoBlurStyle(introEndBlurPx, splitBlurRampPx)}
            />
          </div>
          <div
            className={`pointer-events-none absolute inset-0 z-20 flex items-center justify-center p-4 ${split ? 'opacity-0' : ''}`}
          >
            <div
              className={`relative text-center transition-all ease-in-out ${
                logoState === 'hidden'
                  ? 'translate-y-5 scale-[0.97] opacity-0'
                  : logoState === 'visible'
                    ? 'translate-y-0 scale-100 opacity-100'
                    : 'translate-y-3 scale-[0.98] opacity-0'
              }`}
              style={{ transitionDuration: `${LOGO_MOTION_MS}ms` }}
              dir="ltr"
              lang="en"
            >
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[220px] w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/35 blur-[48px]"
                aria-hidden
              />
              <h1
                className="relative font-didone text-[clamp(2rem,6.5vw,4.5rem)] font-semibold uppercase tracking-[0.22em] text-[#1a1a1a] md:text-[clamp(2.75rem,7vw,5.5rem)] lg:text-[clamp(3.25rem,6vw,6rem)]"
                style={{
                  textShadow: `
      0 0 20px rgba(255,255,255,0.75),
      0 0 48px rgba(255,255,255,0.55),
      0 0 90px rgba(255,255,255,0.38),
      0 0 120px rgba(255,255,255,0.22),
      0 8px 22px rgba(0,0,0,0.35)
    `,
                }}
              >
                {heroWordmark}
              </h1>
              <p
                className="relative mt-3 font-script text-[clamp(1.15rem,3.8vw,2rem)] italic text-[#1a1a1a]/85 md:mt-4 md:text-[clamp(1.35rem,3.2vw,2.5rem)]"
                style={{
                  textShadow: `
      0 0 14px rgba(255,255,255,0.45),
      0 0 32px rgba(255,255,255,0.28)
    `,
                }}
              >
                {site.brandEn}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}
