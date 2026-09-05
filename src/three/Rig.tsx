import * as THREE from 'three'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import { damp } from 'maath/easing'
import { useTama } from '../store/useTama'
import { Device, ATTACH_OFFSET } from './Device'
import { CalloutTracker } from './CalloutTracker'

/**
 * Verlet ball chain hanging from an off-screen anchor. The device is two nodes:
 * `attach` (top of the loop) and `com` (centre of mass), joined by a rigid rod, so it
 * swings like a real pendulum. Dragging pulls the com toward the pointer through a spring.
 */
const MAX_NODES = 96
const BALL_R = 0.048
const BALL_SPACING = 0.104
const GRAVITY = 9.8
const SUBSTEP = 1 / 120
const ITERATIONS = 12
const W_ATTACH = 0.5
const W_COM = 1 / 8

class Rope {
  pos = new Float32Array(MAX_NODES * 3)
  prev = new Float32Array(MAX_NODES * 3)
  w = new Float32Array(MAX_NODES)
  balls = 0
  rest = BALL_SPACING
  rod = ATTACH_OFFSET
  ready = false

  get n() { return this.balls + 3 }
  get attach() { return this.balls + 1 }
  get com() { return this.balls + 2 }

  private setNode(i: number, x: number, y: number, z: number) {
    const o = i * 3
    this.pos[o] = this.prev[o] = x
    this.pos[o + 1] = this.prev[o + 1] = y
    this.pos[o + 2] = this.prev[o + 2] = z
  }

  private weights() {
    this.w.fill(1, 0, this.n)
    this.w[0] = 0
    this.w[this.attach] = W_ATTACH
    this.w[this.com] = W_COM
  }

  init(ax: number, ay: number, balls: number, rest: number, rod: number) {
    this.balls = balls
    this.rest = rest
    this.rod = rod
    for (let i = 0; i <= balls + 1; i++) this.setNode(i, ax, ay - rest * i, 0)
    this.setNode(this.com, ax, ay - rest * (balls + 1) - rod, 0)
    this.weights()
    this.ready = true
  }

  /** Change ball count without a visible pop: redistribute balls along the current chain. */
  resample(balls: number, rest: number, rod: number) {
    const old = this.balls
    this.rest = rest
    this.rod = rod
    if (balls === old) return
    const P = this.pos
    const Q = this.prev
    const m = old + 2 // anchor..attach
    const line = P.slice(0, m * 3)
    const cum = new Float32Array(m)
    for (let i = 1; i < m; i++) {
      const a = (i - 1) * 3
      const b = i * 3
      cum[i] = cum[i - 1] + Math.hypot(line[b] - line[a], line[b + 1] - line[a + 1], line[b + 2] - line[a + 2])
    }
    const total = cum[m - 1]
    const oa = (old + 1) * 3
    const oc = (old + 2) * 3
    const A = [P[oa], P[oa + 1], P[oa + 2], Q[oa], Q[oa + 1], Q[oa + 2]]
    const C = [P[oc], P[oc + 1], P[oc + 2], Q[oc], Q[oc + 1], Q[oc + 2]]
    for (let i = 1; i <= balls; i++) {
      const d = (i / (balls + 1)) * total
      let k = 1
      while (k < m - 1 && cum[k] < d) k++
      const seg = cum[k] - cum[k - 1] || 1
      const t = (d - cum[k - 1]) / seg
      const a = (k - 1) * 3
      const b = k * 3
      this.setNode(i, line[a] + (line[b] - line[a]) * t, line[a + 1] + (line[b + 1] - line[a + 1]) * t, line[a + 2] + (line[b + 2] - line[a + 2]) * t)
    }
    const na = (balls + 1) * 3
    const nc = (balls + 2) * 3
    for (let i = 0; i < 3; i++) {
      P[na + i] = A[i]; Q[na + i] = A[i + 3]
      P[nc + i] = C[i]; Q[nc + i] = C[i + 3]
    }
    this.balls = balls
    this.weights()
  }

