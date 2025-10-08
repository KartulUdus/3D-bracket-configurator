import { useMemo } from 'react'
import { Subtraction, Base } from '@react-three/csg'
import * as THREE from 'three'
import type { PlateConfig } from '../types/geometry'

interface PlateProps extends PlateConfig {
  onGeometryReady?: (geometry: THREE.BufferGeometry) => void;
}

/**
 * Parametric base plate with CSG holes and slot
 */
export function Plate(props: PlateProps) {
  const { dims, holes, slot, edgeStyle } = props

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
  }, [dims, holes.count, holes.edgeOffset])

  return (
    <group>
      <Subtraction>
        <Base>
          {edgeStyle === 'fillet' ? (
            // Rounded box for fillet
            <mesh castShadow receiveShadow>
              <boxGeometry args={[dims.width, dims.height, dims.thickness, 8, 8, 1]} />
              <meshStandardMaterial 
                color="#888" 
                metalness={0.6} 
                roughness={0.4}
              />
            </mesh>
          ) : (
            // Regular box
            <mesh castShadow receiveShadow>
              <boxGeometry args={[dims.width, dims.height, dims.thickness]} />
              <meshStandardMaterial 
                color="#888" 
                metalness={0.6} 
                roughness={0.4}
              />
            </mesh>
          )}
        </Base>
        
        {/* Subtract holes */}
        {holePositions.map((pos, i) => (
          <Subtraction key={`hole-${i}`} position={pos}>
            <mesh>
              <cylinderGeometry 
                args={[
                  holes.diameter / 2, 
                  holes.diameter / 2, 
                  dims.thickness * 1.1, 
                  16
                ]} 
              />
            </mesh>
          </Subtraction>
        ))}
        
        {/* Subtract slot if enabled */}
        {slot.enabled && (
          <Subtraction position={[0, 0, 0]}>
            <mesh>
              <boxGeometry 
                args={[slot.length, slot.width, dims.thickness * 1.1]} 
              />
            </mesh>
          </Subtraction>
        )}
      </Subtraction>
    </group>
  )
}

