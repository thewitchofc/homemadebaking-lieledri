import { useEffect } from 'react'
import { absoluteUrlFromPath, siteSeo } from '../siteConfig'

export type DocumentMetaProps = {
  title: string
  description: string
  ogTitle?: string
  ogDescription?: string
  /** נתיב יחסי מתחיל ב־/ או URL מלא */
  ogImage?: string
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const sel = attr === 'name' ? `meta[name="${key}"]` : `meta[property="${key}"]`
  let el = document.head.querySelector(sel) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function applySeo(
  title: string,
  description: string,
  ogTitle: string,
  ogDescription: string,
  ogImageAbsolute: string,
  canonicalHref: string,
) {
  document.title = title
  upsertMeta('name', 'description', description)
  upsertMeta('property', 'og:title', ogTitle)
  upsertMeta('property', 'og:description', ogDescription)
  upsertMeta('property', 'og:image', ogImageAbsolute)
  upsertMeta('property', 'og:type', 'website')
  upsertMeta('property', 'og:locale', 'he_IL')
  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', ogTitle)
  upsertMeta('name', 'twitter:description', ogDescription)
  upsertMeta('name', 'twitter:image', ogImageAbsolute)
  if (canonicalHref) upsertLink('canonical', canonicalHref)
}

function applyDefaults() {
  const img = absoluteUrlFromPath(siteSeo.defaultOgImagePath)
  applySeo(
    siteSeo.defaultTitle,
    siteSeo.defaultDescription,
    siteSeo.defaultOgTitle,
    siteSeo.defaultOgDescription,
    img,
    typeof window !== 'undefined' ? `${window.location.origin}/` : '',
  )
}

/**
 * מעדכן title, meta description, Open Graph ו־Twitter Cards בזמן שהעמוד פעיל.
 */
export function DocumentMeta({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
}: DocumentMetaProps) {
  useEffect(() => {
    const ogT = ogTitle ?? title
    const ogD = ogDescription ?? description
    const imgPath = ogImage ?? siteSeo.defaultOgImagePath
    const ogImgAbs = absoluteUrlFromPath(imgPath)
    const canonical =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}${window.location.search}`
        : ''

    applySeo(title, description, ogT, ogD, ogImgAbs, canonical)

    return () => {
      applyDefaults()
    }
  }, [title, description, ogTitle, ogDescription, ogImage])

  return null
}
