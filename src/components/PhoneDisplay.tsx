import { site } from '../siteConfig'

type PhoneDisplayProps = {
  className?: string
}

/** מספר טלפון לתצוגה ב־RTL — תמיד כיוון LTR כדי למנוע היפוך ספרות */
export function PhoneDisplay({ className = '' }: PhoneDisplayProps) {
  return (
    <a
      href={`tel:${site.phoneTel}`}
      dir="ltr"
      translate="no"
      className={`whitespace-nowrap tabular-nums underline-offset-2 hover:underline ${className}`}
    >
      {site.phoneDisplay}
    </a>
  )
}
