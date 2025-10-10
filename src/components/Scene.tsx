import { Bounds } from '@react-three/drei'
import { Plate, type PlateRef } from './Plate'
import { SceneLighting } from './SceneLighting'
import { GroundPlane } from './GroundPlane'
import { CameraControls } from './CameraControls'
import { usePlateControls } from '../hooks/usePlateControls'

interface SceneProps {
  plateRef: React.RefObject<PlateRef | null>
}

/**
 * Scene component
 * Orchestrates the 3D scene by composing lighting, camera, ground plane, and the main plate model
 */
export function Scene({ plateRef }: SceneProps) {
  const plateConfig = usePlateControls()

  return (
    <>
      <SceneLighting />
      
      {/* Bounds: auto-frame the model (margin for max 300mm object) */}
      <Bounds fit clip observe margin={1.5}>
        <Plate ref={plateRef} {...plateConfig} />
      </Bounds>
      
      <GroundPlane />
      <CameraControls />
    </>
  )
}

