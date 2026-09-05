import { useTama } from '../../store/useTama'
import { education, profile } from '../../content'
import { SECTION_META } from '../meta'
import { useSectionList } from './useSectionList'

const PAGE = SECTION_META.about.page

const FACTS: Array<[string, string]> = [
  ['Hatched', `${profile.hatchedYear}`],
  ['Based in', profile.location],
  ['Studying', `${education.degree}, ${education.school} (${education.period})`],
  ['Feeds on', 'Hard problems, end-to-end products, coffee'],
  ['Status', profile.available ? profile.availableText : 'Fully booked for now'],
]

export function About() {
  const setMood = useTama((s) => s.setMood)
  useSectionList(1, () => setMood('eating'))

  return (
    <div className="sec">
      <p className="sec-lead">{profile.intro.join(' ')}</p>

      <p className="sec-p">{profile.pitch}</p>
      <p className="sec-p">
        The part I like is the whole path: the collection, the model, the evaluation, and the screen someone actually
        opens. A multi-agent system is only interesting once you can measure whether it is right, and only useful once
        somebody can use it without me in the room.
      </p>
      <p className="sec-p">
        So far that has meant two internships — logistics traceability at LC Waikiki, profitability analytics at
        Halkbank — a freelance inventory system that is live on a warehouse floor, and two projects of my own that keep
        growing.
      </p>

      <h3 className="sec-sub">Table {PAGE}.1 — Specifications</h3>
      <dl className="facts">
        {FACTS.map(([term, value]) => (
          <div className="facts-row" key={term}>
            <dt>{term}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <h3 className="sec-sub">{PAGE}.2 — Test button</h3>
      <button type="button" className="btn" onClick={() => setMood('eating')} aria-label="Feed the creature">
        Feed me
      </button>
      <p className="sec-note">B does this too. It has been a long scroll.</p>
    </div>
  )
}
