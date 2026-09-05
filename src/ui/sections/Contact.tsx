import { useTama } from '../../store/useTama'
import { profile } from '../../content'
import { SECTION_META } from '../meta'
import { host } from '../text'
import { useRevealActive, useSectionList } from './useSectionList'

const PAGE = SECTION_META.contact.page

/** Contract: the list is [email, ...socials] — same order as lcdItems('contact'). */
const LINKS = [
  { label: 'Email', value: profile.email, url: `mailto:${profile.email}`, external: false },
  ...profile.socials.map((s) => ({ label: s.label, value: host(s.url), url: s.url, external: true })),
]

export function Contact() {
  const setSub = useTama((s) => s.setSub)
  const active = useSectionList(LINKS.length, (index) => {
    const link = LINKS[index]
    if (!link) return
    if (link.external) window.open(link.url, '_blank', 'noopener,noreferrer')
    else window.location.href = link.url
  })
  const rows = useRevealActive<HTMLLIElement>(active)

  return (
    <div className="sec">
      <p className="sec-lead">
        Say hi. Internships, junior roles, freelance work or a question about one of the projects — all welcome. I read
        everything and answer within a couple of days.
      </p>

      <h3 className="sec-sub">Table {PAGE}.1 — Support channels</h3>
      <ul className="rows contact-list">
        {LINKS.map((link, i) => (
          <li
            key={link.label}
            className="row contact-row"
            data-active={i === active ? 'true' : 'false'}
            ref={(el) => {
              rows.current[i] = el
            }}
          >
            <a
              className="contact-link"
              href={link.url}
              {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              onFocus={() => setSub(LINKS.length, i)}
              onClick={() => setSub(LINKS.length, i)}
              aria-label={`${link.label}: ${link.value}${link.external ? ' (opens in a new tab)' : ''}`}
            >
              <span className="fig">
                {PAGE}.{i + 1}
              </span>
              <span className="row-title">{link.label}</span>
              <span className="contact-value">{link.value}</span>
              <span className="contact-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>

      <dl className="facts">
        <div className="facts-row">
          <dt>Based in</dt>
          <dd>{profile.location}</dd>
        </div>
        <div className="facts-row">
          <dt>Response time</dt>
          <dd>Usually within a couple of days</dd>
        </div>
        <div className="facts-row">
          <dt>Status</dt>
          <dd>{profile.available ? profile.availableText : 'Fully booked for now'}</dd>
        </div>
      </dl>

      <p className="sec-note">B opens the highlighted channel.</p>
    </div>
  )
}
