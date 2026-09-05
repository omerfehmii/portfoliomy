import { useEffect, useState } from 'react'
import { ICONS, useTama } from '../store/useTama'
import { profile } from '../content'
import { PixelEgg } from './Glyphs'
import { ICON_LABEL, PAGE_COUNT, SECTION_META, SECTION_ORDER } from './meta'
import { SectionPanel } from './SectionPanel'
import { Callouts } from './Callouts'
import { CALLOUTS } from './calloutDefs'
import { MOBILE_QUERY, useMediaQuery } from './useMediaQuery'
import '../styles/ui.css'

const SPECS: Array<[string, string]> = [
  ['Name', `${profile.firstName} ${profile.lastName}`],
  ['Model', 'Full-stack AI engineer'],
  ['Hatched', `${profile.hatchedYear} · Gebze Technical University`],
  ['Firmware', 'Python · TypeScript · LLMs'],
  ['Status', profile.available ? profile.availableText : 'Fully booked for now'],
]

function useCaption() {
  const mode = useTama((s) => s.mode)
  const cursor = useTama((s) => s.cursor)
  const icon = cursor >= 0 && cursor < ICONS.length ? ICONS[cursor] : null
  if (mode === 'boot') return { kind: 'hint', text: 'Press any button to hatch.' }
  if (mode === 'idle') return { kind: 'fig', text: 'Fig. 1 — The device. Press A to open the menu.' }
  if (mode === 'menu') return { kind: 'hint', text: `A next · B open · C close${icon ? ` — ${ICON_LABEL[icon]}` : ''}` }
  return { kind: 'hint', text: '↑↓ browse · B open · C back' }
}

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
  const caption = useCaption()
  const page = section ? SECTION_META[section].page : 1

  useEffect(() => {
    if (mode === 'section') setHelpOpen(false)
  }, [mode])

  return (
    <div className="ui" data-mode={mode}>
      <Callouts />

      <header className="run-head">
        <p className="run-left">
          <PixelEgg />
          <span className="run-brand">{profile.deviceName}</span>
          <span className="run-sep" aria-hidden="true">·</span>
          <span>owner's manual</span>
        </p>
        <p className="run-center">fig. 1 — the device</p>
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

      <aside className="col col-right" data-open={helpOpen ? 'true' : 'false'} aria-label="Legend and contents">
        <h2 className="col-title">Fig. 1 — parts</h2>
        <ol className="legend">
          {CALLOUTS.map((c) => (
            <li key={c.id}>
              <span className="legend-num">{c.num}</span>
              <span className="legend-part">{c.part}</span>
              <span className="legend-note">{c.note}</span>
            </li>
          ))}
        </ol>

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
        aria-label={helpOpen ? 'Hide legend and contents' : 'Show legend and contents'}
        onClick={() => setHelpOpen((v) => !v)}
      >
        {helpOpen ? '×' : '?'}
      </button>
      {helpOpen && <button type="button" className="scrim" aria-label="Close" onClick={() => setHelpOpen(false)} />}

      <footer className="run-foot">
        <span className="foot-left">p. {page} / {PAGE_COUNT}</span>
        <p className="caption" data-kind={caption.kind} aria-live="polite">{caption.text}</p>
        <span className="foot-right">edition: angel · no. {profile.hatchedYear}-gtu</span>
      </footer>

      <SectionPanel />
    </div>
  )
}
