import type { IconId, SectionId } from '../store/useTama'

export interface SectionMeta {
  /** Two-digit ordinal: "02". */
  index: string
  /** Sentence-case title used on the page: "Selected work". */
  label: string
  /** Manual page number (the cover is p. 1). */
  page: number
}

export const SECTION_META: Record<SectionId, SectionMeta> = {
  about: { index: '01', label: 'About me', page: 2 },
  work: { index: '02', label: 'Selected work', page: 3 },
  stack: { index: '03', label: 'The stack', page: 4 },
  journey: { index: '04', label: 'Evolution', page: 5 },
  contact: { index: '05', label: 'Contact', page: 6 },
  extra: { index: '06', label: 'Care log', page: 7 },
}

export const PAGE_COUNT = 7

export const SECTION_ORDER: SectionId[] = ['about', 'work', 'stack', 'journey', 'contact', 'extra']

/** Short name shown in the caption for the highlighted menu icon. */
export const ICON_LABEL: Record<IconId, string> = {
  about: 'About me',
  work: 'Selected work',
  stack: 'The stack',
  journey: 'Evolution',
  contact: 'Contact',
  extra: 'Care log',
  light: 'Light switch',
  sound: 'Sound',
}
