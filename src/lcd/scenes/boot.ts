import { LCD_H, LCD_W, type Lcd } from '../Lcd'
import * as H from '../sprites/human'
import * as P from '../sprites/props'

/**
 * Hatching sequence, ~3s, driven purely by seconds-since-boot.
 *
 *   0.00 - 0.50  egg sits still
 *   0.50 - 2.20  egg wobbles, a crack zigzag grows over three steps
 *   2.20 - 2.40  two full-screen flashes
 *   2.40 - 3.00  the human pops out over the shell with three sparkles
 */
export const BOOT_END = 3.0

const EGG_X = 17
const EGG_Y = 17
const CRACK_Y = EGG_Y + 9
const FLASH_AT = 2.2
const POP_AT = 2.4

/** Where he lands: 15px sprite centred on the egg, feet on row 36. */
const POP_X = 17
const POP_Y = 19

export function drawBoot(lcd: Lcd, bt: number) {
  if (bt < FLASH_AT) {
    const wob = bt < 0.5 ? 0 : Math.sin(bt * Math.PI * 5) > 0 ? 1 : -1
    lcd.blit(P.EGG, EGG_X + wob, EGG_Y)
    const step = bt < 1.1 ? 0 : bt < 1.5 ? 1 : bt < 1.9 ? 2 : 3
    if (step > 0) lcd.blit(P.CRACKS[step - 1], EGG_X + wob, CRACK_Y, { invert: true })
    return
  }

  if (bt < POP_AT) {
    lcd.blit(P.EGG, EGG_X, EGG_Y)
    lcd.blit(P.CRACKS[2], EGG_X, CRACK_Y, { invert: true })
    if (bt < 2.26 || (bt >= 2.32 && bt < 2.38)) lcd.invertRect(0, 0, LCD_W, LCD_H)
    return
  }

  const p = bt - POP_AT
  lcd.blit(P.SHELL, 8, 34)
  lcd.blit(P.SHELL, 31, 34, { flipX: true })
  const hop = Math.max(0, 5 - Math.round(p * 28))
  const pose = p < 0.35 ? H.ARMS_UP : Math.floor(p * 2.5) % 2 === 0 ? H.IDLE_A : H.IDLE_B
  lcd.blit(pose, POP_X, POP_Y - hop)
  if (p < 0.5 && Math.floor(p * 14) % 2 === 0) {
    lcd.blit(P.SPARK_BIG, 5, 14)
    lcd.blit(P.SPARK_BIG, 38, 12)
    lcd.blit(P.SPARK_BIG, 22, 7)
  }
}
