import { useEffect } from 'react'
import { useTama, type TamaState } from '../store/useTama'
import { loadAnalytics, track } from './umami'

export interface Event {
  name: string
  data?: Record<string, string>
}

/**
 * Picks the single event worth recording for one store update, or null.
 *
 * Precedence mirrors `chooseSfx`: one action changes several fields at once
 * (confirming an icon bumps pressSeq *and* opens a section), and the more
 * specific thing is the one worth counting. Individual button presses are not
 * sent one by one — they are summarised once per visit, see `useAnalytics`.
 * Exported so the mapping can be exercised without a DOM.
 */
export function chooseEvent(s: TamaState, prev: TamaState): Event | null {
  if (s.mode !== prev.mode && prev.mode === 'boot') return { name: 'hatch' }
  if (s.section !== prev.section && s.section) return { name: 'page', data: { id: s.section } }
  if (s.theme !== prev.theme) return { name: 'toggle', data: { what: 'light', to: s.theme } }
  if (s.sound !== prev.sound) return { name: 'toggle', data: { what: 'sound', to: s.sound ? 'on' : 'off' } }
  return null
}

/** Presses land in buckets: how hard someone played, not a keystroke log. */
export function pressBucket(n: number): string {
  if (n === 0) return '0'
  if (n <= 5) return '1-5'
  if (n <= 20) return '6-20'
  if (n <= 50) return '21-50'
  return '50+'
}

/** Turns store transitions into analytics events. Mounted once from App. */
export function useAnalytics() {
  useEffect(() => {
    loadAnalytics()

    const unsub = useTama.subscribe((s, prev) => {
      const e = chooseEvent(s, prev)
      if (e) track(e.name, e.data)
    })

    // Delegated, so no anchor in the panels has to know about analytics.
    // The host is enough: which door someone left by, not which page they landed on.
    const onClick = (ev: MouseEvent) => {
      const a = (ev.target as Element | null)?.closest?.('a')
      if (!a) return
      const href = a.getAttribute('href') ?? ''
      if (href.startsWith('mailto:')) track('outbound', { to: 'email' })
      else if (a.hostname && a.hostname !== location.hostname) track('outbound', { to: a.hostname })
    }
    document.addEventListener('click', onClick, true)

    // One engagement event per visit, when the tab goes away for the first time.
    let sent = false
    const onHide = () => {
      if (sent || document.visibilityState !== 'hidden') return
      sent = true
      const s = useTama.getState()
      track('visit', { presses: pressBucket(s.pressSeq), hatched: s.hatched ? 'yes' : 'no' })
    }
    document.addEventListener('visibilitychange', onHide)

    return () => {
      unsub()
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('visibilitychange', onHide)
    }
  }, [])
}
