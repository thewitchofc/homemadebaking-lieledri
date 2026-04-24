import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { defaultWaMessage, whatsappLink } from '../siteConfig'
import { WhatsAppIcon } from './WhatsAppIcon'

const styles = {
  /** חום־לבן על רקע בהיר (כמו צבעי המותג) */
  chocolate:
    'border-cream/40 bg-cocoa text-cream shadow-lg shadow-cocoa/30 hover:border-cream/50 hover:bg-gold-deep hover:text-cream [&_svg]:text-cream',
  /** קרם־לבן על רקע חום (סעיפי CTA כהים) */
  light:
    'border-cream/80 bg-cream text-cocoa shadow-lg shadow-black/10 hover:border-white hover:bg-white hover:text-cocoa [&_svg]:text-cocoa',
  /** מסגרת בהירה על רקע כהה */
  outline:
    'border-2 border-cream/40 bg-transparent text-cream shadow-none hover:bg-white/10 [&_svg]:text-cream',
} as const

export function WaButton({
  children,
  className = '',
  message = defaultWaMessage,
  variant = 'chocolate',
  ...rest
}: {
  children: ReactNode
  className?: string
  message?: string
  /** chocolate = רקע חום | light = רקע קרם על כהה | outline = שקוף עם מסגרת (על רקע כהה) */
  variant?: keyof typeof styles
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-11 touch-manipulation items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-[15px] font-semibold transition active:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep sm:min-h-0 ${styles[variant]} ${className}`}
      {...rest}
    >
      <WhatsAppIcon className="size-[1.35rem] shrink-0" />
      {children}
    </a>
  )
}
