import { useTama } from '../../store/useTama'
import { MAX_HEARTS, skills } from '../../content'
import { Heart } from '../Glyphs'
import { useRevealActive, useSectionList } from './useSectionList'

export function Stack() {
  const setSub = useTama((s) => s.setSub)
  const active = useSectionList(skills.length)
  const rows = useRevealActive<HTMLLIElement>(active)

  return (
    <div className="sec">
      <p className="sec-lead">Care meters, honestly filled. Five hearts means I would happily do it all day.</p>

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
              <span className="pixel-tag">{group.lcdTitle ?? group.title}</span>
              <span className="row-title">{group.title}</span>
              <span className="hearts" role="img" aria-label={`${group.level} out of ${MAX_HEARTS}`}>
                {Array.from({ length: MAX_HEARTS }, (_, h) => (
                  <Heart key={h} filled={h < group.level} />
                ))}
              </span>
            </button>

            <div className="row-body">
              <ul className="tags">
                {group.items.map((item) => (
                  <li key={item} className="tag">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="row-note">{group.note}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
