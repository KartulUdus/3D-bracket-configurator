import { useEffect } from 'react'
import { useControls, button } from 'leva'
import { DEFAULT_PLATE_CONFIG_MM } from '../types/geometry'
import type { EdgeStyle, PlateConfig } from '../types/geometry'
import { getMaterialOptions } from '../materials/useMaterials'

/**
 * Custom hook that manages all Leva controls for plate configuration
 * Handles unit conversion from millimeters to meters and constraint validation
 */
export function usePlateControls(): PlateConfig {
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
  // Safely extract values with fallbacks (Leva button breaks type inference)
  type LevaConfig = Record<string, unknown>
  const typedConfig = config as LevaConfig
  const width = (typedConfig.width as number | undefined) ?? DEFAULT_PLATE_CONFIG_MM.dims.width
  const height = (typedConfig.height as number | undefined) ?? DEFAULT_PLATE_CONFIG_MM.dims.height
  const slotLength = (typedConfig.slotLength as number | undefined) ?? DEFAULT_PLATE_CONFIG_MM.slot.length
  const slotWidth = (typedConfig.slotWidth as number | undefined) ?? DEFAULT_PLATE_CONFIG_MM.slot.width

  // Apply slot size constraints (with 10mm clearance)
  useEffect(() => {
    const maxSlotLength = width - 10
    const maxSlotWidth = height - 10
    
    if (slotLength > maxSlotLength && maxSlotLength >= 10) {
      set({ slotLength: Math.max(10, maxSlotLength) })
    }
    
    if (slotWidth > maxSlotWidth && maxSlotWidth >= 2) {
      set({ slotWidth: Math.max(2, maxSlotWidth) })
    }
  }, [width, height, slotLength, slotWidth, set])
  
  // Return configuration in meters (Three.js units)
  return {
    dims: {
      width: width / 1000,
      height: height / 1000,
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
      length: slotLength / 1000,
      width: slotWidth / 1000,
    },
    edgeStyle: config.edgeStyle,
    edgeRadius: config.edgeRadius / 1000,
    materialKey: config.material,
  }
}

