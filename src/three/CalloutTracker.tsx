import * as THREE from 'three'
import { useMemo, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CALLOUTS } from '../ui/calloutDefs'

interface Els {
  badge: HTMLElement | null
  line: HTMLElement | null
  dot: HTMLElement | null
}

/** Projects device-local anchor points to CSS pixels and pins the DOM callouts to them. */
export function CalloutTracker({ device }: { device: RefObject<THREE.Group | null> }) {
  const { camera, size } = useThree()
  const els = useRef<Record<string, Els>>({})
  const frame = useRef(0)
  const v = useMemo(() => new THREE.Vector3(), [])

  const lookup = () => {
    for (const c of CALLOUTS) {
      const cur = els.current[c.id]
      if (cur?.badge?.isConnected) continue
      els.current[c.id] = {
        badge: document.querySelector<HTMLElement>(`[data-callout="${c.id}"]`),
        line: document.querySelector<HTMLElement>(`[data-callout-line="${c.id}"]`),
        dot: document.querySelector<HTMLElement>(`[data-callout-dot="${c.id}"]`),
      }
    }
  }

  useFrame(() => {
    const g = device.current
    if (!g) return
    if (frame.current++ % 30 === 0) lookup()
    g.updateMatrixWorld(true)
    const s = g.scale.x
    for (const c of CALLOUTS) {
      const e = els.current[c.id]
      if (!e?.badge || !e.line || !e.dot) continue
      v.set(c.anchor[0], c.anchor[1], c.anchor[2])
      g.localToWorld(v)
      v.project(camera)
      const x = ((v.x + 1) / 2) * size.width
      const y = ((1 - v.y) / 2) * size.height
      const bx = x + c.badge[0] * s
      const by = y + c.badge[1] * s
      const len = Math.hypot(bx - x, by - y)
      const ang = Math.atan2(by - y, bx - x)
      e.dot.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
      e.line.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${ang.toFixed(4)}rad) scaleX(${len.toFixed(1)})`
      e.badge.style.transform = `translate(${bx.toFixed(1)}px, ${by.toFixed(1)}px) translate(-50%, -50%)`
    }
  })
  return null
}
