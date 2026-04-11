/**
 * מייבא איור מטרפה+קצפת (JPEG/PNG) ל־public/logo-whisk-mark.png עם שקיפות.
 * תומך ברקע שחור או לבן (מזהה אוטומטית לפי פיקסלי מסגרת).
 * שימוש: node scripts/import-whisk-mark.mjs path/to/image.png
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const outFile = path.join(root, 'public', 'logo-whisk-mark.png')

const input = process.argv[2]
if (!input || !fs.existsSync(input)) {
  console.error('Usage: node scripts/import-whisk-mark.mjs <path-to-image>')
  process.exit(1)
}

function lum(data, i) {
  return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
}

function spread(data, i) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  return Math.max(r, g, b) - Math.min(r, g, b)
}

function edgeMeanL(data, w, h) {
  let s = 0
  let c = 0
  const add = (x, y) => {
    const i = (y * w + x) * 4
    s += lum(data, i)
    c++
  }
  for (let x = 0; x < w; x++) {
    add(x, 0)
    add(x, h - 1)
  }
  for (let y = 1; y < h - 1; y++) {
    add(0, y)
    add(w - 1, y)
  }
  return s / c
}

/** רקע לבן/אפור בהיר: הצפה מהשוליים דרך פיקסלים נייטרליים בהירים (לא אוכל קרם צבעוני) */
function removeLightBackground(data, w, h) {
  const n = w * h
  const out = Buffer.from(data)
  const vis = new Uint8Array(n)
  const q = []

  const edgeSeed = (i) => lum(out, i) >= 218 && spread(out, i) <= 48
  const fillNeighbor = (i) => lum(out, i) >= 185 && spread(out, i) <= 58

  const push = (k) => {
    if (vis[k]) return
    vis[k] = 1
    q.push(k)
  }

  for (let x = 0; x < w; x++) {
    for (const y of [0, h - 1]) {
      const k = y * w + x
      if (edgeSeed(k * 4)) push(k)
    }
  }
  for (let y = 0; y < h; y++) {
    for (const x of [0, w - 1]) {
      const k = y * w + x
      if (edgeSeed(k * 4)) push(k)
    }
  }

  let qi = 0
  while (qi < q.length) {
    const k = q[qi++]
    const i = k * 4
    out[i + 3] = 0
    const x = k % w
    const y = (k / w) | 0
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx
      const ny = y + dy
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
      const nk = ny * w + nx
      if (vis[nk]) continue
      const ni = nk * 4
      if (fillNeighbor(ni)) {
        vis[nk] = 1
        q.push(nk)
      }
    }
  }

  return out
}

/** רקע שחור: מסכה מורפולוגית כמו קודם */
function removeDarkBackground(data, w, h) {
  const n = w * h
  const seed = new Uint8Array(n)
  for (let k = 0; k < n; k++) {
    if (lum(data, k * 4) > 42) seed[k] = 1
  }

  let fg = Buffer.from(seed)
  const passes = 1
  const rad = 6
  for (let p = 0; p < passes; p++) {
    const b = new Uint8Array(n)
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let on = 0
        outer: for (let dy = -rad; dy <= rad; dy++) {
          for (let dx = -rad; dx <= rad; dx++) {
            const nx = x + dx
            const ny = y + dy
            if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
            if (fg[ny * w + nx]) {
              on = 1
              break outer
            }
          }
        }
        b[y * w + x] = on
      }
    }
    fg = b
  }

  const out = Buffer.from(data)
  for (let k = 0; k < n; k++) {
    const i = k * 4
    if (!fg[k] && lum(out, i) < 48) out[i + 3] = 0
  }
  return out
}

;(async () => {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const w = info.width
  const h = info.height

  const meanEdge = edgeMeanL(data, w, h)
  const outBuf = meanEdge > 110 ? removeLightBackground(data, w, h) : removeDarkBackground(data, w, h)

  console.log('Edge mean L:', meanEdge.toFixed(1), '→', meanEdge > 110 ? 'light bg (flood)' : 'dark bg (mask)')

  await sharp(outBuf, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(outFile)

  console.log('Wrote', path.relative(root, outFile))
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
