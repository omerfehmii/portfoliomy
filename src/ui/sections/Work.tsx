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
      <p className="sec-lead">Six things I have shipped, in the order I would talk about them.</p>

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
                  Fig. {PAGE}.{i + 1}
                </span>
                <span className="row-title">{project.title}</span>
                <span className="row-year">{project.year}</span>
              </button>

              <div className="row-body" hidden={!open}>
                <p className="row-role">{project.role}</p>
                <p className="row-summary">{project.summary}</p>
                <p className="row-desc">{project.description}</p>
                {project.highlights && (
                  <ul className="bullets">
                    {project.highlights.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}
                <ul className="tags">
                  {project.tags.map((tag) => (
                    <li key={tag} className="tag">
                      {tag}
                    </li>
                  ))}
                </ul>
                {project.url && (
                  <a
                    className="link-out"
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${project.title} (opens in a new tab)`}
                  >
                    Visit <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      <p className="sec-note">B opens the highlighted figure.</p>
    </div>
  )
}
