import { Link } from 'react-router-dom'
import { DocumentMeta } from '../components/DocumentMeta'
import { siteSeo } from '../siteConfig'

export default function NotFoundPage() {
  return (
    <main
      id="main"
      className="page flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center"
    >
      <DocumentMeta
        title={`דף לא נמצא | ${siteSeo.defaultTitle}`}
        description="העמוד שחיפשת לא קיים באתר. אפשר לעבור לתפריט המתוקים או לדף הבית."
      />
      <h1 className="mb-2 text-2xl font-semibold text-ink">הדף לא נמצא</h1>
      <p className="mb-6 text-sm text-ink/60">כנראה שהקישור שגוי או שהעמוד הוסר</p>
      <Link
        to="/order"
        className="rounded-full bg-cocoa px-5 py-2.5 text-sm text-cream transition hover:opacity-90"
      >
        מעבר לתפריט
      </Link>
    </main>
  )
}
