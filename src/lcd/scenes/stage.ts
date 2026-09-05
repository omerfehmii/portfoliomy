import type { Lcd } from '../Lcd'
import type { Mood, TamaState } from '../../store/useTama'
import { STAGE } from '../layout'
import * as H from '../sprites/human'
import * as P from '../sprites/props'

const PI = Math.PI

/** How long each mood's scripted animation runs before the calm idle loop resumes. */
export const MOOD_DUR: Record<Mood, number> = {
  idle: 0,
  happy: 2.2,
  eating: 3.8,
  playing: 4.0,
  flexing: 3.4,
  thinking: 3.6,
  waving: 3.0,
  excited: 2.6,
  sleeping: Number.POSITIVE_INFINITY,
}

/** True while `mood` still has scripted animation left to play. */
export function isScripted(mood: Mood, age: number) {
  return mood !== 'idle' && mood !== 'sleeping' && age < MOOD_DUR[mood]
}

export interface StageParams {
  /** Centre column of the figure (column 7 of the 15px sprite). */
  cx: number
  /** Top row of the sprite; the feet land on `baseY + 17`. */
  baseY: number
  /** Seconds since page load — drives ambient timing (breathing, blink). */
  t: number
  /** Seconds since `moodSince` — drives the scripted animation. */
  age: number
  flip: boolean
  /** Menu mode: ignore the mood script and just stand there. */
  calm: boolean
}

/* ------------------------------------------------------------------ idle -- */

/** Breathing frame, ~1.6 fps. */
function inhale(t: number) {
  return Math.floor(t * 1.6) % 2 === 0
}

/** Blinks only land on the inhale frame, so the head never jumps to blink. */
export function idleSprite(t: number) {
  const a = inhale(t)
  if (!a) return H.IDLE_B
  const c = t % 4.3
  return c < 0.14 || (c > 2.24 && c < 2.36) ? H.BLINK : H.IDLE_A
}

function drawIdle(lcd: Lcd, p: StageParams, x: number, y: number) {
  lcd.blit(idleSprite(p.t), x, y, { flipX: p.flip })
}

/* ----------------------------------------------------------------- moods -- */

/** Keeps a prop inside the stage no matter how high the figure jumps. */
const above = (y: number) => Math.max(STAGE.y, y)

function drawHappy(lcd: Lcd, p: StageParams, x: number, y: number) {
  const h = Math.abs(Math.sin(p.age * PI * 2.6))
  const dy = -Math.round(h * 4)
  lcd.blit(h > 0.35 ? H.ARMS_UP : H.IDLE_A, x, y + dy, { flipX: p.flip })
  if (Math.floor(p.age * 6) % 4 !== 3) lcd.blit(P.HEART, x + 16, above(y + dy - 3))
}

/**
 * Coffee, in three sips. The cup rides in the right hand: at the chest between
 * sips, at the mouth during one. Steam only while the cup is down, so the two
 * poses never fight for the same pixels.
 */
function drawEating(lcd: Lcd, p: StageParams, x: number, y: number) {
  const sip = 1.15
  const done = p.age >= sip * 3
  const q = p.age % sip
  const up = !done && q > 0.3 && q < 0.85
  lcd.blit(up ? H.SIP : H.HOLD, x, y)
  if (up) {
    lcd.blit(P.CUP, x + 12, y + 3)
  } else {
    lcd.blit(P.CUP, x + 12, y + 9)
    if (Math.floor(p.t * 4) % 2 === 0) {
      lcd.set(x + 13, y + 7)
      lcd.set(x + 14, y + 6)
    }
  }
  if (done && Math.floor(p.age * 6) % 4 !== 3) lcd.blit(P.HEART, x + 16, above(y - 3))
}

/** Ragged code rows with a blinking caret, drawn inside any screen. */
const CODE_W = [8, 5, 10, 6, 9, 4] as const

export function drawCode(lcd: Lcd, x: number, y: number, rows: number, t: number, w: number) {
  const step = Math.floor(t * 2.2)
  for (let i = 0; i < rows; i++) {
    const len = Math.min(w - 2, CODE_W[(step + i) % CODE_W.length])
    lcd.hline(x, y + i * 2, len)
  }
  if (Math.floor(t * 3) % 2 === 0) lcd.set(x + w - 1, y + (rows - 1) * 2)
}

