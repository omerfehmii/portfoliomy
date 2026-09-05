import type { IconId, SectionId } from '../store/useTama'

export interface SectionMeta {
  /** Two-digit ordinal used in headers and sticker chips: "02 · SELECTED WORK". */
  index: string
  label: string
  /** Short label for the sticker chips on the status card. */
  short: string
}

export const SECTION_META: Record<SectionId, SectionMeta> = {
  about: { index: '01', label: 'ABOUT ME', short: 'ABOUT' },
  work: { index: '02', label: 'SELECTED WORK', short: 'WORK' },
  stack: { index: '03', label: 'THE STACK', short: 'STACK' },
  journey: { index: '04', label: 'EVOLUTION', short: 'JOURNEY' },
  contact: { index: '05', label: 'CONTACT', short: 'CONTACT' },
  extra: { index: '06', label: 'CARE LOG', short: 'EXTRA' },
}

export const SECTION_ORDER: SectionId[] = ['about', 'work', 'stack', 'journey', 'contact', 'extra']

/** Short name shown in the hint bar for the highlighted menu icon. */
export const ICON_LABEL: Record<IconId, string> = {
  about: 'ABOUT ME',
  work: 'SELECTED WORK',
  stack: 'THE STACK',
  journey: 'EVOLUTION',
  contact: 'CONTACT',
  extra: 'CARE LOG',
  light: 'LIGHT SWITCH',
  sound: 'SOUND',
}
