/** ריתוך סקשנים — ריווח ומיכל אחידים בכל האתר */
export const sectionShell = 'relative py-16 md:py-20'
export const sectionInner = 'mx-auto max-w-6xl px-4 md:px-6'

/** בראש סקשן — רק מעבר עדין מלבן שקוף (בלי from-black / cocoa כהה) */
export const sectionDarkTopFadeClass =
  'pointer-events-none absolute top-0 left-0 right-0 z-[1] h-16 bg-gradient-to-b from-white/40 to-transparent'

/** אחרי סקשן כהה — אותו מעבר עדין */
export const sectionLightAfterDarkTopFadeClass =
  'pointer-events-none absolute top-0 left-0 right-0 z-[1] h-16 bg-gradient-to-b from-white/40 to-transparent'

/** כותרת סקשן — רקע בהיר */
export const sectionTitleClass =
  'font-display text-xl font-semibold tracking-tight text-ink md:text-2xl'

/** כותרת סקשן — רקע כהה (cocoa) */
export const sectionTitleOnDarkClass =
  'font-display text-xl font-semibold tracking-tight text-cream md:text-2xl'

/** תיאור תחת כותרת — רקע בהיר */
export const sectionDescClass = 'text-sm text-ink/70'

/** תיאור תחת כותרת — רקע כהה */
export const sectionDescOnDarkClass = 'text-sm text-white/75'

/** מרווח בין כותרת (ותיאור) לבין גוף הסקשן */
export const sectionTitleToContentClass = 'mt-4'

/** גוף סקשן — ריווח אחיד בין בלוקי תוכן */
export const sectionBodyClass = 'flex flex-col gap-6'

/** כפתור פעולה ראשי (חום על קרם) — עקבי ב־CTA, וואטסאפ, סל וכו׳ */
export const premiumActionButtonClass =
  'inline-flex touch-manipulation items-center justify-center gap-2 rounded-full bg-cocoa px-5 py-2.5 text-sm font-medium text-cream transition-all duration-200 hover:opacity-90 hover:shadow-md active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep [&_svg]:text-cream'
