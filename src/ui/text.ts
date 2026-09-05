/**
 * Turkish-aware uppercase. Used only for Turkish strings (the owner's name, the
 * location) — English strings are uppercased by CSS so that "i" stays "I".
 */
export const upTr = (s: string) => s.toLocaleUpperCase('tr-TR')

/** Two-digit ordinal: 1 -> "01". */
export const pad2 = (n: number) => String(n).padStart(2, '0')

/** "github.com/omerfehmii" from a full URL. */
export const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
