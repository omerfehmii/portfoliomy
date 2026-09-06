import { useEffect, useState } from 'react'
import { useTama } from '../store/useTama'
import { profile } from '../content'
import { PixelEgg } from './Glyphs'
import { SECTION_META, SECTION_ORDER } from './meta'
import { SectionPanel } from './SectionPanel'
import { MOBILE_QUERY, useMediaQuery } from './useMediaQuery'
import '../styles/ui.css'

const SPECS: Array<[string, string]> = [
  ['Name', `${profile.firstName} ${profile.lastName}`],
  ['Model', 'Computer engineer'],
  ['Hatched', `${profile.hatchedYear} · GTU`],
  ['Firmware', 'Python · TypeScript · LLMs'],
  ['Status', profile.available ? profile.availableText : 'Fully booked for now'],
]

export function Overlay() {
  const mode = useTama((s) => s.mode)
  const section = useTama((s) => s.section)
  const theme = useTama((s) => s.theme)
  const sound = useTama((s) => s.sound)
  const openSection = useTama((s) => s.openSection)
  const toggleTheme = useTama((s) => s.toggleTheme)
  const toggleSound = useTama((s) => s.toggleSound)
  const isMobile = useMediaQuery(MOBILE_QUERY)
  const [helpOpen, setHelpOpen] = useState(false)

  useEffect(() => {
    if (mode === 'section') setHelpOpen(false)
  }, [mode])

  return (
    <div className="ui" data-mode={mode}>
      <header className="run-head">
        <p className="run-left">
          <PixelEgg />
          <span className="run-brand">{profile.deviceName}</span>
          <span className="run-sep run-manual" aria-hidden="true">·</span>
          <span className="run-manual">owner's manual</span>
        </p>
        <p className="run-center" aria-hidden="true" />
        <p className="run-right">
          <span className="stamp" aria-label={profile.availableText}>
            <span aria-hidden="true">open to<br />work</span>
          </span>
        </p>
      </header>

      <section className="col col-left" id="main" data-dim={mode === 'section' && !isMobile ? 'true' : 'false'}>
        <h1 className="greet">
          <span className="greet-1">Congratulations.</span>
          <em className="greet-2">You've found an engineer.</em>
        </h1>
        <p className="greet-sub">Read before use.</p>
        <dl className="spec">
          {SPECS.map(([term, value]) => (
            <div className="spec-row" key={term}>
              <dt>{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <aside className="col col-right" data-open={helpOpen ? 'true' : 'false'} aria-label="Contents">
        <h2 className="col-title">Contents</h2>
        <ol className="contents">
          {SECTION_ORDER.map((id) => (
            <li key={id}>
              <button type="button" onClick={() => openSection(id)} aria-label={`Open ${SECTION_META[id].label}, page ${SECTION_META[id].page}`}>
                <span className="contents-label">{SECTION_META[id].label}</span>
                <span className="contents-page">p. {SECTION_META[id].page}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="switches">
          <button type="button" onClick={toggleTheme} aria-label={`Light is ${theme === 'day' ? 'on' : 'off'}. Toggle day and night.`}>
            light <span>{theme === 'day' ? 'on' : 'off'}</span>
          </button>
          <button type="button" onClick={toggleSound} aria-label={`Sound is ${sound ? 'on' : 'off'}. Toggle sound.`}>
            sound <span>{sound ? 'on' : 'off'}</span>
          </button>
        </div>
      </aside>

      <button
        type="button"
        className="help-toggle"
        aria-expanded={helpOpen}
        aria-label={helpOpen ? 'Hide contents' : 'Show contents'}
        onClick={() => setHelpOpen((v) => !v)}
      >
        {helpOpen ? '×' : '?'}
      </button>
      {helpOpen && <button type="button" className="scrim" aria-label="Close" onClick={() => setHelpOpen(false)} />}

      <SectionPanel />
    </div>
  )
}
