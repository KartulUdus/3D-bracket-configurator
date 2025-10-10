import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * GroundPlane component
 * Renders a checkered ground plane sized for max 300x300mm objects
 */
export function GroundPlane() {
  // Generate checkered texture
  const texture = useMemo(() => {
    const size = 512
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    
    const context = canvas.getContext('2d')
    if (!context) return null
    
    const squareSize = size / 8 // 8x8 checkerboard
    
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        context.fillStyle = (i + j) % 2 === 0 ? '#404040' : '#2a2a2a'
        context.fillRect(i * squareSize, j * squareSize, squareSize, squareSize)
      }
    }
    
    const canvasTexture = new THREE.CanvasTexture(canvas)
    canvasTexture.wrapS = THREE.RepeatWrapping
    canvasTexture.wrapT = THREE.RepeatWrapping
    canvasTexture.repeat.set(3, 3)
    
    return canvasTexture
  }, [])

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[3, 3]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

