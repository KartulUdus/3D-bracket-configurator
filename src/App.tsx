import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import { Leva } from 'leva'
import { type PlateRef } from './components/Plate'
import { Scene } from './components/Scene'
import { ExportDialog } from './components/ExportDialog'

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
            rootWidth: '350px',
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
