export interface Social { label: string; url: string }

export interface Profile {
  firstName: string
  lastName: string
  /** Brand printed in gold on the device shell and in the header, e.g. "foliogotchi". */
  deviceName: string
  role: string
  /** Short role for the 48px LCD (≤ 11 chars), e.g. "AI ENGINEER". */
  lcdRole?: string
  /** Two-line hero headline. */
  headline: [string, string]
  /** One-paragraph pitch used on the status card. */
  pitch?: string
  /** Playful Tamagotchi-style meters shown on the status card. */
  meters?: { label: string; level: number; max?: number }[]
  intro: string[]
  location: string
  available: boolean
  availableText: string
  email: string
  socials: Social[]
  /** Year the "creature" hatched (birth year or career start). */
  hatchedYear: number
}

export type ProjectKind = 'experience' | 'project'

export interface Project {
  id: string
  /** Work panel grouping: professional experience first, then projects (CV order). */
  kind: ProjectKind
  title: string
  year: string
  role: string
  summary: string
  description: string
  tags: string[]
  /** Short title for the LCD (≤ 11 chars). Falls back to `title`. */
  lcdTitle?: string
  /** Bullet points shown in the panel. */
  highlights?: string[]
  url?: string
  /** Optional accent for the panel. */
  color?: string
}

export interface SkillGroup {
  title: string
  /** Short title for the LCD (≤ 11 chars). Falls back to `title`. */
  lcdTitle?: string
  items: string[]
  /** 0–5 hearts. */
  level?: number
  note?: string
}

export type Stage = 'egg' | 'baby' | 'child' | 'teen' | 'adult' | 'legend'

export interface JourneyStep {
  stage: Stage
  period: string
  title: string
  /** Short title for the LCD (≤ 11 chars). Falls back to `title`. */
  lcdTitle?: string
  org?: string
  description: string
  highlights?: string[]
}
