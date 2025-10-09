import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, AdaptiveDpr, AdaptiveEvents, Bounds } from '@react-three/drei'
import { Leva, useControls, button } from 'leva'
import { Plate, type PlateRef } from './components/Plate'
import { ExportDialog } from './components/ExportDialog'
import { DEFAULT_PLATE_CONFIG_MM } from './types/geometry'
import type { EdgeStyle } from './types/geometry'
import { getMaterialOptions } from './materials/useMaterials'

interface SceneProps {
  plateRef: React.RefObject<PlateRef | null>
}

function Scene({ plateRef }: SceneProps) {
  // Leva controls for all plate parameters (in millimeters)
  const [config, set] = useControls(() => ({
    // Material
    material: { 
      value: DEFAULT_PLATE_CONFIG_MM.materialKey, 
      options: getMaterialOptions(),
      label: 'Material'
    },
    
    // Dimensions (in mm, max 300x300x300)
    width: { 
      value: DEFAULT_PLATE_CONFIG_MM.dims.width, 
      min: 10, 
      max: 300, 
      step: 1,
      label: 'Width (mm)'
    },
    height: { 
      value: DEFAULT_PLATE_CONFIG_MM.dims.height, 
      min: 10, 
      max: 300, 
      step: 1,
      label: 'Height (mm)'
    },
    thickness: { 
      value: DEFAULT_PLATE_CONFIG_MM.dims.thickness, 
      min: 1, 
      max: 300, 
      step: 1,
      label: 'Thickness (mm)'
    },
    
    // Holes
    holeCount: { 
      value: DEFAULT_PLATE_CONFIG_MM.holes.count, 
      min: 2, 
      max: 8, 
      step: 1,
      label: 'Hole Count'
    },
    holeTopDiameter: { 
      value: DEFAULT_PLATE_CONFIG_MM.holes.topDiameter, 
      min: 2, 
      max: 100, 
      step: 1,
      label: 'Hole Top ⌀ (mm)'
    },
    holeBottomDiameter: { 
      value: DEFAULT_PLATE_CONFIG_MM.holes.bottomDiameter, 
      min: 2, 
      max: 100, 
      step: 1,
      label: 'Hole Bottom ⌀ (mm)'
    },
    'Untaper Holes': button((get) => {
      const topDiameter = get('holeTopDiameter') as number
      const bottomDiameter = get('holeBottomDiameter') as number
      const smallerDiameter = Math.min(topDiameter, bottomDiameter)
      set({ 
        holeTopDiameter: smallerDiameter,
        holeBottomDiameter: smallerDiameter
      })
    }),
    edgeOffset: { 
      value: DEFAULT_PLATE_CONFIG_MM.holes.edgeOffset, 
      min: 5, 
      max: 100, 
      step: 1,
      label: 'Edge Offset (mm)'
    },
    cornersFirst: { 
      value: DEFAULT_PLATE_CONFIG_MM.holes.cornersFirst, 
      label: 'Corners First' 
    },
    topFirst: { 
      value: DEFAULT_PLATE_CONFIG_MM.holes.topFirst, 
      label: 'Top First' 
    },
    
    // Slot
    slotEnabled: { 
      value: DEFAULT_PLATE_CONFIG_MM.slot.enabled,
      label: 'Slot Enabled'
    },
    slotLength: { 
      value: DEFAULT_PLATE_CONFIG_MM.slot.length, 
      min: 10, 
      max: 150, 
      step: 1,
      label: 'Slot Length (mm)'
    },
    slotWidth: { 
      value: DEFAULT_PLATE_CONFIG_MM.slot.width, 
      min: 2, 
      max: 150, 
      step: 1,
      label: 'Slot Width (mm)'
    },
    
    // Edges
    edgeStyle: { 
      value: DEFAULT_PLATE_CONFIG_MM.edgeStyle, 
      options: ['none', 'chamfer', 'fillet'] as EdgeStyle[],
      label: 'Edge Style'
    },
    edgeRadius: { 
      value: DEFAULT_PLATE_CONFIG_MM.edgeRadius, 
      min: 1, 
      max: 10, 
      step: 1,
      label: 'Edge Radius (mm)'
    },
  }))

  // Convert mm to meters for Three.js
  const plateConfig = {
    dims: {
      width: config.width / 1000,
      height: config.height / 1000,
      thickness: config.thickness / 1000,
    },
    holes: {
      count: config.holeCount,
      diameter: config.holeTopDiameter / 1000, // Use top diameter as default
      topDiameter: config.holeTopDiameter / 1000,
      bottomDiameter: config.holeBottomDiameter / 1000,
      edgeOffset: config.edgeOffset / 1000,
      cornersFirst: config.cornersFirst,
      topFirst: config.topFirst,
    },
    slot: {
      enabled: config.slotEnabled,
      length: config.slotLength / 1000,
      width: config.slotWidth / 1000,
    },
    edgeStyle: config.edgeStyle,
    edgeRadius: config.edgeRadius / 1000,
    materialKey: config.material,
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
      
      {/* Bounds: auto-frame the model (margin for max 300mm object) */}
      <Bounds fit clip observe margin={1.5}>
        <Plate ref={plateRef} {...plateConfig} />
      </Bounds>
      
      {/* Ground plane - sized for max 300x300mm objects */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[3, 3]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Camera controls */}
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
    </>
  )
}

function App() {
  const plateRef = useRef<PlateRef>(null)

  const handleGetMesh = () => {
    return plateRef.current?.getMesh() || null
  }

  return (
    <div className="relative h-screen w-full">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">Bracket Configurator</h1>
          <ExportDialog onGetMesh={handleGetMesh} />
        </div>
      </header>
      
      {/* 3D Canvas */}
      <div className="canvas-wrap h-full w-full" style={{ touchAction: 'none' }}>
        <Canvas
          shadows
          dpr={[1, Math.min(2, window.devicePixelRatio)]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          camera={{ position: [2.5, 2.5, 2.5], fov: 50 }}
          style={{ touchAction: 'none' }}
        >
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <Scene plateRef={plateRef} />
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
