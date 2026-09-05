import { Lcd } from '../src/lcd/Lcd'
import { drawLcd } from '../src/lcd/drawLcd'
import { ICONS, useTama, type Mood, type SectionId, type TamaState } from '../src/store/useTama'
import { lcdItems } from '../src/lcd/lcdContent'

const l = new Lcd()

function frame(label: string, patch: Partial<TamaState>, t: number, moodAgo = 0) {
  const base = useTama.getState()
  const s: TamaState = { ...base, ...patch, moodSince: Date.now() - moodAgo * 1000 }
  drawLcd(l, s, t)
  return { label, rows: dump() }
}

function dump() {
  const rows: string[] = []
  for (let y = 0; y < 48; y++) {
    let r = ''
    for (let x = 0; x < 48; x++) r += l.get(x, y) ? '#' : '.'
    rows.push(r)
  }
  return rows
}

function show(items: Array<{ label: string; rows: string[] }>, cols = 3) {
  for (let g = 0; g < items.length; g += cols) {
    const group = items.slice(g, g + cols)
    console.log(group.map((it) => it.label.padEnd(51, ' ')).join(''))
    console.log(group.map(() => '   ' + '0123456789'.repeat(4) + '01234567' + '   ').join(''))
    for (let y = 0; y < 48; y++) {
      console.log(group.map((it) => String(y).padStart(2, ' ') + ' ' + it.rows[y] + '   ').join(''))
    }
    console.log('')
  }
}

const mode = process.argv[2] ?? 'idle'
const out: Array<{ label: string; rows: string[] }> = []

if (mode === 'boot') {
  for (const bt of [0.2, 1.2, 1.95, 2.5, 2.7, 2.95]) out.push(frame('boot t=' + bt, { mode: 'boot' }, bt))
} else if (mode === 'idle') {
  out.push(frame('idle A', { mode: 'idle', cursor: -1, mood: 'idle' }, 0.1))
  out.push(frame('idle B', { mode: 'idle', cursor: -1, mood: 'idle' }, 0.72))
  out.push(frame('idle blink', { mode: 'idle', cursor: -1, mood: 'idle' }, 4.31))
  out.push(frame('menu (stack)', { mode: 'menu', cursor: 2, mood: 'idle' }, 1.0))
  out.push(frame('sleeping night', { mode: 'idle', cursor: -1, mood: 'sleeping', theme: 'night' }, 3.4, 10))
  out.push(frame('screensaver', { mode: 'idle', cursor: -1, mood: 'idle', lastInteraction: Date.now() - 20000 }, 1.4))
} else if (mode === 'moods') {
  const moods: Array<[Mood, number]> = [['happy', 0.35], ['eating', 0.5], ['eating', 1.0], ['playing', 0.4], ['flexing', 0.4], ['flexing', 1.0], ['thinking', 0.3], ['waving', 0.2], ['excited', 0.3]]
  for (const [m, age] of moods) out.push(frame(m + ' @' + age, { mode: 'idle', cursor: -1, mood: m }, 2 + age, age))
} else {
  const sections: SectionId[] = ['about', 'work', 'stack', 'journey', 'contact', 'extra']
  for (const sec of sections) {
    const n = lcdItems(sec).length
    out.push(
      frame(sec + ' 1/' + n, { mode: 'section', section: sec, cursor: ICONS.indexOf(sec), subIndex: 0, subCount: n }, 1.3),
    )
    if (n > 1) out.push(frame(sec + ' ' + n + '/' + n, { mode: 'section', section: sec, cursor: ICONS.indexOf(sec), subIndex: n - 1, subCount: n }, 3.7))
  }
}
show(out)
