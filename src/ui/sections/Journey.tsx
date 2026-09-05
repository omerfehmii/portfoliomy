import { useTama } from '../../store/useTama'
import { journey } from '../../content'
import { StageMark } from '../Glyphs'
import { useRevealActive, useSectionList } from './useSectionList'

export function Journey() {
  const setSub = useTama((s) => s.setSub)
  const openSection = useTama((s) => s.openSection)
  const active = useSectionList(journey.length, (index) => {
    if (index === journey.length - 1) openSection('contact')
  })
  const rows = useRevealActive<HTMLLIElement>(active)

  return (
    <div className="sec">
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
                  <span className="row-title">{step.title}</span>
                  {step.org && <span className="path-org">{step.org}</span>}
                </button>
                <p className="path-desc">{step.description}</p>
                {last && (
                  <button type="button" className="row-link" onClick={() => openSection('contact')}>
                    Say hi →
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
