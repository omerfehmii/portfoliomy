import { FONT_3X5, FONT_H, FONT_W } from '../font'
import { LCD_W, type Lcd } from '../Lcd'

/**
 * Text utilities for the parts of the LCD that scroll.
 *
 * `Lcd.text` cannot be clipped to a sub-region and walks the whole string every
 * call, which is wrong for a marquee that is mostly off-screen. So a string is
 * resolved to its glyph rows ONCE (when the section or the item changes) and the
 * per-frame draw is a bounded loop over that array: no string work, no
 * allocation, and honest clipping at both edges.
 */

export type Glyph = readonly string[]
export type Glyphs = readonly Glyph[]

const STEP = FONT_W + 1
const HASH = 35 // '#'
const SPACE: Glyph = FONT_3X5[' ']

/** Last resort for letters the 3x5 font does not carry (it does have ÖÜŞÇİĞ). */
const FOLD: Record<string, string> = {
  Ö: 'O', Ü: 'U', Ş: 'S', Ç: 'C', İ: 'I', I: 'I', Ğ: 'G', Â: 'A', Ê: 'E', Î: 'I', Û: 'U',
  '—': '-', '–': '-', '•': '·', '’': "'", '“': '"', '”': '"',
}

/** Resolve a string to glyph rows. Call when content changes, never per frame. */
export function toGlyphs(str: string): Glyphs {
  const out: Glyph[] = []
  for (const ch of str.toUpperCase().normalize('NFC')) {
    const direct = FONT_3X5[ch]
    if (direct) {
      out.push(direct)
      continue
    }
    const folded = FOLD[ch]
    out.push((folded && FONT_3X5[folded]) || SPACE)
  }
  return out
}

export const glyphsWidth = (g: Glyphs) => (g.length === 0 ? 0 : g.length * STEP - 1)

/**
 * Draws glyphs at (x,y), clipped to the inclusive column range [l,r].
 * Glyphs fully outside the range cost one comparison each.
 */
export function drawGlyphs(lcd: Lcd, g: Glyphs, x: number, y: number, l = 0, r = LCD_W - 1) {
  let cx = x
  for (let i = 0; i < g.length; i++, cx += STEP) {
    if (cx + FONT_W <= l) continue
    if (cx > r) return
    const rows = g[i]
    for (let j = 0; j < FONT_H; j++) {
      const row = rows[j]
      for (let k = 0; k < FONT_W; k++) {
        const px = cx + k
        if (px < l || px > r) continue
        if (row.charCodeAt(k) === HASH) lcd.set(px, y + j, 1)
      }
    }
  }
}

/** Gap between the end of a marquee and the start of its next copy. */
export const MARQUEE_GAP = 12

/**
 * Continuous right-to-left marquee inside [l,r]. `speed` is px/s; `phase` is
 * seconds. Enough copies are drawn to keep the band full, so the loop is seamless.
 */
export function drawMarquee(
  lcd: Lcd,
  g: Glyphs,
  w: number,
  y: number,
  phase: number,
  speed: number,
  l: number,
  r: number,
) {
  if (g.length === 0) return
  const span = w + MARQUEE_GAP
  let x = l - Math.floor(((phase * speed) % span + span) % span)
  while (x <= r) {
    drawGlyphs(lcd, g, x, y, l, r)
    x += span
  }
}

/**
 * Horizontal scroll for a label that does not fit: holds still for `pause`
 * seconds, slides left at `speed` px/s until it has travelled one full span,
 * then repeats. Short labels are simply drawn at `x`.
 */
export function drawScrollingLabel(
  lcd: Lcd,
  g: Glyphs,
  w: number,
  x: number,
  y: number,
  t: number,
  l: number,
  r: number,
  speed = 8,
  pause = 1,
) {
  if (w <= r - x + 1) {
    drawGlyphs(lcd, g, x, y, l, r)
    return
  }
  const span = w + MARQUEE_GAP
  const cycle = pause + span / speed
  const q = t % cycle
  const off = q < pause ? 0 : Math.round((q - pause) * speed)
  drawGlyphs(lcd, g, x - off, y, l, r)
  if (off > 0) drawGlyphs(lcd, g, x - off + span, y, l, r)
}
