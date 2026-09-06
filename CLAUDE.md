# Portfolio — Tamagotchi edition

An interactive portfolio: a translucent icy-blue Tamagotchi hanging from a ball chain is the whole interface.
Its 48x48 1-bit LCD shows a pixel creature (= the developer) and 8 menu icons. The three buttons are
`'A' | 'B' | 'C'` in code only = cycle / confirm / back; they carry no letters on the device, so user-facing
copy calls them left / middle / right. Pressed with the mouse (or arrows / Enter / Esc; letter keys are not bound).
Tapping an LCD icon or a Contents entry opens that page directly.
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
- `src/analytics/*` — Umami, `useAnalytics` subscribes to store changes the way `useSoundFx` does.

## Conventions
- Menu icon order: `ICONS` in the store (4 top, 4 bottom). `light` toggles day/night, `sound` toggles beeps.
- Mood animations are timed from `moodSince`; fall back to idle rendering after the animation.
- All text on screen must remain real DOM (selectable). LCD text is decorative only.
- No trademarked names on the device; brand comes from `profile.deviceName`.
- Keep 60fps on a mid-range laptop: no heavy post-processing, DPR capped at 2.
- Layering: the canvas (`.stage`, z 1) sits above the cover columns so the swinging device passes over the copy;
  header, footer and the section panel opt in with z-index 2+. The canvas is `pointer-events: none`;
  R3F listens on `.app` (`eventSource` + `eventPrefix="client"`), so DOM buttons under the device still work.
- `projects` is in CV order with a `kind` (`experience` | `project`); the Work panel groups by it.
- Analytics is cookieless and opt-in by environment: no `VITE_UMAMI_ID`, no collector, no events — so
  local runs and forks stay out of the numbers. Events are coarse on purpose (page opened, one bucketed
  engagement event per visit); never send anything that identifies a visitor, or a consent banner becomes
  mandatory and the packaging is ruined.

## Scripts
`npm run dev` · `npm run build` · `npm run typecheck`

## Verifying in the Browser pane (dev harness)
The desktop Browser pane often reports `document.visibilityState === 'hidden'`, which pauses requestAnimationFrame
(empty canvas) and drops real pointer input to the canvas. Dev-only helpers exist for that:
- `?manual` — stops the R3F loop; `window.__advance(frames)` steps it with a fixed 1/60 s clock (take one screenshot after
  navigating so the R3F root mounts, then advance).
- `window.__tama` — the zustand store; `window.__rig` — `{ grab(nx, ny), move(nx, ny), release(), state() }` (NDC coords) to drive drags.
- `?zoom=2.4` — enlarges the device for close inspection.
- Synthetic PointerEvents: dispatch on `document.elementFromPoint(x, y)` (that is `.app`) with plain client
  coordinates; R3F reads `clientX/Y`, so scale screenshot coordinates by `innerWidth / screenshotWidth` only.
