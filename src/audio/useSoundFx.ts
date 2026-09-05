import { useEffect } from 'react'
import { useTama, type TamaState } from '../store/useTama'
import {
  sfxBack,
  sfxClick,
  sfxConfirm,
  sfxHatch,
  sfxNope,
  sfxSigh,
  sfxTick,
  unlockAudio,
} from './beeps'

/**
 * Picks the single sound for one store update, or null for silence.
 *
 * Precedence matters: one action often changes several fields at once (pressing
 * B on `light` bumps pressSeq *and* flips the theme), and only one beep should
 * come out. Order: sound toggle > hatch > theme > button press > dozing off.
 * Exported so the mapping can be exercised without a DOM.
 */
export function chooseSfx(s: TamaState, prev: TamaState): (() => void) | null {
  // Toggling sound is the one thing the sound flag cannot veto: confirm the
  // switch when it goes on, stay quiet when it goes off.
  if (s.sound !== prev.sound) return s.sound ? sfxConfirm : null
  if (!s.sound) return null

  if (s.mode !== prev.mode && prev.mode === 'boot') return sfxHatch
  if (s.theme !== prev.theme) return sfxClick
  if (s.pressSeq !== prev.pressSeq) {
    if (s.pressed === 'A') return sfxTick
    if (s.pressed === 'B') return sfxConfirm
    if (s.pressed === 'C') {
      // Cancel with nothing to cancel: a flat little buzz.
      return prev.mode === 'idle' && s.mode === 'idle' ? sfxNope : sfxBack
    }
    return null
  }
  if (s.mood !== prev.mood && s.mood === 'sleeping') return sfxSigh
  return null
}

/** Turns store transitions into beeps. Mounted once from App. */
export function useSoundFx() {
  useEffect(() => {
    const unlock = () => unlockAudio()
    // Autoplay policies: the context can only start inside a real gesture.
    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)
    window.addEventListener('touchstart', unlock)

    const unsub = useTama.subscribe((s, prev) => {
      chooseSfx(s, prev)?.()
    })

    return () => {
      unsub()
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('touchstart', unlock)
    }
  }, [])
}
