import { useMemo } from 'react'
import { useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'

/**
 * Material preset type definition
 */
export interface MaterialPreset {
  key: 'oak' | 'walnut' | 'wood' | 'diamond_plate' | 'brushed_metal' | 'painted_metal';
  label: string;
  maps: {
    color: string;
    normal?: string;
    orm?: string; // Packed: R=AO, G=Roughness, B=Metalness
    displacement?: string;
  };
  props?: Partial<THREE.MeshStandardMaterialParameters>;
}

/**
 * Material presets with texture paths
 * 3 Metal materials + 3 Wood materials
 */
const BASE_URL = import.meta.env.BASE_URL

export const MATERIALS: readonly MaterialPreset[] = [
  // Metal Materials (Default: Brushed Metal)
  {
    key: 'brushed_metal',
    label: 'Brushed Metal',
    maps: {
      color: `${BASE_URL}textures/Metal003_4K-JPG/Metal003_4K_Color.ktx2`,
      normal: `${BASE_URL}textures/Metal003_4K-JPG/Metal003_4K_NormalGL.ktx2`,
      orm: `${BASE_URL}textures/Metal003_4K-JPG/Metal003_4K_packed_ORM.ktx2`,
      displacement: `${BASE_URL}textures/Metal003_4K-JPG/Metal003_4K_Displacement.ktx2`,
    },
    props: {
      metalness: 0.2,
      roughness: 0.4,
    },
  },
  {
    key: 'diamond_plate',
    label: 'Diamond Plate',
    maps: {
      color: `${BASE_URL}textures/DiamondPlate006D_4K-JPG/DiamondPlate006D_4K_Color.ktx2`,
      normal: `${BASE_URL}textures/DiamondPlate006D_4K-JPG/DiamondPlate006D_4K_NormalGL.ktx2`,
      orm: `${BASE_URL}textures/DiamondPlate006D_4K-JPG/DiamondPlate006D_4K_packed_ORM.ktx2`,
      displacement: `${BASE_URL}textures/DiamondPlate006D_4K-JPG/DiamondPlate006D_4K_Displacement.ktx2`,
    },
    props: {
      metalness: 0.1,
      roughness: 0.4,
    },
  },
  {
    key: 'painted_metal',
    label: 'Painted Metal',
    maps: {
      color: `${BASE_URL}textures/PaintedMetal001_4K-JPG/PaintedMetal001_4K_Color.ktx2`,
      normal: `${BASE_URL}textures/PaintedMetal001_4K-JPG/PaintedMetal001_4K_NormalGL.ktx2`,
      orm: `${BASE_URL}textures/PaintedMetal001_4K-JPG/PaintedMetal001_4K_packed_ORM.ktx2`,
      displacement: `${BASE_URL}textures/PaintedMetal001_4K-JPG/PaintedMetal001_4K_Displacement.ktx2`,
    },
    props: {
      metalness: 0.5,
      roughness: 0.2,
    },
  },
  // Wood Materials
  {
    key: 'oak',
    label: 'American Oak',
    maps: {
      color: `${BASE_URL}textures/american_oak_2-4K/4K-american_oak_2_basecolor.ktx2`,
      normal: `${BASE_URL}textures/american_oak_2-4K/4K-american_oak_2_normal.ktx2`,
      orm: `${BASE_URL}textures/american_oak_2-4K/4K-american_oak_2_packed_ORM.ktx2`,
      displacement: `${BASE_URL}textures/american_oak_2-4K/4K-american_oak_2_height.ktx2`,
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
      color: `${BASE_URL}textures/american_walnut_1-4K/4K-american_walnut_1_basecolor.ktx2`,
      normal: `${BASE_URL}textures/american_walnut_1-4K/4K-american_walnut_1_normal.ktx2`,
      orm: `${BASE_URL}textures/american_walnut_1-4K/4K-american_walnut_1_packed_ORM.ktx2`,
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
      color: `${BASE_URL}textures/Wood050_4K-JPG/Wood050_4K_Color.ktx2`,
      normal: `${BASE_URL}textures/Wood050_4K-JPG/Wood050_4K_NormalGL.ktx2`,
      orm: `${BASE_URL}textures/Wood050_4K-JPG/Wood050_4K_packed_ORM.ktx2`,
      displacement: `${BASE_URL}textures/Wood050_4K-JPG/Wood050_4K_Displacement.ktx2`,
    },
    props: {
      metalness: 0.0,
      roughness: 0.85,
    },
  },
] as const

export type MaterialKey = (typeof MATERIALS)[number]['key']

/**
 * Configure KTX2Loader with the renderer
 * Call this once when the renderer is available
 */
export function setupKTX2Loader(renderer: THREE.WebGLRenderer) {
  const loader = new KTX2Loader()
  loader.setTranscoderPath('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/basis/')
  loader.detectSupport(renderer)
  return loader
}

/**
 * Hook to load and configure material textures
 * @param materialKey - The key of the material preset to use
 * @param renderer - Optional renderer to set texture anisotropy
 */
export function useMaterials(
  materialKey: MaterialKey,
  renderer?: THREE.WebGLRenderer
) {
  // Get the WebGL renderer from R3F context
  const { gl } = useThree()
  const activeRenderer = renderer ?? gl
  
  // Find the selected material preset (guaranteed to exist)
  const preset = useMemo(
    () => MATERIALS.find((m) => m.key === materialKey) ?? MATERIALS[0]!,
    [materialKey]
  )

  // Build texture path array for useLoader hook
  const texturePaths = useMemo(() => {
    const paths: string[] = []
    const { maps } = preset!
    
    paths.push(maps.color)
    if (maps.normal) paths.push(maps.normal)
    if (maps.orm) paths.push(maps.orm)
    if (maps.displacement) paths.push(maps.displacement)
    
    return paths
  }, [preset])

  // Load all KTX2 textures using useLoader with KTX2Loader
  const loadedTextures = useLoader(
    KTX2Loader,
    texturePaths,
    (loader) => {
      loader.setTranscoderPath('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/basis/')
      loader.detectSupport(activeRenderer)
    }
  )
  
  // Parse loaded textures into a map
  const textureMap = useMemo(() => {
    const textures = Array.isArray(loadedTextures) 
      ? loadedTextures 
      : [loadedTextures]
    
    const map = {
      color: textures[0],
      normal: undefined as THREE.Texture | undefined,
      orm: undefined as THREE.Texture | undefined,
      displacement: undefined as THREE.Texture | undefined,
    }
    
    let idx = 1
    if (preset!.maps.normal) map.normal = textures[idx++]
    if (preset!.maps.orm) map.orm = textures[idx++]
    if (preset!.maps.displacement) map.displacement = textures[idx++]
    
    return map
  }, [loadedTextures, preset])

  // Configure textures (anisotropy, encoding, wrapping)
  useMemo(() => {
    const maxAnisotropy = activeRenderer?.capabilities.getMaxAnisotropy() ?? 16
    
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
  }, [textureMap, activeRenderer])

  // Build material properties
  const materialProps = useMemo<THREE.MeshStandardMaterialParameters>(() => {
    return {
      map: textureMap.color ?? null,
      normalMap: textureMap.normal ?? null,
      // Packed ORM texture: R=AO, G=Roughness, B=Metalness
      aoMap: textureMap.orm ?? null,
      roughnessMap: textureMap.orm ?? null,
      metalnessMap: textureMap.orm ?? null,
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

