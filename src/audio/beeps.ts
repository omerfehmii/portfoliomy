/**
 * Tiny Web Audio beeper: short square/triangle blips with fast envelopes, the
 * way a 90s virtual pet sounds. Everything is defensive — if the browser has no
 * AudioContext, or blocks it, every call is a no-op instead of a throw.
 */

type Ctor = typeof AudioContext

function ctor(): Ctor | null {
  if (typeof window === 'undefined') return null
  if (typeof AudioContext !== 'undefined') return AudioContext
  return (globalThis as { webkitAudioContext?: Ctor }).webkitAudioContext ?? null
}

let ctx: AudioContext | null = null
let master: GainNode | null = null
let unusable = false
/** Browsers refuse to start audio before a gesture, so we wait for one. */
let gestured = false

/** Peak gain of a single blip. Deliberately quiet — this plays unprompted. */
const GAIN = 0.04
const FLOOR = 0.0001

function ensure(): AudioContext | null {
  if (ctx || unusable) return ctx
  const C = ctor()
  if (!C) {
    unusable = true
    return null
  }
  try {
    ctx = new C()
    master = ctx.createGain()
    master.gain.value = 1
    master.connect(ctx.destination)
  } catch {
    unusable = true
    ctx = null
    master = null
  }
  return ctx
}

/** Call from a real user gesture: creates and resumes the context. */
export function unlockAudio() {
  gestured = true
  const c = ensure()
  if (!c) return
  if (c.state === 'suspended') void c.resume().catch(() => {})
}

export interface Note {
  freq: number
  /** Seconds. */
  dur: number
  /** Start offset from now, seconds. */
  at?: number
  /** Glide to this frequency across the note. */
  to?: number
  wave?: OscillatorType
  /** Multiplier on the base gain. */
  gain?: number
}

/** Schedules a short sequence. Silent (never throws) if audio is unavailable. */
export function play(notes: readonly Note[]) {
  if (!gestured) return
  const c = ensure()
  if (!c || !master) return
  if (c.state === 'suspended') void c.resume().catch(() => {})

  try {
    const t0 = c.currentTime + 0.005
    for (const n of notes) {
      const start = t0 + (n.at ?? 0)
      const end = start + n.dur
      const osc = c.createOscillator()
      osc.type = n.wave ?? 'square'
      osc.frequency.setValueAtTime(n.freq, start)
      if (n.to !== undefined) osc.frequency.exponentialRampToValueAtTime(Math.max(20, n.to), end)

      const g = c.createGain()
      g.gain.setValueAtTime(FLOOR, start)
      g.gain.exponentialRampToValueAtTime(GAIN * (n.gain ?? 1), start + 0.006)
      g.gain.exponentialRampToValueAtTime(FLOOR, end)

      osc.connect(g)
      g.connect(master)
      osc.onended = () => {
        try {
          osc.disconnect()
          g.disconnect()
        } catch {
          /* already torn down */
        }
      }
      osc.start(start)
      osc.stop(end + 0.02)
    }
  } catch {
    /* scheduling failed; stay silent */
  }
}

/* --------------------------------------------------------------- the kit -- */

/** A: cycle. One dry tick. */
export const sfxTick = () => play([{ freq: 1100, dur: 0.035 }])

/** B: confirm. Two rising notes. */
export const sfxConfirm = () =>
  play([
    { freq: 880, dur: 0.06 },
    { freq: 1320, dur: 0.06, at: 0.065 },
  ])

/** C: back. Two falling notes. */
export const sfxBack = () =>
  play([
    { freq: 660, dur: 0.06 },
    { freq: 440, dur: 0.07, at: 0.065 },
  ])

/** C with nowhere to go. Short low buzz. */
export const sfxNope = () => play([{ freq: 160, dur: 0.09, gain: 0.9 }])

/** Hatch: five note fanfare. */
export const sfxHatch = () =>
  play([
    { freq: 523, dur: 0.09 },
    { freq: 659, dur: 0.09, at: 0.1 },
    { freq: 784, dur: 0.09, at: 0.2 },
    { freq: 1047, dur: 0.11, at: 0.3 },
    { freq: 1319, dur: 0.26, at: 0.44, wave: 'triangle', gain: 1.2 },
  ])

/** Day/night toggle. Soft click. */
export const sfxClick = () => play([{ freq: 520, dur: 0.025, wave: 'triangle', gain: 0.8 }])

/** Dozing off. Falling sigh. */
export const sfxSigh = () => play([{ freq: 330, to: 200, dur: 0.35, wave: 'triangle', gain: 0.7 }])
