import * as THREE from 'three'
import { EGG, radiusAtY } from './eggProfile'

const W = 2048
const H = 1024
const TAU = Math.PI * 2

/**
 * Gold filigree + brand name, drawn in device space and mapped onto the egg's lathe UVs.
 * White = gold, black = nothing (used as alphaMap).
 */
export function makeOrnamentTexture(brand: string) {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.anisotropy = 8

  /** Device (x, y) on the front surface → canvas pixel. */
  const map = (x: number, y: number): [number, number] => {
    const r = Math.max(radiusAtY(y), 1e-4)
    const u = 0.5 + Math.asin(THREE.MathUtils.clamp(x / r, -1, 1)) / TAU
    const v = (y + EGG.ry) / (2 * EGG.ry)
    return [u * W, (1 - v) * H]
  }

  const dot = (x: number, y: number, rad: number) => {
    const [px, py] = map(x, y)
    ctx.beginPath()
    ctx.arc(px, py, rad, 0, TAU)
    ctx.fill()
  }

  const star = (x: number, y: number, size: number) => {
    const [px, py] = map(x, y)
    ctx.beginPath()
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU - Math.PI / 2
      const rr = i % 2 === 0 ? size : size * 0.38
      const sx = px + Math.cos(a) * rr
      const sy = py + Math.sin(a) * rr
      i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy)
    }
    ctx.closePath()
    ctx.fill()
  }

  const curve = (pts: [number, number][], width: number) => {
    ctx.lineWidth = width
    ctx.beginPath()
    const m = pts.map(([x, y]) => map(x, y))
    ctx.moveTo(m[0][0], m[0][1])
    for (let i = 1; i < m.length - 1; i++) {
      const xc = (m[i][0] + m[i + 1][0]) / 2
      const yc = (m[i][1] + m[i + 1][1]) / 2
      ctx.quadraticCurveTo(m[i][0], m[i][1], xc, yc)
    }
    const last = m[m.length - 1]
    ctx.lineTo(last[0], last[1])
    ctx.stroke()
  }

  /** Small spiral curl (1.25 turns) — the classic filigree terminal. */
  const curl = (x: number, y: number, r: number, side: 1 | -1) => {
    ctx.lineWidth = 5
    ctx.beginPath()
    const steps = 40
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const a = t * Math.PI * 2.5 * side
      const rr = r * (1 - t * 0.85)
      const [px, py] = map(x + Math.cos(a) * rr, y + Math.sin(a) * rr)
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
    }
    ctx.stroke()
  }

  const scroll = (side: 1 | -1) => {
    const x = 0.8 * side
    curve(
      [
        [x - 0.04 * side, 0.68],
        [x + 0.08 * side, 0.55],
        [x - 0.06 * side, 0.4],
        [x + 0.07 * side, 0.24],
        [x - 0.05 * side, 0.08],
        [x + 0.06 * side, -0.08],
        [x - 0.03 * side, -0.2],
      ],
      6,
    )
    curl(x - 0.02 * side, 0.74, 0.06, side)
    curl(x - 0.06 * side, -0.26, 0.06, (-side) as 1 | -1)
    for (let i = 0; i < 5; i++) dot(x + 0.16 * side, 0.6 - i * 0.2, 4)
    star(x + 0.02 * side, 0.9, 12)
  }

  const draw = () => {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = '#fff'
    ctx.strokeStyle = '#fff'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // beaded rim following the silhouette, slightly inside the edge
    for (let i = 0; i < 64; i++) {
      const a = (i / 64) * TAU
      const y = 1.17 * Math.sin(a)
      const x = 0.86 * radiusAtY(y) * Math.cos(a)
      dot(x, y, i % 4 === 0 ? 6 : 3.5)
    }

    // ring of dots around the bezel
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * TAU
      dot(Math.cos(a) * 0.66, 0.32 + Math.sin(a) * 0.66, i % 2 === 0 ? 4.5 : 2.5)
    }

    scroll(1)
    scroll(-1)

    // beaded arc under the screen, echoing the bezel
    for (let i = 0; i <= 14; i++) {
      const a = Math.PI + (i / 14) * Math.PI
      dot(Math.cos(a) * 0.74, 0.32 + Math.sin(a) * 0.74 - 0.06, i % 2 === 0 ? 5 : 3)
    }

    // button labels + two small stars
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = '600 46px "IBM Plex Mono", Menlo, monospace'
    const labels: [string, number, number][] = [['A', -0.36, -1.11], ['B', 0, -1.19], ['C', 0.36, -1.11]]
    for (const [label, x, y] of labels) {
      const [px, py] = map(x, y)
      ctx.fillText(label, px, py)
    }
    star(-0.68, -1.0, 7)
    star(0.68, -1.0, 7)

    // brand
    const [bx, by] = map(0, 1.03)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = 'italic 700 92px "Instrument Serif", Georgia, "Times New Roman", serif'
    ctx.fillText(brand, bx, by)
    star(0, 0.86, 9)

    texture.needsUpdate = true
  }

  draw()
  return { texture, redraw: draw }
}
