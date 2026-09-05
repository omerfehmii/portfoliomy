import { useEffect } from 'react'
import { useTama } from '../store/useTama'

/** Mirrors store.theme onto <html data-theme> so CSS variables switch. */
export function useThemeAttribute() {
  const theme = useTama((s) => s.theme)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
}