  step(dt: number, ax: number, ay: number, t: number, drag: { active: boolean; tx: number; ty: number }, calm: boolean) {
    const P = this.pos
    const Q = this.prev
    const n = this.n
    P[0] = Q[0] = ax
    P[1] = Q[1] = ay
    P[2] = Q[2] = 0
    const g = -GRAVITY * dt * dt
    const dt2 = dt * dt
    for (let i = 1; i < n; i++) {
      const o = i * 3
      // heavy air drag so the swing settles in ~2 s; freeze further while the pointer is over the device
      const damping = i === this.com && drag.active ? 0.9 : calm ? 0.955 : 0.988
      const vx = (P[o] - Q[o]) * damping
      const vy = (P[o + 1] - Q[o + 1]) * damping
      const vz = (P[o + 2] - Q[o + 2]) * damping
      Q[o] = P[o]
      Q[o + 1] = P[o + 1]
      Q[o + 2] = P[o + 2]
      const gust = calm ? 0 : 1
      const wind = 0.12 * gust * Math.sin(t * 0.9 + i * 0.35) * dt2
      const windZ = 0.06 * gust * Math.sin(t * 0.6 + i * 0.5) * dt2
      P[o] += vx + wind
      P[o + 1] += vy + g
      P[o + 2] += vz + windZ - P[o + 2] * 3 * dt2
    }
    if (drag.active) {
      const o = this.com * 3
      P[o] += (drag.tx - P[o]) * 0.22
      P[o + 1] += (drag.ty - P[o + 1]) * 0.22
    }
    for (let it = 0; it < ITERATIONS; it++) {
      for (let i = 0; i < n - 1; i++) {
        const rest = i === n - 2 ? this.rod : this.rest
        const a = i * 3
        const b = a + 3
        const dx = P[b] - P[a]
        const dy = P[b + 1] - P[a + 1]
        const dz = P[b + 2] - P[a + 2]
        const len = Math.hypot(dx, dy, dz) || 1e-6
        const diff = (len - rest) / len
        const wa = this.w[i]
        const wb = this.w[i + 1]
        const ws = wa + wb
        if (ws === 0) continue
        const ka = (diff * wa) / ws
        const kb = (diff * wb) / ws
        P[a] += dx * ka; P[a + 1] += dy * ka; P[a + 2] += dz * ka
        P[b] -= dx * kb; P[b + 1] -= dy * kb; P[b + 2] -= dz * kb
      }
    }
  }
}

const Y_AXIS = new THREE.Vector3(0, 1, 0)

/** Soft elliptical blob used as a fake contact shadow on the backdrop. */
function makeShadowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(128, 128, 20, 128, 128, 128)
  g.addColorStop(0, 'rgba(0,0,0,0.55)')
  g.addColorStop(0.55, 'rgba(0,0,0,0.22)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  const t = new THREE.CanvasTexture(c)
  return t
}
/** ?zoom=2.5 enlarges the device for close inspection during development. */
const DEBUG_ZOOM = (typeof location !== 'undefined' && Number(new URLSearchParams(location.search).get('zoom'))) || 1

