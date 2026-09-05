import { useTama } from '../../store/useTama'
import { journey } from '../../content'
import { StageMark } from '../Glyphs'
import { useRevealActive, useSectionList } from './useSectionList'

export function Journey() {
  const setSub = useTama((s) => s.setSub)
  const openSection = useTama((s) => s.openSection)
  const active = useSectionList(journey.length)
  const rows = useRevealActive<HTMLLIElement>(active)

  return (
    <div className="sec">
      <p className="sec-lead">One creature, six stages. The last one is not mine to unlock.</p>

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
              <span className="path-badge" aria-hidden="true">
                <StageMark stage={step.stage} size={18} />
              </span>

              <div className="path-content">
                <p className="path-meta">
                  <span className="pixel-tag">{step.stage}</span>
                  <span className="path-period">{step.period}</span>
                </p>
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
