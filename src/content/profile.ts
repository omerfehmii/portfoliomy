import type { Profile } from './types'

export const profile: Profile = {
  firstName: 'Ömer Fehmi',
  lastName: 'Çakıcı',
  deviceName: 'omergotchi',
  role: 'Full-stack AI engineer in training',
  lcdRole: 'AI ENGINEER',
  headline: ['Feeds on hard problems.', 'Ships end-to-end.'],
  pitch:
    'I am a computer engineering student at Gebze Technical University and I build AI products end to end: the pipeline that collects, the multi-agent LLM system that reads, and the dashboard someone actually opens. Right now that means 10,000+ social items a week, and an AI that runs first-round interviews.',
  intro: [
    'Computer engineering student at GTU.',
    'I build AI products end to end.',
    'Pipelines, agents, dashboards — shipped.',
  ],
  meters: [
    { label: 'Hunger for hard problems', level: 5 },
    { label: 'Shipping', level: 4 },
    { label: 'Sleep', level: 2 },
    { label: 'Coffee', level: 5 },
  ],
  location: 'Türkiye',
  available: true,
  availableText: 'Open to work',
  email: 'omerfehmicakici@gmail.com',
  socials: [
    { label: 'GitHub', url: 'https://github.com/omerfehmii' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/omerfehmi0101/' },
  ],
  hatchedYear: 2021,
}

/** Compact "class" line printed under the name on the status card. */
export const classLine = 'FULL-STACK AI ENGINEER · COMPUTER ENGINEERING @ GTU'

/** School line printed under the name on the status card. */
export const education = {
  degree: 'B.Sc. Computer Engineering',
  school: 'Gebze Technical University',
  short: 'COMPUTER ENGINEERING @ GTU',
  period: '2021 — present',
}

/** Verifiable certificates, shown in the Extra panel. */
export const certificates = [
  {
    title: 'CCNA: Enterprise Networking, Security, and Automation',
    issuer: 'Cisco',
    url: 'https://www.credly.com/badges/cd516371-c709-4efd-bc8a-4873d4ed23c2/public_url',
  },
  {
    title: 'CCNA: Introduction to Networks',
    issuer: 'Cisco',
    url: 'https://www.credly.com/badges/fbfc341d-5353-42c6-a468-f3a8d3feb446/public_url',
  },
]
