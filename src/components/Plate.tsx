import { useMemo } from 'react'
import { Geometry, Subtraction, Base } from '@react-three/csg'
import * as THREE from 'three'
import type { PlateConfig } from '../types/geometry'

interface PlateProps extends PlateConfig {
  onGeometryReady?: (geometry: THREE.BufferGeometry) => void;
}

/**
 * Parametric base plate with CSG holes and slot
 */
export function Plate(props: PlateProps) {
  const { dims, holes, slot } = props

  // Calculate hole positions in a grid around the edges
  const holePositions = useMemo(() => {
    const positions: [number, number, number][] = []
    const { width, height } = dims
    const { count, edgeOffset } = holes
    
    // Distribute holes around the perimeter
    const holesPerSide = Math.ceil(count / 4)
    
    for (let i = 0; i < count; i++) {
      const side = Math.floor(i / holesPerSide) % 4
      const indexOnSide = i % holesPerSide
      
      let x = 0
      let y = 0
      
      if (side === 0) { // Top
        x = -width/2 + edgeOffset + (indexOnSide * (width - 2*edgeOffset) / (holesPerSide - 1 || 1))
        y = height/2 - edgeOffset
      } else if (side === 1) { // Right
        x = width/2 - edgeOffset
        y = height/2 - edgeOffset - (indexOnSide * (height - 2*edgeOffset) / (holesPerSide - 1 || 1))
      } else if (side === 2) { // Bottom
        x = width/2 - edgeOffset - (indexOnSide * (width - 2*edgeOffset) / (holesPerSide - 1 || 1))
        y = -height/2 + edgeOffset
      } else { // Left
        x = -width/2 + edgeOffset
        y = -height/2 + edgeOffset + (indexOnSide * (height - 2*edgeOffset) / (holesPerSide - 1 || 1))
      }
      
      positions.push([x, y, 0])
    }
    
    return positions
  }, [dims, holes])

  return (
    <mesh castShadow receiveShadow>
      <Geometry>
        <Base>
          <boxGeometry args={[dims.width, dims.height, dims.thickness]} />
        </Base>
        
        {/* Subtract holes */}
        {holePositions.map((pos, i) => (
          <Subtraction key={`hole-${i}`} position={pos} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry 
              args={[
                holes.diameter / 2, 
                holes.diameter / 2, 
                dims.thickness * 1.2, 
                16
              ]}
            />
          </Subtraction>
        ))}
        
        {/* Subtract slot if enabled */}
        {slot.enabled && (
          <Subtraction position={[0, 0, 0]}>
            <boxGeometry 
              args={[slot.length, slot.width, dims.thickness * 1.2]} 
            />
          </Subtraction>
        )}
      </Geometry>
      
      {/* Material applied to the final CSG result */}
      <meshStandardMaterial 
        color="#888" 
        metalness={0.6} 
        roughness={0.4}
      />
    </mesh>
  )
}

