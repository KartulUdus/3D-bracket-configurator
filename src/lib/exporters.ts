/**
 * Typed wrappers for Three.js exporters (STL/OBJ/GLTF)
 * All exports preserve the internal scale (meters) and orientation (Y-up)
 */

import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js'
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import type * as THREE from 'three'

export const EXPORT_FORMATS = ['stl', 'obj', 'glb'] as const
export type ExportFormat = typeof EXPORT_FORMATS[number]

export interface ExportOptions {
  format: ExportFormat
  filename: string
}

/**
 * Export a Three.js object as STL (binary)
 * STL is common for 3D printing and uses meters for units
 */
export function exportSTL(object: THREE.Object3D): Blob {
  const exporter = new STLExporter()
  const result = exporter.parse(object, { binary: true })
  // Convert DataView to ArrayBuffer if needed
  const arrayBuffer = result instanceof DataView ? result.buffer : result as ArrayBuffer
  return new Blob([arrayBuffer], { type: 'model/stl' })
}

/**
 * Export a Three.js object as OBJ (text)
 * OBJ is a simple mesh format, widely supported
 */
export function exportOBJ(object: THREE.Object3D): Blob {
  const exporter = new OBJExporter()
  const text = exporter.parse(object)
  return new Blob([text], { type: 'text/plain' })
}

/**
 * Export a Three.js object as GLTF binary (.glb)
 * GLTF is modern, supports materials/textures, good for sharing and viewing
 */
export function exportGLB(object: THREE.Object3D): Promise<Blob> {
  const exporter = new GLTFExporter()
  return new Promise((resolve, reject) => {
    exporter.parse(
      object,
      (result) => {
        // When binary: true, result is ArrayBuffer
        if (result instanceof ArrayBuffer) {
          resolve(new Blob([result], { type: 'model/gltf-binary' }))
        } else {
          reject(new Error('Expected ArrayBuffer from GLTFExporter'))
        }
      },
      (error) => {
        reject(error)
      },
      { binary: true }
    )
  })
}

/**
 * Trigger a download of a blob with a given filename
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  // Clean up the URL after download
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

/**
 * Export a Three.js object in the specified format and trigger download
 */
export async function exportModel(
  object: THREE.Object3D,
  options: ExportOptions
): Promise<void> {
  const { format, filename } = options
  
  let blob: Blob
  
  switch (format) {
    case 'stl':
      blob = exportSTL(object)
      break
    case 'obj':
      blob = exportOBJ(object)
      break
    case 'glb':
      blob = await exportGLB(object)
      break
    default:
      throw new Error(`Unsupported export format: ${format}`)
  }
  
  downloadBlob(blob, filename)
}

