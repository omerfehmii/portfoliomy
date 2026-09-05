import { create } from 'zustand'

/**
 * Global device state. This is the contract between the 3D device, the LCD
 * renderer, the HTML overlay and the sound layer. Keep it small and boring.
 *
 * Tamagotchi semantics: A = cycle / select, B = confirm, C = cancel.
 */
export type SectionId = 'about' | 'work' | 'stack' | 'journey' | 'contact' | 'extra'
export type UtilityId = 'light' | 'sound'
export type IconId = SectionId | UtilityId

/** Icon order on the LCD: first 4 = top row, last 4 = bottom row. */
export const ICONS: readonly IconId[] = [
  'about', 'work', 'stack', 'journey',
  'contact', 'extra', 'light', 'sound',
] as const

export const isSection = (id: IconId): id is SectionId => id !== 'light' && id !== 'sound'

export type Mode = 'boot' | 'idle' | 'menu' | 'section'
export type Mood =
  | 'idle' | 'happy' | 'eating' | 'playing' | 'flexing'
  | 'thinking' | 'waving' | 'excited' | 'sleeping'
export type Theme = 'day' | 'night'
export type Button = 'A' | 'B' | 'C'

const MOOD_FOR_SECTION: Record<SectionId, Mood> = {
  about: 'eating',
  work: 'playing',
  stack: 'flexing',
  journey: 'thinking',
  contact: 'waving',
  extra: 'excited',
}

export interface TamaState {
  mode: Mode
  /** Index into ICONS; -1 when no icon is highlighted (idle). */
  cursor: number
  section: SectionId | null
  /** Sub-navigation inside a section (e.g. which project). */
  subIndex: number
  subCount: number
  mood: Mood
  /** Date.now() when mood last changed. LCD uses it to time mood animations. */
  moodSince: number
  theme: Theme
  sound: boolean
  hatched: boolean
  lastInteraction: number
  /** Last physical/virtual button and a monotonically increasing sequence. 3D + audio react to pressSeq. */
  pressed: Button | null
  pressSeq: number
  /** Increments when B is pressed while inside a section (UI reacts: open link, expand item…). */
  confirmSeq: number

  press: (b: Button) => void
  moveCursor: (dir: 1 | -1) => void
  moveSub: (dir: 1 | -1) => void
  setSub: (count: number, index?: number) => void
  openSection: (id: SectionId) => void
  closeSection: () => void
  toIdle: () => void
  setMood: (m: Mood) => void
  toggleTheme: () => void
  toggleSound: () => void
  touch: () => void
  finishBoot: () => void
}

const wrap = (i: number, n: number) => (n <= 0 ? 0 : ((i % n) + n) % n)

export const useTama = create<TamaState>((set, get) => {
  const now = () => Date.now()
  const feedback = (b: Button | null) => {
    const s = get()
    return { pressed: b, pressSeq: s.pressSeq + 1, lastInteraction: now() }
  }
  const wake = (s: TamaState) =>
    s.mood === 'sleeping' && s.theme === 'day' ? { mood: 'idle' as Mood, moodSince: now() } : {}

  const cycle = (dir: 1 | -1) => {
    const s = get()
    if (s.mode === 'boot') return { mode: 'idle' as Mode, hatched: true }
    if (s.mode === 'idle') return { mode: 'menu' as Mode, cursor: dir > 0 ? 0 : ICONS.length - 1, ...wake(s) }
    if (s.mode === 'menu') return { cursor: wrap(s.cursor + dir, ICONS.length), ...wake(s) }
    return { subIndex: wrap(s.subIndex + dir, s.subCount), ...wake(s) }
  }

  const confirm = () => {
    const s = get()
    if (s.mode === 'boot') return { mode: 'idle' as Mode, hatched: true }
    if (s.mode === 'idle') return { mood: 'happy' as Mood, moodSince: now(), ...wake(s) }
    if (s.mode === 'menu') {
      const id = ICONS[s.cursor]
      if (id === 'light') {
        const theme: Theme = s.theme === 'day' ? 'night' : 'day'
        return { theme, mood: (theme === 'night' ? 'sleeping' : 'idle') as Mood, moodSince: now() }
      }
      if (id === 'sound') return { sound: !s.sound, ...wake(s) }
      return {
        mode: 'section' as Mode,
        section: id,
        subIndex: 0,
        mood: MOOD_FOR_SECTION[id],
        moodSince: now(),
      }
    }
    return { confirmSeq: s.confirmSeq + 1 }
  }

  const cancel = () => {
    const s = get()
    if (s.mode === 'boot') return { mode: 'idle' as Mode, hatched: true }
    if (s.mode === 'section') return { mode: 'menu' as Mode, section: null, mood: 'idle' as Mood, moodSince: now() }
    if (s.mode === 'menu') return { mode: 'idle' as Mode, cursor: -1, ...wake(s) }
    return { ...wake(s) }
  }

  return {
    mode: 'boot',
    cursor: -1,
    section: null,
    subIndex: 0,
    subCount: 1,
    mood: 'idle',
    moodSince: now(),
    theme: 'day',
    sound: true,
    hatched: false,
    lastInteraction: now(),
    pressed: null,
    pressSeq: 0,
    confirmSeq: 0,

    press: (b) => {
      const fb = feedback(b)
      if (b === 'A') set({ ...fb, ...cycle(1) })
      else if (b === 'B') set({ ...fb, ...confirm() })
      else set({ ...fb, ...cancel() })
    },
    moveCursor: (dir) => set({ ...feedback('A'), ...cycle(dir) }),
    moveSub: (dir) => {
      const s = get()
      if (s.mode !== 'section') return set({ ...feedback('A'), ...cycle(dir) })
      set({ ...feedback('A'), subIndex: wrap(s.subIndex + dir, s.subCount) })
    },
    setSub: (count, index) =>
      set((s) => ({ subCount: Math.max(1, count), subIndex: index ?? Math.min(s.subIndex, Math.max(0, count - 1)) })),
    openSection: (id) =>
      set({
        ...feedback(null),
        mode: 'section',
        section: id,
        cursor: ICONS.indexOf(id),
        subIndex: 0,
        mood: MOOD_FOR_SECTION[id],
        moodSince: now(),
      }),
    closeSection: () => set({ ...feedback(null), mode: 'menu', section: null, mood: 'idle', moodSince: now() }),
    toIdle: () => set({ ...feedback(null), mode: 'idle', section: null, cursor: -1 }),
    setMood: (m) => set({ mood: m, moodSince: now() }),
    toggleTheme: () =>
      set((s) => {
        const theme: Theme = s.theme === 'day' ? 'night' : 'day'
        return { theme, mood: theme === 'night' ? 'sleeping' : 'idle', moodSince: now(), lastInteraction: now() }
      }),
    toggleSound: () => set((s) => ({ sound: !s.sound, lastInteraction: now() })),
    touch: () => set((s) => ({ lastInteraction: now(), ...wake(s) })),
    finishBoot: () => set((s) => (s.mode === 'boot' ? { mode: 'idle', hatched: true } : {})),
  }
})
