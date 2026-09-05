# Portfolio — Tamagotchi edition

An interactive portfolio: a translucent icy-blue Tamagotchi hanging from a ball chain is the whole interface.
Its 48x48 1-bit LCD shows a pixel creature (= the developer) and 8 menu icons. Buttons A/B/C = cycle / confirm / back.
Content itself lives in HTML panels (readable, indexable); the canvas is only the stage.

## Stack
Vite · React 19 · TypeScript · three · @react-three/fiber · @react-three/drei · zustand · maath

## Layout (ownership)
- `src/store/useTama.ts` — THE contract. Mode/cursor/section/mood/theme. Do not add fields casually.
- `src/lcd/Lcd.ts` — 1-bit framebuffer + drawing primitives. `src/lcd/font.ts` — 3x5 font.
- `src/lcd/drawLcd.ts` — draws the LCD every frame from store state (scenes, sprites, icons).
- `src/three/*` — 3D device (shell, screen, buttons, wings, chain physics, lights).
- `src/ui/*` — HTML overlay (header, hero, how-to-play, section panels, mobile layout).
- `src/content/*` — typed content. Placeholders until the owner provides real content.
- `src/audio/*` — Web Audio beeps, `useSoundFx` subscribes to store changes.
- `src/input/*` — keyboard, idle sleep, theme attribute.

## Conventions
- Menu icon order: `ICONS` in the store (4 top, 4 bottom). `light` toggles day/night, `sound` toggles beeps.
- Mood animations are timed from `moodSince`; fall back to idle rendering after the animation.
- All text on screen must remain real DOM (selectable). LCD text is decorative only.
- No trademarked names on the device; brand comes from `profile.deviceName`.
- Keep 60fps on a mid-range laptop: no heavy post-processing, DPR capped at 2.

## Scripts
`npm run dev` · `npm run build` · `npm run typecheck`

## Verifying in the Browser pane (dev harness)
The desktop Browser pane often reports `document.visibilityState === 'hidden'`, which pauses requestAnimationFrame
(empty canvas) and drops real pointer input to the canvas. Dev-only helpers exist for that:
- `?manual` — stops the R3F loop; `window.__advance(frames)` steps it with a fixed 1/60 s clock (take one screenshot after
  navigating so the R3F root mounts, then advance).
- `window.__tama` — the zustand store; `window.__rig` — `{ grab(nx, ny), move(nx, ny), release(), state() }` (NDC coords) to drive drags.
- `?zoom=2.4` — enlarges the device for close inspection.
- Synthetic PointerEvents in the emulated viewport reach R3F with halved offsets: dispatch at 2× client coordinates.
