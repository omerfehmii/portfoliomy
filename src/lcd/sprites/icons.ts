import { sprite, type Sprite } from '../Lcd'
import { ICONS, type IconId } from '../../store/useTama'

/**
 * 8x8 menu icons, one per entry of ICONS.
 * Authored so each silhouette stays readable at 1 bit, both normally and
 * knocked out of the inverted 10x10 selection box.
 */
export const ICON_SPRITES: Record<IconId, Sprite> = {
  // Mug of coffee with two steam wisps — what this one runs on.
  about: sprite([
    '..#..#..',
    '.#..#...',
    '........',
    '######..',
    '#....###',
    '#....#.#',
    '#....###',
    '.####...',
  ]),
  // Briefcase with a handle and a centre clasp.
  work: sprite([
    '..####..',
    '..#..#..',
    '########',
    '#......#',
    '###..###',
    '#......#',
    '########',
    '........',
  ]),
  // Ascending bar chart on a baseline.
  stack: sprite([
    '......##',
    '......##',
    '...##.##',
    '...##.##',
    '##.##.##',
    '##.##.##',
    '##.##.##',
    '########',
  ]),
  // Two footprints stepping up to the right (wide toes, narrow heels).
  journey: sprite([
    '....###.',
    '....###.',
    '.....##.',
    '.....#..',
    '.###....',
    '.###....',
    '.##.....',
    '.#......',
  ]),
  // Speech bubble with a three dot ellipsis and a tail.
  contact: sprite([
    '.######.',
    '########',
    '##.#.#.#',
    '########',
    '.######.',
    '.##.....',
    '.#......',
    '........',
  ]),
  // Five pointed star.
  extra: sprite([
    '...##...',
    '...##...',
    '########',
    '.######.',
    '..####..',
    '..#..#..',
    '.##..##.',
    '........',
  ]),
  // Light bulb: glass with a filament, screw base, tip.
  light: sprite([
    '..####..',
    '.#....#.',
    '#..##..#',
    '#......#',
    '.#....#.',
    '..####..',
    '...##...',
    '...##...',
  ]),
  // Eighth note with a flag.
  sound: sprite([
    '....###.',
    '....#.##',
    '....#..#',
    '....#...',
    '....#...',
    '..###...',
    '.#####..',
    '..###...',
  ]),
}

/** Icons resolved into ICONS order once, so the hot path is a plain array index. */
export const ICON_LIST: readonly Sprite[] = ICONS.map((id) => ICON_SPRITES[id])

/** 3x3 "muted" marker shown in the stage corner when sound is off. */
export const XMARK = sprite(['#.#', '.#.', '#.#'])
