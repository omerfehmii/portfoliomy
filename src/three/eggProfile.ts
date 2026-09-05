import * as THREE from 'three'

/** Egg body parameters (world units). Width ~2.0, height 2.6, depth ~1.0. */
export const EGG = { rx: 1.0, ry: 1.3, e: 0.16, zScale: 0.5 } as const

/** Horizontal radius of the (unflattened) egg at height y. */
export function radiusAtY(y: number) {
  const c = THREE.MathUtils.clamp(y / EGG.ry, -1, 1)
  const s = Math.sqrt(Math.max(0, 1 - c * c))
  return EGG.rx * s * (1 - EGG.e * c)
}

/** z of the front surface at (x, y). Returns 0 when (x, y) is outside the silhouette. */
export function frontZ(x: number, y: number) {
  const r = radiusAtY(y)
  const d = r * r - x * x
  return d <= 0 ? 0 : EGG.zScale * Math.sqrt(d)
}

/** Lathe profile from bottom (y = -ry) to top (y = +ry), as (radius, y). */
export function eggProfile(segments = 96): THREE.Vector2[] {
  const pts: THREE.Vector2[] = []
  for (let i = 0; i <= segments; i++) {
    const th = Math.PI - (i / segments) * Math.PI
    const c = Math.cos(th)
    const s = Math.sin(th)
    pts.push(new THREE.Vector2(EGG.rx * s * (1 - EGG.e * c), EGG.ry * c))
  }
  return pts
}

/** Flattened egg. UV: u wraps around with u=0.5 at the front centre, v=0 bottom → v=1 top. */
export function eggGeometry(latheSegments = 160, profileSegments = 120) {
  const g = new THREE.LatheGeometry(eggProfile(profileSegments), latheSegments)
  g.rotateY(Math.PI)
  g.scale(1, 1, EGG.zScale)
  g.computeVertexNormals()
  return g
}

/** Jagged "starburst" bezel outline around a square window (like the reference device). */
export function starburstShape(half = 0.43, perEdge = 4, spike = 0.12, window = 0.36) {
  const corners: [number, number][] = [
    [-half, -half],
    [half, -half],
    [half, half],
    [-half, half],
  ]
  const pts: [number, number][] = []
  for (let c = 0; c < 4; c++) {
    const [ax, ay] = corners[c]
    const [bx, by] = corners[(c + 1) % 4]
    const ex = bx - ax
    const ey = by - ay
    const len = Math.hypot(ex, ey)
    const nx = ey / len
    const ny = -ex / len // outward normal for CCW square
    let px = ax
    let py = ay
    pts.push([ax, ay])
    for (let i = 1; i <= perEdge; i++) {
      const qx = ax + (ex * i) / perEdge
      const qy = ay + (ey * i) / perEdge
      const h = spike * (i % 2 === 0 ? 1 : 0.8)
      pts.push([(px + qx) / 2 + nx * h, (py + qy) / 2 + ny * h])
      if (i < perEdge) pts.push([qx, qy])
      px = qx
      py = qy
    }
    // corner spike (diagonal)
    pts.push([Math.sign(bx) * (half + spike * 0.95), Math.sign(by) * (half + spike * 0.95)])
  }
  const shape = new THREE.Shape()
  pts.forEach(([x, y], i) => (i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)))
  shape.closePath()
  // window for the LCD
  const hole = new THREE.Path()
  hole.moveTo(-window, -window)
  hole.lineTo(-window, window)
  hole.lineTo(window, window)
  hole.lineTo(window, -window)
  hole.closePath()
  shape.holes.push(hole)
  return shape
}

/** Right-hand angel wing silhouette, base at x=0, tip toward +x. Mirror with scale.x = -1 for the left. */
export function wingShape() {
  const s = new THREE.Shape()
  s.moveTo(0, 0.14)
  s.bezierCurveTo(0.1, 0.3, 0.32, 0.34, 0.46, 0.22)
  s.quadraticCurveTo(0.36, 0.17, 0.44, 0.06)
  s.quadraticCurveTo(0.32, 0.03, 0.36, -0.09)
  s.quadraticCurveTo(0.23, -0.09, 0.22, -0.2)
  s.quadraticCurveTo(0.1, -0.13, 0, -0.1)
  s.lineTo(0, 0.14)
  return s
}
