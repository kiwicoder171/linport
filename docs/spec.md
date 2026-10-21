# Specification: Lin's Spatial Art Museum & Portfolio

## Problem Statement

Visual artist Lin has created a collection of 32 artworks (16 high-resolution digital masterworks and 16 process studies/sketches) currently sitting as raw image files. Traditional 2D portfolio websites display artwork as flat, generic thumbnail grids, which destroys curatorial pacing, architectural atmosphere, and emotional depth. Furthermore, loading 160MB of raw images into a browser causes heavy lag and mobile crashes.

## Solution

A spatial, browser-based 3D art museum exhibition powered by Three.js and React Three Fiber. Visitors experience a scroll-driven camera walkthrough through distinct architectural exhibition halls with directional spotlights and polished floors. Clicking any artwork smoothly glides the camera into an Inspection View displaying a curatorial placard with technical specs, editable notes, and an on-demand full-resolution inspection view.

## User Stories

1. As a gallery visitor, I want to scroll smoothly through the museum on desktop or mobile, so that I experience a guided, cinematic walkthrough of Lin's body of work.
2. As a visitor, I want to experience two distinct architectural wings (Hall I: Masterworks and Hall II: The Atelier), so that I can appreciate finished paintings and raw sketches in appropriate settings.
3. As a visitor, I want to click any artwork to enter Inspection View, so that the camera docks directly in front of the canvas with ambient light dimmed for focused viewing.
4. As a visitor, I want to see an architectural placard beside each artwork showing its catalog index, medium, specs, and curatorial notes, so that I understand the context behind each piece.
5. As a visitor, I want to open a 1:1 uncompressed lightbox from the placard, so that I can inspect the artist's original high-resolution brushwork without slowing down the 3D scene.
6. As a visitor, I want an ambient acoustic room-tone audio toggle, so that the museum feels alive with natural gallery reverberation.
7. As a visitor, I want a minimalist HUD and 2D floorplan minimap, so that I always know where I am and can instantly jump between wings or return to the Foyer.
8. As the artist (Lin), I want all metadata stored in a clean, centralized configuration file (`src/data/artworks.ts`), so that I can add custom artwork titles, dates, or stories in the future without editing 3D code.
9. As a mobile visitor, I want the 3D museum to load rapidly without crashing memory, so that I can explore the gallery at 60 FPS on any smartphone.
10. As a potential client or collaborator, I want to reach the Curatorial Desk at the end of the walkthrough, so that I can review Lin's bio, commission status, and contact links.

## Implementation Decisions

- **Architecture**: Single-page 3D WebGL application built with Vite, React 18, TypeScript, `@react-three/fiber`, `@react-three/drei`, and Tailwind CSS.
- **Asset Pipeline**: Dual-tier texture delivery. An automated Python script converts the 32 raw assets into optimized WebP gallery textures (~350KB each) and populates exact aspect ratios in `src/data/artworks.ts`. Full-resolution originals are preserved and loaded on-demand only during Inspection View.
- **Navigation**: Continuous spline camera rail driven by standard page scroll, with spring-damped camera transitions when switching between walkthrough mode and Inspection View.
- **Procedural 3D Elements**: Centerpiece sculptures and Atelier staging (drafting easels, studio desks, benches, spotlight tracks) are authored procedurally in Three.js code rather than loading heavy external GLTF assets.
- **Audio Atmosphere**: Procedurally synthesized binaural gallery room tone via browser native Web Audio API, requiring zero audio downloads and no external audio files.

## Testing Decisions

- **Visual & Component Testing**: Verify that every artwork canvas maintains its true aspect ratio without stretching, that spotlight cones track accurately, and that clicking any artwork docks the camera with correct bounding margins.
- **Performance Seams**: Verify 60 FPS frame rates across standard viewports (mobile 375px, tablet 768px, desktop 1440px) using Playwright / Chrome DevTools.
- **State Seams**: Verify smooth state transitions between Walkthrough, Inspection View, and Floorplan Teleportation without WebGL context loss or camera clipping.

## Out of Scope

- Full WASD free-roam first-person gaming controls (deliberately replaced by the scroll rail for mobile ergonomics).
- Multi-user avatar multiplayer (focused purely on a high-fidelity solo museum experience).
- E-commerce checkout / payment gateway (commissions are handled via direct inquiry links at the Curatorial Desk).

## Further Notes

All decisions and domain vocabulary adhere strictly to [GLOSSARY.md](file:///Users/kiwi/Desktop/Developer/Antigravity/Lin-Port/GLOSSARY.md) and recorded ADRs 0001 through 0005.
