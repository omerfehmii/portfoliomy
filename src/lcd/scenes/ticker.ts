import { LCD_W, type Lcd } from '../Lcd'
import { lcdItems } from '../lcdContent'
import { ICON_Y_BOTTOM } from '../layout'
import { drawMarquee, glyphsWidth, toGlyphs, type Glyphs } from './text'

/**
 * The bottom row doubles as a one-line ticker: inside a section it carries the
 * item's long text, and on an idle screen it eventually introduces the owner.
 * A 1px rule separates it from the stage so the row never reads as part of the
 * scene above it.
 */
export const TICKER_RULE_Y = ICON_Y_BOTTOM - 1 // 38
export const TICKER_TEXT_Y = ICON_Y_BOTTOM + 2 // 41
export const TICKER_SPEED = 10

export function drawTicker(lcd: Lcd, g: Glyphs, w: number, t: number) {
  lcd.hline(0, TICKER_RULE_Y, LCD_W)
  drawMarquee(lcd, g, w, TICKER_TEXT_Y, t, TICKER_SPEED, 0, LCD_W - 1)
}

/* ------------------------------------------------------------ screensaver -- */

let saver: Glyphs | null = null
let saverW = 0

/** "ÖMER FEHMI · AI ENGINEER · PRESS A", built once from the about item. */
function ensureSaver() {
  if (saver) return
  const item = lcdItems('about')[0]
  let str = item?.title ?? ''
  if (item?.line2) str += ' · ' + item.line2
  str += ' · PRESS A'
  saver = toGlyphs(str)
  saverW = glyphsWidth(saver)
}

export function drawScreensaver(lcd: Lcd, t: number) {
  ensureSaver()
  if (saver) drawTicker(lcd, saver, saverW, t)
}
