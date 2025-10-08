import { Canvas } from '@react-three/fiber'
import { OrbitControls, AdaptiveDpr, AdaptiveEvents, Bounds } from '@react-three/drei'
import { Leva, useControls } from 'leva'
import { Plate } from './components/Plate'
import { DEFAULT_PLATE_CONFIG } from './types/geometry'
import type { EdgeStyle } from './types/geometry'

function Scene() {
  // Basic Leva controls for testing Increment 2
  const config = useControls({
    width: { value: DEFAULT_PLATE_CONFIG.dims.width, min: 0.1, max: 0.5, step: 0.01 },
    height: { value: DEFAULT_PLATE_CONFIG.dims.height, min: 0.1, max: 0.5, step: 0.01 },
    thickness: { value: DEFAULT_PLATE_CONFIG.dims.thickness, min: 0.005, max: 0.05, step: 0.001 },
    holeCount: { value: DEFAULT_PLATE_CONFIG.holes.count, min: 2, max: 8, step: 1 },
    holeDiameter: { value: DEFAULT_PLATE_CONFIG.holes.diameter, min: 0.004, max: 0.02, step: 0.001 },
    edgeOffset: { value: DEFAULT_PLATE_CONFIG.holes.edgeOffset, min: 0.01, max: 0.05, step: 0.001 },
    cornersFirst: { value: DEFAULT_PLATE_CONFIG.holes.cornersFirst, label: 'Corners First' },
    topFirst: { value: DEFAULT_PLATE_CONFIG.holes.topFirst, label: 'Top First' },
    slotEnabled: DEFAULT_PLATE_CONFIG.slot.enabled,
    slotLength: { value: DEFAULT_PLATE_CONFIG.slot.length, min: 0.02, max: 0.15, step: 0.01 },
    slotWidth: { value: DEFAULT_PLATE_CONFIG.slot.width, min: 0.005, max: 0.03, step: 0.001 },
    edgeStyle: { 
      value: DEFAULT_PLATE_CONFIG.edgeStyle, 
      options: ['none', 'chamfer', 'fillet'] as EdgeStyle[]
    },
    edgeRadius: { value: DEFAULT_PLATE_CONFIG.edgeRadius, min: 0.001, max: 0.01, step: 0.0005 },
  })

  const plateConfig = {
    dims: {
      width: config.width,
      height: config.height,
      thickness: config.thickness,
    },
    holes: {
      count: config.holeCount,
      diameter: config.holeDiameter,
      edgeOffset: config.edgeOffset,
      cornersFirst: config.cornersFirst,
      topFirst: config.topFirst,
    },
    slot: {
      enabled: config.slotEnabled,
      length: config.slotLength,
      width: config.slotWidth,
    },
    edgeStyle: config.edgeStyle,
    edgeRadius: config.edgeRadius,
    materialKey: 'steel',
  }

  return (
    <>
      {/* Lighting */}
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
      
      {/* Bounds: auto-frame the model */}
      <Bounds fit clip observe margin={1.2}>
        <Plate {...plateConfig} />
      </Bounds>
      
      {/* Ground plane */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Camera controls */}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.1}
        minDistance={0.2}
        maxDistance={2}
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
    </>
  )
}

function App() {
  return (
    <div className="relative h-screen w-full">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-xl font-bold">Bracket Configurator</h1>
        </div>
      </header>
      
      {/* 3D Canvas */}
      <div className="canvas-wrap h-full w-full" style={{ touchAction: 'none' }}>
        <Canvas
          shadows
          dpr={[1, Math.min(2, window.devicePixelRatio)]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          camera={{ position: [2, 2, 2], fov: 50 }}
          style={{ touchAction: 'none' }}
        >
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <Scene />
        </Canvas>
      </div>
      
      {/* Leva Controls */}
      <Leva 
        collapsed={true}
        theme={{
          sizes: {
            rootWidth: '280px',
          }
        }}
        titleBar={{
          position: { x: 0, y: 50 }
        }}
      />
    </div>
  )
}

export default App
