import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 1. Kinetic Centerpiece Celestial Chandelier for Room II (The Central Rotunda)
 * Calder / Studio Drift inspired gyroscopic mobile suspended from dome ceiling.
 * Multi-axis harmonic rotation, precision brass gimbals, optical refractive prism core.
 */
export const CenterpieceSculpture: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const outerRingRef = useRef<THREE.Group>(null);
  const middleRingRef = useRef<THREE.Group>(null);
  const innerRibbonRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y += delta * 0.16;
      outerRingRef.current.rotation.z += delta * 0.08;
    }
    if (middleRingRef.current) {
      middleRingRef.current.rotation.y -= delta * 0.24;
      middleRingRef.current.rotation.x += delta * 0.14;
    }
    if (innerRibbonRef.current) {
      innerRibbonRef.current.rotation.y += delta * 0.38;
      innerRibbonRef.current.rotation.z -= delta * 0.2;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.45;
      coreRef.current.rotation.x += delta * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* --- Inlaid Terrazzo & Brass Compass Medallion (Flush with floor, zero collision) --- */}
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3.2, 64]} />
        <meshStandardMaterial color="#262932" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Outer Brass Ring */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.14, 3.2, 64]} />
        <meshStandardMaterial color="#cba76b" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Mid Accent Brass Ring */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.95, 2.0, 64]} />
        <meshStandardMaterial color="#cba76b" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Inner Rosette Ring */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.78, 0.82, 48]} />
        <meshStandardMaterial color="#cba76b" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* --- Ceiling Rosette & Braided Suspension Rod (Ceiling height: Y = 5.2) --- */}
      <mesh position={[0, 5.16, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.08, 32]} />
        <meshStandardMaterial color="#cba76b" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0, 4.4, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 1.45, 16]} />
        <meshStandardMaterial color="#cba76b" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* --- Overhead Kinetic Chandelier (Hovering at Y = 3.65, well above eye level) --- */}
      <group position={[0, 3.65, 0]}>
        {/* Outer Champagne Brass Gimbal Ring */}
        <group ref={outerRingRef}>
          <mesh castShadow>
            <torusGeometry args={[1.05, 0.038, 16, 64]} />
            <meshStandardMaterial color="#cba76b" roughness={0.18} metalness={0.92} />
          </mesh>
          {/* 4 Counterweight studs */}
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
            <mesh key={i} position={[Math.cos(angle) * 1.05, Math.sin(angle) * 1.05, 0]}>
              <sphereGeometry args={[0.065, 16, 16]} />
              <meshStandardMaterial color="#2d2214" roughness={0.3} metalness={0.8} />
            </mesh>
          ))}
        </group>

        {/* Middle Satin Platinum Gimbal Ring */}
        <group ref={middleRingRef}>
          <mesh castShadow>
            <torusGeometry args={[0.78, 0.03, 16, 64]} />
            <meshStandardMaterial color="#e5e2dc" roughness={0.15} metalness={0.85} />
          </mesh>
        </group>

        {/* Inner Kinetic Mobius Ribbon */}
        <mesh ref={innerRibbonRef} castShadow>
          <torusKnotGeometry args={[0.46, 0.028, 64, 16, 2, 3]} />
          <meshStandardMaterial color="#cba76b" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* Core Refractive Optical Gem Prism */}
        <group ref={coreRef}>
          <mesh>
            <octahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.05}
              metalness={0.9}
              emissive="#cba76b"
              emissiveIntensity={0.4}
            />
          </mesh>
          <mesh>
            <icosahedronGeometry args={[0.14, 0]} />
            <meshStandardMaterial
              color="#cba76b"
              roughness={0.1}
              metalness={1.0}
              emissive="#ffffff"
              emissiveIntensity={0.2}
            />
          </mesh>
        </group>
      </group>

      {/* Gentle ambient chandelier illumination */}
      <pointLight position={[0, 3.65, 0]} intensity={1.8} color="#fff2dc" distance={9} />
    </group>
  );
};

