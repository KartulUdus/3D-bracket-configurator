/**
 * SceneLighting component
 * Encapsulates all lighting setup for the 3D scene
 */
export function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[3, 5, 3]} 
        intensity={1.1} 
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={15}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
    </>
  )
}

