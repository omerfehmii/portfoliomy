import { useTama } from '../../store/useTama'
import { education, profile } from '../../content'
import { useSectionList } from './useSectionList'

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
      <h3 className="sec-sub">Specifications</h3>
      <dl className="facts">
        {FACTS.map(([term, value]) => (
          <div className="facts-row" key={term}>
            <dt>{term}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <button type="button" className="row-link" onClick={() => setMood('eating')} aria-label="Feed the creature">
        Feed me →
      </button>
    </div>
  )
}
