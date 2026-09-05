import { useEffect } from 'react'
import { useTama } from '../store/useTama'

/** Arrow keys cycle (A), Enter/Z/Space confirm (B), Esc/X/Backspace cancel (C). 'A' key = A button. */
export function useKeyboard() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      const s = useTama.getState()
      switch (e.key) {
        case 'ArrowRight': s.moveCursor(1); break
        case 'ArrowLeft': s.moveCursor(-1); break
        case 'ArrowDown': s.moveSub(1); break
        case 'ArrowUp': s.moveSub(-1); break
        case 'a': case 'A': s.press('A'); break
        case 'Enter': case 'z': case 'Z': case ' ': s.press('B'); break
        case 'Escape': case 'x': case 'X': case 'Backspace': s.press('C'); break
        default: return
      }
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
