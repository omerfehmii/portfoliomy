import type { Lcd } from '../Lcd'
import { ICONS, type IconId, type TamaState } from '../../store/useTama'
import { STAGE, iconCell } from '../layout'
import { ICON_LIST, XMARK } from '../sprites/icons'

/** Menu captions, drawn in the bottom of the stage while browsing. */
const LABEL: Record<IconId, string> = {
  about: 'ABOUT ME',
  work: 'WORK',
  stack: 'STACK',
  journey: 'JOURNEY',
  contact: 'SAY HELLO',
  extra: 'EXTRA',
  light: 'LIGHT',
  sound: 'SOUND',
}

const LABEL_Y = 31

/**
 * Both icon rows. The highlighted cell is a filled 10x10 box (the 8x8 cell
 * grown by 1px) with the icon knocked out of it, like a real Tamagotchi.
 * Inside a section the highlight pulses so it reads as "you are in here".
 *
 * `bottomRow` goes false when the bottom row has been handed to a ticker: the
 * four icons step aside, but a highlighted cell stays as a badge drawn over the
 * scrolling text — so contact and extra still show where you are, in the cell
 * that Screen.tsx maps taps to.
 */
export function drawIcons(lcd: Lcd, s: TamaState, t: number, bottomRow = true) {
  const browsing = s.mode === 'menu' || s.mode === 'section'
  const hi = browsing ? s.cursor : -1
  const lit = s.mode === 'section' ? t % 1.1 < 0.78 : true

  for (let i = 0; i < 8; i++) {
    const hidden = i >= 4 && !bottomRow
    if (hidden && i !== hi) continue
    const c = iconCell(i)
    if (i === hi && (lit || hidden)) {
      lcd.fillRect(c.x - 1, c.y - 1, 10, 10, lit ? 1 : 0)
      lcd.blit(ICON_LIST[i], c.x, c.y, { invert: lit })
    } else {
      lcd.blit(ICON_LIST[i], c.x, c.y)
    }
  }
}

/** Caption for the highlighted menu entry; the two utilities show their state. */
export function drawMenuLabel(lcd: Lcd, s: TamaState) {
  const id = ICONS[s.cursor]
  if (id === undefined) return
  let label: string = LABEL[id]
  if (id === 'light') label = s.theme === 'day' ? 'LIGHT:ON' : 'LIGHT:OFF'
  else if (id === 'sound') label = s.sound ? 'SOUND:ON' : 'SOUND:OFF'
  lcd.textCentered(label, LABEL_Y)
}

/** Tiny muted marker in the stage's top-left corner while sound is off. */
export function drawSoundOff(lcd: Lcd, s: TamaState) {
  if (s.sound) return
  lcd.blit(XMARK, STAGE.x + 1, STAGE.y + 1)
}
