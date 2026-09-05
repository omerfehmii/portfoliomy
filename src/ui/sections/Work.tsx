import { useTama } from '../../store/useTama'
import { projects } from '../../content'
import { SECTION_META } from '../meta'
import { useRevealActive, useSectionList } from './useSectionList'

const PAGE = SECTION_META.work.page

export function Work() {
  const setSub = useTama((s) => s.setSub)
  const active = useSectionList(projects.length, (index) => {
    const url = projects[index]?.url
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  })
  const rows = useRevealActive<HTMLLIElement>(active)

  return (
    <div className="sec">
      <ol className="rows">
        {projects.map((project, i) => {
          const open = i === active
          return (
            <li
              key={project.id}
              className="row"
              data-active={open ? 'true' : 'false'}
              ref={(el) => {
                rows.current[i] = el
              }}
            >
              <button type="button" className="row-head" aria-expanded={open} onClick={() => setSub(projects.length, i)}>
                <span className="fig">
                  {PAGE}.{i + 1}
                </span>
                <span className="row-title">{project.title}</span>
                <span className="row-year">{project.year}</span>
              </button>

              <div className="row-body" hidden={!open}>
                <p className="row-summary">{project.summary}</p>
                {project.highlights && (
                  <ul className="bullets">
                    {project.highlights.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}
                <p className="row-meta">
                  {project.tags.join(' · ')}
                  {project.url && (
                    <>
                      <span className="row-meta-sep" aria-hidden="true"> · </span>
                      <a
                        className="row-link"
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${project.title} (opens in a new tab)`}
                      >
                        Visit ↗
                      </a>
                    </>
                  )}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
