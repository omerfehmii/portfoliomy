import * as THREE from 'three'

export const DAY_BG = new THREE.Color('#eef4fc')
/** Seen only through the shell: kept lighter than the page so the device stays legible at night. */
export const NIGHT_BG = new THREE.Color('#2b3752')

/** Damped every frame by Scene; Shell passes it to the transmission material as its buffer background. */
export const sceneBg = DAY_BG.clone()
