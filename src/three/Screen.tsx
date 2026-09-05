import * as THREE from 'three'
import { useMemo, useRef, useState } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import { dampC } from 'maath/easing'
import { lcd, LCD_W, LCD_H } from '../lcd/Lcd'
import { drawLcd } from '../lcd/drawLcd'
import { iconAt } from '../lcd/layout'
import { ICONS, useTama } from '../store/useTama'
import { starburstShape } from './eggProfile'

export const LCD_CENTER_Y = 0.32
const LCD_SIZE = 0.7
const BEZEL_Z = 0.33
const BEZEL_DEPTH = 0.18
const BEZEL_FACE_Z = BEZEL_Z + BEZEL_DEPTH + 0.012
const FACE_Z = BEZEL_FACE_Z - 0.02 // LCD slightly recessed, but still in front of the shell dome (z≈0.466)

const DAY = { bg: new THREE.Color('#c7dbee'), ink: new THREE.Color('#1b2230'), shadow: new THREE.Color('#9db1c9') }
const NIGHT = { bg: new THREE.Color('#34435a'), ink: new THREE.Color('#0b0f17'), shadow: new THREE.Color('#25314a') }

const vert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

const frag = /* glsl */ `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec3 uBg;
uniform vec3 uInk;
uniform vec3 uShadow;
uniform float uOff;
varying vec2 vUv;

float inkAt(vec2 cell) {
  if (cell.x < 0.0 || cell.y < 0.0 || cell.x >= uRes.x || cell.y >= uRes.y) return 0.0;
  vec2 uv = (floor(cell) + 0.5) / uRes;
  return step(0.002, texture2D(uTex, uv).r);
}
float cellMask(vec2 f, float hs) {
  vec2 d = abs(f - 0.5) - hs;
  float m = max(d.x, d.y);
  float aa = fwidth(m) * 0.9 + 0.004;
  return 1.0 - smoothstep(-aa, aa, m);
}
void main() {
  vec2 cell = vec2(vUv.x, 1.0 - vUv.y) * uRes; // row 0 = top
  vec2 f = fract(cell);
  float ink = inkAt(cell);
  float m = cellMask(f, 0.42);
  vec2 sc = cell - vec2(0.33, 0.42);
  float sInk = inkAt(sc);
  float sm = cellMask(fract(sc), 0.42);

  vec3 col = uBg;
  col = mix(col, uInk, uOff * m * (1.0 - ink));            // ghost of off segments
  col = mix(col, uShadow, 0.65 * sInk * sm * (1.0 - ink * m)); // segment shadow on backing
  col = mix(col, uInk, ink * m);                              // ink
  float edge = smoothstep(0.0, 0.05, min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y)));
  col *= mix(0.8, 1.0, edge);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`

function LcdPlane() {
  const [hover, setHover] = useState(false)
  useCursor(hover, 'pointer')

  const texture = useMemo(() => {
    const t = new THREE.DataTexture(lcd.data, LCD_W, LCD_H, THREE.RedFormat, THREE.UnsignedByteType)
    t.magFilter = THREE.NearestFilter
    t.minFilter = THREE.NearestFilter
    t.generateMipmaps = false
    t.needsUpdate = true
    return t
  }, [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        toneMapped: false,
        uniforms: {
          uTex: { value: texture },
          uRes: { value: new THREE.Vector2(LCD_W, LCD_H) },
          uBg: { value: DAY.bg.clone() },
          uInk: { value: DAY.ink.clone() },
          uShadow: { value: DAY.shadow.clone() },
          uOff: { value: 0.07 },
        },
      }),
    [texture],
  )

  useFrame((state, delta) => {
    const s = useTama.getState()
    drawLcd(lcd, s, state.clock.getElapsedTime())
    if (lcd.dirty) {
      texture.needsUpdate = true
      lcd.dirty = false
    }
    const target = s.theme === 'day' ? DAY : NIGHT
    dampC(material.uniforms.uBg.value, target.bg, 0.4, delta)
    dampC(material.uniforms.uInk.value, target.ink, 0.4, delta)
    dampC(material.uniforms.uShadow.value, target.shadow, 0.4, delta)
  })

  const onTap = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    const s = useTama.getState()
    if (!e.uv) return s.press('B')
    const px = Math.floor(e.uv.x * LCD_W)
    const py = Math.floor((1 - e.uv.y) * LCD_H)
    const i = iconAt(px, py)
    if (i < 0) return s.press('B')
    const id = ICONS[i]
    if (id === 'light') s.toggleTheme()
    else if (id === 'sound') s.toggleSound()
    else s.openSection(id)
  }

  return (
    <mesh
      position={[0, LCD_CENTER_Y, FACE_Z]}
      material={material}
      onPointerDown={onTap}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true) }}
      onPointerOut={() => setHover(false)}
      onClick={(e) => e.stopPropagation()}
    >
      <planeGeometry args={[LCD_SIZE, LCD_SIZE]} />
    </mesh>
  )
}

function Bezel() {
  const geo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(starburstShape(0.41, 4, 0.11, 0.365), {
      depth: BEZEL_DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 2,
    })
    return g
  }, [])
  return (
    <mesh geometry={geo} position={[0, LCD_CENTER_Y, BEZEL_Z]}>
      <meshStandardMaterial color="#c9d1db" roughness={0.45} metalness={0.05} />
    </mesh>
  )
}

function Glass() {
  return (
    <mesh position={[0, LCD_CENTER_Y, BEZEL_FACE_Z - 0.004]} raycast={() => null}>
      <planeGeometry args={[LCD_SIZE + 0.02, LCD_SIZE + 0.02]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.14} roughness={0.05} metalness={0} envMapIntensity={1.6} depthWrite={false} />
    </mesh>
  )
}

/** Starburst bezel + LCD + glass window. */
export function ScreenAssembly() {
  return (
    <group>
      <Bezel />
      <LcdPlane />
      <Glass />
    </group>
  )
}
