import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useTama, type SectionId } from '../store/useTama'
import { PAGE_COUNT, SECTION_META, SECTION_ORDER } from './meta'
import { SECTION_VIEWS } from './sections'
import { MOBILE_QUERY, useMediaQuery } from './useMediaQuery'

const EXIT_MS = 420
const DISMISS_PX = 90

/** An inner page of the manual: desktop leaf on the right, bottom sheet on mobile. */
export function SectionPanel() {
  const section = useTama((s) => s.section)
  const press = useTama((s) => s.press)
  const openSection = useTama((s) => s.openSection)
  const isMobile = useMediaQuery(MOBILE_QUERY)

  /** The section still painted while the page animates out. */
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
  const at = SECTION_ORDER.indexOf(shown)
  const prev = at > 0 ? SECTION_ORDER[at - 1] : null
  const next = at < SECTION_ORDER.length - 1 ? SECTION_ORDER[at + 1] : null

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
      aria-label={`Page ${meta.page}: ${meta.label}`}
    >
      <button
        type="button"
        className="panel-grip"
        aria-label="Close page"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={onGripClick}
      >
        <span aria-hidden="true" />
      </button>

      <header className="panel-head">
        <p className="panel-run">
          p. {meta.page} / {PAGE_COUNT}
        </p>
        <button type="button" className="panel-close" onClick={() => press('C')} aria-label="Close page">
          <span aria-hidden="true">×</span>
        </button>
      </header>

      <div className="panel-body" ref={bodyRef}>
        <h2 className="page-title">{meta.label}.</h2>
        <View />
      </div>

      <footer className="panel-foot">
        {prev ? (
          <button type="button" className="page-nav" onClick={() => openSection(prev)}>
            <span aria-hidden="true">←</span> {SECTION_META[prev].label}
          </button>
        ) : (
          <button type="button" className="page-nav" onClick={() => press('C')}>
            <span aria-hidden="true">←</span> Cover
          </button>
        )}
        {next ? (
          <button type="button" className="page-nav" onClick={() => openSection(next)}>
            {SECTION_META[next].label} <span aria-hidden="true">→</span>
          </button>
        ) : (
          <button type="button" className="page-nav" onClick={() => press('C')}>
            Cover <span aria-hidden="true">→</span>
          </button>
        )}
      </footer>
    </aside>
  )
}
