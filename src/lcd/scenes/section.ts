import type { Lcd } from '../Lcd'
import type { SectionId, TamaState } from '../../store/useTama'
import type { Stage } from '../../content/types'
import { lcdItems } from '../lcdContent'
import { LCD_W } from '../Lcd'
import * as H from '../sprites/human'
import * as P from '../sprites/props'
import { bubble, drawCode } from './stage'
import { drawTicker } from './ticker'
import { drawGlyphs, drawScrollingLabel, glyphsWidth, toGlyphs, type Glyphs } from './text'

/**
 * Section screens — the LCD half of the panel that is open in the HTML overlay.
 * Both read `lcdItems(section)[subIndex]`, so the little screen and the big
 * panel are always talking about the same thing.
 *
 *   y 10..14  title (scrolls when wider than the 44px it is given)
 *   y 16..20  second line + NN/NN counter
 *   y 22..37  the human, left, doing what the section is about + an info widget
 *   y 38      rule
 *   y 39..47  ticker
 */
const TITLE_Y = 10
const LINE2_Y = 16
const TEXT_L = 2
const TEXT_R = 46

const FIG_X = 2
const FIG_Y = 22

const WIDGET_L = 17
const WIDGET_R = 46
const WIDGET_MID = (WIDGET_L + WIDGET_R) >> 1
const FLOOR_Y = 37

const HEART_STEP = 6
const MAX_HEARTS = 5

/* ----------------------------------------------------------------- cache -- */

// Item strings are resolved to glyphs only when the section or the index moves,
// so the per-frame path never touches lcdItems() or allocates a string.
let cSection: SectionId | null = null
let cIndex = -1
let cTitle: Glyphs = []
let cTitleW = 0
let cLine2: Glyphs = []
let cTicker: Glyphs = []
let cTickerW = 0
let cHearts = 0
let cStage: Stage | null = null

function ensureItem(section: SectionId, subIndex: number) {
  if (section === cSection && subIndex === cIndex) return
  cSection = section
  cIndex = subIndex

  const items = lcdItems(section)
  const item = items[Math.min(Math.max(subIndex, 0), items.length - 1)]
  cTitle = toGlyphs(item?.title ?? '')
  cTitleW = glyphsWidth(cTitle)
  cLine2 = toGlyphs(item?.line2 ?? '')
  cTicker = toGlyphs(item?.marquee ?? '')
  cTickerW = glyphsWidth(cTicker)
  cHearts = item?.hearts ?? 0
  cStage = item?.stage ?? null
}

const PAD2: readonly string[] = Array.from({ length: 100 }, (_, i) => (i < 10 ? '0' : '') + i)
let counterKey = -1
let counterStr = ''

function counter(subIndex: number, subCount: number) {
  const a = Math.min(99, Math.max(0, subIndex + 1))
  const b = Math.min(99, Math.max(0, subCount))
  const key = a * 100 + b
  if (key !== counterKey) {
    counterKey = key
    counterStr = PAD2[a] + '/' + PAD2[b]
  }
  return counterStr
}

/* ---------------------------------------------------------------- widgets -- */

/** Care meter: `filled` solid hearts, the rest outlined. */
function drawHearts(lcd: Lcd, x: number, y: number, filled: number) {
  for (let i = 0; i < MAX_HEARTS; i++) {
    lcd.blit(i < filled ? P.HEART : P.HEART_OUT, x + i * HEART_STEP, y)
  }
}

const STAGE_SPRITE = {
  egg: H.EGG_SMALL,
  baby: H.BABY,
  child: H.CHILD,
  teen: H.TEEN,
  adult: H.MINI_A,
  legend: H.LEGEND,
} as const

/** The evolution sprite for a journey step, standing on the stage floor. */
function drawEvolution(lcd: Lcd, stage: Stage, t: number) {
  const spr = STAGE_SPRITE[stage]
  const x = WIDGET_MID - (spr.w >> 1)
  const y = FLOOR_Y + 1 - spr.h
  // The egg has no legs to breathe with, so it rocks instead.
  const wob = stage === 'egg' && Math.sin(t * 2.2) > 0 ? 1 : 0
  lcd.blit(spr, x + wob, y)
  if (stage === 'legend' && Math.floor(t * 3) % 2 === 0) lcd.blit(P.SPARK, x + spr.w + 1, y + 2)
}