/**
 * 2. Minimalist Monolithic Floating Gallery Bench
 * Bleached honed travertine stone with tufted aniline leather cushion
 * and recessed bronze steel shadow gap base.
 */
export const GalleryBench: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  length?: number;
}> = ({ position, rotation = [0, 0, 0], length = 2.4 }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Recessed Bronze Steel Base Plinth (Shadow gap at floor level) */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[length - 0.5, 0.08, 0.52]} />
        <meshStandardMaterial color="#1a1c22" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Solid Honed Travertine Stone Monolith */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.34, 0.76]} />
        <meshStandardMaterial color="#ece7de" roughness={0.65} metalness={0.05} />
      </mesh>

      {/* Travertine Accent Shadow Reveal Line */}
      <mesh position={[0, 0.425, 0]}>
        <boxGeometry args={[length + 0.01, 0.01, 0.77]} />
        <meshStandardMaterial color="#cba76b" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Top Tufted Aniline Leather Cushion */}
      <mesh position={[0, 0.46, 0]} castShadow>
        <boxGeometry args={[length - 0.1, 0.06, 0.66]} />
        <meshStandardMaterial color="#2d2a26" roughness={0.45} metalness={0.1} />
      </mesh>
    </group>
  );
};

/**
 * 3. Museum Archival Showcase Vitrine (for Room 5: The Study Archive)
 * Frameless museum glass vitrine, bronze plinth, illuminated interior,
 * displaying artist's open sketchbook, graphite drawings, and drafting instruments.
 */
export const ArchivalVitrine: React.FC<{ position: [number, number, number]; rotation?: [number, number, number] }> = ({
  position,
  rotation = [0, 0, 0]
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Recessed Base Plinth */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <boxGeometry args={[1.5, 0.08, 0.7]} />
        <meshStandardMaterial color="#121418" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Monolithic Dark Bronze Steel Island Plinth */}
      <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.8, 0.9]} />
        <meshStandardMaterial color="#1e222a" roughness={0.35} metalness={0.4} />
      </mesh>

      {/* Brass Accent Reveal Trim */}
      <mesh position={[0, 0.885, 0]}>
        <boxGeometry args={[1.82, 0.01, 0.92]} />
        <meshStandardMaterial color="#cba76b" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Archival Linen Display Bed Inside */}
      <mesh position={[0, 0.91, 0]}>
        <boxGeometry args={[1.72, 0.04, 0.82]} />
        <meshStandardMaterial color="#f0ece4" roughness={0.9} />
      </mesh>

      {/* Open Artist Sketchbook */}
      <group position={[-0.15, 0.94, 0]} rotation={[0, 0.15, 0]}>
        {/* Left Page */}
        <mesh position={[-0.16, 0.01, 0]} rotation={[-0.04, 0, -0.05]}>
          <boxGeometry args={[0.3, 0.015, 0.42]} />
          <meshStandardMaterial color="#fdfbf7" roughness={0.85} />
        </mesh>
        {/* Right Page */}
        <mesh position={[0.16, 0.01, 0]} rotation={[-0.04, 0, 0.05]}>
          <boxGeometry args={[0.3, 0.015, 0.42]} />
          <meshStandardMaterial color="#fdfbf7" roughness={0.85} />
        </mesh>
        {/* Sketchbook Spine Binding */}
        <mesh position={[0, 0.005, 0]}>
          <boxGeometry args={[0.03, 0.02, 0.43]} />
          <meshStandardMaterial color="#4a301d" roughness={0.7} />
        </mesh>
      </group>

      {/* Vintage Brass Fountain Pen & Architect Divider */}
      <mesh position={[0.42, 0.945, 0.1]} rotation={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.007, 0.007, 0.22, 16]} />
        <meshStandardMaterial color="#1a1c22" roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh position={[0.42, 0.945, -0.1]} rotation={[0, -0.25, 0]}>
        <boxGeometry args={[0.012, 0.006, 0.24]} />
        <meshStandardMaterial color="#cba76b" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Frameless Opti-White Museum Glass Vitrine Cover */}
      <mesh position={[0, 1.13, 0]}>
        <boxGeometry args={[1.76, 0.42, 0.86]} />
        <meshStandardMaterial
          color="#dbeaf0"
          roughness={0.08}
          metalness={0.1}
          transparent
          opacity={0.32}
        />
      </mesh>

      {/* Interior Showcase Micro-LED Warm Illumination */}
      <pointLight position={[0, 1.18, 0]} intensity={1.2} color="#fff6ea" distance={2.5} />
    </group>
  );
};

