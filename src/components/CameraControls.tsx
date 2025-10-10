import { OrbitControls } from '@react-three/drei'

/**
 * CameraControls component
 * Configures orbit controls for camera interaction
 */
export function CameraControls() {
  return (
    <OrbitControls
      makeDefault
      enableDamping
      dampingFactor={0.1}
      minDistance={0.3}
      maxDistance={3}
      maxPolarAngle={Math.PI * 0.49}
      enablePan={true}
      panSpeed={0.5}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
      touches={{
        ONE: 0, // TOUCH.ROTATE - one finger rotates
        TWO: 2  // TOUCH.DOLLY_PAN - two fingers zoom/pan
      }}
    />
  )
}

