import { CALLOUTS } from './calloutDefs'

/** Hairline leaders + numbered badges. Positions are written by three/CalloutTracker.tsx each frame. */
export function Callouts() {
  return (
    <div className="callouts" aria-hidden="true">
      <svg className="callouts-svg" width="100%" height="100%">
        {CALLOUTS.map((c) => (
          <g key={c.id}>
            <line data-callout-line={c.id} x1="0" y1="0" x2="0" y2="0" />
            <circle data-callout-dot={c.id} cx="0" cy="0" r="2.2" />
          </g>
        ))}
      </svg>
      {CALLOUTS.map((c) => (
        <span key={c.id} className="callout-badge" data-callout={c.id}>
          {c.num}
        </span>
      ))}
    </div>
  )
}