/** "Playing" is coding: types at a laptop, screen alive. */
function drawPlaying(lcd: Lcd, p: StageParams, x: number, y: number) {
  lcd.blit(Math.floor(p.age * 7) % 2 === 0 ? H.TYPE_A : H.TYPE_B, x, y)
  lcd.blit(P.LAPTOP, x + 1, y + 12, { opaque: true })
  drawCode(lcd, x + 4, y + 13, 2, p.t, 8)
}

function drawFlexing(lcd: Lcd, p: StageParams, x: number, y: number) {
  const u = (p.age / MOOD_DUR.flexing) * 3
  const up = u % 1 > 0.5
  lcd.blit(up ? H.LIFT_UP : H.LIFT_DOWN, x, y)
  lcd.blit(P.DUMBBELL, x + 12, up ? y : y + 12)
  if (u >= 2.5 && Math.floor(p.age * 6) % 4 !== 3) lcd.text('+1', x + 16, above(y + 6))
}

function drawThinking(lcd: Lcd, p: StageParams, x: number, y: number) {
  lcd.blit(H.THINK, x, y)
  if (p.age % 0.95 >= 0.62) return
  if (Math.floor(p.age / 1.9) % 2 === 0) lcd.text('?', x + 5, above(y - 7))
  else lcd.blit(P.BULB, x + 4, above(y - 7))
}

function drawWaving(lcd: Lcd, p: StageParams, x: number, y: number) {
  const up = Math.floor(p.age * 3) % 2 === 0
  lcd.blit(up ? H.WAVE : H.IDLE_A, x, y)
  bubble(lcd, x + 16, above(y - 2), 'HI!')
}

const SPARK_X = [-4, 16, -3, 17] as const
const SPARK_Y = [-2, 0, 7, 9] as const

function drawExcited(lcd: Lcd, p: StageParams, x: number, y: number) {
  const shake = Math.floor(p.age * 14) % 2 === 0 ? -1 : 1
  lcd.blit(H.ARMS_UP, x + shake, y + (Math.floor(p.age * 7) % 2))
  const off = Math.floor(p.age * 8) % 4
  for (let i = 0; i < 4; i++) {
    if (i === off) continue
    lcd.blit(P.SPARK, x + SPARK_X[i], above(y + SPARK_Y[i]))
  }
}

function drawSleeping(lcd: Lcd, p: StageParams, x: number, y: number) {
  lcd.blit(Math.floor(p.t * 0.8) % 2 === 0 ? H.SLEEP_A : H.SLEEP_B, x, y, { flipX: p.flip })
  // Three Z's drifting up and out; the flicker near the end reads as a fade.
  // Skipped when the pose sits too high for them to have anywhere to go (menu).
  const rise = y + 1 - STAGE.y
  if (rise < 6) return
  for (let i = 0; i < 3; i++) {
    const q = (p.t * 0.4 + i * 0.34) % 1
    if (q > 0.86) continue
    if (q > 0.58 && Math.floor(p.t * 9) % 2 === 0) continue
    lcd.text('Z', x + 12 + Math.round(q * 4), y + 1 - Math.round(q * Math.min(10, rise)))
  }
}

/* ----------------------------------------------------------------- entry -- */

/** Rounded speech balloon with a tail on its left, pointing back at the figure. */
export function bubble(lcd: Lcd, x: number, y: number, msg: string) {
  const w = lcd.textWidth(msg) + 4
  lcd.fillRect(x, y, w, 9, 0)
  lcd.strokeRect(x, y, w, 9, 1)
  lcd.text(msg, x + 2, y + 2)
  lcd.set(x - 1, y + 6)
  lcd.set(x - 2, y + 7)
}

/** Draws the human and whatever his current mood is doing. Pure drawing. */
export function drawStage(lcd: Lcd, s: TamaState, p: StageParams) {
  const x = p.cx - 7
  const y = p.baseY

  if (s.mood === 'sleeping') {
    drawSleeping(lcd, p, x, y)
    return
  }

  if (!p.calm && isScripted(s.mood, p.age)) {
    switch (s.mood) {
      case 'happy': drawHappy(lcd, p, x, y); return
      case 'eating': drawEating(lcd, p, x, y); return
      case 'playing': drawPlaying(lcd, p, x, y); return
      case 'flexing': drawFlexing(lcd, p, x, y); return
      case 'thinking': drawThinking(lcd, p, x, y); return
      case 'waving': drawWaving(lcd, p, x, y); return
      case 'excited': drawExcited(lcd, p, x, y); return
      default: break
    }
  }

  drawIdle(lcd, p, x, y)
}
