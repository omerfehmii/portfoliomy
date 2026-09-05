import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { damp, dampC } from 'maath/easing'
import { useTama } from '../store/useTama'
import { Rig } from './Rig'
import { DAY_BG, NIGHT_BG, sceneBg } from './theme'

export function Scene() {
  const { scene } = useThree()
  const key = useRef<THREE.DirectionalLight>(null)
  const fill = useRef<THREE.DirectionalLight>(null)
  const amb = useRef<THREE.AmbientLight>(null)
  const env = useRef({ v: 1 })

  useFrame((_, delta) => {
    const night = useTama.getState().theme === 'night'
    dampC(sceneBg, night ? NIGHT_BG : DAY_BG, 0.35, delta) // canvas stays transparent; DOM paints the sky
    damp(env.current, 'v', night ? 0.7 : 1, 0.35, delta)
    scene.environmentIntensity = env.current.v
    if (key.current) key.current.intensity = THREE.MathUtils.lerp(0.55, 1.1, (env.current.v - 0.7) / 0.3)
    if (fill.current) fill.current.intensity = 0.25 * env.current.v
    if (amb.current) amb.current.intensity = 0.3 * env.current.v
  })

  return (
    <>
      <ambientLight ref={amb} intensity={0.3} />
      <directionalLight ref={key} position={[2.5, 4, 5]} intensity={1.1} color="#fff6e8" />
      <directionalLight ref={fill} position={[-3, -1, 4]} intensity={0.25} color="#dbe9ff" />
      <Environment resolution={256} frames={1}>
        <mesh scale={50}>
          <sphereGeometry args={[1, 24, 16]} />
          <meshBasicMaterial color="#aeb8c4" side={THREE.BackSide} />
        </mesh>
        <Lightformer form="rect" intensity={4} position={[0, 5, 3]} scale={[8, 4, 1]} target={[0, 0, 0]} color="#ffffff" />
        <Lightformer form="rect" intensity={2} position={[-6, 1, 2]} scale={[2, 8, 1]} target={[0, 0, 0]} color="#eaf2ff" />
        <Lightformer form="rect" intensity={2} position={[6, 0, 2]} scale={[2, 8, 1]} target={[0, 0, 0]} color="#fff3e0" />
        <Lightformer form="circle" intensity={1} position={[0, -5, 3]} scale={3} target={[0, 0, 0]} color="#ffffff" />
      </Environment>
      <Rig />
    </>
  )
}
