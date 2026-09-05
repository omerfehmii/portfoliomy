import { Canvas, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Scene } from './three/Scene'
import { Overlay } from './ui/Overlay'
import { useKeyboard } from './input/useKeyboard'
import { useIdleSleep } from './input/useIdleSleep'
import { useThemeAttribute } from './input/useThemeAttribute'
import { useSoundFx } from './audio/useSoundFx'
import { useTama } from './store/useTama'

/**
 * Dev-only harness: with ?manual in the URL the render loop stops and `window.__advance(frames)`
 * steps it by hand with a fixed 1/60 s clock. Lets us verify the scene when the tab is reported
 * hidden (rAF paused) and drive deterministic screenshots.
 */
const MANUAL_LOOP = import.meta.env.DEV && new URLSearchParams(location.search).has('manual')

function DebugBridge() {
  const three = useThree()
  useEffect(() => {
    if (!MANUAL_LOOP) return
    let elapsed = 0
    const clock = three.clock as unknown as { getDelta: () => number; getElapsedTime: () => number }
    clock.getDelta = () => { elapsed += 1 / 60; return 1 / 60 }
    clock.getElapsedTime = () => elapsed
    const w = window as unknown as { __advance?: (frames?: number) => number; __three?: unknown; __tama?: unknown }
    w.__tama = useTama
    w.__advance = (frames = 60) => { for (let i = 0; i < frames; i++) three.advance(performance.now()); return elapsed }
    w.__three = three
    three.advance(performance.now())
  }, [three])
  return null
}

export default function App() {
  useKeyboard()
  useIdleSleep()
  useThemeAttribute()
  useSoundFx()
  // The canvas sits above the text columns (the device swings over the copy) and is pointer-events:none so the
  // copy stays selectable; R3F listens on the app root instead and raycasts from client coordinates.
  const appRef = useRef<HTMLDivElement>(null!)
  return (
    <div className="app" ref={appRef}>
      <Canvas
        className="stage"
        eventSource={appRef}
        eventPrefix="client"
        camera={{ position: [0, 0, 7], fov: 32, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
        frameloop={MANUAL_LOOP ? 'never' : 'always'}
        shadows="variance"
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Scene />
        {import.meta.env.DEV && <DebugBridge />}
      </Canvas>
      <Overlay />
    </div>
  )
}
