import { useTama } from '../../store/useTama'
import { education, profile } from '../../content'
import { useSectionList } from './useSectionList'

const FACTS: Array<[string, string]> = [
  ['Hatched', `${profile.hatchedYear}`],
  ['Based in', profile.location],
  ['Studying', `${education.degree}, ${education.school} (${education.period})`],
  ['Feeds on', 'Hard problems, end-to-end products'],
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
        I care about the unglamorous parts: whether the pipeline is reproducible, whether the model is measured
        against real labels, and whether the whole thing is cheap enough to keep running. A system is finished when
        someone else can rely on it without me in the room.
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
    </div>
  )
}
