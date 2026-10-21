import * as THREE from 'three';
import { Artwork } from './artworks';

export interface ArtworkTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  baseHeight: number;
}

/**
 * Single Source of Truth for all 31 artwork spatial transforms across the 5 exhibition halls.
 * Curated Chronologically by Lin:
 * Room 1: Sep 2020 – Mar 2022 (Works 01–05)
 * Room 2: Apr 2022 – Sep 2022 (Works 06–10)
 * Room 3: May 2023 – Oct 2024 (Works 11–15)
 * Room 4: Mar 2026 – Jun 2026 (Works 16–23)
 * Room 5: Aug 2026 – Sep 2026 (Works 24–31)
 */
export const ARTWORK_TRANSFORMS: Record<string, ArtworkTransform> = {
  // =========================================================================
  // ROOM 1: PAVILION I (Sep 2020 – Mar 2022, Z = 2 to -18)
  // Left wall (01, 02) -> Focal North wall (03) -> Right wall (04, 05)
  // =========================================================================
  'art-01': {
    position: [-6.92, 2.35, -5.5],
    rotation: [0, Math.PI / 2, 0], // Date Night
    baseHeight: 2.35
  },
  'art-02': {
    position: [-6.92, 2.35, -12.5],
    rotation: [0, Math.PI / 2, 0], // Dorothy
    baseHeight: 2.35
  },
  'art-03': {
    position: [-1.8, 2.35, -17.72],
    rotation: [0, 0, 0], // Haunted (Focal North Wall)
    baseHeight: 2.5
  },
  'art-04': {
    position: [6.92, 2.35, -7.5],
    rotation: [0, -Math.PI / 2, 0], // The Last Goodbye Kiss
    baseHeight: 2.35
  },
  'art-05': {
    position: [6.92, 2.35, -14.5],
    rotation: [0, -Math.PI / 2, 0], // Late Night In The City
    baseHeight: 2.35
  },

  // =========================================================================
  // ROOM 2: THE CENTRAL ROTUNDA (Apr 2022 – Sep 2022, Center: [0, 0, -33])
  // Octagonal perimeter niches (Works 06–10)
  // =========================================================================
  'art-06': {
    position: [-7.72, 2.35, -29.0],
    rotation: [0, Math.PI / 2, 0], // The Witch (West wall South)
    baseHeight: 2.35
  },
  'art-07': {
    position: [-7.72, 2.35, -35.0],
    rotation: [0, Math.PI / 2, 0], // Crying Girl (West wall North)
    baseHeight: 2.35
  },
  'art-08': {
    position: [-5.54, 2.35, -40.14],
    rotation: [0, Math.PI / 4, 0], // The Demon Sister (NW diagonal bay)
    baseHeight: 2.35
  },
  'art-09': {
    position: [5.54, 2.35, -40.14],
    rotation: [0, -Math.PI / 4, 0], // Last Stop (NE diagonal bay)
    baseHeight: 2.35
  },
  'art-10': {
    position: [7.72, 2.35, -33.0],
    rotation: [0, -Math.PI / 2, 0], // After Midnight (East rotunda niche)
    baseHeight: 2.35
  },

  // =========================================================================
  // ROOM 3: PAVILION II (May 2023 – Oct 2024, Z = -45 to -69)
  // West wall (11, 12) -> East wall (13, 14) -> Focal North wall (15)
  // =========================================================================
  'art-11': {
    position: [-7.42, 2.35, -52.0],
    rotation: [0, Math.PI / 2, 0], // Crying Fairy
    baseHeight: 2.35
  },
  'art-12': {
    position: [-7.42, 2.35, -60.0],
    rotation: [0, Math.PI / 2, 0], // Fringe & Shadow (Cinema Crop)
    baseHeight: 2.35
  },
  'art-13': {
    position: [7.42, 2.35, -52.0],
    rotation: [0, -Math.PI / 2, 0], // Heated Call
    baseHeight: 2.35
  },
  'art-14': {
    position: [7.42, 2.35, -60.0],
    rotation: [0, -Math.PI / 2, 0], // Junetta Origin
    baseHeight: 2.35
  },
  'art-15': {
    position: [0, 2.35, -68.72],
    rotation: [0, 0, 0], // Junetta The Wood Elf (Focal North Wall)
    baseHeight: 2.6
  },

  // =========================================================================
  // ROOM 4: THE DRAWING STUDIO (Mar 2026 – Jun 2026, Z = -73 to -93)
  // West Corkboard (16–19) -> East Corkboard (20–23)
  // =========================================================================
  'art-16': {
    position: [-6.87, 2.2, -75.5],
    rotation: [0, Math.PI / 2, 0], // The Traveler
    baseHeight: 1.85
  },
  'art-17': {
    position: [-6.87, 2.2, -80.0],
    rotation: [0, Math.PI / 2, 0], // Maki and Billy
    baseHeight: 1.85
  },
  'art-18': {
    position: [-6.87, 2.2, -84.5],
    rotation: [0, Math.PI / 2, 0], // Dappled Amber Gaze
    baseHeight: 1.85
  },
  'art-19': {
    position: [-6.87, 2.2, -89.0],
    rotation: [0, Math.PI / 2, 0], // Chole
    baseHeight: 1.85
  },
  'art-20': {
    position: [6.87, 2.2, -75.5],
    rotation: [0, -Math.PI / 2, 0], // Maquia and Ariel
    baseHeight: 1.85
  },
  'art-21': {
    position: [6.87, 2.2, -80.0],
    rotation: [0, -Math.PI / 2, 0], // Long-tailed Tits
    baseHeight: 1.85
  },
  'art-22': {
    position: [6.87, 2.2, -84.5],
    rotation: [0, -Math.PI / 2, 0], // I Am Here For You
    baseHeight: 1.85
  },
  'art-23': {
    position: [6.87, 2.2, -89.0],
    rotation: [0, -Math.PI / 2, 0], // Expression Sketch
    baseHeight: 1.85
  },

  // =========================================================================
  // ROOM 5: THE MASTER STUDY ARCHIVE (Aug 2026 – Sep 2026, Z = -96 to -116)
  // West Archival Wall (24–27) -> East Archival Wall (28–31)
  // =========================================================================
  'art-24': {
    position: [-6.92, 2.2, -98.5],
    rotation: [0, Math.PI / 2, 0], // The Nerdy Brawl
    baseHeight: 1.85
  },
  'art-25': {
    position: [-6.92, 2.2, -103.0],
    rotation: [0, Math.PI / 2, 0], // Rotten Girl
    baseHeight: 1.85
  },
  'art-26': {
    position: [-6.92, 2.2, -107.5],
    rotation: [0, Math.PI / 2, 0], // Anxious Girl Sketch
    baseHeight: 1.85
  },
  'art-27': {
    position: [-6.92, 2.2, -112.0],
    rotation: [0, Math.PI / 2, 0], // Red Hoodie Girl with Her Cat
    baseHeight: 1.85
  },
  'art-28': {
    position: [6.92, 2.2, -98.5],
    rotation: [0, -Math.PI / 2, 0], // American Teenager
    baseHeight: 1.85
  },
  'art-29': {
    position: [6.92, 2.2, -103.0],
    rotation: [0, -Math.PI / 2, 0], // Crush
    baseHeight: 1.85
  },
  'art-30': {
    position: [6.92, 2.2, -107.5],
    rotation: [0, -Math.PI / 2, 0], // The God-forsaken Pearl
    baseHeight: 1.85
  },
  'art-31': {
    position: [6.92, 2.2, -112.0],
    rotation: [0, -Math.PI / 2, 0], // Long Way from Home
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
 */
const ARTWORK_SCROLL_PROGRESS: Record<string, number> = {
  // Room 1: Sep 2020 – Mar 2022
  'art-01': 3 / 46,
  'art-02': 4 / 46,
  'art-03': 5 / 46,
  'art-04': 6 / 46,
  'art-05': 7 / 46,
  // Room 2: Apr 2022 – Sep 2022
  'art-06': 11 / 46,
  'art-07': 12 / 46,
  'art-08': 13 / 46,
  'art-09': 14 / 46,
  'art-10': 15 / 46,
  // Room 3: May 2023 – Oct 2024
  'art-11': 19 / 46,
  'art-12': 20 / 46,
  'art-13': 21 / 46,
  'art-14': 22 / 46,
  'art-15': 23 / 46,
  // Room 4: Mar 2026 – Jun 2026
  'art-16': 27 / 46,
  'art-17': 28 / 46,
  'art-18': 29 / 46,
  'art-19': 30 / 46,
  'art-20': 31 / 46,
  'art-21': 32 / 46,
  'art-22': 33 / 46,
  'art-23': 34 / 46,
  // Room 5: Aug 2026 – Sep 2026
  'art-24': 37 / 46,
  'art-25': 38 / 46,
  'art-26': 39 / 46,
  'art-27': 40 / 46,
  'art-28': 41 / 46,
  'art-29': 42 / 46,
  'art-30': 43 / 46,
  'art-31': 44 / 46
};

export function getArtworkScrollProgress(id: string): number {
  return ARTWORK_SCROLL_PROGRESS[id] ?? 0.1;
}

/**
 * Calculates dedicated inspection camera docking parameters.
 */
export function getInspectionCameraFraming(artwork: Artwork): {
  cameraPosition: THREE.Vector3;
  lookAtTarget: THREE.Vector3;
} {
  const transform = getArtworkTransform(artwork.id);
  const pos = new THREE.Vector3(...transform.position);
  const rot = new THREE.Euler(...transform.rotation);

  const normal = new THREE.Vector3(0, 0, 1).applyEuler(rot);
  const right = new THREE.Vector3(1, 0, 0).applyEuler(rot);

  const baseHeight = transform.baseHeight;
  const width = Math.round(baseHeight * artwork.aspectRatio * 100) / 100;

  const dist = Math.max(4.2, baseHeight * 1.78, width * 1.38);
  const shiftX = dist * 0.16;

  const cameraPosition = pos.clone()
    .add(new THREE.Vector3(0, 0.08, 0))
    .addScaledVector(normal, dist)
    .addScaledVector(right, shiftX);

  const lookAtTarget = pos.clone()
    .add(new THREE.Vector3(0, 0.08, 0))
    .addScaledVector(right, shiftX);

  return { cameraPosition, lookAtTarget };
}
