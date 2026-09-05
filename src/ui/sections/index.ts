import type { ComponentType } from 'react'
import type { SectionId } from '../../store/useTama'
import { About } from './About'
import { Work } from './Work'
import { Stack } from './Stack'
import { Journey } from './Journey'
import { Contact } from './Contact'
import { Extra } from './Extra'

export const SECTION_VIEWS: Record<SectionId, ComponentType> = {
  about: About,
  work: Work,
  stack: Stack,
  journey: Journey,
  contact: Contact,
  extra: Extra,
}
