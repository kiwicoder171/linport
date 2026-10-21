import * as THREE from 'three';
import { Artwork } from './artworks';

export interface ArtworkTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  baseHeight: number;
}

/**
 * Single Source of Truth for all 32 artwork spatial transforms in the museum.
 * Curatorial Rule: In each room, left-hand artworks are visited first,
 * followed by focal centerpieces, then right-hand artworks.
 * Every artwork hangs 100% FLAT against the wall face with ZERO wall sinking!
 */
export const ARTWORK_TRANSFORMS: Record<string, ArtworkTransform> = {
  // =========================================================================
  // ROOM 1: PAVILION I · GENESIS (Masterworks 1–5, Z = 2 to -18)
  // Left wall first (MW 1, 2) -> Focal North wall (MW 3) -> Right wall (MW 4, 5)
  // =========================================================================
  'mw-01': {
    position: [-6.92, 2.35, -4.5],
    rotation: [0, Math.PI / 2, 0], // Left Wall (West) #1
    baseHeight: 2.35
  },
  'mw-02': {
    position: [-6.92, 2.35, -11.5],
    rotation: [0, Math.PI / 2, 0], // Left Wall (West) #2
    baseHeight: 2.35
  },
  'mw-03': {
    position: [-1.8, 2.35, -17.72],
    rotation: [0, 0, 0], // Focal Flagship on North Wall (0.08m in front of -17.80 face)
    baseHeight: 2.5
  },
  'mw-04': {
    position: [6.92, 2.35, -8.0],
    rotation: [0, -Math.PI / 2, 0], // Right Wall (East) #1 (Generous 6.5m spacing!)
    baseHeight: 2.35
  },
  'mw-05': {
    position: [6.92, 2.35, -14.5],
    rotation: [0, -Math.PI / 2, 0], // Right Wall (East) #2
    baseHeight: 2.35
  },

  // =========================================================================
  // ROOM 2: THE CENTRAL ROTUNDA (Masterworks 6–10, Center: [0, 0, -33])
  // Left rotunda bays first (MW 6, 7, 8) -> Right rotunda bays (MW 9, 10)
  // =========================================================================
  'mw-06': {
    position: [-7.72, 2.35, -29.0],
    rotation: [0, Math.PI / 2, 0], // West rotunda wall South (Left 1)
    baseHeight: 2.35
  },
  'mw-07': {
    position: [-7.72, 2.35, -35.0],
    rotation: [0, Math.PI / 2, 0], // West rotunda wall North (Left 2)
    baseHeight: 2.35
  },
  'mw-08': {
    position: [-5.54, 2.35, -40.14],
    rotation: [0, Math.PI / 4, 0], // Northwest rotunda bay (Left 3 — faces South-East toward center)
    baseHeight: 2.35
  },
  'mw-09': {
    position: [5.54, 2.35, -40.14],
    rotation: [0, -Math.PI / 4, 0], // Northeast rotunda bay (Right 1 — faces South-West toward center)
    baseHeight: 2.35
  },
  'mw-10': {
    position: [7.72, 2.35, -33.0],
    rotation: [0, -Math.PI / 2, 0], // East rotunda niche (Right 2)
    baseHeight: 2.35
  },

  // =========================================================================
  // ROOM 3: PAVILION II · VISIONS (Masterworks 11–16, Z = -45 to -69)
  // Left wall first (MW 11, 12, 13) -> Right wall (MW 14, 15) -> Focal finale (MW 16)
  // =========================================================================
  'mw-11': {
    position: [-7.42, 2.35, -49.5],
    rotation: [0, Math.PI / 2, 0], // Left Wall (West) #1
    baseHeight: 2.35
  },
  'mw-12': {
    position: [-7.42, 2.35, -56.0],
    rotation: [0, Math.PI / 2, 0], // Left Wall (West) #2
    baseHeight: 2.35
  },
  'mw-13': {
    position: [-7.42, 2.35, -62.5],
    rotation: [0, Math.PI / 2, 0], // Left Wall (West) #3
    baseHeight: 2.35
  },
  'mw-14': {
    position: [7.42, 2.35, -53.5],
    rotation: [0, -Math.PI / 2, 0], // Right Wall (East) #1 (8.0m spacing!)
    baseHeight: 2.35
  },
  'mw-15': {
    position: [7.42, 2.35, -61.5],
    rotation: [0, -Math.PI / 2, 0], // Right Wall (East) #2
    baseHeight: 2.35
  },
  'mw-16': {
    position: [0, 2.35, -68.72],
    rotation: [0, 0, 0], // Flagship Finale Centered on North Wall (0.08m in front of -68.80 face)
    baseHeight: 2.6
  },

  // =========================================================================
  // ROOM 4: THE DRAWING STUDIO (Studies 1–8, Z = -73 to -93)
  // Left cork board first (Studies 1–4) -> Right cork board (Studies 5–8)
  // =========================================================================
  'study-01': {
    position: [-6.87, 2.2, -75.5],
    rotation: [0, Math.PI / 2, 0], // Left Cork Board #1
    baseHeight: 1.85
  },
  'study-02': {
    position: [-6.87, 2.2, -80.0],
    rotation: [0, Math.PI / 2, 0], // Left Cork Board #2
    baseHeight: 1.85
  },
  'study-03': {
    position: [-6.87, 2.2, -84.5],
    rotation: [0, Math.PI / 2, 0], // Left Cork Board #3
    baseHeight: 1.85
  },
  'study-04': {
    position: [-6.87, 2.2, -89.0],
    rotation: [0, Math.PI / 2, 0], // Left Cork Board #4
    baseHeight: 1.85
  },
  'study-05': {
    position: [6.87, 2.2, -75.5],
    rotation: [0, -Math.PI / 2, 0], // Right Cork Board #1
    baseHeight: 1.85
  },
  'study-06': {
    position: [6.87, 2.2, -80.0],
    rotation: [0, -Math.PI / 2, 0], // Right Cork Board #2
    baseHeight: 1.85
  },
  'study-07': {
    position: [6.87, 2.2, -84.5],
    rotation: [0, -Math.PI / 2, 0], // Right Cork Board #3
    baseHeight: 1.85
  },
  'study-08': {
    position: [6.87, 2.2, -89.0],
    rotation: [0, -Math.PI / 2, 0], // Right Cork Board #4
    baseHeight: 1.85
  },

  // =========================================================================
  // ROOM 5: THE MASTER STUDY ARCHIVE (Studies 9–16, Z = -96 to -116)
  // Left archival wall first (Studies 9–12) -> Right archival wall (Studies 13–16)
  // =========================================================================
  'study-09': {
    position: [-6.92, 2.2, -98.5],
    rotation: [0, Math.PI / 2, 0], // Left Archival Wall #1
    baseHeight: 1.85
  },
  'study-10': {
    position: [-6.92, 2.2, -103.0],
    rotation: [0, Math.PI / 2, 0], // Left Archival Wall #2
    baseHeight: 1.85
  },
  'study-11': {
    position: [-6.92, 2.2, -107.5],
    rotation: [0, Math.PI / 2, 0], // Left Archival Wall #3
    baseHeight: 1.85
  },
  'study-12': {
    position: [-6.92, 2.2, -112.0],
    rotation: [0, Math.PI / 2, 0], // Left Archival Wall #4
    baseHeight: 1.85
  },
  'study-13': {
    position: [6.92, 2.2, -98.5],
    rotation: [0, -Math.PI / 2, 0], // Right Archival Wall #1
    baseHeight: 1.85
  },
  'study-14': {
    position: [6.92, 2.2, -103.0],
    rotation: [0, -Math.PI / 2, 0], // Right Archival Wall #2
    baseHeight: 1.85
  },
  'study-15': {
    position: [6.92, 2.2, -107.5],
    rotation: [0, -Math.PI / 2, 0], // Right Archival Wall #3
    baseHeight: 1.85
  },
  'study-16': {
    position: [6.92, 2.2, -112.0],
    rotation: [0, -Math.PI / 2, 0], // Right Archival Wall #4
    baseHeight: 1.85
  }
};

