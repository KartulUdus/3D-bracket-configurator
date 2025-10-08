import { useMemo } from 'react'
import { Geometry, Subtraction, Base } from '@react-three/csg'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import type { PlateConfig } from '../types/geometry'

interface PlateProps extends PlateConfig {
  onGeometryReady?: (geometry: THREE.BufferGeometry) => void;
}

/**
 * Parametric base plate with CSG holes and slot
 */
export function Plate(props: PlateProps) {
  const { dims, holes, slot, edgeStyle, edgeRadius } = props

  // Calculate hole positions based on count and placement preferences
  const holePositions = useMemo(() => {
    const positions: [number, number, number][] = []
    const { width, height } = dims
    const { count, edgeOffset, cornersFirst, topFirst } = holes
    
    // Define corner positions
    const corners = [
      { x: -width/2 + edgeOffset, y: height/2 - edgeOffset, name: 'top-left' },
      { x: width/2 - edgeOffset, y: height/2 - edgeOffset, name: 'top-right' },
      { x: width/2 - edgeOffset, y: -height/2 + edgeOffset, name: 'bottom-right' },
      { x: -width/2 + edgeOffset, y: -height/2 + edgeOffset, name: 'bottom-left' },
    ]
    
    // Define edge-middle positions with opposite-sides pairing
    // topFirst = true: top, bottom, left, right (vertical pairs first)
    // topFirst = false: left, right, top, bottom (horizontal pairs first)
    const edgeMidpoints = topFirst ? [
      { x: 0, y: height/2 - edgeOffset, name: 'top-middle' },
      { x: 0, y: -height/2 + edgeOffset, name: 'bottom-middle' },
      { x: -width/2 + edgeOffset, y: 0, name: 'left-middle' },
      { x: width/2 - edgeOffset, y: 0, name: 'right-middle' },
    ] : [
      { x: -width/2 + edgeOffset, y: 0, name: 'left-middle' },
      { x: width/2 - edgeOffset, y: 0, name: 'right-middle' },
      { x: 0, y: height/2 - edgeOffset, name: 'top-middle' },
      { x: 0, y: -height/2 + edgeOffset, name: 'bottom-middle' },
    ]
    
    // Reorder corners based on topFirst toggle
    const orderedCorners = topFirst ? corners : [...corners].reverse()
    
    // Build placement array based on cornersFirst preference
    const placements = cornersFirst 
      ? [...orderedCorners, ...edgeMidpoints]
      : [...edgeMidpoints, ...orderedCorners]
    
    // Take the first N positions
    for (let i = 0; i < Math.min(count, placements.length); i++) {
      const placement = placements[i]
      if (placement) {
        positions.push([placement.x, placement.y, 0])
      }
    }
    
    return positions
  }, [dims, holes])

  // Create base geometry based on edge style
  const baseGeometry = useMemo(() => {
    if (edgeStyle === 'fillet') {
      // Use RoundedBoxGeometry for fillets
      // RoundedBoxGeometry(width, height, depth, segments, radius)
      return new RoundedBoxGeometry(
        dims.width, 
        dims.height, 
        dims.thickness, 
        4, // segments
        edgeRadius
      )
    } else if (edgeStyle === 'chamfer') {
      // Chamfer is similar to fillet but with smaller radius
      return new RoundedBoxGeometry(
        dims.width, 
        dims.height, 
        dims.thickness, 
        2, // fewer segments for sharper chamfer
        edgeRadius * 0.7
      )
    }
    return new THREE.BoxGeometry(dims.width, dims.height, dims.thickness)
  }, [dims, edgeStyle, edgeRadius])

  // Create slot geometry with rounded edges
  // Increase dimensions by 2x edgeRadius to maintain minimum slot size
  // Use extra thickness (2.5x) to ensure clean CSG subtraction at any plate thickness
  const slotGeometry = useMemo(() => {
    const slotEdgeRadius = edgeRadius * 0.7
    return new RoundedBoxGeometry(
      slotEdgeRadius * 2 + slot.length,
      slotEdgeRadius * 2 + slot.width,
      dims.thickness * 2,
      4, // segments
      slotEdgeRadius
    )
  }, [slot.length, slot.width, dims.thickness, edgeRadius])

  return (
    <mesh castShadow receiveShadow>
      <Geometry>
        <Base geometry={baseGeometry} />
        
        {/* Subtract holes */}
        {holePositions.map((pos, i) => (
          <Subtraction key={`hole-${i}`} position={pos} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry 
              args={[
                holes.topDiameter / 2, 
                holes.bottomDiameter / 2, 
                dims.thickness * 1.2, 
                16
              ]}
            />
          </Subtraction>
        ))}
        
        {/* Subtract slot if enabled */}
        {slot.enabled && (
          <Subtraction position={[0, 0, dims.thickness / 2]} geometry={slotGeometry} />
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

