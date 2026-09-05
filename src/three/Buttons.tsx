import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import { useTama, type Button } from '../store/useTama'
import { frontZ } from './eggProfile'

const BUTTONS: { b: Button; x: number; y: number }[] = [
  { b: 'A', x: -0.36, y: -0.86 },
  { b: 'B', x: 0, y: -0.93 },
  { b: 'C', x: 0.36, y: -0.86 },
]
const R = 0.125
const H = 0.14

function PushButton({ b, x, y }: { b: Button; x: number; y: number }) {
  const group = useRef<THREE.Group>(null)
  const pressedAt = useRef(-1)
  const [hover, setHover] = useState(false)
  useCursor(hover, 'pointer')
  const z0 = frontZ(x, y) - 0.05

  useEffect(
    () =>
      useTama.subscribe((s, prev) => {
        if (s.pressSeq !== prev.pressSeq && s.pressed === b) pressedAt.current = performance.now()
      }),
    [b],
  )

  useFrame(() => {
    const g = group.current
    if (!g) return
    const t = (performance.now() - pressedAt.current) / 1000
    const k = pressedAt.current < 0 || t > 0.24 ? 0 : t < 0.07 ? t / 0.07 : 1 - (t - 0.07) / 0.17
    g.position.z = z0 - 0.04 * k
  })

  return (
    <group
      ref={group}
      position={[x, y, z0]}
      onPointerDown={(e) => { e.stopPropagation(); useTama.getState().press(b) }}
      onClick={(e) => e.stopPropagation()}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true) }}
      onPointerOut={() => setHover(false)}
    >
      {/* generous invisible hit area so a swinging device is still easy to press */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, H]}>
        <cylinderGeometry args={[R * 1.6, R * 1.6, H * 2.4, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, H / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[R, R, H, 40]} />
        <meshPhysicalMaterial color="#f5f4f0" roughness={0.22} clearcoat={1} clearcoatRoughness={0.08} />
      </mesh>
      <mesh position={[0, 0, H]} scale={[1, 1, 0.42]} castShadow receiveShadow>
        <sphereGeometry args={[R, 40, 24]} />
        <meshPhysicalMaterial color="#f7f6f2" roughness={0.18} clearcoat={1} clearcoatRoughness={0.06} />
      </mesh>
    </group>
  )
}

export function Buttons() {
  return (
    <group>
      {BUTTONS.map((p) => (
        <PushButton key={p.b} {...p} />
      ))}
    </group>
  )
}