export function getArtworkTransform(id: string): ArtworkTransform {
  return ARTWORK_TRANSFORMS[id] || {
    position: [0, 2.35, 0],
    rotation: [0, 0, 0],
    baseHeight: 2.35
  };
}

/**
 * Maps each artwork ID to its corresponding normalized promenade spline position (0..1)
 * so deep-linking, catalog jumping, or stepping through works keeps the walkthrough
 * camera positioned right in front of the current artwork when exiting inspection.
 */
const ARTWORK_SCROLL_PROGRESS: Record<string, number> = {
  'mw-01': 3 / 47,
  'mw-02': 4 / 47,
  'mw-03': 5 / 47,
  'mw-04': 6 / 47,
  'mw-05': 7 / 47,
  'mw-06': 11 / 47,
  'mw-07': 12 / 47,
  'mw-08': 13 / 47,
  'mw-09': 14 / 47,
  'mw-10': 15 / 47,
  'mw-11': 19 / 47,
  'mw-12': 20 / 47,
  'mw-13': 21 / 47,
  'mw-14': 22 / 47,
  'mw-15': 23 / 47,
  'mw-16': 24 / 47,
  'study-01': 28 / 47,
  'study-02': 28.5 / 47,
  'study-03': 29.5 / 47,
  'study-04': 30 / 47,
  'study-05': 31 / 47,
  'study-06': 31.5 / 47,
  'study-07': 32.5 / 47,
  'study-08': 33 / 47,
  'study-09': 37 / 47,
  'study-10': 37.5 / 47,
  'study-11': 38.5 / 47,
  'study-12': 39 / 47,
  'study-13': 41 / 47,
  'study-14': 41.5 / 47,
  'study-15': 42.5 / 47,
  'study-16': 43 / 47
};

