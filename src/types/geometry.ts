/**
 * Geometry types for the bracket configurator
 * All dimensions are in meters for consistency with Three.js
 */

export type EdgeStyle = 'none' | 'chamfer' | 'fillet';

export interface PlateDimensions {
  width: number;    // meters
  height: number;   // meters
  thickness: number; // meters
}

export interface HoleConfig {
  count: number;      // number of holes (2-8)
  diameter: number;   // meters
  edgeOffset: number; // meters from edge
}

export interface SlotConfig {
  enabled: boolean;
  length: number;  // meters
  width: number;   // meters
}

export interface PlateConfig {
  dims: PlateDimensions;
  holes: HoleConfig;
  slot: SlotConfig;
  edgeStyle: EdgeStyle;
  edgeRadius: number; // meters - for chamfer/fillet
  materialKey: string;
}

/**
 * Default configuration for the base plate
 */
export const DEFAULT_PLATE_CONFIG: PlateConfig = {
  dims: {
    width: 0.2,      // 200mm
    height: 0.15,    // 150mm
    thickness: 0.01, // 10mm
  },
  holes: {
    count: 4,
    diameter: 0.008, // 8mm
    edgeOffset: 0.015, // 15mm
  },
  slot: {
    enabled: true,
    length: 0.06,    // 60mm
    width: 0.01,     // 10mm
  },
  edgeStyle: 'fillet',
  edgeRadius: 0.003, // 3mm
  materialKey: 'steel',
};