/**
 * 4. Procedural Heavy Beechwood Studio Mast Easel
 * Authentic H-frame base with wooden casters, ratchet mast, and primed canvas.
 */
export const StudioEasel: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Heavy H-Frame Base */}
      <mesh position={[-0.38, 0.06, 0]}>
        <boxGeometry args={[0.06, 0.08, 0.85]} />
        <meshStandardMaterial color="#7a5534" roughness={0.65} />
      </mesh>
      <mesh position={[0.38, 0.06, 0]}>
        <boxGeometry args={[0.06, 0.08, 0.85]} />
        <meshStandardMaterial color="#7a5534" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.7, 0.08, 0.06]} />
        <meshStandardMaterial color="#7a5534" roughness={0.65} />
      </mesh>

      {/* Twin Vertical Mast Rails */}
      <mesh position={[-0.14, 1.35, 0]}>
        <boxGeometry args={[0.05, 2.5, 0.05]} />
        <meshStandardMaterial color="#88603b" roughness={0.6} />
      </mesh>
      <mesh position={[0.14, 1.35, 0]}>
        <boxGeometry args={[0.05, 2.5, 0.05]} />
        <meshStandardMaterial color="#88603b" roughness={0.6} />
      </mesh>

      {/* Center Ratchet Gear Strip */}
      <mesh position={[0, 1.35, 0.01]}>
        <boxGeometry args={[0.04, 2.3, 0.02]} />
        <meshStandardMaterial color="#553a22" roughness={0.8} />
      </mesh>

      {/* Adjustable Lower Canvas Rest Shelf with Handwheel Knobs */}
      <mesh position={[0, 1.1, 0.08]} castShadow>
        <boxGeometry args={[1.05, 0.06, 0.14]} />
        <meshStandardMaterial color="#6e4c2e" roughness={0.6} />
      </mesh>
      {/* Wooden Knobs */}
      <mesh position={[-0.32, 1.07, 0.08]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.04, 16]} />
        <meshStandardMaterial color="#cba76b" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0.32, 1.07, 0.08]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.04, 16]} />
        <meshStandardMaterial color="#cba76b" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Stretched Blank Primed Linen Study Canvas Resting on Easel */}
      <mesh position={[0, 1.62, 0.11]} castShadow>
        <boxGeometry args={[0.85, 0.95, 0.04]} />
        <meshStandardMaterial color="#faf6ee" roughness={0.92} />
      </mesh>
      {/* Canvas Edge Framing */}
      <mesh position={[0, 1.62, 0.09]}>
        <boxGeometry args={[0.87, 0.97, 0.02]} />
        <meshStandardMaterial color="#4a3623" roughness={0.7} />
      </mesh>

      {/* Upper Mast Clamp */}
      <mesh position={[0, 2.12, 0.08]}>
        <boxGeometry args={[0.26, 0.05, 0.08]} />
        <meshStandardMaterial color="#6e4c2e" roughness={0.6} />
      </mesh>
    </group>
  );
};

/**
 * 5. Procedural Walnut Artist Palette with Oil Impasto Paint
 */
