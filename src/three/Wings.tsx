import * as THREE from 'three'
import { useMemo } from 'react'
import { radiusAtY, wingShape } from './eggProfile'

const WING_Y = 0.46

export function Wings() {
  const geo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(wingShape(), {
      depth: 0.09,
      bevelEnabled: true,
      bevelThickness: 0.022,
      bevelSize: 0.02,
      bevelSegments: 4,
      curveSegments: 32,
    })
    g.translate(0, 0, -0.065)
    return g
  }, [])
  const x = radiusAtY(WING_Y) - 0.1
  return (
    <group>
      {/* right wing sweeps slightly back and up; left is the mirror */}
      <mesh geometry={geo} position={[x, WING_Y, 0.04]} rotation={[0.08, 0.28, 0.1]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#f8f7f3" roughness={0.45} clearcoat={0.35} clearcoatRoughness={0.3} />
      </mesh>
      <mesh geometry={geo} position={[-x, WING_Y, 0.04]} rotation={[0.08, -0.28, -0.1]} scale={[-1, 1, 1]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#f8f7f3" roughness={0.45} clearcoat={0.35} clearcoatRoughness={0.3} />
      </mesh>
    </group>
  )
}
