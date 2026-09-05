/** Shared LCD layout constants (used by drawLcd and by Screen.tsx click mapping). */
export const ICON_SIZE = 8
/** Left x of the 4 icon cells in a row. */
export const ICON_XS = [2, 14, 26, 38] as const
export const ICON_Y_TOP = 1
export const ICON_Y_BOTTOM = 39
/** Creature stage between the two icon rows. */
export const STAGE = { x: 0, y: 10, w: 48, h: 28 } as const

export function iconCell(i: number) {
  return { x: ICON_XS[i % 4], y: i < 4 ? ICON_Y_TOP : ICON_Y_BOTTOM, w: ICON_SIZE, h: ICON_SIZE }
}

/** Icon index under LCD pixel (px,py) with a 2px tolerance, or -1. */
export function iconAt(px: number, py: number): number {
  for (let i = 0; i < 8; i++) {
    const c = iconCell(i)
    if (px >= c.x - 2 && px < c.x + c.w + 2 && py >= c.y - 2 && py < c.y + c.h + 2) return i
  }
  return -1
}
