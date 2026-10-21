import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Artwork, ARTWORKS } from '../../data/artworks';
import { getArtworkTransform, getInspectionCameraFraming } from '../../data/artworkTransforms';

interface CameraControllerProps {
  targetProgressRef: React.MutableRefObject<number>; // 0 to 1
  inspectedArtwork: Artwork | null;
  onActiveArtworkChange?: (artwork: Artwork | null) => void;
  onProgressChange?: (quantizedProgress: number) => void;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  targetProgressRef,
  inspectedArtwork,
  onActiveArtworkChange,
  onProgressChange
}) => {
  const { camera } = useThree();
  const smoothProgressRef = useRef(0);
  const lastReportedQuantized = useRef(0);

  // Natural architectural promenade spline through all 6 distinct gallery pavilions.
  // Curatorial Rule: In every room, ALL left-hand artworks are visited first,
  // followed by focal centerpieces/vitrines, then all right-hand artworks,
  // before transitioning gracefully through the architectural doorway.
  // Uses .getPoint(t) (index-parameterized) so cameraPoints[i] and lookAtPoints[i]
  // remain 100% synchronized at every scroll fraction.
  const { cameraSpline, lookAtSpline } = useMemo(() => {
    const cameraPoints = [
      // --- ROOM 0: Grand Foyer (Z = 12 to 2) ---
      new THREE.Vector3(0, 2.15, 11.5),
      new THREE.Vector3(0, 2.15, 6.0),

      // --- ROOM 1: Pavilion I · Genesis (Z = 2 to -18) ---
      // Left Wall First: MW 01 (-4.5), MW 02 (-11.5)
      new THREE.Vector3(-1.2, 2.15, 0.5),   // Crossing South threshold, angling toward MW 01
      new THREE.Vector3(-2.1, 2.15, -4.5),  // Directly framing MW 01 on Left Wall
      new THREE.Vector3(-2.1, 2.15, -11.5), // Directly framing MW 02 on Left Wall
      // Focal North Wall: MW 03 (-17.75)
      new THREE.Vector3(-1.2, 2.15, -13.5), // Turning to face focal Masterwork #03
      // Right Wall: MW 04 (-8.0), MW 05 (-14.5)
      new THREE.Vector3(1.6, 2.15, -9.0),   // Facing MW 04 on Right Wall
      new THREE.Vector3(2.0, 2.15, -14.5),  // Facing MW 05 on Right Wall
      // Exit Doorway to Room 2
      new THREE.Vector3(3.6, 2.15, -17.2),  // Aligning with North exit doorway
      new THREE.Vector3(3.8, 2.15, -19.8),  // Passing through Room 1 doorway into corridor

      // --- ROOM 2: The Central Rotunda (Z = -22 to -44) ---
      new THREE.Vector3(1.2, 2.15, -23.5),   // Approaching Rotunda South portal
      // Left Rotunda Bays First: MW 06 (-29.0), MW 07 (-35.0), MW 08 (-40.14)
      new THREE.Vector3(-2.3, 2.15, -29.0),  // Squarely framing MW 06 on West wall South
      new THREE.Vector3(-2.3, 2.15, -35.0),  // Squarely framing MW 07 on West wall North
      new THREE.Vector3(-2.14, 2.15, -36.74),// Squarely perpendicular to MW 08 on NW diagonal bay
      // Right Rotunda Bays: MW 09 (-40.14), MW 10 (-33.0)
      new THREE.Vector3(2.14, 2.15, -36.74), // Squarely perpendicular to MW 09 on NE diagonal bay
      new THREE.Vector3(2.3, 2.15, -33.0),   // Squarely framing MW 10 on East niche
      // Exit Portal to Room 3
      new THREE.Vector3(0.0, 2.15, -40.2),   // Aligning with North exit portal
      new THREE.Vector3(0.0, 2.15, -43.8),   // Passing through Rotunda North doorway

      // --- ROOM 3: Pavilion II (May 2023 – Oct 2024, Z = -45 to -69) ---
      new THREE.Vector3(-1.4, 2.15, -46.5), // Entering Room 3, angling toward art-11
      // West Wall: art-11 (-52.0), art-12 (-60.0)
      new THREE.Vector3(-2.3, 2.15, -52.0), // Framing art-11 on Left Wall
      new THREE.Vector3(-2.3, 2.15, -60.0), // Framing art-12 on Left Wall
      // East Wall: art-13 (-52.0), art-14 (-60.0)
      new THREE.Vector3(1.8, 2.15, -52.0),  // Sweeping to Right side, framing art-13
      new THREE.Vector3(2.0, 2.15, -60.0),  // Framing art-14 on Right Wall
      // Focal North Wall Finale: art-15 (-68.75)
      new THREE.Vector3(0.0, 2.15, -64.5),  // Center front, framing flagship art-15
      // Exit Portal to Room 4
      new THREE.Vector3(3.5, 2.15, -67.8),  // Approaching Right exit portal
      new THREE.Vector3(3.6, 2.05, -70.8),  // Passing through Room 3 exit doorway

      // --- ROOM 4: The Drawing Studio (Z = -73 to -93) ---
      new THREE.Vector3(-1.4, 2.05, -73.8), // Entering Studio, angling to Left Corkboard
      // Left Corkboard First: Studies 1–4 (-75.5, -80.0, -84.5, -89.0)
      new THREE.Vector3(-2.1, 2.05, -76.5), // Framing Studies 01 & 02
      new THREE.Vector3(-2.1, 2.05, -82.5), // Framing Studies 02 & 03
      new THREE.Vector3(-2.1, 2.05, -88.0), // Framing Study 04
      // Right Corkboard: Studies 5–8 (-75.5, -80.0, -84.5, -89.0)
      new THREE.Vector3(1.8, 2.05, -77.5),  // Sweeping to Right Corkboard, framing Studies 05 & 06
      new THREE.Vector3(1.8, 2.05, -83.5),  // Framing Studies 06 & 07
      new THREE.Vector3(1.8, 2.05, -88.5),  // Framing Study 08
      // Exit Portal to Room 5
      new THREE.Vector3(0.0, 2.05, -91.5),  // Approaching center North exit doorway
      new THREE.Vector3(0.0, 2.05, -94.8),  // Passing through Studio exit doorway

      // --- ROOM 5: The Master Study Archive (Z = -96 to -116) ---
      new THREE.Vector3(-1.4, 2.05, -97.2), // Entering Archive, angling to Left Archival Wall
      // Left Archival Wall First: Studies 9–12 (-98.5, -103.0, -107.5, -112.0)
      new THREE.Vector3(-2.1, 2.05, -99.5), // Framing Studies 09 & 10
      new THREE.Vector3(-2.1, 2.05, -105.5),// Framing Studies 10 & 11
      new THREE.Vector3(-2.1, 2.05, -111.0),// Framing Study 12
      // Central Showcase Vitrine & Right Archival Wall: Studies 13–16
      new THREE.Vector3(0.0, 2.05, -103.5), // Viewing Showcase Vitrine
      new THREE.Vector3(1.8, 2.05, -100.5), // Framing Studies 13 & 14 on Right Archival Wall
      new THREE.Vector3(1.8, 2.05, -106.5), // Framing Studies 14 & 15
      new THREE.Vector3(1.8, 2.05, -111.5), // Framing Study 16
      // Exit Portal to Curatorial Desk
      new THREE.Vector3(0.0, 2.05, -114.5), // Approaching exit doorway to Curatorial Lounge
      new THREE.Vector3(0.0, 1.85, -117.8), // Passing through Archive exit doorway

      // --- ROOM 6: Curatorial Lounge & Reception (Z = -119 to -133) ---
      new THREE.Vector3(0.0, 1.85, -121.0), // Entering Lounge
      new THREE.Vector3(0.0, 1.85, -123.5)  // Stopping before Curatorial Desk & statement wall
    ];

    const lookAtPoints = [
      // ROOM 0
      new THREE.Vector3(0, 2.15, 2),
      new THREE.Vector3(0, 2.15, -2),

      // ROOM 1 (Genesis)
      new THREE.Vector3(-6.95, 2.35, -4.5),  // Looking diagonally at MW 01 early
      new THREE.Vector3(-6.95, 2.35, -4.5),  // Squarely facing MW 01
      new THREE.Vector3(-6.95, 2.35, -11.5), // Squarely facing MW 02
      new THREE.Vector3(-1.8, 2.35, -17.75), // Facing focal North wall MW 03
      new THREE.Vector3(6.95, 2.35, -8.0),   // Facing MW 04
      new THREE.Vector3(6.95, 2.35, -14.5),  // Facing MW 05
      new THREE.Vector3(3.8, 2.15, -24.0),   // Looking through doorway
      new THREE.Vector3(1.8, 2.15, -27.0),   // Looking ahead in corridor

      // ROOM 2 (The Rotunda)
      new THREE.Vector3(-3.5, 2.25, -29.0),  // Angling into rotunda toward MW 06
      new THREE.Vector3(-7.72, 2.35, -29.0), // Squarely facing MW 06
      new THREE.Vector3(-7.72, 2.35, -35.0), // Squarely facing MW 07
      new THREE.Vector3(-5.54, 2.35, -40.14),// Squarely facing MW 08 (NW diagonal bay)
      new THREE.Vector3(5.54, 2.35, -40.14), // Squarely facing MW 09 (NE diagonal bay)
      new THREE.Vector3(7.72, 2.35, -33.0),  // Squarely facing MW 10 (East wall)
      new THREE.Vector3(0.0, 2.15, -48.0),   // Looking toward exit portal
      new THREE.Vector3(-1.5, 2.15, -50.0),  // Looking ahead into Room 3

      // ROOM 3 (May 2023 – Oct 2024)
      new THREE.Vector3(-7.45, 2.35, -52.0), // Looking at art-11 early
      new THREE.Vector3(-7.45, 2.35, -52.0), // Facing art-11
      new THREE.Vector3(-7.45, 2.35, -60.0), // Facing art-12
      new THREE.Vector3(7.45, 2.35, -52.0),  // Facing art-13
      new THREE.Vector3(7.45, 2.35, -60.0),  // Facing art-14
      new THREE.Vector3(0.0, 2.35, -68.75),  // Facing flagship art-15
      new THREE.Vector3(3.6, 2.15, -75.0),   // Looking at right exit portal
      new THREE.Vector3(-1.5, 2.05, -75.5),  // Looking into Studio

      // ROOM 4 (Drawing Studio)
      new THREE.Vector3(-6.90, 2.2, -75.5),  // Looking at Study 01 early
      new THREE.Vector3(-6.90, 2.2, -77.5),  // Facing Studies 01 & 02
      new THREE.Vector3(-6.90, 2.2, -83.5),  // Facing Studies 02 & 03
      new THREE.Vector3(-6.90, 2.2, -89.0),  // Facing Study 04
      new THREE.Vector3(6.90, 2.2, -77.5),   // Facing Studies 05 & 06
      new THREE.Vector3(6.90, 2.2, -83.5),   // Facing Studies 06 & 07
      new THREE.Vector3(6.90, 2.2, -89.0),   // Facing Study 08
      new THREE.Vector3(0.0, 2.05, -98.5),   // Looking toward center exit doorway
      new THREE.Vector3(-1.8, 2.05, -98.5),  // Looking into Archive

      // ROOM 5 (Study Archive)
      new THREE.Vector3(-6.94, 2.2, -98.5),  // Looking at Study 09 early
      new THREE.Vector3(-6.94, 2.2, -100.5), // Facing Studies 09 & 10
      new THREE.Vector3(-6.94, 2.2, -106.5), // Facing Studies 10 & 11
      new THREE.Vector3(-6.94, 2.2, -112.0), // Facing Study 12
      new THREE.Vector3(0.0, 0.95, -106.0),  // Looking at Showcase Vitrine
      new THREE.Vector3(6.94, 2.2, -100.5),  // Facing Studies 13 & 14
      new THREE.Vector3(6.94, 2.2, -106.5),  // Facing Studies 14 & 15
      new THREE.Vector3(6.94, 2.2, -112.0),  // Facing Study 16
      new THREE.Vector3(0.0, 1.85, -125.0),  // Looking toward Curatorial Lounge
      new THREE.Vector3(0.0, 1.85, -125.0),  // Passing into Lounge

      // ROOM 6 (Curatorial Desk)
      new THREE.Vector3(0.0, 1.85, -125.0),  // Approaching Curatorial Desk
      new THREE.Vector3(0.0, 1.85, -125.5)   // Framing Curatorial Desk & Monograph statement
    ];

    return {
      cameraSpline: new THREE.CatmullRomCurve3(cameraPoints, false, 'centripetal', 0.5),
      lookAtSpline: new THREE.CatmullRomCurve3(lookAtPoints, false, 'centripetal', 0.5)
    };
  }, []);

  const targetLookAt = useRef(new THREE.Vector3(0, 2.15, -10));
  const currentLookAt = useRef(new THREE.Vector3(0, 2.15, -10));
  const smoothPointer = useRef(new THREE.Vector2(0, 0));
  const lastActiveId = useRef<string | null>(null);
  const visitorLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ pointer, clock }, delta) => {
    const dampSpeed = 4.2;

    // Smoothly damp mouse pointer for tactile head-turn & inspection parallax
    smoothPointer.current.x += (pointer.x - smoothPointer.current.x) * Math.min(delta * 5.0, 0.2);
    smoothPointer.current.y += (pointer.y - smoothPointer.current.y) * Math.min(delta * 5.0, 0.2);

    if (inspectedArtwork) {
      // =========================================================================
      // 1. INSPECTION MODE: Dedicated split-view camera docking + tactile parallax
      // Positions artwork dynamically in the LEFT 55% of the screen with ZERO card overlap!
      // Moving the cursor gently shifts viewing angle to reveal 3D frame depth & canvas weave.
      // =========================================================================
      const framing = getInspectionCameraFraming(inspectedArtwork);
      const transform = getArtworkTransform(inspectedArtwork.id);
      const rot = new THREE.Euler(...transform.rotation);
      const rightVec = new THREE.Vector3(1, 0, 0).applyEuler(rot);
      const upVec = new THREE.Vector3(0, 1, 0);

      const desiredPos = framing.cameraPosition
        .clone()
        .addScaledVector(rightVec, smoothPointer.current.x * 0.08)
        .addScaledVector(upVec, smoothPointer.current.y * 0.05);

      const desiredLook = framing.lookAtTarget
        .clone()
        .addScaledVector(rightVec, smoothPointer.current.x * 0.14)
        .addScaledVector(upVec, smoothPointer.current.y * 0.10);

      targetLookAt.current.copy(desiredLook);
      camera.position.lerp(desiredPos, Math.min(delta * dampSpeed, 0.16));
      currentLookAt.current.lerp(targetLookAt.current, Math.min(delta * dampSpeed, 0.16));
      camera.lookAt(currentLookAt.current);
      smoothProgressRef.current = Math.max(0, Math.min(1, targetProgressRef.current));
    } else {
      // =========================================================================
      // 2. WALKTHROUGH MODE: Smooth architectural promenade into/out of rooms
      // Uses .getPoint(t) so cameraSpline and lookAtSpline stay 100% locked by index!
      // =========================================================================
      const targetVal = Math.max(0, Math.min(1, targetProgressRef.current));
      const diff = targetVal - smoothProgressRef.current;
      if (Math.abs(diff) < 0.00008) {
        smoothProgressRef.current = targetVal;
      } else {
        smoothProgressRef.current += diff * Math.min(delta * 5.2, 0.16);
      }

      const clampedProgress = Math.max(0, Math.min(1, smoothProgressRef.current));

      // Report quantized progress (0.5% steps) to React HUD only when it changes
      if (onProgressChange) {
        const quantized = Math.round(clampedProgress * 200) / 200;
        if (quantized !== lastReportedQuantized.current) {
          lastReportedQuantized.current = quantized;
          onProgressChange(quantized);
        }
      }

      const railPos = cameraSpline.getPoint(clampedProgress);
      const lookPos = lookAtSpline.getPoint(clampedProgress);

      // Subtle organic breathing & cursor gaze offset
      const breathY = Math.sin(clock.elapsedTime * 1.35) * 0.008;
      railPos.y += breathY;

      const viewDir = lookPos.clone().sub(railPos).normalize();
      const rightDir = new THREE.Vector3().crossVectors(viewDir, new THREE.Vector3(0, 1, 0)).normalize();

      lookPos.addScaledVector(rightDir, smoothPointer.current.x * 0.25);
      lookPos.y += smoothPointer.current.y * 0.14;

      targetLookAt.current.copy(lookPos);

      camera.position.lerp(railPos, Math.min(delta * dampSpeed, 0.16));
      currentLookAt.current.lerp(targetLookAt.current, Math.min(delta * dampSpeed, 0.16));
      camera.lookAt(currentLookAt.current);

      // Compute currently viewed artwork for HUD indicator
      if (onActiveArtworkChange) {
        let nearest: Artwork | null = null;
        let minScore = 7.5;

        for (const art of ARTWORKS) {
          const t = getArtworkTransform(art.id);
          const artPos = new THREE.Vector3(...t.position);
          // Score combines gaze proximity and camera physical proximity
          const gazeDist = currentLookAt.current.distanceTo(artPos);
          const camDist = camera.position.distanceTo(artPos);
          const score = gazeDist * 1.2 + camDist * 0.5;

          if (score < minScore) {
            minScore = score;
            nearest = art;
          }
        }

        if (nearest && lastActiveId.current !== nearest.id) {
          lastActiveId.current = nearest.id;
          onActiveArtworkChange(nearest);
        } else if (!nearest && lastActiveId.current !== null) {
          lastActiveId.current = null;
          onActiveArtworkChange(null);
        }
      }
    }

    // Move the single dynamic gallery fill light with the visitor's gaze
    if (visitorLightRef.current) {
      visitorLightRef.current.position
        .copy(camera.position)
        .lerp(currentLookAt.current, 0.45);
      visitorLightRef.current.position.y += 1.1;
    }
  });

  return (
    <pointLight
      ref={visitorLightRef}
      intensity={2.4}
      color="#fff2dc"
      distance={14}
      decay={1.6}
    />
  );
};
