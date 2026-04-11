/**
 * GA4 דרך gtag — ללא עיכוב אם הסקריפט לא נטען (אין מזהה / חסימה).
 */
export function gaEvent(name: string, params?: Record<string, string | number | boolean>): void {
  try {
    if (typeof window === 'undefined') return
    const g = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
    if (typeof g !== 'function') return
    g('event', name, params ?? {})
  } catch {
    /* התעלמות — לא לשבור UX */
  }
}