export const ArtistPalette: React.FC<{ position: [number, number, number]; rotation?: [number, number, number] }> = ({
  position,
  rotation = [0, 0, 0]
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Wooden Oval Palette Body */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.24, 0.015, 32]} />
        <meshStandardMaterial color="#845e39" roughness={0.5} />
      </mesh>

      {/* Thumb Hole */}
      <mesh position={[0.15, 0.01, 0.07]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
        <meshStandardMaterial color="#4e331c" roughness={0.9} />
      </mesh>

      {/* Impasto Paint Dollops with Viscous Oil Sheen */}
      {[
        { color: '#b82020', pos: [-0.16, 0.012, -0.09] }, // Cadmium Red
        { color: '#1c4596', pos: [-0.14, 0.012, 0.02] },  // French Ultramarine
        { color: '#cba76b', pos: [-0.05, 0.012, 0.13] },  // Yellow Ochre
        { color: '#1f6942', pos: [0.06, 0.012, 0.13] },   // Phthalo Green
        { color: '#f7f4ea', pos: [-0.09, 0.012, -0.13] }, // Flake White
        { color: '#3d2415', pos: [0.03, 0.012, -0.13] },  // Raw Umber
        { color: '#96386d', pos: [0.12, 0.012, -0.05] }   // Quinacridone Magenta
      ].map((p, i) => (
        <mesh key={i} position={p.pos as [number, number, number]}>
          <sphereGeometry args={[0.026, 16, 16]} />
          <meshStandardMaterial color={p.color} roughness={0.15} metalness={0.1} />
        </mesh>
      ))}

      {/* Steel Palette Knife with Rosewood Handle */}
      <group position={[-0.04, 0.015, 0]} rotation={[0, -0.3, 0]}>
        <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.005, 0.006, 0.11, 8]} />
          <meshStandardMaterial color="#4a2810" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.005, -0.05]}>
          <boxGeometry args={[0.02, 0.002, 0.09]} />
          <meshStandardMaterial color="#d4d8de" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>
    </group>
  );
};

/**
 * 6. Stoneware Ceramic Brush Jar with Sable & Hog Bristle Brushes
 */
