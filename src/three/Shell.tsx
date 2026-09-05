import * as THREE from 'three'
import { useEffect, useMemo } from 'react'
import { MeshTransmissionMaterial } from '@react-three/drei'
import { eggGeometry, eggProfile, EGG } from './eggProfile'
import { makeOrnamentTexture } from './ornamentTexture'
import { profile } from '../content/profile'
import { sceneBg } from './theme'

export const LOOP_Y = 1.36

function Internals() {
  return (
    <group>
      {/* small PCB behind the screen */}
      <mesh position={[0, 0.2, -0.04]}>
        <boxGeometry args={[0.8, 1.0, 0.04]} />
        <meshStandardMaterial color="#3f7a63" roughness={0.6} />
      </mesh>
      {/* LCD module behind the bezel */}
      <mesh position={[0, 0.32, 0.14]}>
        <boxGeometry args={[0.8, 0.8, 0.14]} />
        <meshStandardMaterial color="#3a4150" roughness={0.5} />
      </mesh>
      {/* coin cell, back-bottom like the real battery compartment */}
      <mesh position={[0, -0.62, -0.16]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.08, 32]} />
        <meshStandardMaterial color="#dfe3e8" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* chips */}
      {[
        [-0.32, 0.9, 0.14, 0.1],
        [0.28, 0.92, 0.2, 0.12],
        [0.0, -0.95, 0.3, 0.08],
      ].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0.02]}>
          <boxGeometry args={[w, h, 0.04]} />
          <meshStandardMaterial color="#14171c" roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

function Loop() {
  return (
    <mesh position={[0, LOOP_Y, 0]} castShadow receiveShadow>
      <torusGeometry args={[0.075, 0.02, 16, 40]} />
      <meshStandardMaterial color="#d7dbe0" metalness={1} roughness={0.25} />
    </mesh>
  )
}

export function Shell() {
  const geo = useMemo(() => eggGeometry(), [])
  const ornament = useMemo(() => makeOrnamentTexture(profile.deviceName), [])
  useEffect(() => {
    document.fonts?.ready.then(() => ornament.redraw()).catch(() => {})
  }, [ornament])

  const seam = useMemo(() => {
    const right = eggProfile(80).map((p) => new THREE.Vector3(p.x, p.y, 0))
    const left = right.slice(1, -1).reverse().map((p) => new THREE.Vector3(-p.x, p.y, 0))
    const curve = new THREE.CatmullRomCurve3([...right, ...left], true)
    return new THREE.TubeGeometry(curve, 240, 0.011, 8, true)
  }, [])

  return (
    <group>
      <mesh geometry={geo} castShadow receiveShadow>
        <MeshTransmissionMaterial
          background={sceneBg}
          backside
          backsideThickness={0.35}
          backsideResolution={256}
          samples={7}
          resolution={512}
          transmission={1}
          roughness={0.16}
          thickness={0.9}
          ior={1.4}
          chromaticAberration={0.02}
          anisotropicBlur={0.15}
          distortion={0}
          color="#a6c8f5"
          attenuationColor="#5f97e6"
          attenuationDistance={1.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.1}
        />
      </mesh>
      {/* gold filigree + brand */}
      <mesh geometry={geo} scale={1.004} renderOrder={2} raycast={() => null}>
        <meshStandardMaterial
          color="#d3a83e"
          metalness={0.9}
          roughness={0.34}
          transparent
          alphaMap={ornament.texture}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>
      {/* seam where the two shell halves meet */}
      <mesh geometry={seam} raycast={() => null}>
        <meshStandardMaterial color="#eef3f9" roughness={0.4} />
      </mesh>
      <Loop />
      <Internals />
    </group>
  )
}

export { EGG }
