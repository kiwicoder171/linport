import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useProgress, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { Artwork, ARTWORKS, EXHIBITION_METADATA } from './data/artworks';
import { getArtworkScrollProgress } from './data/artworkTransforms';
import { museumAudio } from './utils/audio';
import { MuseumGallery } from './components/3d/MuseumGallery';
import { CameraController } from './components/3d/CameraController';
import { CuratorialPlacard } from './components/ui/CuratorialPlacard';
import { FullResLightbox } from './components/ui/FullResLightbox';
import { FloorplanMinimap } from './components/ui/FloorplanMinimap';
import { MuseumHUD } from './components/ui/MuseumHUD';

type CompileStage = 'downloading' | 'vram-upload' | 'shader-compile' | 'ready';

/**
 * Inside-Canvas GPU Precompiler:
 * Forces Three.js to upload all 32 artwork textures + procedural bump maps to GPU VRAM
 * and pre-compiles all GLSL shaders across all 6 rooms before the loading curtain opens,
 * eliminating first-scroll frame drops when walking into new rooms.
 */
function GpuPrecompiler({
  onStageChange,
  onComplete
}: {
  onStageChange: (stage: CompileStage) => void;
  onComplete: () => void;
}) {
  const { gl, scene, camera } = useThree();
  const { active, progress } = useProgress();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    if (!active && progress >= 100) {
      startedRef.current = true;

      // Step 1: Upload all textures across all 6 rooms to GPU VRAM
      onStageChange('vram-upload');

      const r1 = requestAnimationFrame(() => {
        const culledRestore: Array<{ obj: THREE.Object3D; prev: boolean }> = [];
        const initializedTextures = new Set<THREE.Texture>();

        scene.traverse((obj) => {
          if (obj.frustumCulled) {
            culledRestore.push({ obj, prev: obj.frustumCulled });
            obj.frustumCulled = false;
          }

          const mesh = obj as THREE.Mesh;
          if (mesh.isMesh && mesh.material) {
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            for (const mat of mats) {
              const stdMat = mat as THREE.MeshStandardMaterial;
              const texList = [
                stdMat.map,
                stdMat.emissiveMap,
                stdMat.bumpMap,
                stdMat.roughnessMap,
                stdMat.normalMap
              ];
              for (const tex of texList) {
                if (tex && !initializedTextures.has(tex)) {
                  initializedTextures.add(tex);
                  gl.initTexture(tex);
                }
              }
            }
          }
        });

        // Step 2: Compile all GLSL shaders across the entire unculled museum scene
        onStageChange('shader-compile');

        const r2 = requestAnimationFrame(async () => {
          try {
            if ('compileAsync' in gl && typeof gl.compileAsync === 'function') {
              await gl.compileAsync(scene, camera);
            } else {
              gl.compile(scene, camera);
            }
            // Render a full warmup pass with frustum culling disabled so every room's GPU pipeline is hot
            gl.render(scene, camera);
          } catch {
            gl.compile(scene, camera);
          }

          // Restore frustum culling so off-screen rooms are culled cheaply during scroll
          for (const item of culledRestore) {
            item.obj.frustumCulled = item.prev;
          }

          onStageChange('ready');
          onComplete();
        });

        return () => cancelAnimationFrame(r2);
      });

      return () => cancelAnimationFrame(r1);
    }
  }, [active, progress, gl, scene, camera, onStageChange, onComplete]);

  return null;
}

