import React, { useState, useMemo } from 'react';
import { useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Artwork, ARTWORKS } from '../../data/artworks';
import {
  getCanvasWeaveTexture,
  getLightHaloTexture
} from '../../utils/proceduralTextures';

// Eagerly preload all 32 artwork textures at startup so they download in parallel during the loading screen
ARTWORKS.forEach((art) => {
  useTexture.preload(art.textureUrl);
});

interface FramedArtworkProps {
  artwork: Artwork;
  position: [number, number, number];
  rotation?: [number, number, number];
  baseHeight?: number;
  isInspected?: boolean;
  onSelect: (artwork: Artwork) => void;
}

// No-op raycast function for decorative sub-meshes so pointer events only test the 1 main frame box
const NO_RAYCAST = () => null;

// Shared static geometries & materials across all 32 frames (huge draw-call & memory savings)
const SHARED_ESCUTCHEON_GEO = new THREE.BoxGeometry(0.22, 0.05, 0.025);
const SHARED_ESCUTCHEON_TRIM_GEO = new THREE.BoxGeometry(0.18, 0.028, 0.006);
const SHARED_ARM_GEO = new THREE.CylinderGeometry(0.006, 0.006, 0.28, 8);
const SHARED_KNUCKLE_GEO = new THREE.CylinderGeometry(0.011, 0.011, 0.024, 8);
const SHARED_ENDCAP_GEO = new THREE.CylinderGeometry(0.0255, 0.0255, 0.018, 12);
const SHARED_SPLINE_GEO = new THREE.BoxGeometry(0.042, 0.042, 0.005);
const SHARED_PLACARD_SHADOW_GEO = new THREE.PlaneGeometry(0.44, 0.23);
const SHARED_PLACARD_GEO = new THREE.PlaneGeometry(0.42, 0.21);
const SHARED_PLACARD_EDGE_GEO = new THREE.EdgesGeometry(SHARED_PLACARD_GEO);

const SHARED_BRONZE_MAT = new THREE.MeshStandardMaterial({
  color: '#16181e',
  roughness: 0.28,
  metalness: 0.82
});

const SHARED_BRASS_MAT = new THREE.MeshStandardMaterial({
  color: '#cba76b',
  roughness: 0.22,
  metalness: 0.88
});

const SHARED_CAVITY_MAT = new THREE.MeshStandardMaterial({
  color: '#090a0d',
  roughness: 0.96
});

const SHARED_MATBOARD_MAT = new THREE.MeshStandardMaterial({
  color: '#dfd7c8',
  roughness: 0.92,
  metalness: 0.0
});

const SHARED_SHADOW_MAT = new THREE.MeshBasicMaterial({
  color: '#040507',
  transparent: true,
  opacity: 0.58,
  depthWrite: false
});

