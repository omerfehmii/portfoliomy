import type { Profile } from './types'

export const profile: Profile = {
  firstName: 'Ömer Fehmi',
  lastName: 'Çakıcı',
  deviceName: 'pocketdev',
  role: 'Full-stack AI engineer in training',
  lcdRole: 'AI ENGINEER',
  headline: ['Feeds on hard problems.', 'Ships end-to-end.'],
  pitch:
    'Most of my work sits where data and language models meet production. The Social Media Intelligence Pipeline reads more than ten thousand posts a week and turns them into brand-collaboration analytics. HirePilot lets an AI run the first interview and rank candidates for a hiring team. In between, an inventory system I built freelance runs every day on a warehouse floor.',
  intro: [
    'Computer engineering student at GTU.',
    'I build AI products end to end: the data pipeline, the model layer, and the interface someone actually uses.',
  ],
  meters: [
    { label: 'Hunger for hard problems', level: 5 },
    { label: 'Shipping', level: 4 },
    { label: 'Sleep', level: 2 },
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