export function getArtworkScrollProgress(id: string): number {
  return ARTWORK_SCROLL_PROGRESS[id] ?? 0.1;
}

/**
 * Calculates dedicated inspection camera docking parameters.
 * Positions the camera square-on perpendicular to the wall,
 * shifting framing so the artwork sits in the LEFT 55% of the screen
 * with ZERO overlap from the Curatorial Placard on the right!
 */
export function getInspectionCameraFraming(artwork: Artwork): {
  cameraPosition: THREE.Vector3;
  lookAtTarget: THREE.Vector3;
} {
  const transform = getArtworkTransform(artwork.id);
  const pos = new THREE.Vector3(...transform.position);
  const rot = new THREE.Euler(...transform.rotation);

  // Surface normal pointing straight out from the canvas into the room
  const normal = new THREE.Vector3(0, 0, 1).applyEuler(rot);
  // Horizontal right vector along the frame
  const right = new THREE.Vector3(1, 0, 0).applyEuler(rot);

  const baseHeight = transform.baseHeight;
  const width = Math.round(baseHeight * artwork.aspectRatio * 100) / 100;

  // Compute exact optical distance for 46° vertical FOV so the entire shadowbox frame,
  // overhead brass picture lamp, and scalloped wall halo are framed with generous margins
  const dist = Math.max(4.2, baseHeight * 1.78, width * 1.38);

  // Shift viewport center slightly right (~14% of frustum width) so the artwork + lamp
  // sit centered in the left 70% of the viewport with wide margins on BOTH left and right sides
  const shiftX = dist * 0.16;

  // Elevate vertical center slightly (+0.08m) to include the brass picture lamp above the frame
  const cameraPosition = pos.clone()
    .add(new THREE.Vector3(0, 0.08, 0))
    .addScaledVector(normal, dist)
    .addScaledVector(right, shiftX);

  const lookAtTarget = pos.clone()
    .add(new THREE.Vector3(0, 0.08, 0))
    .addScaledVector(right, shiftX);

  return { cameraPosition, lookAtTarget };
}
