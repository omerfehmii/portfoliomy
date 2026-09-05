import { profile } from '../content/profile'
import { projects } from '../content/projects'
import { skills } from '../content/skills'
import { journey } from '../content/journey'
import type { Stage } from '../content/types'
import type { SectionId } from '../store/useTama'

/**
 * Single source of truth for what the LCD shows inside a section.
 * The HTML panel and the LCD both derive their lists from content/* in the SAME order,
 * so `state.subIndex` points at the same item on both. Panels must call
 * setSub(lcdItems(section).length) when they mount.
 */
export interface LcdItem {
  /** Big label. ≤ 11 chars fits in one line of 3x5 text; longer titles scroll. */
  title: string
  /** Small second line (year, period, role). */
  line2?: string
  /** Long text scrolled as a marquee at the bottom of the stage. */
  marquee?: string
  /** 0–5 hearts meter (stack). */
  hearts?: number
  /** Evolution stage (journey). */
  stage?: Stage
}

const up = (s: string) => s.toUpperCase()
const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

export function lcdItems(section: SectionId): LcdItem[] {
  switch (section) {
    case 'about':
      return [
        {
          title: up(profile.firstName),
          line2: up(profile.lcdRole ?? profile.role),
          marquee: up(profile.pitch ?? profile.intro.join('  ·  ')),
        },
      ]
    case 'work':
      return projects.map((p) => ({ title: up(p.lcdTitle ?? p.title), line2: p.year, marquee: up(p.summary) }))
    case 'stack':
      return skills.map((g) => ({
        title: up(g.lcdTitle ?? g.title),
        hearts: g.level ?? 4,
        marquee: up(g.items.join(' · ')),
      }))
    case 'journey':
      return journey.map((j) => ({
        title: up(j.lcdTitle ?? j.title),
        line2: j.period,
        stage: j.stage,
        marquee: up(j.org ?? j.description),
      }))
    case 'contact':
      return [
        { title: 'SAY HI!', line2: 'EMAIL', marquee: up(profile.email) },
        ...profile.socials.map((s) => ({ title: up(s.label), line2: 'LINK', marquee: up(host(s.url)) })),
      ]
    case 'extra':
      return [{ title: 'CARE LOG', line2: 'THIS VISIT', marquee: 'THANKS FOR TAKING CARE OF ME' }]
  }
}