function drawWidget(lcd: Lcd, section: SectionId, t: number) {
  switch (section) {
    case 'stack':
      drawHearts(lcd, WIDGET_L, 28, cHearts)
      return
    case 'extra':
      // The care meter fills up while the visit lasts: one heart a minute.
      drawHearts(lcd, WIDGET_L, 28, Math.min(MAX_HEARTS, 1 + Math.floor(t / 60)))
      return
    case 'journey':
      if (cStage) drawEvolution(lcd, cStage, t)
      return
    case 'work':
      lcd.blit(P.MONITOR, WIDGET_L, FLOOR_Y + 1 - P.MONITOR.h, { opaque: true })
      drawCode(lcd, WIDGET_L + 2, FLOOR_Y - 10, 3, t, 10)
      return
    case 'about':
      lcd.blit(P.MUG, WIDGET_MID - 5, FLOOR_Y - 11)
      return
    case 'contact':
      bubble(lcd, WIDGET_L + 5, 26, 'HI!')
      return
  }
}

/* ------------------------------------------------------------- the human -- */

/** Closes the mini figure's eyes for a beat (row 3 of every open-eyed pose). */
function blink(lcd: Lcd, x: number, y: number, t: number) {
  const c = t % 4.1
  if (c > 0.14 && (c < 2.2 || c > 2.32)) return
  lcd.set(x + 4, y + 3, 0)
  lcd.set(x + 6, y + 3, 0)
}

const MINI_SPARK_X = [0, 10, 1] as const
const MINI_SPARK_Y = [0, 1, 12] as const

/** The mini human, looping the animation that belongs to the open section. */
function drawFigure(lcd: Lcd, section: SectionId, t: number) {
  const x = FIG_X
  const y = FIG_Y

  switch (section) {
    case 'about': {
      const q = t % 2.4
      const up = q > 0.9 && q < 1.7
      lcd.blit(up ? H.MINI_SIP : H.MINI_HOLD, x, y)
      if (up) {
        lcd.blit(P.CUP, x + 10, y + 2)
      } else {
        lcd.blit(P.CUP, x + 9, y + 7)
        blink(lcd, x, y, t)
        if (Math.floor(t * 4) % 2 === 0) lcd.set(x + 10, y + 5)
      }
      return
    }
    case 'work':
      lcd.blit(Math.floor(t * 7) % 2 === 0 ? H.MINI_TYPE_A : H.MINI_TYPE_B, x, y)
      blink(lcd, x, y, t)
      return
    case 'stack': {
      const up = t % 1.6 > 0.8
      lcd.blit(up ? H.MINI_LIFT_UP : H.MINI_LIFT_DOWN, x, y)
      lcd.blit(P.DUMBBELL_S, x + 10, up ? y + 1 : y + 10)
      blink(lcd, x, y, t)
      return
    }
    case 'journey':
      lcd.blit(H.MINI_THINK, x, y)
      blink(lcd, x, y, t)
      return
    case 'contact': {
      const up = Math.floor(t * 3) % 2 === 0
      lcd.blit(up ? H.MINI_WAVE : H.MINI_A, x, y)
      blink(lcd, x, y, t)
      return
    }
    case 'extra': {
      // Shakes sideways only: a 16px pose plus a bob would land on the ticker rule.
      const shake = Math.floor(t * 12) % 2
      lcd.blit(H.MINI_ARMS_UP, x + shake, y)
      const off = Math.floor(t * 8) % 3
      for (let i = 0; i < 3; i++) {
        if (i === off) continue
        lcd.blit(P.SPARK, x + MINI_SPARK_X[i], y + MINI_SPARK_Y[i])
      }
      return
    }
  }
}

/* ----------------------------------------------------------------- entry -- */

/** Draws a whole section screen. Icons are drawn by the caller, on top. */
export function drawSection(lcd: Lcd, s: TamaState, t: number) {
  const section = s.section
  if (!section) return
  ensureItem(section, s.subIndex)

  drawScrollingLabel(lcd, cTitle, cTitleW, TEXT_L, TITLE_Y, t, TEXT_L, TEXT_R)

  let line2R = TEXT_R
  if (s.subCount > 1) {
    const str = counter(s.subIndex, s.subCount)
    const w = lcd.textWidth(str)
    const x = LCD_W - 1 - w
    lcd.text(str, x, LINE2_Y)
    line2R = x - 2
  }
  drawGlyphs(lcd, cLine2, TEXT_L, LINE2_Y, TEXT_L, line2R)

  drawWidget(lcd, section, t)
  drawFigure(lcd, section, t)
  drawTicker(lcd, cTicker, cTickerW, t)
}
