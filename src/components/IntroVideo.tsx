type IntroVideoProps = {
  onEnded: () => void
  videoSrc?: string
  posterSrc?: string
}

const DEFAULT_VIDEO = '/video/hero.mp4'
const DEFAULT_POSTER = '/images/hero.jpg'

export function IntroVideo({
  onEnded,
  videoSrc = DEFAULT_VIDEO,
  posterSrc = DEFAULT_POSTER,
}: IntroVideoProps) {
  return (
    <section
      className="relative min-h-[100svh] w-full overflow-hidden bg-black"
      aria-label="פתיחה"
    >
      <video
        src={videoSrc}
        poster={posterSrc}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={onEnded}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </section>
  )
}