export function Rig() {
  const { viewport, size, gl } = useThree()
  const device = useRef<THREE.Group>(null)
  const balls = useRef<THREE.InstancedMesh>(null)
  const links = useRef<THREE.InstancedMesh>(null)
  const shadow = useRef<THREE.Mesh>(null)
  const shadowTex = useMemo(makeShadowTexture, [])
  const rope = useMemo(() => new Rope(), [])
  const acc = useRef(0)
  const sm = useRef({ scale: 1, anchorX: 0, yd: -0.4, twistY: 0, twistX: 0 })
  const drag = useRef({ active: false, tx: 0, ty: 0, grab: new THREE.Vector3(), pointer: new THREE.Vector2() })
  const [hover, setHover] = useState(false)
  const hoverRef = useRef(false)
  useCursor(hover && !drag.current.active, 'grab')

  const tmp = useMemo(
    () => ({ m: new THREE.Matrix4(), p: new THREE.Vector3(), q: new THREE.Quaternion(), s: new THREE.Vector3(), d: new THREE.Vector3(), g: new THREE.Vector3() }),
    [],
  )

  // Pointer tracking on window so drags survive leaving the canvas or crossing HTML.
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const r = gl.domElement.getBoundingClientRect()
      drag.current.pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    }
    const up = () => {
      if (!drag.current.active) return
      drag.current.active = false
      document.body.style.cursor = ''
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    window.addEventListener('blur', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      window.removeEventListener('blur', up)
    }
  }, [gl])

  // Dev-only test API: drive a drag without real pointer input (used with ?manual frame stepping).
  useEffect(() => {
    if (!import.meta.env.DEV) return
    const w = window as unknown as { __rig?: unknown }
    w.__rig = {
      grab: (nx: number, ny: number) => {
        drag.current.active = true
        drag.current.grab.set(0, 0, 0)
        drag.current.pointer.set(nx, ny)
      },
      move: (nx: number, ny: number) => drag.current.pointer.set(nx, ny),
      release: () => { drag.current.active = false },
      state: () => {
        const P = rope.pos
        const C = rope.com * 3
        return { x: P[C], y: P[C + 1], rotZ: device.current?.rotation.z ?? 0, balls: rope.balls }
      },
    }
    return () => { delete w.__rig }
  }, [rope])

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    const g = device.current
    if (!g) return
    drag.current.active = true
    drag.current.grab.copy(g.worldToLocal(e.point.clone()))
    drag.current.pointer.set(e.pointer.x, e.pointer.y)
    document.body.style.cursor = 'grabbing'
    useTama.getState().touch()
  }

  useFrame((state, delta) => {
    const g = device.current
    if (!g) return
    const vw = viewport.width
    const vh = viewport.height
    const mobile = size.width < 768
    const st = useTama.getState()
    const section = st.mode === 'section'
    const S = sm.current

    // layout: desktop = device just left of centre (so a right-side panel never overlaps it), mobile = device on top
    const base = mobile
      ? THREE.MathUtils.clamp(vw / 2.9, 0.4, 1)
      : THREE.MathUtils.clamp(vw / 3.7, 0.46, 1)
    const scaleTarget = base * (section ? (mobile ? 0.78 : 0.9) : 1) * DEBUG_ZOOM
    damp(S, 'scale', scaleTarget, 0.35, delta)
    damp(S, 'anchorX', mobile ? 0 : -vw * 0.04, 0.45, delta)
    damp(S, 'yd', mobile ? (section ? vh * 0.24 : vh * 0.12) : -0.3 * S.scale, 0.45, delta)
    const s = S.scale
    const anchorY = vh / 2 + 0.3
    const rod = ATTACH_OFFSET * s
    const chainLen = Math.max(0.25, anchorY - (S.yd + rod))
    const nBalls = THREE.MathUtils.clamp(Math.round(chainLen / (BALL_SPACING * s)), 2, MAX_NODES - 3)
    const rest = chainLen / (nBalls + 1)
    if (!rope.ready) rope.init(S.anchorX, anchorY, nBalls, rest, rod)
    else rope.resample(nBalls, rest, rod)

    // drag target: make the grabbed point follow the pointer
    const D = drag.current
    if (D.active) {
      tmp.g.copy(D.grab)
      g.localToWorld(tmp.g)
      const px = (D.pointer.x * vw) / 2
      const py = (D.pointer.y * vh) / 2
      D.tx = px - (tmp.g.x - g.position.x)
      D.ty = py - (tmp.g.y - g.position.y)
    }

    // simulate
    acc.current += Math.min(delta, 0.05)
    const t = state.clock.getElapsedTime()
    while (acc.current >= SUBSTEP) {
      rope.step(SUBSTEP, S.anchorX, anchorY, t, D, hoverRef.current && !D.active)
      acc.current -= SUBSTEP
    }

    // device transform from attach/com nodes
    const P = rope.pos
    const Q = rope.prev
    const A = rope.attach * 3
    const C = rope.com * 3
    const ux = P[A] - P[C]
    const uy = P[A + 1] - P[C + 1]
    g.position.set(P[C], P[C + 1], P[C + 2])
    g.rotation.z = Math.atan2(-ux, uy)
    const vx = (P[C] - Q[C]) / SUBSTEP
    const vz = (P[C + 2] - Q[C + 2]) / SUBSTEP
    damp(S, 'twistY', THREE.MathUtils.clamp(vx * 0.06, -0.25, 0.25), 0.18, delta)
    damp(S, 'twistX', THREE.MathUtils.clamp(-vz * 0.06, -0.15, 0.15), 0.18, delta)
    g.rotation.y = S.twistY
    g.rotation.x = S.twistX
    g.scale.setScalar(s)

    // fake shadow on the backdrop, offset down-right like the key light
    const sh = shadow.current
    if (sh) {
      sh.position.set(P[C] + 0.22 * s, P[C + 1] - 0.3 * s, -1.4)
      sh.rotation.z = g.rotation.z
      sh.scale.set(3.1 * s, 3.9 * s, 1)
      const night = st.theme === 'night'
      const mat = sh.material as THREE.MeshBasicMaterial
      mat.opacity = THREE.MathUtils.damp(mat.opacity, night ? 0.25 : 0.16, 4, delta)
    }

    // chain instances
    const B = balls.current
    const L = links.current
    if (B && L) {
      const n = rope.balls
      for (let i = 1; i <= n; i++) {
        const o = i * 3
        tmp.p.set(P[o], P[o + 1], P[o + 2])
        tmp.s.setScalar(BALL_R * s)
        tmp.m.compose(tmp.p, tmp.q.identity(), tmp.s)
        B.setMatrixAt(i - 1, tmp.m)
      }
      B.count = n
      B.instanceMatrix.needsUpdate = true
      for (let i = 0; i <= n; i++) {
        const a = i * 3
        const b = a + 3
        tmp.d.set(P[b] - P[a], P[b + 1] - P[a + 1], P[b + 2] - P[a + 2])
        const len = tmp.d.length() || 1e-6
        tmp.d.divideScalar(len)
        tmp.p.set((P[a] + P[b]) / 2, (P[a + 1] + P[b + 1]) / 2, (P[a + 2] + P[b + 2]) / 2)
        tmp.q.setFromUnitVectors(Y_AXIS, tmp.d)
        tmp.s.set(0.016 * s, len, 0.016 * s)
        tmp.m.compose(tmp.p, tmp.q, tmp.s)
        L.setMatrixAt(i, tmp.m)
      }
      L.count = n + 1
      L.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group>
      <mesh ref={shadow} position={[0, 0, -1.4]} raycast={() => null}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={shadowTex} transparent opacity={0.16} depthWrite={false} toneMapped={false} />
      </mesh>
      <instancedMesh ref={balls} args={[undefined, undefined, MAX_NODES]} frustumCulled={false} raycast={() => null}>
        <sphereGeometry args={[1, 20, 14]} />
        <meshStandardMaterial color="#d8dce2" metalness={1} roughness={0.22} />
      </instancedMesh>
      <instancedMesh ref={links} args={[undefined, undefined, MAX_NODES]} frustumCulled={false} raycast={() => null}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshStandardMaterial color="#b9bec6" metalness={1} roughness={0.3} />
      </instancedMesh>
      <group
        ref={device}
        onPointerDown={onPointerDown}
        onPointerOver={() => { hoverRef.current = true; setHover(true) }}
        onPointerOut={() => { hoverRef.current = false; setHover(false) }}
      >
        <Device />
      </group>
      <CalloutTracker device={device} />
    </group>
  )
}
