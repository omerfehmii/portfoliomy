import { useTama } from '../../store/useTama'
import { MAX_HEARTS, skills } from '../../content'
import { Heart } from '../Glyphs'
import { SECTION_META } from '../meta'
import { useRevealActive, useSectionList } from './useSectionList'

const PAGE = SECTION_META.stack.page

export function Stack() {
  const setSub = useTama((s) => s.setSub)
  const active = useSectionList(skills.length)
  const rows = useRevealActive<HTMLLIElement>(active)

  return (
    <div className="sec">
      <ul className="rows">
        {skills.map((group, i) => (
          <li
            key={group.title}
            className="row row-static"
            data-active={i === active ? 'true' : 'false'}
            ref={(el) => {
              rows.current[i] = el
            }}
          >
            <button
              type="button"
              className="row-head"
              onClick={() => setSub(skills.length, i)}
              aria-label={`Highlight ${group.title}`}
            >
              <span className="fig">
                {PAGE}.{i + 1}
              </span>
              <span className="row-title">{group.title}</span>
              <span className="hearts" role="img" aria-label={`${group.level} out of ${MAX_HEARTS}`}>
                {Array.from({ length: MAX_HEARTS }, (_, h) => (
                  <Heart key={h} filled={h < group.level} />
                ))}
              </span>
            </button>
            <div className="row-body">
              <p className="row-meta">{group.items.join(' · ')}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
