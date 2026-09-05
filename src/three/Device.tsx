import { Shell } from './Shell'
import { ScreenAssembly } from './Screen'
import { Buttons } from './Buttons'
import { Wings } from './Wings'

/** Distance from the device centre to the chain attachment point (top of the loop). */
export const ATTACH_OFFSET = 1.43

export function Device() {
  return (
    <group>
      <Shell />
      <ScreenAssembly />
      <Buttons />
      <Wings />
    </group>
  )
}
