import { sprite, type Sprite } from '../Lcd'

/**
 * Everything the human holds, sits at, or is decorated with, plus the shell he
 * hatched from. Sprites only — all timing lives in the scenes.
 */

/* ------------------------------------------------------------------ hatch -- */

/** 14x18 egg for the boot sequence, with two speckles. */
export const EGG = sprite([
  '.....####.....',
  '....######....',
  '...########...',
  '..##########..',
  '.############.',
  '.############.',
  '##############',
  '##############',
  '###..####..###',
  '##############',
  '##############',
  '######..######',
  '##############',
  '##############',
  '##############',
  '.############.',
  '..##########..',
  '...########...',
])

/**
 * Crack zigzags, blitted over the egg with `invert: true` so their ink carves
 * a white split. Three growth steps, right to left.
 */
export const CRACKS: readonly Sprite[] = [
  sprite([
    '.........#...#',
    '........#.#.#.',
    '...........#..',
  ]),
  sprite([
    '.....#...#...#',
    '....#.#.#.#.#.',
    '.......#...#..',
  ]),
  sprite([
    '.#...#...#...#',
    '#.#.#.#.#.#.#.',
    '...#...#...#..',
  ]),
]

/** Broken shell chunk left behind after hatching. */
export const SHELL = sprite([
  '#..#',
  '#.##',
  '####',
])

/* ------------------------------------------------------------- the props -- */

/** 5x4 cup with a handle, held in one hand. */
export const CUP = sprite([
  '####.',
  '#..#.',
  '#..##',
  '.##..',
])

/** 10x12 mug with a handle and two rising wisps — the about-section widget. */
export const MUG = sprite([
  '..#....#..',
  '.#....#...',
  '..#..#....',
  '..........',
  '#########.',
  '#.......#.',
  '#.......##',
  '#.......#.',
  '#.......##',
  '#.......#.',
  '#########.',
  '.#######..',
])

/**
 * 13x7 laptop the human types on. Blitted opaque so it sits *in front of* him;
 * the scene draws the code lines inside rows 1..3, columns 2..10.
 */
export const LAPTOP = sprite([
  '.###########.',
  '.#.........#.',
  '.#.........#.',
  '.#.........#.',
  '.###########.',
  '#############',
  '..#########..',
])

/**
 * 14x13 monitor on a stand — the work-section widget. Also blitted opaque, with
 * the scene drawing code lines inside rows 1..6, columns 2..11.
 */
export const MONITOR = sprite([
  '##############',
  '#............#',
  '#............#',
  '#............#',
  '#............#',
  '#............#',
  '#............#',
  '#............#',
  '##############',
  '.....####.....',
  '.....####.....',
  '...########...',
  '..##########..',
])

/** 5x3 dumbbell for the 12px figure. */
export const DUMBBELL_S = sprite([
  '##.##',
  '#####',
  '##.##',
])

/** 7x3 dumbbell. */
export const DUMBBELL = sprite([
  '##...##',
  '#######',
  '##...##',
])

/** 5x5 heart, filled. */
export const HEART = sprite([
  '.#.#.',
  '#####',
  '#####',
  '.###.',
  '..#..',
])

/** 5x5 heart, outline only — an empty care meter. */
export const HEART_OUT = sprite([
  '.#.#.',
  '#.#.#',
  '#...#',
  '.#.#.',
  '..#..',
])

/** 3x3 sparkle. */
export const SPARK = sprite([
  '.#.',
  '###',
  '.#.',
])

/** 5x5 twinkle for the hatch. */
export const SPARK_BIG = sprite([
  '..#..',
  '..#..',
  '#####',
  '..#..',
  '..#..',
])

/** 6x6 crescent moon, shown at night while asleep. */
export const MOON = sprite([
  '..###.',
  '.###..',
  '.##...',
  '.##...',
  '.###..',
  '..###.',
])

/** 5x6 idea bulb blinking over the head while thinking. */
export const BULB = sprite([
  '.###.',
  '#...#',
  '#.#.#',
  '#...#',
  '.###.',
  '.###.',
])