function MuseumLoader({
  compileStage,
  isGpuCompiled
}: {
  compileStage: CompileStage;
  isGpuCompiled: boolean;
}) {
  const { progress } = useProgress();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (isGpuCompiled) {
      const timer = setTimeout(() => setVisible(false), 550);
      return () => clearTimeout(timer);
    }
  }, [isGpuCompiled]);

  if (!visible) return null;

  // Map combined download (0..75%) + VRAM upload (85%) + shader compile (96%..100%)
  const displayProgress =
    compileStage === 'downloading'
      ? Math.round(progress * 0.75)
      : compileStage === 'vram-upload'
      ? 86
      : compileStage === 'shader-compile'
      ? 95
      : 100;

  const statusLabel =
    compileStage === 'downloading'
      ? `LOADING 32 ARCHIVAL CANVASES · ${Math.round(progress)}%`
      : compileStage === 'vram-upload'
      ? 'UPLOADING TEXTURES TO GPU VRAM...'
      : compileStage === 'shader-compile'
      ? 'PRE-COMPILING GALLERY SHADERS & REFLECTIONS...'
      : 'OPENING EXHIBITION HALLS · 100%';

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#090a0d] flex flex-col items-center justify-center transition-opacity duration-700 select-none ${
        isGpuCompiled ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="text-center max-w-md px-6">
        <span className="font-serif text-3xl font-bold tracking-[0.35em] text-white block mb-2">
          {EXHIBITION_METADATA.artist.toUpperCase()}
        </span>
        <span className="text-[11px] font-mono tracking-[0.25em] text-[#cba76b] uppercase block mb-8">
          {EXHIBITION_METADATA.exhibitionTitle.toUpperCase()}
        </span>

        {/* Minimal Hairline Progress */}
        <div className="w-56 mx-auto bg-white/10 h-[1px] relative overflow-hidden mb-3">
          <div
            className="h-full bg-[#cba76b] transition-all duration-300"
            style={{ width: `${displayProgress}%` }}
          />
        </div>

        <p className="font-mono text-[10px] text-neutral-400 tracking-widest uppercase">
          {statusLabel}
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [inspectedArtwork, setInspectedArtwork] = useState<Artwork | null>(null);
  const [activeArtwork, setActiveArtwork] = useState<Artwork | null>(null);
  const [lightboxArtwork, setLightboxArtwork] = useState<Artwork | null>(null);
  const [isMinimapOpen, setIsMinimapOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [compileStage, setCompileStage] = useState<CompileStage>('downloading');
  const [isGpuCompiled, setIsGpuCompiled] = useState(false);

  // Zero-re-render mutable scroll target consumed directly by Three.js useFrame
  const targetProgress = useRef(0);

  // Select artwork helper: syncs walkthrough spline position, URL hash, and tactile audio cue
  const handleSelectArtwork = useCallback((artwork: Artwork | null) => {
    setInspectedArtwork(artwork);
    if (artwork) {
      const artProgress = getArtworkScrollProgress(artwork.id);
      targetProgress.current = artProgress;
      setScrollProgress(artProgress);
      museumAudio.setRoomZone(artProgress);
      museumAudio.playInspectCue('open');
      window.history.replaceState(null, '', `#${artwork.id}`);
    } else {
      museumAudio.playInspectCue('close');
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  // Deep-link initialization (#mw-01 .. #study-16) and hashchange listener
  useEffect(() => {
    const applyHash = () => {
      const rawHash = window.location.hash.replace(/^#/, '').trim().toLowerCase();
      if (!rawHash) return;
      const found = ARTWORKS.find(a => a.id.toLowerCase() === rawHash);
      if (found) {
        const artProgress = getArtworkScrollProgress(found.id);
        targetProgress.current = artProgress;
        setScrollProgress(artProgress);
        setInspectedArtwork(found);
      }
    };

    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  // Step artwork in inspection mode (Next / Previous)
  const handleStepArtwork = useCallback((direction: 'next' | 'prev') => {
    setInspectedArtwork(current => {
      if (!current) return null;
      const idx = ARTWORKS.findIndex(a => a.id === current.id);
      if (idx === -1) return current;

      let nextIdx = direction === 'next' ? idx + 1 : idx - 1;
      if (nextIdx >= ARTWORKS.length) nextIdx = 0;
      if (nextIdx < 0) nextIdx = ARTWORKS.length - 1;

      const nextArt = ARTWORKS[nextIdx];
      const artProgress = getArtworkScrollProgress(nextArt.id);
      targetProgress.current = artProgress;
      setScrollProgress(artProgress);
      museumAudio.setRoomZone(artProgress);
      museumAudio.playInspectCue('step');
      window.history.replaceState(null, '', `#${nextArt.id}`);
      return nextArt;
    });
  }, []);

  // Handle smooth scroll physics & keyboard navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (lightboxArtwork || isMinimapOpen) return;

      // If currently inspecting, scrolling exits inspection back to walkthrough
      if (inspectedArtwork) {
        handleSelectArtwork(null);
      }

      // Normalize line / page / pixel delta
      let rawDelta = e.deltaY;
      if (e.deltaMode === 1) rawDelta *= 24;
      else if (e.deltaMode === 2) rawDelta *= 300;

      // Clamp max single burst to prevent runaway skipping on notched scroll wheels
      const cappedDelta = Math.max(-100, Math.min(100, rawDelta));
      // Calibrate so 1 notch of scroll wheel (~80-100px) translates to ~0.007 (~0.7% progress)
      // instead of jumping multiple artworks in a single click
      const delta = cappedDelta * 0.000075;
      targetProgress.current = Math.max(0, Math.min(1, targetProgress.current + delta));
    };

    window.addEventListener('wheel', handleWheel, { passive: true });

    // Touch support for mobile
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (lightboxArtwork || isMinimapOpen) return;
      if (inspectedArtwork) {
        handleSelectArtwork(null);
      }
      const currentY = e.touches[0].clientY;
      const delta = (touchStartY - currentY) * 0.00025;
      targetProgress.current = Math.max(0, Math.min(1, targetProgress.current + delta));
      touchStartY = currentY;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxArtwork) setLightboxArtwork(null);
        else if (isMinimapOpen) setIsMinimapOpen(false);
        else if (showShortcuts) setShowShortcuts(false);
        else if (inspectedArtwork) handleSelectArtwork(null);
      } else if (e.key === 'm' || e.key === 'M') {
        if (!lightboxArtwork) setIsMinimapOpen(prev => !prev);
      } else if (e.key === 'Enter') {
        if (activeArtwork && !inspectedArtwork && !lightboxArtwork && !isMinimapOpen) {
          handleSelectArtwork(activeArtwork);
        }
      } else if (inspectedArtwork && !lightboxArtwork) {
        if (e.key === 'ArrowRight') {
          handleStepArtwork('next');
        } else if (e.key === 'ArrowLeft') {
          handleStepArtwork('prev');
        }
      } else if (!inspectedArtwork && !lightboxArtwork && !isMinimapOpen) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
          targetProgress.current = Math.min(1, targetProgress.current + 0.012);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          targetProgress.current = Math.max(0, targetProgress.current - 0.012);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    inspectedArtwork,
    activeArtwork,
    lightboxArtwork,
    isMinimapOpen,
    showShortcuts,
    handleSelectArtwork,
    handleStepArtwork
  ]);

  // Quantized progress callback from Three.js useFrame (0.5% steps)
  const handleQuantizedProgress = useCallback((quantized: number) => {
    setScrollProgress(quantized);
    museumAudio.setRoomZone(quantized);
  }, []);

  // Teleport handler
  const handleTeleport = useCallback(
    (newProgress: number) => {
      handleSelectArtwork(null);
      targetProgress.current = newProgress;
      setScrollProgress(newProgress);
      museumAudio.setRoomZone(newProgress);
    },
    [handleSelectArtwork]
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0b0e]">
      {/* Multi-Stage GPU Precompilation & Asset Loading Screen */}
      <MuseumLoader compileStage={compileStage} isGpuCompiled={isGpuCompiled} />

      {/* 3D WebGL Canvas */}
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
          powerPreference: 'high-performance'
        }}
        camera={{
          fov: 46,
          near: 0.1,
          far: 200,
          position: [0, 2.1, 13]
        }}
        className="w-full h-full"
      >
        <color attach="background" args={['#101217']} />
        <fog attach="fog" args={['#101217', 26, 92]} />
        <CameraController
          targetProgressRef={targetProgress}
          inspectedArtwork={inspectedArtwork}
          onActiveArtworkChange={setActiveArtwork}
          onProgressChange={handleQuantizedProgress}
        />
        <Suspense fallback={null}>
          <MuseumGallery
            onSelectArtwork={handleSelectArtwork}
            inspectedArtworkId={inspectedArtwork?.id}
          />
          <Preload all />
          <GpuPrecompiler
            onStageChange={setCompileStage}
            onComplete={() => setIsGpuCompiled(true)}
          />
        </Suspense>
      </Canvas>

      {/* Subtle Optical Lens Vignette Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(10,11,14,0) 58%, rgba(8,9,12,0.48) 100%)'
        }}
      />

      {/* Museum Architectural HUD (Four-Corner Layout) */}
      <MuseumHUD
        scrollProgress={scrollProgress}
        onOpenMinimap={() => setIsMinimapOpen(true)}
        isInspecting={!!inspectedArtwork}
        activeArtwork={activeArtwork}
        onInspectActive={() => {
          if (activeArtwork) handleSelectArtwork(activeArtwork);
        }}
        onOpenHelp={() => setShowShortcuts(prev => !prev)}
      />

      {/* Minimalist Gallery Navigation Guide Modal */}
      {showShortcuts && (
        <div className="fixed top-20 right-8 z-40 bg-[#101217]/95 border border-white/15 p-6 text-white max-w-xs shadow-2xl backdrop-blur-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <span className="text-[10px] font-mono tracking-widest text-[#cba76b] uppercase font-bold">
              VISITOR CONTROLS
            </span>
            <button
              onClick={() => setShowShortcuts(false)}
              className="text-xs font-mono text-neutral-400 hover:text-white"
            >
              ×
            </button>
          </div>
          <div className="space-y-3 text-[11px] font-mono">
            <div className="flex justify-between items-baseline text-neutral-300">
              <span className="text-neutral-500 uppercase text-[10px]">Promenade</span>
              <span>Scroll / [↑][↓]</span>
            </div>
            <div className="flex justify-between items-baseline text-neutral-300">
              <span className="text-neutral-500 uppercase text-[10px]">Inspect</span>
              <span>Click / [Enter]</span>
            </div>
            <div className="flex justify-between items-baseline text-neutral-300">
              <span className="text-neutral-500 uppercase text-[10px]">Browse Works</span>
              <span>[←] / [→]</span>
            </div>
            <div className="flex justify-between items-baseline text-neutral-300">
              <span className="text-neutral-500 uppercase text-[10px]">Toggle Folio</span>
              <span>[H]</span>
            </div>
            <div className="flex justify-between items-baseline text-neutral-300">
              <span className="text-neutral-500 uppercase text-[10px]">Blueprint & Index</span>
              <span>[M]</span>
            </div>
            <div className="flex justify-between items-baseline text-neutral-300">
              <span className="text-neutral-500 uppercase text-[10px]">Exit View</span>
              <span>[Esc]</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Curatorial Spec Folio */}
      <CuratorialPlacard
        artwork={inspectedArtwork}
        onClose={() => handleSelectArtwork(null)}
        onOpenLightbox={() => setLightboxArtwork(inspectedArtwork)}
        onNavigateArtwork={handleStepArtwork}
      />

      {/* Archival 1:1 Lightbox */}
      <FullResLightbox
        artwork={lightboxArtwork}
        onClose={() => setLightboxArtwork(null)}
      />

      {/* Architectural Exhibition Directory & Catalog Index */}
      <FloorplanMinimap
        isOpen={isMinimapOpen}
        onClose={() => setIsMinimapOpen(false)}
        scrollProgress={scrollProgress}
        onTeleport={handleTeleport}
        onSelectArtwork={handleSelectArtwork}
        inspectedArtworkId={inspectedArtwork?.id}
      />
    </div>
  );
}
