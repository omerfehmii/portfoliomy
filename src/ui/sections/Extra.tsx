import { useEffect, useState } from 'react'
import { useTama } from '../../store/useTama'
import { certificates, profile } from '../../content'
import { PixelEgg } from '../Glyphs'
import { useSectionList } from './useSectionList'

/** Captured once per page load, so the log covers the whole visit. */
const VISIT_START = Date.now()

const clock = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000))
  const mm = String(Math.floor(total / 60)).padStart(2, '0')
  const ss = String(total % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export function Extra() {
  const mood = useTama((s) => s.mood)
  const theme = useTama((s) => s.theme)
  const sound = useTama((s) => s.sound)
  const presses = useTama((s) => s.pressSeq)
  const hatched = useTama((s) => s.hatched)
  const [elapsed, setElapsed] = useState(() => Date.now() - VISIT_START)
  useSectionList(1)

  useEffect(() => {
    const id = window.setInterval(() => setElapsed(Date.now() - VISIT_START), 1000)
    return () => window.clearInterval(id)
  }, [])

  const stats: Array<[string, string]> = [
    ['TIME ON SITE', clock(elapsed)],
    ['BUTTONS PRESSED', String(presses).padStart(3, '0')],
    ['CURRENT MOOD', mood],
    ['LIGHT', theme === 'day' ? 'DAY' : 'NIGHT'],
    ['SOUND', sound ? 'ON' : 'OFF'],
    ['SHELL', hatched ? 'HATCHED' : 'INTACT'],
  ]

  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="sec">
      <p className="sec-lead">A care log for this visit. It resets when you leave, like most good habits.</p>

      <dl className="stats">
        {stats.map(([term, value]) => (
          <div className="stat" key={term}>
            <dt>{term}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <section className="cert" aria-label="Certificate of care">
        <p className="cert-kicker">CERTIFICATE OF CARE</p>
        <p className="cert-body">
          This visitor kept the creature company for <strong>{clock(elapsed)}</strong> and pressed its buttons{' '}
          <strong>{presses}</strong> times. No creatures were neglected in the making of this portfolio.
        </p>
        <div className="cert-foot">
          <span className="cert-sign">
            <span className="cert-egg">
              <PixelEgg />
            </span>
            {profile.deviceName}
          </span>
          <span>{today}</span>
        </div>
      </section>

      <h3 className="sec-sub">Paperwork</h3>
      <ul className="link-list">
        <li>
          <a className="link-out" href="/cv.pdf" aria-label="Download CV as PDF">
            DOWNLOAD CV <span aria-hidden="true">↗</span>
          </a>
        </li>
        {certificates.map((cert) => (
          <li key={cert.url}>
            <a
              className="link-out"
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${cert.title}, verified by ${cert.issuer} (opens in a new tab)`}
            >
              {cert.title} <span aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="sec-note">CV: one page, no clip art. Certificates: verifiable on Credly.</p>
    </div>
  )
}
