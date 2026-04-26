import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { premiumActionButtonClass } from '../sectionLayout'
import { defaultWaMessage, whatsappLink } from '../siteConfig'
import { WhatsAppIcon } from './WhatsAppIcon'

const styles = {
  /** חום על קרם — עיצוב פעולה פרימיום אחיד */
  chocolate: `${premiumActionButtonClass} min-h-11 sm:min-h-0`,
  /** קרם על רקע בהיר */
  light:
    'inline-flex min-h-11 touch-manipulation items-center justify-center gap-2 rounded-full border border-cream/80 bg-cream px-5 py-2.5 text-sm font-medium text-cocoa transition-all duration-200 hover:border-white hover:bg-white hover:opacity-95 hover:shadow-md active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep sm:min-h-0 [&_svg]:text-cocoa',
  /** מסגרת על רקע כהה */
  outline:
    'inline-flex min-h-11 touch-manipulation items-center justify-center gap-2 rounded-full border-2 border-cream/40 bg-transparent px-5 py-2.5 text-sm font-medium text-cream shadow-none transition-all duration-200 hover:bg-white/10 hover:shadow-md active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep sm:min-h-0 [&_svg]:text-cream',
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
      className={`${styles[variant]} ${className}`}
      {...rest}
    >
      <WhatsAppIcon className="size-[1.35rem] shrink-0" />
      {children}
    </a>
  )
}