export const FramedArtwork: React.FC<FramedArtworkProps> = ({
  artwork,
  position,
  rotation = [0, 0, 0],
  baseHeight = 2.35,
  isInspected = false,
  onSelect
}) => {
  const [hovered, setHovered] = useState(false);

  // Load optimized WebP artwork texture
  const texture = useTexture(artwork.textureUrl);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;

  // Procedural micro-textures (cached singletons)
  const canvasWeave = useMemo(() => getCanvasWeaveTexture(), []);
  const lightHalo = useMemo(() => getLightHaloTexture(), []);

  // Compute physical dimensions preserving exact aspect ratio
  const height = baseHeight;
  const width = Math.round(baseHeight * artwork.aspectRatio * 100) / 100;

  // Floating Shadowbox Frame Profile Specifications
  const isMasterwork = artwork.hall === 'hall-1';
  const matBorder = isMasterwork ? 0 : 0.085;
  const frameThickness = isMasterwork ? 0.075 : 0.055;
  const frameDepth = 0.085;
  const shadowGap = isMasterwork ? 0.028 : 0.015;

  const outerWidth = width + (matBorder + shadowGap + frameThickness) * 2;
  const outerHeight = height + (matBorder + shadowGap + frameThickness) * 2;
  const lampWidth = Math.min(outerWidth * 0.68, 1.65);

  const isHighlighted = hovered || isInspected;

  return (
    <group position={position} rotation={rotation}>
      {/* 0. Scalloped Museum Spotlight Wall Wash Halo (Simulates halogen wall grazing without per-frame pointLight lag) */}
      <mesh position={[0, 0.12, -0.072]} renderOrder={1} raycast={NO_RAYCAST}>
        <planeGeometry args={[outerWidth * 2.15, outerHeight * 2.05]} />
        <meshBasicMaterial
          map={lightHalo}
          transparent
          opacity={isHighlighted ? 0.96 : 0.78}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>

      {/* 1. Dedicated Architectural Museum Picture Lamp */}
      <group position={[0, outerHeight / 2 + 0.16, 0.22]}>
        {/* Recessed Wall Mounting Escutcheon Plate */}
        <mesh
          position={[0, 0, -0.25]}
          geometry={SHARED_ESCUTCHEON_GEO}
          material={SHARED_BRONZE_MAT}
          raycast={NO_RAYCAST}
        />
        {/* Brushed Brass Escutcheon Trim */}
        <mesh
          position={[0, 0, -0.236]}
          geometry={SHARED_ESCUTCHEON_TRIM_GEO}
          material={SHARED_BRASS_MAT}
          raycast={NO_RAYCAST}
        />

        {/* Dual Slim Cantilever Brass Arms */}
        {[-0.18, 0.18].map((x, i) => (
          <group key={i} position={[x, 0.012, -0.11]}>
            <mesh
              rotation={[Math.PI / 2 + 0.14, 0, 0]}
              geometry={SHARED_ARM_GEO}
              material={SHARED_BRASS_MAT}
              raycast={NO_RAYCAST}
            />
            <mesh
              position={[0, 0.018, 0.13]}
              geometry={SHARED_KNUCKLE_GEO}
              material={SHARED_BRASS_MAT}
              raycast={NO_RAYCAST}
            />
          </group>
        ))}

        {/* Horizontal Cylindrical Bronze Lamp Hood */}
        <mesh
          position={[0, 0.032, 0.02]}
          rotation={[0, 0, Math.PI / 2]}
          material={SHARED_BRONZE_MAT}
          raycast={NO_RAYCAST}
        >
          <cylinderGeometry args={[0.024, 0.024, lampWidth, 12]} />
        </mesh>

        {/* Brass End-Caps on Lamp Hood */}
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[(side * lampWidth) / 2, 0.032, 0.02]}
            rotation={[0, 0, Math.PI / 2]}
            geometry={SHARED_ENDCAP_GEO}
            material={SHARED_BRASS_MAT}
            raycast={NO_RAYCAST}
          />
        ))}

        {/* Underside Warm Halogen/LED Diffuser Strip */}
        <mesh position={[0, 0.009, 0.02]} rotation={[Math.PI / 2, 0, 0]} raycast={NO_RAYCAST}>
          <planeGeometry args={[lampWidth - 0.04, 0.022]} />
          <meshBasicMaterial color={isHighlighted ? '#ffffff' : '#fff3d6'} />
        </mesh>
      </group>

      {/* 2. Architectural Drop-Shadow Base Plate */}
      <mesh position={[0, -0.035, -0.068]} material={SHARED_SHADOW_MAT} raycast={NO_RAYCAST}>
        <planeGeometry args={[outerWidth + 0.06, outerHeight + 0.06]} />
      </mesh>

      {/* 3. Outer Architectural Shadowbox Frame — SOLE INTERACTIVE HITBOX FOR FAST RAYCASTING */}
      <mesh
        position={[0, 0, -0.042]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(artwork);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={[outerWidth, outerHeight, 0.048]} />
        <meshStandardMaterial
          color={isMasterwork ? (hovered ? '#25211b' : '#141519') : '#3b2b1d'}
          roughness={isMasterwork ? 0.32 : 0.52}
          metalness={isMasterwork ? 0.28 : 0.08}
          emissive={isHighlighted ? '#cba76b' : '#000000'}
          emissiveIntensity={isHighlighted ? 0.16 : 0}
        />
      </mesh>

      {/* 4. Inner Champagne Brass Bezel Liner */}
      <mesh position={[0, 0, -0.014]} material={SHARED_BRASS_MAT} raycast={NO_RAYCAST}>
        <planeGeometry
          args={[
            width + (matBorder + shadowGap) * 2 + 0.014,
            height + (matBorder + shadowGap) * 2 + 0.014
          ]}
        />
      </mesh>

      {/* 5. Deep Recessed Shadow Cavity Backboard */}
      <mesh position={[0, 0, -0.009]} material={SHARED_CAVITY_MAT} raycast={NO_RAYCAST}>
        <planeGeometry args={[width + (matBorder + shadowGap) * 2, height + (matBorder + shadowGap) * 2]} />
      </mesh>

      {/* 6. Archival Museum Rag Matboard (Exclusive to Studies in Rooms IV & V) */}
      {!isMasterwork && (
        <mesh position={[0, 0, 0.004]} material={SHARED_MATBOARD_MAT} raycast={NO_RAYCAST}>
          <planeGeometry args={[width + matBorder * 2, height + matBorder * 2]} />
        </mesh>
      )}

      {/* 7. Fine-Art Archival Matte Canvas Surface with Self-Lit Picture Lamp Illumination & Linen Micro-Bump */}
      <mesh position={[0, 0, 0.012]} raycast={NO_RAYCAST}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive="#fff6e5"
          emissiveIntensity={isHighlighted ? 0.68 : 0.52}
          bumpMap={canvasWeave}
          bumpScale={0.0025}
          roughness={0.95}
          metalness={0.0}
          toneMapped={true}
        />
      </mesh>

      {/* 8. Precision Mitered Brass Frame Corner Splines */}
      {[-1, 1].map((sx) =>
        [-1, 1].map((sy) => (
          <mesh
            key={`${sx}-${sy}`}
            position={[
              (sx * (outerWidth - frameThickness * 0.9)) / 2,
              (sy * (outerHeight - frameThickness * 0.9)) / 2,
              -0.015
            ]}
            geometry={SHARED_SPLINE_GEO}
            material={SHARED_BRASS_MAT}
            raycast={NO_RAYCAST}
          />
        ))
      )}

      {/* 9. Curatorial 3D Museum Wall Accession Placard */}
      {!isInspected && (
        <group position={[outerWidth / 2 + 0.26, -outerHeight / 2 + 0.14, 0.01]}>
          <mesh
            position={[0, -0.006, -0.004]}
            geometry={SHARED_PLACARD_SHADOW_GEO}
            material={SHARED_SHADOW_MAT}
            raycast={NO_RAYCAST}
          />

          <mesh
            geometry={SHARED_PLACARD_GEO}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(artwork);
            }}
          >
            <meshStandardMaterial
              color={hovered ? '#23201a' : '#14161b'}
              roughness={0.35}
              metalness={0.45}
            />
          </mesh>

          <lineSegments geometry={SHARED_PLACARD_EDGE_GEO} raycast={NO_RAYCAST}>
            <lineBasicMaterial color={hovered ? '#ffffff' : '#cba76b'} opacity={0.65} transparent />
          </lineSegments>

          <Text
            position={[-0.18, 0.064, 0.006]}
            fontSize={0.015}
            color="#cba76b"
            anchorX="left"
            anchorY="middle"
            letterSpacing={0.14}
            raycast={NO_RAYCAST}
          >
            {artwork.catalogIndex.toUpperCase()}
          </Text>

          <Text
            position={[-0.18, 0.02, 0.006]}
            fontSize={0.021}
            color="#f5f0e6"
            anchorX="left"
            anchorY="middle"
            maxWidth={0.36}
            letterSpacing={0.02}
            raycast={NO_RAYCAST}
          >
            {artwork.title || artwork.catalogIndex}
          </Text>

          <Text
            position={[-0.18, -0.025, 0.006]}
            fontSize={0.014}
            color="#9da2ae"
            anchorX="left"
            anchorY="middle"
            maxWidth={0.36}
            letterSpacing={0.03}
            raycast={NO_RAYCAST}
          >
            {artwork.medium.split('·')[0].trim()} · {artwork.year}
          </Text>

          <Text
            position={[-0.18, -0.068, 0.006]}
            fontSize={0.013}
            color={hovered ? '#cba76b' : '#686d78'}
            anchorX="left"
            anchorY="middle"
            letterSpacing={0.1}
            raycast={NO_RAYCAST}
          >
            {hovered ? '● CLICK TO INSPECT' : 'CLICK TO INSPECT ↵'}
          </Text>
        </group>
      )}
    </group>
  );
};
