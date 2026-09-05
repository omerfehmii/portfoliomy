import type { SkillGroup } from './types'

/** A skill group with a Tamagotchi-style care meter (0-5 hearts). */
export interface SkillMeter extends SkillGroup {
  /** Filled hearts out of MAX_HEARTS. */
  level: number
  note: string
}

export const MAX_HEARTS = 5

export const skills: SkillMeter[] = [
  {
    title: 'Languages',
    lcdTitle: 'LANGUAGES',
    level: 5,
    note: 'Where it started: pointers first, types later.',
    items: ['C', 'C++', 'Python', 'TypeScript'],
  },
  {
    title: 'Backend',
    lcdTitle: 'BACKEND',
    level: 4,
    note: 'APIs, schemas and the queue behind them.',
    items: ['FastAPI', 'NestJS', 'Next.js', 'PostgreSQL', 'Supabase', 'Redis'],
  },
  {
    title: 'AI Systems',
    lcdTitle: 'AI SYSTEMS',
    level: 5,
    note: 'Fed daily. Agents are only useful once they are measured.',
    items: ['LLM & multi-agent apps', 'Speech & vision', 'Embeddings & vector search', 'Evals & benchmarking'],
  },
  {
    title: 'Infra & Tools',
    lcdTitle: 'INFRA',
    level: 4,
    note: 'Containers, a terminal and a network that makes sense.',
    items: ['Docker', 'Git', 'Linux', 'CCNA networking'],
  },
  {
    title: 'Frontend',
    lcdTitle: 'FRONTEND',
    level: 3,
    note: 'Enough to ship the dashboard — and the odd Tamagotchi.',
    items: ['Next.js', 'React', 'Three.js'],
  },
]
