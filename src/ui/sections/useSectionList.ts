import { useEffect, useRef } from 'react'
import { useTama } from '../../store/useTama'

/**
 * Wires a list panel to the device's sub-navigation:
 * - registers `count` items so A / arrow keys can walk them,
 * - returns the highlighted index,
 * - calls `onConfirm(index)` when B is pressed inside the section.
 */
export function useSectionList(count: number, onConfirm?: (index: number) => void): number {
  const subIndex = useTama((s) => s.subIndex)
  const confirmSeq = useTama((s) => s.confirmSeq)
  const setSub = useTama((s) => s.setSub)
  const seen = useRef(confirmSeq)

  useEffect(() => {
    setSub(count)
  }, [count, setSub])

  useEffect(() => {
    if (seen.current === confirmSeq) return
    seen.current = confirmSeq
    onConfirm?.(useTama.getState().subIndex)
    // Only react to new confirmations, never to a new callback identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmSeq])

  return subIndex
}

/** Breathing room left between the revealed row and the edge of the panel body. */
const REVEAL_PAD = 16

/** Nearest ancestor that actually scrolls: the panel body on desktop and on mobile. */
function scroller(el: HTMLElement): HTMLElement | null {
  for (let p = el.parentElement; p; p = p.parentElement) {
    const oy = getComputedStyle(p).overflowY
    if (oy === 'auto' || oy === 'scroll') return p
  }
  return null
}

/**
 * Keeps the highlighted row inside the scrollable panel body.
 *
 * `scrollIntoView({ block: 'nearest' })` parks the row flush against the edge it entered
 * from, which on the way down leaves the row it just expanded entirely below the fold.
 * So the offset is computed by hand: reveal the whole row when it fits, and pin its top
 * when it is taller than the panel, so a step always lands on the item's title.
 */
export function useRevealActive<T extends HTMLElement>(index: number) {
  const refs = useRef<Array<T | null>>([])
  useEffect(() => {
    const row = refs.current[index]
    if (!row) return
    const box = scroller(row)
    if (!box) {
      row.scrollIntoView({ block: 'nearest' })
      return
    }

    // Row edges in the box's own scroll coordinates.
    const view = box.clientHeight
    const origin = box.getBoundingClientRect().top + box.clientTop - box.scrollTop
    const rect = row.getBoundingClientRect()
    const top = rect.top - origin
    const bottom = rect.bottom - origin

    let next = box.scrollTop
    if (index === 0) next = 0 // nothing above the first row but the page title: show it
    else if (bottom - top + REVEAL_PAD * 2 > view) next = top - REVEAL_PAD
    else if (top - REVEAL_PAD < next) next = top - REVEAL_PAD
    else if (bottom + REVEAL_PAD > next + view) next = bottom + REVEAL_PAD - view

    next = Math.max(0, Math.min(next, box.scrollHeight - view))
    if (Math.abs(next - box.scrollTop) < 1) return

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    box.scrollTo({ top: next, behavior: still ? 'auto' : 'smooth' })
  }, [index])
  return refs
}
