import { useEffect, useRef, useState } from 'react'
import { site } from '../siteConfig'

/** במובייל: סרטון אחד מלא (ללא פיצול) — מונע חוסר יישור וניגון כפול ב־iOS */
const INTRO_NARROW_MAX_PX = 767

const heroWordmark = site.logoWordmarkLatin
const INTRO_CURTAIN_MS = 3400
const INTRO_AFTER_CURTAIN_MS = 450
const LOGO_MOTION_MS = 2600
const LOGO_ENTER_DELAY_MS = 750
const INTRO_END_BLUR_LAST_SEC = 2
const INTRO_END_BLUR_MAX_PX = 16
const INTRO_SPLIT_BLUR_PX = 14
const INTRO_SPLIT_BLUR_RAMP_MS = 1000

function smoothstep01(t: number): number {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

function introVideoBlurStyle(
  introEndBlurPx: number,
  splitBlurRampPx: number,
): { filter: string } | undefined {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const splitPx = reduce ? 0 : splitBlurRampPx
  const total = introEndBlurPx + splitPx
  if (total <= 0) return undefined
  return { filter: `blur(${total}px)` }
}

export function IntroVideoComponent({ onDone }: { onDone: () => void }) {
  const [introNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(`(max-width: ${INTRO_NARROW_MAX_PX}px)`).matches,
  )
  const [split, setSplit] = useState(false)
  const [logoState, setLogoState] = useState<'hidden' | 'visible' | 'fadeOut'>('hidden')
  const [introEndBlurPx, setIntroEndBlurPx] = useState(0)
  const [splitBlurRampPx, setSplitBlurRampPx] = useState(0)
  const introFadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const logoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const logoDurationFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const videoLeftRef = useRef<HTMLVideoElement | null>(null)
  const videoRightRef = useRef<HTMLVideoElement | null>(null)
  const introBlurRaf = useRef<number | null>(null)
  const introSplitStartedRef = useRef(false)
  const introSplitWallMsRef = useRef<number | null>(null)
  const introRvfcHandleRef = useRef<number>(-1)
  const introSyncRafRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (introFadeTimer.current) clearTimeout(introFadeTimer.current)
      if (logoPlayTimerRef.current) clearTimeout(logoPlayTimerRef.current)
      if (logoDurationFadeRef.current) clearTimeout(logoDurationFadeRef.current)
    }
  }, [])

  /** מובייל: ללא גלילה מתחת לאינטרו עד סיום המסך (כולל וילון), כדי שלא ייראו „שאריות” גלילה */
  useEffect(() => {
    if (!introNarrow) return
    const html = document.documentElement
    const body = document.body
    const prevHtmlOverflow = html.style.overflow
    const prevBodyOverflow = body.style.overflow
    const prevBodyTouch = body.style.touchAction
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    body.style.touchAction = 'none'
    return () => {
      html.style.overflow = prevHtmlOverflow
      body.style.overflow = prevBodyOverflow
      body.style.touchAction = prevBodyTouch
    }
  }, [introNarrow])

  useEffect(() => {
    const L = videoLeftRef.current
    const R = videoRightRef.current
    if (!L) return
    if (!introNarrow && !R) return

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

    const DRIFT_MAX_SEC = 0.028
    const syncSlaveToMaster = (master: HTMLVideoElement, slave: HTMLVideoElement) => {
      if (Math.abs(slave.currentTime - master.currentTime) > DRIFT_MAX_SEC) {
        slave.currentTime = master.currentTime
      }
    }

    const runIntroFrameSync = () => {
      const L2 = videoLeftRef.current
      const R2 = videoRightRef.current
      if (!L2 || L2.paused || L2.ended) return
      if (!introNarrow && R2) syncSlaveToMaster(L2, R2)
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
      if (!L2 || L2.paused || L2.ended) return
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
      if (!L2 || L2.paused || L2.ended) return
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
      if (!L2) return
      if (!introNarrow && R2) {
        R2.currentTime = L2.currentTime
        void R2.play().catch(() => {})
      }
      maybeStartCurtainWhilePlaying()
      if (typeof L2.requestVideoFrameCallback === 'function') kickRvfcLoop()
      else kickRafFallback()
    }

    const onTimeupdateBackup = () => {
      if (introRvfcHandleRef.current !== -1 || introSyncRafRef.current != null) return
      runIntroFrameSync()
    }

    L.addEventListener('playing', onPlaying)
    L.addEventListener('timeupdate', onTimeupdateBackup)

    return () => {
      L.removeEventListener('playing', onPlaying)
      L.removeEventListener('timeupdate', onTimeupdateBackup)
      cancelRvfc()
      cancelRafSync()
      if (introBlurRaf.current != null) cancelAnimationFrame(introBlurRaf.current)
      introBlurRaf.current = null
    }
  }, [introNarrow])

  useEffect(() => {
    if (!split) {
      setSplitBlurRampPx(0)
      return
    }
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
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

  const videoProps = {
    src: '/intro.mp4' as const,
    autoPlay: true,
    muted: true,
    playsInline: true,
    preload: 'auto' as const,
    poster: '/images/hero.jpg',
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] flex min-h-[100dvh] overscroll-none ${introNarrow ? 'bg-transparent flex-col' : 'bg-black flex-row'}`}
      dir="ltr"
      aria-hidden
    >
      {introNarrow ? (
        <div
          className={`relative z-10 min-h-[100dvh] w-full min-w-0 flex-1 overflow-hidden bg-black transition-transform ease-[cubic-bezier(0.45,0.05,0.55,0.95)] motion-reduce:transition-none will-change-transform ${
            split ? '-translate-y-full' : 'translate-y-0'
          }`}
          style={{ transitionDuration: `${INTRO_CURTAIN_MS}ms` }}
        >
          <video
            ref={videoLeftRef}
            {...videoProps}
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            className="intro-video-enter absolute inset-0 h-full w-full object-cover will-change-[filter]"
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
              const wait = Math.max(INTRO_AFTER_CURTAIN_MS, INTRO_CURTAIN_MS - elapsed + 80)
              introFadeTimer.current = setTimeout(() => {
                setSplit(false)
                setLogoState('hidden')
                introSplitStartedRef.current = false
                introSplitWallMsRef.current = null
                onDone()
              }, wait)
            }}
          />
        </div>
      ) : (
        <>
      <div
        className={`relative z-10 h-full min-h-0 w-1/2 min-w-0 overflow-hidden bg-black transition-transform ease-[cubic-bezier(0.45,0.05,0.55,0.95)] motion-reduce:transition-none ${
          split ? '-translate-x-full' : 'translate-x-0'
        }`}
        style={{ transitionDuration: `${INTRO_CURTAIN_MS}ms` }}
      >
        <video
          ref={videoLeftRef}
          {...videoProps}
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
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
            const wait = Math.max(INTRO_AFTER_CURTAIN_MS, INTRO_CURTAIN_MS - elapsed + 80)
            introFadeTimer.current = setTimeout(() => {
              setSplit(false)
              setLogoState('hidden')
              introSplitStartedRef.current = false
              introSplitWallMsRef.current = null
              onDone()
            }, wait)
          }}
        />
      </div>
      <div
        className={`relative z-10 h-full min-h-0 w-1/2 min-w-0 overflow-hidden bg-black transition-transform ease-[cubic-bezier(0.45,0.05,0.55,0.95)] motion-reduce:transition-none ${
          split ? 'translate-x-full' : 'translate-x-0'
        }`}
        style={{ transitionDuration: `${INTRO_CURTAIN_MS}ms` }}
      >
        <video
          ref={videoRightRef}
          {...videoProps}
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          className="intro-video-enter absolute inset-y-0 left-0 top-0 h-full w-[200%] max-w-none -translate-x-1/2 object-cover object-right will-change-[filter]"
          style={introVideoBlurStyle(introEndBlurPx, splitBlurRampPx)}
        />
      </div>
        </>
      )}
      <div
        className={`pointer-events-none absolute inset-0 z-20 flex items-center justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] max-sm:px-5 ${split ? 'opacity-0' : ''}`}
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
            className="pointer-events-none absolute left-1/2 top-1/2 h-[min(180px,42svh)] w-[min(88vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/35 blur-[40px] max-sm:blur-[36px] md:h-[220px] md:w-[min(92vw,520px)] md:blur-[48px]"
            aria-hidden
          />
          <h1
            className="relative max-w-[min(100%,18ch)] font-didone text-[clamp(1.35rem,5.2vw,4.5rem)] font-semibold uppercase leading-[1.05] tracking-[0.14em] text-[#1a1a1a] max-sm:tracking-[0.1em] sm:max-w-none sm:tracking-[0.18em] md:text-[clamp(2.75rem,7vw,5.5rem)] md:tracking-[0.22em] lg:text-[clamp(3.25rem,6vw,6rem)]"
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
            className="relative mt-2 max-w-[min(100%,22ch)] font-script text-[clamp(1rem,3.2vw,2rem)] italic leading-snug text-[#1a1a1a]/85 max-sm:mt-2.5 md:mt-4 md:max-w-none md:text-[clamp(1.35rem,3.2vw,2.5rem)]"
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
  )
}
