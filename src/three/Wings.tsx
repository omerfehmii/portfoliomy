import * as THREE from 'three'
import { useMemo } from 'react'
import { radiusAtY, wingShape } from './eggProfile'

const WING_Y = 0.42

export function Wings() {
  const geo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(wingShape(), {
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
      curveSegments: 24,
    })
    g.translate(0, 0, -0.06)
    return g
  }, [])
  const x = radiusAtY(WING_Y) - 0.08
  return (
    <group>
      <mesh geometry={geo} position={[x, WING_Y, 0.05]} rotation={[0, -0.3, 0.08]}>
        <meshStandardMaterial color="#f8f8f5" roughness={0.5} />
      </mesh>
      <mesh geometry={geo} position={[-x, WING_Y, 0.05]} rotation={[0, 0.3, -0.08]} scale={[-1, 1, 1]}>
        <meshStandardMaterial color="#f8f8f5" roughness={0.5} />
      </mesh>
    </group>
  )
}