export const BrushJar: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Glazed Ceramic Jar */}
      <mesh position={[0, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.075, 0.26, 24]} />
        <meshStandardMaterial color="#e0d9cd" roughness={0.35} metalness={0.05} />
      </mesh>
      {/* Glaze Rim Accent */}
      <mesh position={[0, 0.26, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.065, 0.006, 12, 24]} />
        <meshStandardMaterial color="#cba76b" roughness={0.25} metalness={0.7} />
      </mesh>

      {/* Array of Fine-Art Brushes Sprouting Out */}
      {[
        { rot: [0.14, 0.22, 0.24], len: 0.36, tipColor: '#cba76b' },
        { rot: [-0.22, -0.12, -0.16], len: 0.4, tipColor: '#b82020' },
        { rot: [0.26, -0.18, -0.1], len: 0.34, tipColor: '#1c4596' },
        { rot: [-0.12, 0.28, 0.18], len: 0.38, tipColor: '#1f6942' },
        { rot: [0.08, -0.32, 0.12], len: 0.35, tipColor: '#4a2810' }
      ].map((b, i) => (
        <group key={i} position={[0, 0.24, 0]} rotation={b.rot as [number, number, number]}>
          <mesh position={[0, b.len / 2, 0]}>
            <cylinderGeometry args={[0.005, 0.006, b.len, 8]} />
            <meshStandardMaterial color="#5c3e24" roughness={0.6} />
          </mesh>
          <mesh position={[0, b.len - 0.02, 0]}>
            <cylinderGeometry args={[0.007, 0.007, 0.04, 12]} />
            <meshStandardMaterial color="#cba76b" metalness={0.92} roughness={0.2} />
          </mesh>
          <mesh position={[0, b.len + 0.02, 0]}>
            <coneGeometry args={[0.008, 0.05, 12]} />
            <meshStandardMaterial color={b.tipColor} roughness={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/**
 * 7. Danish Modern / Jean Prouvé Architect Drafting Table
 * Cast-iron A-frame trestle, tilted solid beechwood top, parallel ruler, lamp & tools.
 */
export const DraftingTable: React.FC<{ position: [number, number, number]; rotation?: [number, number, number] }> = ({
  position,
  rotation = [0, 0, 0]
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Cast Iron A-Frame Trestle Legs */}
      <mesh position={[-0.85, 0.46, 0.38]} castShadow>
        <cylinderGeometry args={[0.025, 0.028, 0.92, 16]} />
        <meshStandardMaterial color="#1e2229" roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh position={[0.85, 0.46, 0.38]} castShadow>
        <cylinderGeometry args={[0.025, 0.028, 0.92, 16]} />
        <meshStandardMaterial color="#1e2229" roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh position={[-0.85, 0.46, -0.38]} castShadow>
        <cylinderGeometry args={[0.025, 0.028, 0.92, 16]} />
        <meshStandardMaterial color="#1e2229" roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh position={[0.85, 0.46, -0.38]} castShadow>
        <cylinderGeometry args={[0.025, 0.028, 0.92, 16]} />
        <meshStandardMaterial color="#1e2229" roughness={0.4} metalness={0.8} />
      </mesh>
      {/* Lower Steel Cross Stretcher */}
      <mesh position={[0, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 1.7, 16]} />
        <meshStandardMaterial color="#1e2229" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Tilted Solid Beechwood Table Surface (18° tilt) */}
      <mesh position={[0, 1.0, 0]} rotation={[0.22, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.05, 1.15]} />
        <meshStandardMaterial color="#9c764e" roughness={0.6} />
      </mesh>
      {/* Green Vinyl Drafting Mat Overlay */}
      <mesh position={[0, 1.028, 0]} rotation={[0.22, 0, 0]}>
        <planeGeometry args={[1.85, 1.0]} />
        <meshStandardMaterial color="#2d4f3e" roughness={0.7} />
      </mesh>

      {/* Stainless Steel Parallel Motion Ruler across drawing board */}
      <mesh position={[0, 1.04, 0.08]} rotation={[0.22, 0, 0]}>
        <boxGeometry args={[1.9, 0.008, 0.06]} />
        <meshStandardMaterial color="#e2e6ec" metalness={0.92} roughness={0.15} />
      </mesh>

      {/* Rolled Blueprint Scrolls on side of desk */}
      <group position={[0.72, 1.06, 0.28]} rotation={[0.22, 0.15, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.035, 0.45, 16]} />
          <meshStandardMaterial color="#eaf0f8" roughness={0.8} />
        </mesh>
      </group>

      {/* Studio Drafting Stool with Padded Leather Seat */}
      <mesh position={[0, 0.28, 0.72]} castShadow>
        <cylinderGeometry args={[0.22, 0.24, 0.56, 20]} />
        <meshStandardMaterial color="#3d2919" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.58, 0.72]} castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.05, 24]} />
        <meshStandardMaterial color="#25272e" roughness={0.45} />
      </mesh>

      {/* Artist Palette on Desk */}
      <ArtistPalette position={[-0.48, 1.08, 0.12]} rotation={[0.22, 0.38, 0]} />

      {/* Brush Jar on Desk */}
      <BrushJar position={[0.44, 1.07, -0.15]} />

      {/* Articulated Architect Pantograph Lamp */}
      <group position={[0.74, 1.12, -0.25]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
          <meshStandardMaterial color="#111" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.22, 0]} rotation={[0, 0, -0.22]}>
          <cylinderGeometry args={[0.012, 0.012, 0.44, 16]} />
          <meshStandardMaterial color="#cba76b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-0.1, 0.42, 0.1]} rotation={[0.62, 0, 0]}>
          <coneGeometry args={[0.085, 0.13, 16, 1, true]} />
          <meshStandardMaterial color="#1e2229" metalness={0.8} />
        </mesh>
        <pointLight position={[-0.1, 0.38, 0.1]} intensity={2.8} color="#ffdf9e" distance={4.5} />
      </group>
    </group>
  );
};
