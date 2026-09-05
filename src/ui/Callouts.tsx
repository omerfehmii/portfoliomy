import { CALLOUTS } from './calloutDefs'

/** Hairline leaders + numbered badges. Positions are written by three/CalloutTracker.tsx each frame (transforms only). */
export function Callouts() {
  return (
    <div className="callouts" aria-hidden="true">
      {CALLOUTS.map((c) => (
        <span key={`l-${c.id}`} className="callout-line" data-callout-line={c.id} />
      ))}
      {CALLOUTS.map((c) => (
        <span key={`d-${c.id}`} className="callout-dot" data-callout-dot={c.id} />
      ))}
      {CALLOUTS.map((c) => (
        <span key={c.id} className="callout-badge" data-callout={c.id}>
          {c.num}
        </span>
      ))}
    </div>
  )
}
