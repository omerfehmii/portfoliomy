import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useTama, type SectionId } from '../store/useTama'
import { SECTION_META } from './meta'
import { SECTION_VIEWS } from './sections'
import { MOBILE_QUERY, useMediaQuery } from './useMediaQuery'

const EXIT_MS = 420
const DISMISS_PX = 90

/** Takes over the card region (desktop) or rises as a bottom sheet (mobile). */
export function SectionPanel() {
  const section = useTama((s) => s.section)
  const press = useTama((s) => s.press)
  const isMobile = useMediaQuery(MOBILE_QUERY)

  /** The section still painted while the panel animates out. */
  const [shown, setShown] = useState<SectionId | null>(section)
  const [dragY, setDragY] = useState(0)
  const startY = useRef<number | null>(null)
  const dragged = useRef(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (section) {
      setShown(section)
      setDragY(0)
      return
    }
    const t = window.setTimeout(() => setShown(null), EXIT_MS)
    return () => window.clearTimeout(t)
  }, [section])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0
  }, [shown])

  if (!shown) return null

  const meta = SECTION_META[shown]
  const View = SECTION_VIEWS[shown]
  const open = section !== null

  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (!isMobile) return
    startY.current = e.clientY
    dragged.current = false
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (startY.current === null) return
    const delta = Math.max(0, e.clientY - startY.current)
    if (delta > 6) dragged.current = true
    setDragY(delta)
  }
  const onPointerUp = () => {
    if (startY.current === null) return
    startY.current = null
    if (dragY > DISMISS_PX) press('C')
    setDragY(0)
  }
  // A drag ends with a click on the grip; only the tap should close the panel.
  const onGripClick = () => {
    if (dragged.current) {
      dragged.current = false
      return
    }
    press('C')
  }

  return (
    <aside
      className="panel"
      data-open={open ? 'true' : 'false'}
      data-dragging={dragY > 0 ? 'true' : 'false'}
      style={dragY > 0 ? { transform: `translateY(${dragY}px)` } : undefined}
      role="dialog"
      aria-modal="false"
      aria-label={`${meta.index} ${meta.label}`}
    >
      <button
        type="button"
        className="panel-grip"
        aria-label="Close panel"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={onGripClick}
      >
        <span aria-hidden="true" />
      </button>

      <header className="panel-head">
        <h2 className="panel-title">
          <span className="panel-num">{meta.index}</span>
          <span className="panel-dot" aria-hidden="true">
            ·
          </span>
          {meta.label}
        </h2>
        <button type="button" className="panel-close" onClick={() => press('C')} aria-label="Close panel (C button)">
          <span aria-hidden="true">C</span>
        </button>
      </header>

      <div className="panel-body" ref={bodyRef}>
        <View />
      </div>
    </aside>
  )
}
