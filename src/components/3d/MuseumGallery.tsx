import React, { Suspense, useMemo } from 'react';
import { Text, Sparkles } from '@react-three/drei';
import { Artwork, MASTERWORKS, STUDIES, EXHIBITION_METADATA } from '../../data/artworks';
import { getArtworkTransform } from '../../data/artworkTransforms';
import { getPlasterWallTexture } from '../../utils/proceduralTextures';
import { FramedArtwork } from './FramedArtwork';
import {
  CenterpieceSculpture,
  GalleryBench,
  ArchivalVitrine,
  DraftingTable
} from './ProceduralModels';

interface MuseumGalleryProps {
  onSelectArtwork: (artwork: Artwork) => void;
  inspectedArtworkId?: string;
}

/**
 * Architectural Ceiling Lighting Track with Miniature LED Spotlights
 */
const CeilingTrack: React.FC<{
  position: [number, number, number];
  length: number;
  rotation?: [number, number, number];
  lightSpacing?: number;
}> = ({ position, length, rotation = [0, 0, 0], lightSpacing = 3.5 }) => {
  const count = Math.floor(length / lightSpacing);
  return (
    <group position={position} rotation={rotation}>
      {/* Extruded Matte Black Aluminum Rail */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.06, 0.08, length]} />
        <meshStandardMaterial color="#14161b" roughness={0.28} metalness={0.85} />
      </mesh>
      {/* Miniature Cylindrical Track Spotlight Fixtures */}
      {Array.from({ length: count }).map((_, i) => {
        const z = -length / 2 + (i + 0.5) * lightSpacing;
        return (
          <group key={i} position={[0, -0.08, z]}>
            {/* Fixture Adapter */}
            <mesh position={[0, 0.03, 0]}>
              <boxGeometry args={[0.04, 0.04, 0.06]} />
              <meshStandardMaterial color="#111215" roughness={0.4} metalness={0.9} />
            </mesh>
            {/* Angled Spotlight Cylinder */}
            <mesh rotation={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.032, 0.036, 0.11, 16]} />
              <meshStandardMaterial color="#1a1c22" roughness={0.3} metalness={0.8} />
            </mesh>
            {/* Brass Bezel Accent Ring */}
            <mesh position={[0, -0.05, 0.02]} rotation={[0.4, 0, 0]}>
              <torusGeometry args={[0.035, 0.004, 8, 16]} />
              <meshStandardMaterial color="#cba76b" roughness={0.2} metalness={0.9} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

/**
 * Recessed Architectural Shadow-Gap Baseboard with Brushed Brass Inlay
 */
const WallBaseboard: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  length: number;
}> = ({ position, rotation = [0, 0, 0], length }) => (
  <group position={position} rotation={rotation}>
    {/* Dark Recessed Shadow Channel */}
    <mesh position={[0, 0.045, 0.008]}>
      <planeGeometry args={[length, 0.09]} />
      <meshStandardMaterial color="#0d0e12" roughness={0.85} metalness={0.2} />
    </mesh>
    {/* Hairline Champagne Brass Reveal Strip */}
    <mesh position={[0, 0.092, 0.012]}>
      <planeGeometry args={[length, 0.012]} />
      <meshStandardMaterial color="#cba76b" roughness={0.22} metalness={0.9} />
    </mesh>
  </group>
);

/**
 * Inlaid Brushed Brass Doorway Threshold Plate
 */
const DoorwayThreshold: React.FC<{
  position: [number, number, number];
  width: number;
}> = ({ position, width }) => (
  <group position={position}>
    <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width, 0.42]} />
      <meshStandardMaterial color="#16181f" roughness={0.35} metalness={0.5} />
    </mesh>
    <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width - 0.08, 0.06]} />
      <meshStandardMaterial color="#cba76b" roughness={0.2} metalness={0.92} />
    </mesh>
  </group>
);

