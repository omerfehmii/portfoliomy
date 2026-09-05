import { useEffect } from 'react'
import { useTama } from '../store/useTama'

const SLEEP_AFTER_MS = 45_000
const MOOD_ANIMATION_MS = 4_500

/** Creature falls asleep after inactivity when not reading a section. Any press wakes it (see store). */
export function useIdleSleep() {
  useEffect(() => {
    const id = window.setInterval(() => {
      const s = useTama.getState()
      if (s.mode === 'boot') return
      // one-shot moods (happy, eating, …) fall back to idle once their animation has played
      if (s.mood !== 'idle' && s.mood !== 'sleeping' && Date.now() - s.moodSince > MOOD_ANIMATION_MS) s.setMood('idle')
      if (s.mode === 'section') return
      if (s.mood !== 'sleeping' && Date.now() - s.lastInteraction > SLEEP_AFTER_MS) s.setMood('sleeping')
    }, 1000)
    return () => window.clearInterval(id)
  }, [])
}
