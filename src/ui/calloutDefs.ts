/**
 * Fig. 1 callouts: numbered badges pinned to parts of the live 3D device.
 * `anchor` is in device-local units (see three/eggProfile.ts); `badge` is the badge offset in CSS px at scale 1.
 * The DOM (ui/Callouts.tsx) renders them, three/CalloutTracker.tsx moves them every frame.
 */
export interface CalloutDef {
  id: string
  num: number
  part: string
  note: string
  anchor: [number, number, number]
  badge: [number, number]
}

export const CALLOUTS: CalloutDef[] = [
  { id: 'display', num: 1, part: 'Display', note: 'One engineer inside', anchor: [-0.37, 0.36, 0.5], badge: [-56, -36] },
  { id: 'a', num: 2, part: 'A', note: 'Cycle · ← →', anchor: [-0.36, -0.86, 0.56], badge: [-50, 34] },
  { id: 'b', num: 3, part: 'B', note: 'Open · Enter', anchor: [0, -0.93, 0.56], badge: [0, 54] },
  { id: 'c', num: 4, part: 'C', note: 'Back · Esc', anchor: [0.36, -0.86, 0.56], badge: [50, 34] },
  { id: 'wings', num: 5, part: 'Wings', note: 'Angel edition', anchor: [1.3, 0.5, 0.05], badge: [46, -32] },
  { id: 'chain', num: 6, part: 'Chain', note: 'Drag to swing', anchor: [0, 1.64, 0], badge: [48, -12] },
]