export const MuseumGallery: React.FC<MuseumGalleryProps> = ({
  onSelectArtwork,
  inspectedArtworkId
}) => {
  const plasterBump = useMemo(() => getPlasterWallTexture(), []);

  return (
    <group>
      {/* =========================================================================
          ATMOSPHERIC CONTEMPORARY GALLERY ILLUMINATION
          Subdued architectural ambient allowing focused picture lamps to step out
         ========================================================================= */}
      <ambientLight intensity={0.32} color="#e8e2d8" />
      <hemisphereLight args={['#ede5d8', '#111216', 0.22]} />
      <directionalLight
        position={[0, 18, -35]}
        intensity={0.38}
        color="#fff5e2"
      />

      {/* =========================================================================
          UNIFIED MATTE ARCHITECTURAL LIMESTONE FLOOR (Rooms 0–3, Z = 14 to -71)
          Clean, non-reflective matte finish so zero floor glare distracts from the art
         ========================================================================= */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, -28]}>
        <planeGeometry args={[18, 86]} />
        <meshStandardMaterial
          color="#262523"
          bumpMap={plasterBump}
          bumpScale={0.004}
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>

      {/* =========================================================================
          ROOM 0: THE GRAND FOYER (Z = 12 to 2)
          Intimate high-ceiling entrance hall with illuminated curatorial epigraph
         ========================================================================= */}
      <group position={[0, 0, 7]}>
        {/* Ceiling */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.2, 0]}>
          <planeGeometry args={[14, 12]} />
          <meshStandardMaterial color="#3c3935" roughness={0.9} />
        </mesh>
        {/* South Entrance Wall */}
        <mesh position={[0, 2.6, 5]}>
          <planeGeometry args={[14, 5.2]} />
          <meshStandardMaterial color="#181a20" roughness={0.7} />
        </mesh>
        {/* West Wall */}
        <mesh position={[-6.5, 2.6, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[10, 5.2]} />
          <meshStandardMaterial
            color="#68645d"
            bumpMap={plasterBump}
            bumpScale={0.01}
            roughness={0.76}
          />
        </mesh>
        <WallBaseboard position={[-6.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} length={10} />

        {/* East Wall */}
        <mesh position={[6.5, 2.6, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[10, 5.2]} />
          <meshStandardMaterial
            color="#68645d"
            bumpMap={plasterBump}
            bumpScale={0.01}
            roughness={0.76}
          />
        </mesh>
        <WallBaseboard position={[6.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} length={10} />

        {/* North Portal Partition Wall into Room 1 (Z = -5 relative to group = Z = 2 world) */}
        <mesh position={[-4.8, 2.6, -5]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 5.2, 0.5]} />
          <meshStandardMaterial
            color="#3e3c38"
            bumpMap={plasterBump}
            bumpScale={0.008}
            roughness={0.62}
            metalness={0.08}
          />
        </mesh>
        <mesh position={[4.8, 2.6, -5]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 5.2, 0.5]} />
          <meshStandardMaterial
            color="#3e3c38"
            bumpMap={plasterBump}
            bumpScale={0.008}
            roughness={0.62}
            metalness={0.08}
          />
        </mesh>
        {/* Overhead Doorway Header Beam */}
        <mesh position={[0, 4.7, -5]} castShadow receiveShadow>
          <boxGeometry args={[13.2, 1.0, 0.5]} />
          <meshStandardMaterial color="#3e3c38" roughness={0.62} metalness={0.08} />
        </mesh>
        <mesh position={[0, 4.18, -4.73]}>
          <boxGeometry args={[13.24, 0.04, 0.02]} />
          <meshStandardMaterial color="#cba76b" roughness={0.2} metalness={0.92} />
        </mesh>

        {/* Brass Doorway Threshold into Pavilion I */}
        <DoorwayThreshold position={[0, 0, -5]} width={6.2} />

        {/* Exhibition Title Header Inscription */}
        <Text
          position={[0, 4.65, -4.72]}
          fontSize={0.32}
          color="#f5efe4"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.28}
        >
          {EXHIBITION_METADATA.artist.toUpperCase()} · {EXHIBITION_METADATA.exhibitionTitle.toUpperCase()}
        </Text>

        {/* Left Pylon Curatorial Overview */}
        <Text position={[-4.8, 3.45, -4.72]} fontSize={0.14} color="#cba76b" anchorX="center" letterSpacing={0.16}>
          CURATORIAL NOTE
        </Text>
        <Text
          position={[-4.8, 2.45, -4.72]}
          fontSize={0.115}
          color="#d8d2c7"
          anchorX="center"
          maxWidth={2.6}
          textAlign="center"
          lineHeight={1.5}
        >
          {EXHIBITION_METADATA.subtitle}
        </Text>

        {/* Right Pylon Gallery Navigation */}
        <Text position={[4.8, 3.45, -4.72]} fontSize={0.14} color="#cba76b" anchorX="center" letterSpacing={0.16}>
          EXHIBITION GUIDE
        </Text>
        <Text
          position={[4.8, 2.45, -4.72]}
          fontSize={0.115}
          color="#d8d2c7"
          anchorX="center"
          maxWidth={2.6}
          textAlign="center"
          lineHeight={1.5}
        >
          Six architectural halls housing 16 Masterworks & 16 Atelier Studies. Scroll to walk the collection; click any frame to inspect.
        </Text>
      </group>

      {/* =========================================================================
          ROOM 1: PAVILION I · GENESIS (Masterworks 1–5, Z = 2 to -18)
          Enclosed 14m x 20m salon with West, East, and North feature walls
         ========================================================================= */}
      <group position={[0, 0, -8]}>
        {/* Ceiling with Recessed Daylight Skylight Coffer */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.2, 0]}>
          <planeGeometry args={[14, 20]} />
          <meshStandardMaterial color="#3c3935" roughness={0.9} />
        </mesh>
        {/* Recessed Skylight Cove Panel */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.18, 0]}>
          <planeGeometry args={[6.5, 12]} />
          <meshStandardMaterial
            color="#4d4841"
            roughness={0.85}
            emissive="#ffefd2"
            emissiveIntensity={0.07}
          />
        </mesh>

        {/* Ceiling Lighting Tracks */}
        <CeilingTrack position={[-4.5, 5.12, 0]} length={18} />
        <CeilingTrack position={[4.5, 5.12, 0]} length={18} />

        {/* Subtle Atmospheric Gallery Dust Motes */}
        <Sparkles
          position={[0, 2.6, 0]}
          count={38}
          scale={[11, 3.6, 16]}
          size={1.1}
          speed={0.14}
          opacity={0.22}
          color="#ffe9bf"
        />

        {/* West Wall */}
        <mesh position={[-7.0, 2.6, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[20, 5.2]} />
          <meshStandardMaterial
            color="#6e6a63"
            bumpMap={plasterBump}
            bumpScale={0.012}
            roughness={0.76}
          />
        </mesh>
        <WallBaseboard position={[-7.0, 0, 0]} rotation={[0, Math.PI / 2, 0]} length={20} />

        {/* East Wall */}
        <mesh position={[7.0, 2.6, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[20, 5.2]} />
          <meshStandardMaterial
            color="#6e6a63"
            bumpMap={plasterBump}
            bumpScale={0.012}
            roughness={0.76}
          />
        </mesh>
        <WallBaseboard position={[7.0, 0, 0]} rotation={[0, -Math.PI / 2, 0]} length={20} />

        {/* North Wall with Feature Wall holding Masterwork #03 & Exit Doorway to Room 2 */}
        <mesh position={[-2.4, 2.6, -10]} castShadow receiveShadow>
          <boxGeometry args={[9.2, 5.2, 0.4]} />
          <meshStandardMaterial
            color="#5e5a54"
            bumpMap={plasterBump}
            bumpScale={0.01}
            roughness={0.7}
          />
        </mesh>
        <WallBaseboard position={[-2.4, 0, -9.8]} rotation={[0, 0, 0]} length={9.2} />

        <mesh position={[6.2, 2.6, -10]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 5.2, 0.4]} />
          <meshStandardMaterial color="#5e5a54" roughness={0.7} />
        </mesh>
        <mesh position={[3.8, 4.6, -10]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 1.2, 0.4]} />
          <meshStandardMaterial color="#5e5a54" roughness={0.7} />
        </mesh>
        <DoorwayThreshold position={[3.8, 0, -10]} width={3.2} />

        <Text position={[3.8, 4.3, -9.78]} fontSize={0.15} color="#cba76b" letterSpacing={0.16} anchorX="center">
          TO ROOM II · THE ROTUNDA →
        </Text>

        {/* Room Title Plaque */}
        <Text position={[0, 4.7, 9.78]} fontSize={0.22} color="#cba76b" letterSpacing={0.2} anchorX="center">
          PAVILION I · GENESIS
        </Text>

        {/* Minimalist Floating Travertine Gallery Bench */}
        <GalleryBench position={[1.8, 0, -2]} length={2.5} rotation={[0, 0, 0]} />
      </group>

      <Suspense fallback={null}>
        {MASTERWORKS.slice(0, 5).map((art) => {
          const t = getArtworkTransform(art.id);
          return (
            <FramedArtwork
              key={art.id}
              artwork={art}
              position={t.position}
              rotation={t.rotation}
              baseHeight={t.baseHeight}
              isInspected={inspectedArtworkId === art.id}
              onSelect={onSelectArtwork}
            />
          );
        })}
      </Suspense>

      {/* =========================================================================
          ROOM 2: THE CENTRAL ROTUNDA (Masterworks 6–10, Center: [0, 0, -33])
          Grand octagonal rotunda with perimeter niches framing kinetic chandelier
         ========================================================================= */}
      <group position={[0, 0, -33]}>
        {/* Rotunda Dome Ceiling with Central Recessed Skylight */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.2, 0]}>
          <circleGeometry args={[12.5, 48]} />
          <meshStandardMaterial color="#383530" roughness={0.9} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.18, 0]}>
          <circleGeometry args={[4.2, 48]} />
          <meshStandardMaterial
            color="#4d4841"
            roughness={0.85}
            emissive="#ffefd2"
            emissiveIntensity={0.08}
          />
        </mesh>

        {/* Dedicated Warm Spotlight on Kinetic Chandelier & Medallion */}
        <pointLight position={[0, 4.8, 0]} intensity={2.4} color="#ffefd2" distance={9} decay={1.6} />

        {/* Golden Dust Motes Drifting Under the Rotunda Ocular Dome */}
        <Sparkles
          position={[0, 2.8, 0]}
          count={48}
          scale={[9, 4.2, 9]}
          size={1.3}
          speed={0.16}
          opacity={0.28}
          color="#ffe5b4"
        />

        {/* Watertight Octagonal Rotunda Wall Bays (Inward-Facing Normals) */}
        {/* SW Diagonal Wall */}
        <mesh position={[-5.6, 2.6, 9.2]} rotation={[0, (3 * Math.PI) / 4, 0]}>
          <planeGeometry args={[6.5, 5.2]} />
          <meshStandardMaterial color="#66625b" bumpMap={plasterBump} bumpScale={0.012} roughness={0.75} />
        </mesh>
        <WallBaseboard position={[-5.6, 0, 9.2]} rotation={[0, (3 * Math.PI) / 4, 0]} length={6.5} />

        {/* West Wall (Holds MW 06 & MW 07) */}
        <mesh position={[-7.8, 2.6, 1.0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[12.4, 5.2]} />
          <meshStandardMaterial color="#66625b" bumpMap={plasterBump} bumpScale={0.012} roughness={0.75} />
        </mesh>
        <WallBaseboard position={[-7.8, 0, 1.0]} rotation={[0, Math.PI / 2, 0]} length={12.4} />

        {/* NW Diagonal Bay (Holds MW 08 — faces South-East toward visitor!) */}
        <mesh position={[-5.6, 2.6, -7.2]} rotation={[0, Math.PI / 4, 0]}>
          <planeGeometry args={[6.5, 5.2]} />
          <meshStandardMaterial color="#66625b" bumpMap={plasterBump} bumpScale={0.012} roughness={0.75} />
        </mesh>
        <WallBaseboard position={[-5.6, 0, -7.2]} rotation={[0, Math.PI / 4, 0]} length={6.5} />

        {/* NE Diagonal Bay (Holds MW 09 — faces South-West toward visitor!) */}
        <mesh position={[5.6, 2.6, -7.2]} rotation={[0, -Math.PI / 4, 0]}>
          <planeGeometry args={[6.5, 5.2]} />
          <meshStandardMaterial color="#66625b" bumpMap={plasterBump} bumpScale={0.012} roughness={0.75} />
        </mesh>
        <WallBaseboard position={[5.6, 0, -7.2]} rotation={[0, -Math.PI / 4, 0]} length={6.5} />

        {/* East Wall (Holds MW 10) */}
        <mesh position={[7.8, 2.6, 1.0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[12.4, 5.2]} />
          <meshStandardMaterial color="#66625b" bumpMap={plasterBump} bumpScale={0.012} roughness={0.75} />
        </mesh>
        <WallBaseboard position={[7.8, 0, 1.0]} rotation={[0, -Math.PI / 2, 0]} length={12.4} />

        {/* SE Diagonal Wall */}
        <mesh position={[5.6, 2.6, 9.2]} rotation={[0, (-3 * Math.PI) / 4, 0]}>
          <planeGeometry args={[6.5, 5.2]} />
          <meshStandardMaterial color="#66625b" bumpMap={plasterBump} bumpScale={0.012} roughness={0.75} />
        </mesh>
        <WallBaseboard position={[5.6, 0, 9.2]} rotation={[0, (-3 * Math.PI) / 4, 0]} length={6.5} />

        {/* North Portal Lintel leading into Room 3 */}
        <group position={[0, 2.6, -9.4]}>
          <mesh position={[-3.4, 0, 0]}>
            <boxGeometry args={[1.6, 5.2, 0.5]} />
            <meshStandardMaterial color="#58544e" roughness={0.65} />
          </mesh>
          <mesh position={[3.4, 0, 0]}>
            <boxGeometry args={[1.6, 5.2, 0.5]} />
            <meshStandardMaterial color="#58544e" roughness={0.65} />
          </mesh>
          <mesh position={[0, 2.1, 0]}>
            <boxGeometry args={[8.4, 1.0, 0.5]} />
            <meshStandardMaterial color="#58544e" roughness={0.65} />
          </mesh>
          <Text position={[0, 2.1, 0.28]} fontSize={0.16} color="#cba76b" letterSpacing={0.16} anchorX="center">
            ROOM III · PAVILION II: VISIONS →
          </Text>
        </group>
        <DoorwayThreshold position={[0, 0, -9.4]} width={5.2} />

        {/* Room Header Text */}
        <Text position={[0, 4.8, 7.8]} fontSize={0.22} color="#cba76b" letterSpacing={0.2} anchorX="center">
          ROOM II · THE CENTRAL ROTUNDA
        </Text>

        {/* Overhead Kinetic Chandelier (Hovering at Y = 3.65, zero walkway collision) */}
        <CenterpieceSculpture position={[0, 0, 0]} />
      </group>

      <Suspense fallback={null}>
        {MASTERWORKS.slice(5, 10).map((art) => {
          const t = getArtworkTransform(art.id);
          return (
            <FramedArtwork
              key={art.id}
              artwork={art}
              position={t.position}
              rotation={t.rotation}
              baseHeight={t.baseHeight}
              isInspected={inspectedArtworkId === art.id}
              onSelect={onSelectArtwork}
            />
          );
        })}
      </Suspense>

      {/* =========================================================================
          ROOM 3: PAVILION II · VISIONS (Masterworks 11–16, Z = -45 to -69)
          Grand 15m x 24m salon culminating in flagship Masterwork #16
         ========================================================================= */}
      <group position={[0, 0, -57]}>
        {/* Ceiling with Recessed Daylight Skylight */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.2, 0]}>
          <planeGeometry args={[15, 24]} />
          <meshStandardMaterial color="#3c3935" roughness={0.9} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.18, 0]}>
          <planeGeometry args={[7.5, 14]} />
          <meshStandardMaterial
            color="#4d4841"
            roughness={0.85}
            emissive="#ffefd2"
            emissiveIntensity={0.07}
          />
        </mesh>

        {/* Ceiling Lighting Tracks */}
        <CeilingTrack position={[-5.0, 5.12, 0]} length={22} />
        <CeilingTrack position={[5.0, 5.12, 0]} length={22} />

        {/* Subtle Atmospheric Gallery Dust Motes */}
        <Sparkles
          position={[0, 2.6, 0]}
          count={42}
          scale={[12, 3.6, 20]}
          size={1.1}
          speed={0.14}
          opacity={0.22}
          color="#ffe9bf"
        />

        {/* West Wall */}
        <mesh position={[-7.5, 2.6, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[24, 5.2]} />
          <meshStandardMaterial
            color="#6e6a63"
            bumpMap={plasterBump}
            bumpScale={0.012}
            roughness={0.76}
          />
        </mesh>
        <WallBaseboard position={[-7.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} length={24} />

        {/* East Wall */}
        <mesh position={[7.5, 2.6, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[24, 5.2]} />
          <meshStandardMaterial
            color="#6e6a63"
            bumpMap={plasterBump}
            bumpScale={0.012}
            roughness={0.76}
          />
        </mesh>
        <WallBaseboard position={[7.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} length={24} />

        {/* North Wall: Grand Feature Wall with Masterwork #16 & Symmetrical Exit Portals */}
        <mesh position={[0, 2.6, -12]} castShadow receiveShadow>
          <boxGeometry args={[6.8, 5.2, 0.4]} />
          <meshStandardMaterial
            color="#5e5a54"
            bumpMap={plasterBump}
            bumpScale={0.01}
            roughness={0.7}
          />
        </mesh>
        <WallBaseboard position={[0, 0, -11.8]} rotation={[0, 0, 0]} length={6.8} />

        {/* Left Exit Portal to Drawing Studio */}
        <mesh position={[-6.2, 2.6, -12]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 5.2, 0.4]} />
          <meshStandardMaterial color="#5e5a54" roughness={0.7} />
        </mesh>
        <mesh position={[-4.0, 4.6, -12]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 1.2, 0.4]} />
          <meshStandardMaterial color="#5e5a54" roughness={0.7} />
        </mesh>
        {/* Right Exit Portal to Drawing Studio */}
        <mesh position={[6.2, 2.6, -12]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 5.2, 0.4]} />
          <meshStandardMaterial color="#5e5a54" roughness={0.7} />
        </mesh>
        <mesh position={[4.0, 4.6, -12]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 1.2, 0.4]} />
          <meshStandardMaterial color="#5e5a54" roughness={0.7} />
        </mesh>
        <DoorwayThreshold position={[4.0, 0, -12]} width={2.8} />

        <Text position={[4.0, 4.3, -11.78]} fontSize={0.15} color="#cba76b" letterSpacing={0.14} anchorX="center">
          TO ROOM IV · DRAWING STUDIO →
        </Text>
        <Text position={[0, 4.8, 11.78]} fontSize={0.22} color="#cba76b" letterSpacing={0.2} anchorX="center">
          ROOM III · PAVILION II: VISIONS
        </Text>

        {/* Centered Minimalist Gallery Bench facing Masterwork #16 */}
        <GalleryBench position={[0, 0, -2]} length={2.8} rotation={[0, 0, 0]} />
      </group>

      <Suspense fallback={null}>
        {MASTERWORKS.slice(10, 16).map((art) => {
          const t = getArtworkTransform(art.id);
          return (
            <FramedArtwork
              key={art.id}
              artwork={art}
              position={t.position}
              rotation={t.rotation}
              baseHeight={t.baseHeight}
              isInspected={inspectedArtworkId === art.id}
              onSelect={onSelectArtwork}
            />
          );
        })}
      </Suspense>

      {/* =========================================================================
          ROOM 4: THE DRAWING STUDIO (Studies 1–8, Z = -73 to -93)
          Authentic artist atelier with warm oak planks, pinboards, tables & easels
         ========================================================================= */}
      <group position={[0, 0, -83]}>
        {/* Warm Matte Oak Studio Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
          <planeGeometry args={[14, 22]} />
          <meshStandardMaterial color="#2e2116" roughness={0.92} metalness={0.0} />
        </mesh>
        {/* Studio Ceiling */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.2, 0]}>
          <planeGeometry args={[14, 20]} />
          <meshStandardMaterial color="#302c27" roughness={0.88} />
        </mesh>

        {/* Ceiling Lighting Tracks */}
        <CeilingTrack position={[-4.5, 5.12, 0]} length={18} />
        <CeilingTrack position={[4.5, 5.12, 0]} length={18} />

        {/* Golden Studio Dust Motes */}
        <Sparkles
          position={[0, 2.4, 0]}
          count={36}
          scale={[11, 3.2, 16]}
          size={1.15}
          speed={0.12}
          opacity={0.24}
          color="#ffdfa8"
        />

        {/* West Studio Wall & Natural Cork Pinboard */}
        <mesh position={[-7.0, 2.6, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[20, 5.2]} />
          <meshStandardMaterial color="#585249" bumpMap={plasterBump} bumpScale={0.01} roughness={0.78} />
        </mesh>
        <WallBaseboard position={[-7.0, 0, 0]} rotation={[0, Math.PI / 2, 0]} length={20} />
        <mesh position={[-6.95, 2.2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[17, 3.2]} />
          <meshStandardMaterial color="#6e573e" bumpMap={plasterBump} bumpScale={0.018} roughness={0.92} />
        </mesh>

        {/* East Studio Wall & Natural Cork Pinboard */}
        <mesh position={[7.0, 2.6, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[20, 5.2]} />
          <meshStandardMaterial color="#585249" bumpMap={plasterBump} bumpScale={0.01} roughness={0.78} />
        </mesh>
        <WallBaseboard position={[7.0, 0, 0]} rotation={[0, -Math.PI / 2, 0]} length={20} />
        <mesh position={[6.95, 2.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[17, 3.2]} />
          <meshStandardMaterial color="#6e573e" bumpMap={plasterBump} bumpScale={0.018} roughness={0.92} />
        </mesh>

        {/* Central Studio Drafting Table Island (low profile at X=0, zero artwork sightline obstruction) */}
        <DraftingTable position={[0, 0, 0]} rotation={[0, 0, 0]} />

        {/* North Portal Partition Wall into Study Archive */}
        <mesh position={[-4.5, 2.6, -10]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 5.2, 0.4]} />
          <meshStandardMaterial color="#4e4941" roughness={0.7} />
        </mesh>
        <mesh position={[4.5, 2.6, -10]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 5.2, 0.4]} />
          <meshStandardMaterial color="#4e4941" roughness={0.7} />
        </mesh>
        <mesh position={[0, 4.6, -10]} castShadow receiveShadow>
          <boxGeometry args={[14, 1.2, 0.4]} />
          <meshStandardMaterial color="#4e4941" roughness={0.7} />
        </mesh>
        <DoorwayThreshold position={[0, 0, -10]} width={4.8} />

        <Text position={[0, 4.3, -9.78]} fontSize={0.15} color="#cba76b" letterSpacing={0.14} anchorX="center">
          TO ROOM V · THE STUDY ARCHIVE →
        </Text>

        <Text position={[0, 4.7, 9.78]} fontSize={0.22} color="#cba76b" letterSpacing={0.2} anchorX="center">
          ROOM IV · THE DRAWING STUDIO
        </Text>
      </group>

      <Suspense fallback={null}>
        {STUDIES.slice(0, 8).map((art) => {
          const t = getArtworkTransform(art.id);
          return (
            <FramedArtwork
              key={art.id}
              artwork={art}
              position={t.position}
              rotation={t.rotation}
              baseHeight={t.baseHeight}
              isInspected={inspectedArtworkId === art.id}
              onSelect={onSelectArtwork}
            />
          );
        })}
      </Suspense>

      {/* =========================================================================
          ROOM 5: THE MASTER STUDY ARCHIVE (Studies 9–16, Z = -96 to -116)
          Intimate charcoal exhibition vault with central vitrine display case
         ========================================================================= */}
      <group position={[0, 0, -106]}>
        {/* Matte Charcoal Basalt Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[14, 24]} />
          <meshStandardMaterial color="#181a20" roughness={0.94} metalness={0.0} />
        </mesh>
        {/* Ceiling */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.2, 0]}>
          <planeGeometry args={[14, 20]} />
          <meshStandardMaterial color="#121318" roughness={0.9} />
        </mesh>

        {/* Ceiling Lighting Tracks */}
        <CeilingTrack position={[-4.5, 5.12, 0]} length={18} />
        <CeilingTrack position={[4.5, 5.12, 0]} length={18} />

        {/* Subtle Vault Dust Motes */}
        <Sparkles
          position={[0, 2.2, 0]}
          count={32}
          scale={[10, 3.0, 16]}
          size={1.1}
          speed={0.12}
          opacity={0.25}
          color="#cba76b"
        />

        {/* West Archival Wall */}
        <mesh position={[-7.0, 2.6, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[20, 5.2]} />
          <meshStandardMaterial color="#1e2028" bumpMap={plasterBump} bumpScale={0.01} roughness={0.72} />
        </mesh>
        <WallBaseboard position={[-7.0, 0, 0]} rotation={[0, Math.PI / 2, 0]} length={20} />

        {/* East Archival Wall */}
        <mesh position={[7.0, 2.6, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[20, 5.2]} />
          <meshStandardMaterial color="#1e2028" bumpMap={plasterBump} bumpScale={0.01} roughness={0.72} />
        </mesh>
        <WallBaseboard position={[7.0, 0, 0]} rotation={[0, -Math.PI / 2, 0]} length={20} />

        {/* Archival Museum Showcase Vitrine Island (Centerpiece of the Archive) */}
        <ArchivalVitrine position={[0, 0, 0]} />

        {/* North Portal Partition Wall into Curatorial Desk */}
        <mesh position={[-4.2, 2.6, -10]} castShadow receiveShadow>
          <boxGeometry args={[4.4, 5.2, 0.4]} />
          <meshStandardMaterial color="#1c1e26" roughness={0.7} />
        </mesh>
        <mesh position={[4.2, 2.6, -10]} castShadow receiveShadow>
          <boxGeometry args={[4.4, 5.2, 0.4]} />
          <meshStandardMaterial color="#1c1e26" roughness={0.7} />
        </mesh>
        <mesh position={[0, 4.6, -10]} castShadow receiveShadow>
          <boxGeometry args={[14, 1.2, 0.4]} />
          <meshStandardMaterial color="#1c1e26" roughness={0.7} />
        </mesh>
        <DoorwayThreshold position={[0, 0, -10]} width={5.2} />

        <Text position={[0, 4.3, -9.78]} fontSize={0.15} color="#cba76b" letterSpacing={0.14} anchorX="center">
          TO CURATORIAL DESK & LOUNGE →
        </Text>

        <Text position={[0, 4.7, 9.78]} fontSize={0.22} color="#cba76b" letterSpacing={0.2} anchorX="center">
          ROOM V · THE STUDY ARCHIVE
        </Text>
      </group>

      <Suspense fallback={null}>
        {STUDIES.slice(8, 16).map((art) => {
          const t = getArtworkTransform(art.id);
          return (
            <FramedArtwork
              key={art.id}
              artwork={art}
              position={t.position}
              rotation={t.rotation}
              baseHeight={t.baseHeight}
              isInspected={inspectedArtworkId === art.id}
              onSelect={onSelectArtwork}
            />
          );
        })}
      </Suspense>

      {/* =========================================================================
          ROOM 6: CURATORIAL LOUNGE & RECEPTION DESK (Z = -119 to -133)
          Artist statement, monograph presentation & commission inquiries
         ========================================================================= */}
      <group position={[0, 0, -125]}>
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[14, 16]} />
          <meshStandardMaterial color="#16181e" roughness={0.94} metalness={0.0} />
        </mesh>
        {/* Ceiling */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5.2, 0]}>
          <planeGeometry args={[14, 14]} />
          <meshStandardMaterial color="#121318" roughness={0.9} />
        </mesh>

        {/* North Back Wall */}
        <mesh position={[0, 2.6, -6.5]}>
          <planeGeometry args={[14, 5.2]} />
          <meshStandardMaterial color="#1a1d24" bumpMap={plasterBump} bumpScale={0.01} roughness={0.62} />
        </mesh>
        <WallBaseboard position={[0, 0, -6.5]} rotation={[0, 0, 0]} length={14} />

        {/* Curatorial Reception Counter */}
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.4, 1.1, 1.3]} />
          <meshStandardMaterial color="#252832" roughness={0.28} metalness={0.35} />
        </mesh>
        <mesh position={[0, 1.12, 0]}>
          <boxGeometry args={[4.6, 0.05, 1.4]} />
          <meshStandardMaterial color="#cba76b" roughness={0.22} metalness={0.88} />
        </mesh>

        {/* Inscribed Statement Typography */}
        <Text position={[0, 3.65, -6.3]} fontSize={0.36} color="#cba76b" letterSpacing={0.2} anchorX="center">
          CURATORIAL DESK
        </Text>
        <Text position={[0, 2.95, -6.3]} fontSize={0.16} color="#f5efe4" letterSpacing={0.14} anchorX="center">
          COMMISSION STATUS: {EXHIBITION_METADATA.commissionStatus.toUpperCase()}
        </Text>
        <Text
          position={[0, 2.05, -6.3]}
          fontSize={0.125}
          color="#b8bdc8"
          maxWidth={6.6}
          textAlign="center"
          lineHeight={1.55}
          anchorX="center"
        >
          {EXHIBITION_METADATA.statement}
        </Text>
      </group>
    </group>
  );
};
