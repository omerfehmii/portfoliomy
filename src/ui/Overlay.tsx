import { ICONS, useTama } from '../store/useTama'
import { profile } from '../content'
import { PixelEgg } from './Glyphs'
import { ICON_LABEL } from './meta'
import { SectionPanel } from './SectionPanel'
import { StatusCard } from './StatusCard'
import '../styles/ui.css'

function useHint() {
  const mode = useTama((s) => s.mode)
  const cursor = useTama((s) => s.cursor)
  const icon = cursor >= 0 && cursor < ICONS.length ? ICONS[cursor] : null

  if (mode === 'boot') return { text: 'PRESS ANY BUTTON TO HATCH', accent: null }
  if (mode === 'idle') return { text: 'PRESS A TO OPEN THE MENU', accent: null }
  if (mode === 'menu') return { text: 'A NEXT · B OPEN · C CLOSE', accent: icon ? ICON_LABEL[icon] : null }
  return { text: '↑↓ BROWSE · B OPEN · C BACK', accent: null }
}

/**
 * The HTML half of the toy: a top bar, one card region on the right (status card
 * or section panel) and a little LCD hint pill under the device. The device owns
 * the left half of the screen and is never dimmed or moved by the overlay.
 */
export function Overlay() {
  const mode = useTama((s) => s.mode)
  const hint = useHint()

  return (
    <div className="ui" data-mode={mode}>
      <header className="topbar">
        <p className="brand">
          <span className="brand-mark">
            <PixelEgg />
          </span>
          <span className="brand-name">{profile.deviceName}</span>
        </p>

        <p className="topbar-mono">POCKET PORTFOLIO · v1.0</p>

        <p className="sticker" data-on={profile.available ? 'true' : 'false'}>
          <span className="sticker-text">{profile.availableText}</span>
        </p>
      </header>

      <StatusCard />
      <SectionPanel />

      <p className="hint" aria-live="polite">
        <span>{hint.text}</span>
        {hint.accent && <span className="hint-accent">{hint.accent}</span>}
      </p>
    </div>
  )
}
