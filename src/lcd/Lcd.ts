import { FONT_3X5, FONT_H, FONT_W } from './font'

/**
 * Tiny 1-bit framebuffer that the 3D screen displays.
 * 48x48 pixels: rows 0-8 top icon row, 10-37 creature stage, 39-47 bottom icon row (suggested layout).
 * The Screen component uploads `data` to a DataTexture whenever `dirty` is true.
 */
export const LCD_W = 48
export const LCD_H = 48

export interface Sprite {
  w: number
  h: number
  /** 1 = ink, 0 = off. Row-major. */
  data: Uint8Array
}

/** Author pixel art as strings. '#' = ink, anything else = off. Rows may differ in length. */
export function sprite(rows: string[]): Sprite {
  const h = rows.length
  const w = rows.reduce((m, r) => Math.max(m, r.length), 0)
  const data = new Uint8Array(w * h)
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) if (row[x] === '#') data[y * w + x] = 1
  })
  return { w, h, data }
}

/** Convenience: several frames of the same animation. */
export function frames(...sets: string[][]): Sprite[] {
  return sets.map(sprite)
}

export interface BlitOptions {
  /** Draw ink pixels as off (and, if opaque, off as ink). */
  invert?: boolean
  flipX?: boolean
  flipY?: boolean
  /** Also write the sprite's off pixels (default: only ink pixels are written). */
  opaque?: boolean
}

export interface TextOptions {
  invert?: boolean
  /** Pixels between glyphs. Default 1. */
  spacing?: number
}

export class Lcd {
  readonly width = LCD_W
  readonly height = LCD_H
  readonly data = new Uint8Array(LCD_W * LCD_H)
  dirty = true

  clear(v: 0 | 1 = 0) {
    this.data.fill(v)
    this.dirty = true
  }

  set(x: number, y: number, v: 0 | 1 = 1) {
    if (x < 0 || y < 0 || x >= LCD_W || y >= LCD_H) return
    this.data[y * LCD_W + x] = v
    this.dirty = true
  }

  get(x: number, y: number): 0 | 1 {
    if (x < 0 || y < 0 || x >= LCD_W || y >= LCD_H) return 0
    return this.data[y * LCD_W + x] as 0 | 1
  }

  fillRect(x: number, y: number, w: number, h: number, v: 0 | 1 = 1) {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) this.set(i, j, v)
  }

  strokeRect(x: number, y: number, w: number, h: number, v: 0 | 1 = 1) {
    this.hline(x, y, w, v)
    this.hline(x, y + h - 1, w, v)
    this.vline(x, y, h, v)
    this.vline(x + w - 1, y, h, v)
  }

  hline(x: number, y: number, w: number, v: 0 | 1 = 1) {
    for (let i = x; i < x + w; i++) this.set(i, y, v)
  }

  vline(x: number, y: number, h: number, v: 0 | 1 = 1) {
    for (let j = y; j < y + h; j++) this.set(x, j, v)
  }

  invertRect(x: number, y: number, w: number, h: number) {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) this.set(i, j, this.get(i, j) ? 0 : 1)
  }

  /** Dotted 1px border (used for menu selection frames). */
  dottedRect(x: number, y: number, w: number, h: number, v: 0 | 1 = 1) {
    for (let i = 0; i < w; i += 2) { this.set(x + i, y, v); this.set(x + i, y + h - 1, v) }
    for (let j = 0; j < h; j += 2) { this.set(x, y + j, v); this.set(x + w - 1, y + j, v) }
  }

  blit(spr: Sprite, x: number, y: number, o: BlitOptions = {}) {
    for (let j = 0; j < spr.h; j++) {
      for (let i = 0; i < spr.w; i++) {
        const sx = o.flipX ? spr.w - 1 - i : i
        const sy = o.flipY ? spr.h - 1 - j : j
        const src = spr.data[sy * spr.w + sx]
        if (o.opaque) this.set(x + i, y + j, (o.invert ? 1 - src : src) as 0 | 1)
        else if (src) this.set(x + i, y + j, o.invert ? 0 : 1)
      }
    }
  }

  textWidth(str: string, spacing = 1) {
    return str.length === 0 ? 0 : str.length * FONT_W + (str.length - 1) * spacing
  }

  /** Draws 3x5 text; unknown glyphs render as space. Returns the x after the last glyph. */
  text(str: string, x: number, y: number, o: TextOptions = {}) {
    const spacing = o.spacing ?? 1
    let cx = x
    for (const raw of str.toUpperCase()) {
      const rows = FONT_3X5[raw] ?? FONT_3X5[' ']
      for (let j = 0; j < FONT_H; j++) {
        const row = rows[j]
        for (let i = 0; i < FONT_W; i++) {
          const on = row[i] === '#'
          if (on) this.set(cx + i, y + j, o.invert ? 0 : 1)
          else if (o.invert) this.set(cx + i, y + j, 1)
        }
      }
      cx += FONT_W + spacing
    }
    return cx - spacing
  }

  textCentered(str: string, y: number, o: TextOptions = {}) {
    const w = this.textWidth(str, o.spacing ?? 1)
    return this.text(str, Math.floor((LCD_W - w) / 2), y, o)
  }
}

/** Single shared framebuffer. LCD scenes draw into it; Screen.tsx displays it. */
export const lcd = new Lcd()
