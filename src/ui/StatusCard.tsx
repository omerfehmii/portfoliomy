import { useTama } from '../store/useTama'
import { MAX_HEARTS, classLine, profile } from '../content'
import { Heart, KeyGlyph, SwingGlyph } from './Glyphs'
import { SECTION_META, SECTION_ORDER } from './meta'
import { upTr } from './text'

const CARE: Array<{ key: 'A' | 'B' | 'C'; label: string }> = [
  { key: 'A', label: 'cycle' },
  { key: 'B', label: 'open' },
  { key: 'C', label: 'back' },
]

const FULL_NAME = upTr(`${profile.firstName} ${profile.lastName}`)
const FOOTER = `HATCHED ${profile.hatchedYear} · ${upTr(profile.location)} · NO BATTERIES REQUIRED`

/**
 * The idle/menu face of the right-hand card region: a Tamagotchi status card for
 * the owner. The section panel slides over this same region.
 */
export function StatusCard() {
  const mode = useTama((s) => s.mode)
  const theme = useTama((s) => s.theme)
  const sound = useTama((s) => s.sound)
  const openSection = useTama((s) => s.openSection)
  const toggleTheme = useTama((s) => s.toggleTheme)
  const toggleSound = useTama((s) => s.toggleSound)

  const away = mode === 'section'
  const meters = profile.meters ?? []

  return (
    <section className="card" id="main" data-away={away ? 'true' : 'false'} inert={away} aria-label="Status card">
      <div className="card-scroll">
        <p className="card-eyebrow">PLAYER 01 · STATUS</p>
        <h1 className="card-name">{FULL_NAME}</h1>
        <p className="card-class">{classLine}</p>
        <p className="card-pitch">{profile.pitch}</p>

        <ul className="meters" aria-label="Status meters">
          {meters.map((meter) => {
            const max = meter.max ?? MAX_HEARTS
            return (
              <li className="meter" key={meter.label}>
                <span className="meter-label">{meter.label}</span>
                <span className="meter-rule" aria-hidden="true" />
                <span className="meter-hearts" role="img" aria-label={`${meter.level} out of ${max}`}>
                  {Array.from({ length: max }, (_, i) => (
                    <Heart key={i} filled={i < meter.level} />
                  ))}
                </span>
              </li>
            )
          })}
        </ul>

        <div className="care">
          <p className="care-title">HOW TO CARE</p>
          <ul className="care-keys">
            {CARE.map((row) => (
              <li className="care-key" key={row.key}>
                <KeyGlyph label={row.key} />
                <span className="care-key-label">{row.label}</span>
              </li>
            ))}
            <li className="care-key care-key-drag">
              <span className="glyph-key glyph-key-plain" aria-hidden="true">
                <SwingGlyph />
              </span>
              <span className="care-key-label">drag the egg to swing</span>
            </li>
          </ul>
        </div>

        <nav className="chips" aria-label="Sections">
          {SECTION_ORDER.map((id) => {
            const meta = SECTION_META[id]
            return (
              <button
                key={id}
                type="button"
                className="chip"
                onClick={() => openSection(id)}
                aria-label={`Open section ${meta.index}, ${meta.label}`}
              >
                <span className="chip-num" aria-hidden="true">
                  {meta.index}
                </span>
                <span className="chip-label">{meta.short}</span>
              </button>
            )
          })}
        </nav>

        <div className="card-foot">
          <p className="card-foot-line">{FOOTER}</p>
          <div className="card-toggles">
            <button
              type="button"
              className="toggle"
              onClick={toggleTheme}
              aria-pressed={theme === 'day'}
              aria-label={`Light is ${theme === 'day' ? 'on' : 'off'}. Toggle day and night.`}
            >
              LIGHT <span className="toggle-value">{theme === 'day' ? 'ON' : 'OFF'}</span>
            </button>
            <button
              type="button"
              className="toggle"
              onClick={toggleSound}
              aria-pressed={sound}
              aria-label={`Sound is ${sound ? 'on' : 'off'}. Toggle sound.`}
            >
              SOUND <span className="toggle-value">{sound ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
