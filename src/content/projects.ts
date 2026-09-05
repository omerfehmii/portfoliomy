import type { Project } from './types'

const GITHUB = 'https://github.com/omerfehmii'

export const projects: Project[] = [
  {
    id: 'hirepilot',
    title: 'HirePilot',
    lcdTitle: 'HIREPILOT',
    year: '2025 - NOW',
    role: 'Product + full-stack + AI systems',
    summary: 'A B2B recruitment platform where an AI conducts the live first interview and ranks the candidates.',
    description:
      'Companies invite candidates, the candidate joins a real-time interview conducted by AI, and a decision engine scores and ranks everyone against the role. I built the whole product surface: company dashboard, candidate flow, the live interview itself, notifications, team invites and usage quotas.',
    highlights: [
      'Multi-agent interview system: separate AI roles plan the interview, ask, listen and adapt to the answers and the CV.',
      'Decision engine that scores and ranks candidates so a hiring team can compare them side by side.',
      'Full B2B surface: dashboards, candidate flow, notifications, team invites, usage quotas.',
    ],
    tags: ['Multi-agent LLM', 'Real-time', 'Next.js', 'FastAPI', 'PostgreSQL'],
    url: GITHUB,
  },
  {
    id: 'social-intel',
    title: 'Social Media Intelligence Pipeline',
    lcdTitle: 'SOCIAL INTEL',
    year: '2026 - NOW',
    role: 'Data + AI engineering',
    summary:
      'Monitors a curated panel of social accounts and turns ephemeral content into brand-collaboration analytics.',
    description:
      'Content that disappears in 24 hours becomes a durable, queryable archive. Collection runs unattended around the clock, and every item carries its provenance. On top of the archive sits a multi-modal reading stack: visual frames, speech transcription and LLM readers that detect sponsorships, promo mechanics and brand mentions.',
    highlights: [
      '10,000+ new items a week from 270+ accounts, collected 24/7 with a durable archive and full provenance.',
      'Multi-modal analysis: visual frames + speech transcription + LLM readers for sponsorships, promo mechanics and brand mentions.',
      'Reproducible processing, accuracy measured against human-labeled benchmarks, per-item LLM cost tuned roughly 15x down.',
    ],
    tags: ['Data pipeline', 'LLM evaluation', 'Speech + vision', 'Python', 'Cost engineering'],
    url: GITHUB,
  },
  {
    id: 'airbagsepeti-inventory',
    title: 'Airbagsepeti Inventory System',
    lcdTitle: 'INVENTORY',
    year: '2026',
    role: 'Freelance software developer',
    summary: 'A unit-level inventory system for an auto-parts retailer, in production on the warehouse floor.',
    description:
      'Every single part is tracked as its own unit: a QR-coded label, a shelf and location, and a full history of every stock movement it has been through. Warehouse, sales and management each see their own slice through role-based access, and the whole thing is a mobile-friendly PWA because the people using it are holding a phone, not sitting at a desk.',
    highlights: [
      'QR-coded item labels with shelf and location tracking and a complete stock-movement history.',
      'Role-based access for warehouse, sales and management.',
      'Mobile-friendly PWA used on the warehouse floor; in production.',
    ],
    tags: ['Freelance', 'Inventory', 'PWA', 'PostgreSQL', 'Role-based access'],
  },
  {
    id: 'halkbank-profitability',
    title: 'Halkbank Profitability Analytics',
    lcdTitle: 'HALKBANK',
    year: '2026',
    role: 'Computer engineering intern',
    summary: 'Software for analyzing and tracking banking profitability inside a national bank.',
    description:
      'Built during my internship at HALKBANK: tooling that analyzes and tracks profitability across banking operations. The work focused on solutions that improve the accuracy and reliability of financial processes, where a wrong number is expensive and a slow number is useless.',
    highlights: [
      'Analyzed and tracked banking profitability across financial operations.',
      'Delivered solutions improving the accuracy and reliability of financial processes.',
    ],
    tags: ['Internship', 'Fintech', 'Data analysis', 'Reporting'],
  },
  {
    id: 'lcw-logistics',
    title: 'LC Waikiki Logistics Traceability',
    lcdTitle: 'LC WAIKIKI',
    year: '2025',
    role: 'Computer engineering intern',
    summary: 'A project improving the visibility and traceability of logistics operations at retail scale.',
    description:
      'My first internship, on the logistics side of a retailer that moves a great deal of stock. The project made operations legible: tasks tracked through the processing lifecycle, so anyone could answer where something was and what had already happened to it.',
    highlights: [
      'Improved visibility and traceability across logistics operations.',
      'Task tracking through the processing lifecycle.',
    ],
    tags: ['Internship', 'Logistics', 'Traceability', 'Retail scale'],
  },
  {
    id: 'bike-demand',
    title: 'Bike Rental Demand Forecasting',
    lcdTitle: 'DATATHON',
    year: '2023',
    role: '3rd place, Develhope Datathon',
    summary: 'A Python optimization model forecasting bike-rental demand. Third place out of 50+ teams.',
    description:
      'A datathon entry built under time pressure: model the demand for a bike-rental network and optimize the fleet against it. It placed third among more than fifty teams, and it is where I learned that a clean feature and an honest validation split beat a clever model most of the time.',
    highlights: [
      '3rd place out of 50+ teams at the Develhope Datathon 2023.',
      'Python optimization model for demand forecasting.',
    ],
    tags: ['Python', 'Forecasting', 'Optimization', 'Competition'],
    url: GITHUB,
  },
]
