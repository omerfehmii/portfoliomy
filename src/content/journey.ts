import type { JourneyStep } from './types'

export const journey: JourneyStep[] = [
  {
    stage: 'egg',
    period: '2021',
    title: 'Hatched at GTU',
    lcdTitle: 'HATCHED',
    org: 'Gebze Technical University',
    description:
      'Started a B.Sc. in Computer Engineering. C, pointers, and the slow discovery that the interesting part is always the system around the algorithm.',
  },
  {
    stage: 'baby',
    period: '2023',
    title: 'First trophy',
    lcdTitle: 'TROPHY',
    org: 'Develhope Datathon · Cisco CCNA',
    description:
      'Third place out of 50+ teams at the Develhope Datathon with a Python optimization model for bike-rental demand. The same stretch brought both CCNA certificates, so the networking layer stopped being a black box.',
    highlights: ['3rd place, Develhope Datathon 2023', 'CCNA: Introduction to Networks', 'CCNA: Enterprise Networking, Security, and Automation'],
  },
  {
    stage: 'child',
    period: '2025',
    title: 'First internship',
    lcdTitle: 'INTERNSHIP',
    org: 'LC Waikiki · 07/2025 - 08/2025',
    description:
      'A summer inside real logistics operations, working on visibility and traceability: tasks tracked through the processing lifecycle so the warehouse and the office finally saw the same picture.',
  },
  {
    stage: 'teen',
    period: '2026',
    title: 'First product in production',
    lcdTitle: 'SHIPPED',
    org: 'Airbagsepeti · 05/2026 - 07/2026',
    description:
      'A freelance unit-level inventory system for an auto-parts retailer, and the first thing I built that other people depend on every day: QR-coded labels, shelf tracking, full stock-movement history, live on the warehouse floor.',
  },
  {
    stage: 'adult',
    period: '2026',
    title: 'Shipping AI products',
    lcdTitle: 'AI PRODUCTS',
    org: 'Halkbank internship · HirePilot · Social Intel',
    description:
      'An internship at HALKBANK on banking profitability analytics, while HirePilot grew into a full B2B platform with an AI interviewer and the Social Media Intelligence Pipeline started reading 10,000+ items a week.',
  },
  {
    stage: 'legend',
    period: '????',
    title: 'Next evolution: your team?',
    lcdTitle: 'YOUR TEAM?',
    org: 'Open to work',
    description:
      'This one is unlocked by someone else. If you are building something where data pipelines and LLM systems have to actually work in production, say hi.',
  },
]
