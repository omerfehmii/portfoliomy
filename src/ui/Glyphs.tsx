import type { Stage } from '../content'

type Grid = string[]

/** Renders a '#'/'.' grid as 1x1 SVG rects. One SVG unit = one pixel. */
function Pixels({ grid, fill = 'currentColor' }: { grid: Grid; fill?: string }) {
  return (
    <>
      {grid.map((row, y) =>
        row.split('').map((cell, x) =>
          cell === '#' ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} /> : null,
        ),
      )}
    </>
  )
}

/** Keeps only the cells on the silhouette's border — the "outlined" version of a sprite. */
function outline(grid: Grid): Grid {
  const on = (x: number, y: number) => grid[y]?.[x] === '#'
  return grid.map((row, y) =>
    row
      .split('')
      .map((cell, x) => (cell === '#' && (!on(x - 1, y) || !on(x + 1, y) || !on(x, y - 1) || !on(x, y + 1)) ? '#' : '.'))
      .join(''),
  )
}

/** 12x12 pixel egg used as the wordmark. */
export function PixelEgg({ size = 12 }: { size?: number }) {
  const rows: Array<[number, number]> = [
    [4, 4], [3, 6], [2, 8], [2, 8],
    [1, 10], [1, 10], [1, 10], [1, 10],
    [2, 8], [2, 8], [3, 6], [4, 4],
  ]
  return (
    <svg className="glyph-egg" width={size} height={size} viewBox="0 0 12 12" aria-hidden="true" shapeRendering="crispEdges">
      {rows.map(([x, w], y) => (
        <rect key={y} x={x} y={y} width={w} height={1} fill="currentColor" />
      ))}
      <rect x="4" y="5" width="1" height="1" className="glyph-egg-eye" />
      <rect x="7" y="5" width="1" height="1" className="glyph-egg-eye" />
    </svg>
  )
}

const HEART: Grid = ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...']
const HEART_OUTLINE = outline(HEART)

/** Care-meter heart, drawn as pixels: solid when filled, hollow when empty. */
export function Heart({ filled, size = 14 }: { filled: boolean; size?: number }) {
  return (
    <svg
      className="glyph-heart"
      data-filled={filled ? 'true' : 'false'}
      width={size}
      height={(size / 7) * 6}
      viewBox="0 0 7 6"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <Pixels grid={filled ? HEART : HEART_OUTLINE} />
    </svg>
  )
}

/** Round key cap with a letter, matching the device's A/B/C buttons. */
export function KeyGlyph({ label }: { label: string }) {
  return (
    <span className="glyph-key" aria-hidden="true">
      {label}
    </span>
  )
}

const SWING: Grid = [
  '...#...',
  '...#...',
  '..###..',
  '.#####.',
  '.#####.',
  '..###..',
  '.#...#.',
]

/** A little egg on a chain — the "drag me" affordance. */
export function SwingGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg className="glyph-swing" width={size} height={size} viewBox="0 0 7 7" aria-hidden="true" shapeRendering="crispEdges">
      <Pixels grid={SWING} />
    </svg>
  )
}

const STAGE_PIXELS: Record<Stage, Grid> = {
  egg: ['..###..', '.#####.', '.#####.', '#######', '#######', '.#####.', '..###..'],
  baby: ['...#...', '..###..', '.#####.', '.#####.', '.#####.', '..#.#..', '..#.#..'],
  child: ['..#.#..', '..###..', '.#####.', '#######', '.#####.', '..#.#..', '.##.##.'],
  teen: ['..###..', '.#####.', '#.###.#', '#######', '..###..', '..#.#..', '.##.##.'],
  adult: ['.#.#.#.', '..###..', '.#####.', '#.###.#', '#######', '..#.#..', '.##.##.'],
  legend: ['.#.#.#.', '..###..', '#######', '.#####.', '#######', '..#.#..', '.##.##.'],
}

/** Tiny pixel silhouette for an evolution stage. */
export function StageMark({ stage, size = 21 }: { stage: Stage; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 7 7" aria-hidden="true" shapeRendering="crispEdges">
      <Pixels grid={STAGE_PIXELS[stage]} />
    </svg>
  )
}
