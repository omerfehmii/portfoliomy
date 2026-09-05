import { useTama } from '../../store/useTama'
import { journey } from '../../content'
import { StageMark } from '../Glyphs'
import { SECTION_META } from '../meta'
import { useRevealActive, useSectionList } from './useSectionList'

const PAGE = SECTION_META.journey.page

export function Journey() {
  const setSub = useTama((s) => s.setSub)
  const openSection = useTama((s) => s.openSection)
  const active = useSectionList(journey.length, (index) => {
    if (index === journey.length - 1) openSection('contact')
  })
  const rows = useRevealActive<HTMLLIElement>(active)

  return (
    <div className="sec">
      <p className="sec-lead">One creature, six stages. The last one is not mine to unlock.</p>

      <h3 className="sec-sub">Fig. {PAGE}.1 — Evolution chart</h3>
      <ol className="path">
        {journey.map((step, i) => {
          const last = i === journey.length - 1
          return (
            <li
              key={step.period + step.title}
              className="path-step"
              data-active={i === active ? 'true' : 'false'}
              data-stage={step.stage}
              ref={(el) => {
                rows.current[i] = el
              }}
            >
              <div className="path-margin">
                <span className="path-badge" aria-hidden="true">
                  <StageMark stage={step.stage} size={18} />
                </span>
                <span className="path-stage">{step.stage}</span>
                <span className="path-period">{step.period}</span>
              </div>

              <div className="path-content">
                <button
                  type="button"
                  className="path-head"
                  onClick={() => setSub(journey.length, i)}
                  aria-label={`Highlight ${step.title}`}
                >
                  <span className="path-title">{step.title}</span>
                  {step.org && <span className="path-org">{step.org}</span>}
                </button>
                <p className="path-desc">{step.description}</p>
                {step.highlights && (
                  <ul className="bullets">
                    {step.highlights.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}
                {last && (
                  <button type="button" className="btn" onClick={() => openSection('contact')}>
                    Say hi
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
