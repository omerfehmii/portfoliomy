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

/**
 * Keeps the highlighted row inside the scrollable panel body. Only the row's head
 * (its first child) is revealed, so an expanded, taller-than-viewport row never
 * scrolls the page title away.
 */
export function useRevealActive<T extends HTMLElement>(index: number) {
  const refs = useRef<Array<T | null>>([])
  useEffect(() => {
    const row = refs.current[index]
    const head = (row?.firstElementChild as HTMLElement | null) ?? row
    head?.scrollIntoView({ block: 'nearest' })
  }, [index])
  return refs
}
