import { useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Material preset type definition
 */
export interface MaterialPreset {
  key: 'oak' | 'walnut' | 'wood' | 'diamond_plate' | 'brushed_metal' | 'painted_metal';
  label: string;
  maps: {
    color: string;
    normal?: string;
    roughness?: string;
    metalness?: string;
    ao?: string;
    displacement?: string;
  };
  props?: Partial<THREE.MeshStandardMaterialParameters>;
}

/**
 * Material presets with texture paths
 * 3 Wood materials + 3 Metal materials
 */
export const MATERIALS: readonly MaterialPreset[] = [
  // Wood Materials
  {
    key: 'oak',
    label: 'American Oak',
    maps: {
      color: '/textures/american_oak_2-4K/4K-american_oak_2_basecolor.png',
      normal: '/textures/american_oak_2-4K/4K-american_oak_2_normal.png',
      roughness: '/textures/american_oak_2-4K/4K-american_oak_2_roughness.png',
      metalness: '/textures/american_oak_2-4K/4K-american_oak_2_metallic.png',
      ao: '/textures/american_oak_2-4K/4K-american_oak_2_ao.png',
      displacement: '/textures/american_oak_2-4K/4K-american_oak_2_height.png',
    },
    props: {
      metalness: 0.0,
      roughness: 0.8,
    },
  },
  {
    key: 'walnut',
    label: 'American Walnut',
    maps: {
      color: '/textures/american_walnut_1-4K/4K-american_walnut_1_basecolor.png',
      normal: '/textures/american_walnut_1-4K/4K-american_walnut_1_normal.png',
      roughness: '/textures/american_walnut_1-4K/4K-american_walnut_1_roughness.png',
    },
    props: {
      metalness: 0.0,
      roughness: 0.8,
    },
  },
  {
    key: 'wood',
    label: 'Wood Planks',
    maps: {
      color: '/textures/Wood050_4K-JPG/Wood050_4K_Color.jpg',
      normal: '/textures/Wood050_4K-JPG/Wood050_4K_NormalGL.jpg',
      roughness: '/textures/Wood050_4K-JPG/Wood050_4K_Roughness.jpg',
      displacement: '/textures/Wood050_4K-JPG/Wood050_4K_Displacement.jpg',
    },
    props: {
      metalness: 0.0,
      roughness: 0.85,
    },
  },
  // Metal Materials
  {
    key: 'diamond_plate',
    label: 'Diamond Plate',
    maps: {
      color: '/textures/DiamondPlate006D_4K-JPG/DiamondPlate006D_4K_Color.jpg',
      normal: '/textures/DiamondPlate006D_4K-JPG/DiamondPlate006D_4K_NormalGL.jpg',
      roughness: '/textures/DiamondPlate006D_4K-JPG/DiamondPlate006D_4K_Roughness.jpg',
      metalness: '/textures/DiamondPlate006D_4K-JPG/DiamondPlate006D_4K_Metalness.jpg',
      ao: '/textures/DiamondPlate006D_4K-JPG/DiamondPlate006D_4K_AmbientOcclusion.jpg',
      displacement: '/textures/DiamondPlate006D_4K-JPG/DiamondPlate006D_4K_Displacement.jpg',
    },
    props: {
      metalness: 0.3,
      roughness: 0.4,
    },
  },
  {
    key: 'brushed_metal',
    label: 'Brushed Metal',
    maps: {
      color: '/textures/Metal003_4K-JPG/Metal003_4K_Color.jpg',
      normal: '/textures/Metal003_4K-JPG/Metal003_4K_NormalGL.jpg',
      roughness: '/textures/Metal003_4K-JPG/Metal003_4K_Roughness.jpg',
      metalness: '/textures/Metal003_4K-JPG/Metal003_4K_Metalness.jpg',
      displacement: '/textures/Metal003_4K-JPG/Metal003_4K_Displacement.jpg',
    },
    props: {
      metalness: 0.4,
      roughness: 0.9,
    },
  },
  {
    key: 'painted_metal',
    label: 'Painted Metal',
    maps: {
      color: '/textures/PaintedMetal001_4K-JPG/PaintedMetal001_4K_Color.jpg',
      normal: '/textures/PaintedMetal001_4K-JPG/PaintedMetal001_4K_NormalGL.jpg',
      roughness: '/textures/PaintedMetal001_4K-JPG/PaintedMetal001_4K_Roughness.jpg',
      metalness: '/textures/PaintedMetal001_4K-JPG/PaintedMetal001_4K_Metalness.jpg',
      displacement: '/textures/PaintedMetal001_4K-JPG/PaintedMetal001_4K_Displacement.jpg',
    },
    props: {
      metalness: 0.9,
      roughness: 0.2,
    },
  },
] as const

export type MaterialKey = (typeof MATERIALS)[number]['key']

/**
 * Hook to load and configure material textures
 * @param materialKey - The key of the material preset to use
 * @param renderer - Optional renderer to set texture anisotropy
 */
export function useMaterials(
  materialKey: MaterialKey,
  renderer?: THREE.WebGLRenderer
) {
  // Find the selected material preset (guaranteed to exist)
  const preset = useMemo(
    () => MATERIALS.find((m) => m.key === materialKey) ?? MATERIALS[0]!,
    [materialKey]
  )

  // Build texture path array for useTexture hook
  const texturePaths = useMemo(() => {
    const paths: string[] = []
    const { maps } = preset!
    
    paths.push(maps.color)
    if (maps.normal) paths.push(maps.normal)
    if (maps.roughness) paths.push(maps.roughness)
    if (maps.metalness) paths.push(maps.metalness)
    if (maps.ao) paths.push(maps.ao)
    if (maps.displacement) paths.push(maps.displacement)
    
    return paths
  }, [preset])

  // Load all textures
  const loadedTextures = useTexture(texturePaths)
  
  // Parse loaded textures into a map
  const textureMap = useMemo(() => {
    const textures = Array.isArray(loadedTextures) 
      ? loadedTextures 
      : [loadedTextures]
    
    const map = {
      color: textures[0],
      normal: undefined as THREE.Texture | undefined,
      roughness: undefined as THREE.Texture | undefined,
      metalness: undefined as THREE.Texture | undefined,
      ao: undefined as THREE.Texture | undefined,
      displacement: undefined as THREE.Texture | undefined,
    }
    
    let idx = 1
    if (preset!.maps.normal) map.normal = textures[idx++]
    if (preset!.maps.roughness) map.roughness = textures[idx++]
    if (preset!.maps.metalness) map.metalness = textures[idx++]
    if (preset!.maps.ao) map.ao = textures[idx++]
    if (preset!.maps.displacement) map.displacement = textures[idx++]
    
    return map
  }, [loadedTextures, preset])

  // Configure textures (anisotropy, encoding, wrapping)
  useMemo(() => {
    const maxAnisotropy = renderer?.capabilities.getMaxAnisotropy() ?? 16
    
    Object.values(textureMap).forEach((texture) => {
      if (texture) {
        texture.anisotropy = maxAnisotropy
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        
        // Set color space for color/diffuse maps
        if (texture === textureMap.color) {
          texture.colorSpace = THREE.SRGBColorSpace
        }
      }
    })
  }, [textureMap, renderer])

  // Build material properties
  const materialProps = useMemo<THREE.MeshStandardMaterialParameters>(() => {
    return {
      map: textureMap.color ?? null,
      normalMap: textureMap.normal ?? null,
      roughnessMap: textureMap.roughness ?? null,
      metalnessMap: textureMap.metalness ?? null,
      aoMap: textureMap.ao ?? null,
      displacementMap: textureMap.displacement ?? null,
      displacementScale: 0.001, // subtle displacement
      ...(preset!.props ?? {}),
    }
  }, [textureMap, preset])

  return {
    preset,
    materialProps,
    textures: textureMap,
  }
}

/**
 * Get material options for UI controls (e.g., Leva)
 */
export function getMaterialOptions(): Record<string, MaterialKey> {
  return Object.fromEntries(
    MATERIALS.map((m) => [m.label, m.key])
  ) as Record<string, MaterialKey>
}

