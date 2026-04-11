/**
 * לוגו מטרפה+קציפה — PNG 1024×1024 שקוף, מותאם לרקע בהיר (#fff) ול־small sizes.
 * מקור: public/hero-whisk-transparent.png  |  הרצה: npm run build:logo
 *
 * כולל: matting אגרסיבי, outline פנימי חום, פחות “ברק” פוטוריאליסטי, QA על לבן.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const inputPath = path.join(root, 'public', 'hero-whisk-transparent.png')
const outPng = path.join(root, 'public', 'logo-whisk-1024.png')
const outSvg = path.join(root, 'public', 'logo-whisk.svg')
const outQaWhite = path.join(root, 'public', 'logo-whisk-1024-qa-white.png')

const CANVAS = 1024
const CONTENT_RATIO = 0.68

/** outline פנימי — בין gold-deep ל־cocoa, לא שחור */
const STROKE = { r: 92, g: 71, b: 58 }
const STROKE_BLEND = 0.52

function lum(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b
}

/** מסכה בינארית + כיווץ מורפולוגי (כולם שכנים) */
function erodeMask(mask, w, h) {
  const out = new Uint8Array(w * h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let ok = 1
      for (let dy = -1; dy <= 1 && ok; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= w || ny >= h || mask[ny * w + nx] === 0) {
            ok = 0
            break
          }
        }
      }
      out[y * w + x] = ok
    }
  }
  return out
}

function maskFromAlpha(data, w, h, thresh = 138) {
  const m = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) {
    m[i] = data[i * 4 + 3] >= thresh ? 1 : 0
  }
  return m
}

/**
 * טבעת ~1px פנימית: erode פעמיים — הצביעה על m1&!m2 (פנים השכבה החיצונית).
 * חום מהפלטה, לא שחור — קריאות על #fff.
 */
function applyInnerRimStroke(data, w, h) {
  const out = Buffer.from(data)
  const m0 = maskFromAlpha(out, w, h, 120)
  const m1 = erodeMask(m0, w, h)
  const m2 = erodeMask(m1, w, h)
  const strokeIdx = []
  for (let i = 0; i < w * h; i++) {
    if (m1[i] === 1 && m2[i] === 0) strokeIdx.push(i)
  }
  for (const idx of strokeIdx) {
    const p = idx * 4
    if (out[p + 3] < 16) continue
    const t = STROKE_BLEND
    out[p] = Math.round(out[p] * (1 - t) + STROKE.r * t)
    out[p + 1] = Math.round(out[p + 1] * (1 - t) + STROKE.g * t)
    out[p + 2] = Math.round(out[p + 2] * (1 - t) + STROKE.b * t)
    out[p + 3] = Math.min(255, out[p + 3] + 8)
  }
  return out
}

/** matting אגרסיבי: מוחק fringe בהיר; מעדיף חיתוך על פני הילה */
function aggressiveFringe(data, w, h) {
  const out = Buffer.from(data)
  const aAt = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return 0
    return out[(y * w + x) * 4 + 3]
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      let a = out[i + 3]
      if (a === 0) continue
      const r = out[i]
      const g = out[i + 1]
      const b = out[i + 2]
      const L = lum(r, g, b)
      let nStrong = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue
          if (aAt(x + dx, y + dy) > 200) nStrong++
        }
      }
      if (L >= 238 && a < 255) {
        out[i + 3] = 0
        continue
      }
      if (L >= 210 && a < 250) {
        out[i + 3] = Math.max(0, Math.round(a * (1 - (L - 210) / 80)))
      }
      a = out[i + 3]
      if (a > 0 && a < 255 && L > 198 && nStrong < 4) {
        out[i + 3] = Math.max(0, Math.round(a * 0.35))
      }
      if (out[i + 3] < 18) out[i + 3] = 0
    }
  }
  return out
}

/** שני מעברי “חיתוך” אלפא על שוליים בהירים */
function chopBrightEdge(data, w, h) {
  const out = Buffer.from(data)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      const a = out[i + 3]
      if (a === 0 || a === 255) continue
      const L = lum(out[i], out[i + 1], out[i + 2])
      if (L > 192) {
        out[i + 3] = Math.max(0, Math.round(a * (L > 220 ? 0.15 : 0.45)))
      }
    }
  }
  return out
}

/** פחות פוטוריאליזם: דיכוי highlight ניטרלי “מבריק” */
function flattenSpecular(data, w, h) {
  const out = Buffer.from(data)
  for (let i = 0; i < out.length; i += 4) {
    const a = out[i + 3]
    if (a < 40) continue
    const r = out[i]
    const g = out[i + 1]
    const b = out[i + 2]
    const L = lum(r, g, b)
    const spread = Math.max(r, g, b) - Math.min(r, g, b)
    if (L > 232 && spread < 22) {
      const tr = 246
      const tg = 236
      const tb = 222
      const m = 0.62
      out[i] = Math.round(r * (1 - m) + tr * m)
      out[i + 1] = Math.round(g * (1 - m) + tg * m)
      out[i + 2] = Math.round(b * (1 - m) + tb * m)
    }
  }
  return out
}

