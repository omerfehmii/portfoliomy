import type { Lcd } from './Lcd'
import { useTama, type TamaState } from '../store/useTama'
import { MOON } from './sprites/props'
import { drawIcons, drawMenuLabel, drawSoundOff } from './scenes/chrome'
import { BOOT_END, drawBoot } from './scenes/boot'
import { drawSection } from './scenes/section'
import { drawStage, isScripted, type StageParams } from './scenes/stage'
import { drawScreensaver } from './scenes/ticker'

const TAU = Math.PI * 2

/** Human sprite top row. Lifted in menu mode to leave room for the caption. */
const BASE_Y = 19
const BASE_Y_MENU = 11
/** Wander sweep: cx oscillates between 16 - AMP and 16 + AMP. */
const CENTER_X = 16
const WANDER_AMP = 8
/** Wander laps per second. */
const WANDER_SPEED = 0.16

const MOON_X = 40
const MOON_Y = 11

/** Idle for this long and the bottom row starts introducing its owner. */
const SAVER_AFTER_MS = 10_000
/** …for 7s out of every 15, so the icons are never gone for long. */
const SAVER_PERIOD = 15
const SAVER_ON = 7

// Persistent animation state. Numbers only — the draw path allocates nothing.
let bootT0 = -1
let bootRequested = false
let lastT = -1
let wanderPhase = 0
let cxSmooth = CENTER_X
let facingLeft = false

/** Reused so the per-frame call site stays allocation free. */
const params: StageParams = { cx: CENTER_X, baseY: BASE_Y, t: 0, age: 0, flip: false, calm: false }

/**
 * Called every animation frame by the 3D screen. `t` is seconds since page load.
 * Pure drawing, with one exception: it reports the end of the hatch to the store.
 */
export function drawLcd(lcd: Lcd, s: TamaState, t: number) {
  lcd.clear()

  const dt = lastT < 0 ? 0 : Math.min(0.05, Math.max(0, t - lastT))
  lastT = t

  if (s.mode === 'boot') {
    if (bootT0 < 0) bootT0 = t
    const bt = t - bootT0
    drawBoot(lcd, bt)
    if (bt >= BOOT_END && !bootRequested) {
      bootRequested = true
      useTama.getState().finishBoot()
    }
    return
  }
  // Covers the case where a button press ended the hatch before the animation did.
  bootRequested = true

  // A section takes over the whole screen: title, line, human, widget, ticker.
  // Icons go on top, so a highlighted bottom-row cell can badge the ticker.
  if (s.mode === 'section' && s.section) {
    drawSection(lcd, s, t)
    drawIcons(lcd, s, t, false)
    return
  }

  const age = (Date.now() - s.moodSince) / 1000
  const calm = s.mode === 'menu'
  const scripted = !calm && isScripted(s.mood, age)
  const wander = s.mode === 'idle' && !scripted && s.mood !== 'sleeping'

  if (wander) wanderPhase += dt * WANDER_SPEED
  const target = wander ? CENTER_X + WANDER_AMP * Math.sin(wanderPhase * TAU) : CENTER_X
  cxSmooth += (target - cxSmooth) * Math.min(1, dt * 5)
  if (target - cxSmooth > 0.2) facingLeft = false
  else if (cxSmooth - target > 0.2) facingLeft = true

  params.cx = Math.round(cxSmooth)
  params.baseY = calm ? BASE_Y_MENU : BASE_Y
  params.t = t
  params.age = age
  params.flip = facingLeft
  params.calm = calm

  // Nobody has touched the device in a while: hand the bottom row to the ticker.
  const saver =
    s.mode === 'idle' &&
    s.mood !== 'sleeping' &&
    Date.now() - s.lastInteraction > SAVER_AFTER_MS &&
    t % SAVER_PERIOD < SAVER_ON

  drawIcons(lcd, s, t, !saver)
  drawStage(lcd, s, params)

  if (calm) drawMenuLabel(lcd, s)
  if (s.theme === 'night' && s.mood === 'sleeping') lcd.blit(MOON, MOON_X, MOON_Y)
  drawSoundOff(lcd, s)
  if (saver) drawScreensaver(lcd, t)
}
