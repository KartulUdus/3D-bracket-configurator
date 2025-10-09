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
  topDiameter: number;    // meters - top diameter for tapered holes
  bottomDiameter: number; // meters - bottom diameter for tapered holes
  edgeOffset: number; // meters from edge
  cornersFirst: boolean; // if true, place holes at corners first (for 4 holes), then add to middle of sides
  topFirst: boolean;     // if true, start placement from top, otherwise from bottom
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
 * Values in millimeters for UI (converted to meters for Three.js)
 */
export const DEFAULT_PLATE_CONFIG_MM = {
  dims: {
    width: 200,      // mm
    height: 150,     // mm
    thickness: 10,   // mm
  },
  holes: {
    count: 4,
    diameter: 8,     // mm
    topDiameter: 8,  // mm
    bottomDiameter: 8, // mm
    edgeOffset: 15,  // mm
    cornersFirst: true,
    topFirst: true,
  },
  slot: {
    enabled: true,
    length: 60,      // mm
    width: 10,       // mm
  },
  edgeStyle: 'fillet' as EdgeStyle,
  edgeRadius: 3,     // mm
  materialKey: 'brushed_metal',
};