/** עומק בקצפת: כהה צללים באזור שמני/חם, שומר highlights */
function deepenFrosting(data, w, h) {
  const out = Buffer.from(data)
  for (let i = 0; i < out.length; i += 4) {
    const a = out[i + 3]
    if (a < 50) continue
    const r = out[i]
    const g = out[i + 1]
    const b = out[i + 2]
    const L = lum(r, g, b)
    const warm = r > b + 8 && g > b + 4
    if (warm && L > 72 && L < 210) {
      const f = 0.88 - (210 - L) * 0.00035
      out[i] = Math.max(0, Math.min(255, Math.round(r * f)))
      out[i + 1] = Math.max(0, Math.min(255, Math.round(g * f)))
      out[i + 2] = Math.max(0, Math.min(255, Math.round(b * f * 1.02)))
    }
    if (warm && L >= 210 && L < 248) {
      const f = 0.94
      out[i] = Math.round(out[i] * f + 8)
      out[i + 1] = Math.round(out[i + 1] * f + 6)
      out[i + 2] = Math.round(out[i + 2] * f + 4)
    }
  }
  return out
}

/** חימום עדין — לא מכהה מדי */
function warmBrandTint(data) {
  const out = Buffer.from(data)
  for (let i = 0; i < out.length; i += 4) {
    if (out[i + 3] === 0) continue
    out[i] = Math.min(255, Math.round(out[i] * 1.012 + 2))
    out[i + 1] = Math.min(255, Math.round(out[i + 1] * 1.006 + 1))
    out[i + 2] = Math.max(0, Math.round(out[i + 2] * 0.978))
  }
  return out
}

async function rawToPng(buf, w, h) {
  return sharp(buf, { raw: { width: w, height: h, channels: 4 } }).ensureAlpha().png().toBuffer()
}

async function main() {
  if (!fs.existsSync(inputPath)) {
    console.error('Missing input:', inputPath)
    process.exit(1)
  }

  const trimmed = await sharp(inputPath).ensureAlpha().trim({ threshold: 8 }).toBuffer({ resolveWithObject: true })

  let { data, info } = await sharp(trimmed.data).ensureAlpha().raw().toBuffer({ resolveWithObject: true })

  let buf = aggressiveFringe(data, info.width, info.height)
  buf = chopBrightEdge(buf, info.width, info.height)
  buf = aggressiveFringe(buf, info.width, info.height)

  buf = flattenSpecular(buf, info.width, info.height)
  buf = deepenFrosting(buf, info.width, info.height)
  buf = warmBrandTint(buf)

  let cleaned = await rawToPng(buf, info.width, info.height)
  const meta = await sharp(cleaned).metadata()
  const maxSide = Math.round(CANVAS * CONTENT_RATIO)
  const scale = Math.min(maxSide / meta.width, maxSide / meta.height)
  const newW = Math.max(1, Math.round(meta.width * scale))
  const newH = Math.max(1, Math.round(meta.height * scale))

  let resized = await sharp(cleaned)
    .resize(newW, newH, { kernel: sharp.kernel.lanczos3, fit: 'inside' })
    .sharpen({ sigma: 0.48, m1: 0.35, m2: 2.4 })
    .modulate({ saturation: 1.03, brightness: 1.008 })
    .ensureAlpha()
    .png()
    .toBuffer()

  const left = Math.round((CANVAS - newW) / 2)
  const top = Math.round((CANVAS - newH) / 2)

  let canvasBuf = await sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: resized, left, top }])
    .ensureAlpha()
    .png()
    .toBuffer()

  let { data: d2, info: i2 } = await sharp(canvasBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  d2 = aggressiveFringe(d2, i2.width, i2.height)
  d2 = chopBrightEdge(d2, i2.width, i2.height)
  d2 = applyInnerRimStroke(d2, i2.width, i2.height)

  await sharp(d2, { raw: { width: CANVAS, height: CANVAS, channels: 4 } })
    .ensureAlpha()
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(outPng)

  await sharp({
    create: { width: CANVAS, height: CANVAS, channels: 3, background: '#ffffff' },
  })
    .composite([{ input: await sharp(outPng).ensureAlpha().toBuffer(), blend: 'over' }])
    .png()
    .toFile(outQaWhite)

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}">
  <title>Whisk mark</title>
  <image href="logo-whisk-1024.png" width="${CANVAS}" height="${CANVAS}" preserveAspectRatio="xMidYMid meet"/>
</svg>
`
  fs.writeFileSync(outSvg, svg, 'utf8')

  const vectorPath = path.join(root, 'public', 'logo-whisk-vector.svg')
  console.log('Wrote', path.relative(root, outPng))
  console.log('Wrote', path.relative(root, outQaWhite), '(on #ffffff — בדיקת קריאות)')
  console.log('Wrote', path.relative(root, outSvg))
  if (fs.existsSync(vectorPath)) console.log('Vector:', path.relative(root, vectorPath))
  console.log('Content:', newW, '×', newH, '@', left, top)

  const stats = await sharp(outPng).stats()
  const minA = stats.channels[3]?.min ?? 0
  const maxA = stats.channels[3]?.max ?? 255
  console.log('Alpha channel min/max:', minA, maxA, '(0 = full transparency present)')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
