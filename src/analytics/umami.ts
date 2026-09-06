/**
 * Umami: cookieless, no personal data, so the site needs no consent banner —
 * which matters here, because a cookie bar would sit badly on a page that is
 * meant to look like a toy in its packaging.
 *
 * The website id comes from the build environment, so a checkout without
 * `VITE_UMAMI_ID` (a local run, a fork) never injects the collector and never
 * sends anything. See README for the two variables.
 */

const ID = import.meta.env.VITE_UMAMI_ID
const SRC = import.meta.env.VITE_UMAMI_SRC ?? 'https://cloud.umami.is/script.js'

interface Umami {
  track: (name: string, data?: Record<string, string | number>) => void
}

declare global {
  interface Window {
    umami?: Umami
  }
}

let injected = false

/** Adds the collector once. Without an id, analytics simply stays off. */
export function loadAnalytics() {
  if (injected || !ID) return
  injected = true
  const el = document.createElement('script')
  el.async = true
  el.defer = true
  el.src = SRC
  el.dataset.websiteId = ID
  el.dataset.doNotTrack = 'true' // browsers asking not to be tracked are not
  document.head.appendChild(el)
}

/** Fire-and-forget custom event; a no-op until (or unless) the collector loads. */
export function track(name: string, data?: Record<string, string | number>) {
  window.umami?.track(name, data)
}
