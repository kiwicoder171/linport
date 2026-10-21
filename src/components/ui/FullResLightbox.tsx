import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Artwork } from '../../data/artworks';

interface FullResLightboxProps {
  artwork: Artwork | null;
  onClose: () => void;
}

export const FullResLightbox: React.FC<FullResLightboxProps> = ({ artwork, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // Reset zoom and pan when artwork changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [artwork?.id]);

  const handleReset = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = -e.deltaY * 0.0022;
    setZoom(prev => {
      const next = Math.max(0.75, Math.min(4.0, Number((prev + delta).toFixed(2))));
      if (next <= 1) {
        setPan({ x: 0, y: 0 });
      }
      return next;
    });
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: pan.x,
        panY: pan.y
      };
    },
    [pan.x, pan.y]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPan({
        x: dragStartRef.current.panX + dx,
        y: dragStartRef.current.panY + dy
      });
    },
    [isDragging]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
  }, []);

  if (!artwork) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#090a0d]/98 backdrop-blur-2xl flex flex-col animate-in fade-in duration-200"
      onWheel={handleWheel}
    >
      {/* Top Archival Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0e13] z-10">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs font-bold text-[#cba76b] tracking-wider">
            {artwork.id.toUpperCase()}
          </span>
          <span className="text-white/20">/</span>
          <h2 className="text-sm font-serif font-bold text-white tracking-wide">
            {artwork.title || artwork.catalogIndex}
          </h2>
          <span className="hidden sm:inline text-[11px] font-mono text-neutral-400 ml-2">
            · {artwork.width} × {artwork.height} px · {artwork.medium}
          </span>
        </div>

        {/* Precision Inspection Controls */}
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <button
            onClick={() => {
              setZoom(z => {
                const next = Math.max(0.75, z - 0.25);
                if (next <= 1) setPan({ x: 0, y: 0 });
                return next;
              });
            }}
            className="px-2.5 py-1 text-neutral-300 hover:text-white border border-white/15 hover:border-white/30 transition-colors"
            title="Zoom Out"
          >
            –
          </button>
          <span className="w-14 text-center text-neutral-400">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(z => Math.min(4.0, z + 0.25))}
            className="px-2.5 py-1 text-neutral-300 hover:text-white border border-white/15 hover:border-white/30 transition-colors"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={handleReset}
            className="px-2.5 py-1 text-neutral-400 hover:text-white border border-white/10 hover:border-white/20 transition-colors ml-1"
            title="Reset Zoom & Pan (1:1)"
          >
            1:1
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#cba76b] text-black font-bold tracking-wider hover:bg-[#dfbc7f] transition-colors ml-3"
            title="Close Lightbox (Esc)"
          >
            ESC
          </button>
        </div>
      </div>

      {/* Interactive Pan & Zoom Canvas Stage */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={() => {
          if (zoom > 1) handleReset();
          else setZoom(2.25);
        }}
        className={`flex-1 overflow-hidden flex items-center justify-center p-6 select-none touch-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <img
          src={artwork.fullResUrl}
          alt={artwork.title || artwork.catalogIndex}
          draggable={false}
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 120ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="max-h-[84vh] max-w-[86vw] object-contain shadow-2xl border border-white/10 pointer-events-none"
        />
      </div>

      {/* Bottom Footer Info */}
      <div className="px-6 py-3 border-t border-white/5 bg-[#0b0c10] flex items-center justify-between text-[10px] font-mono text-neutral-400 z-10">
        <span>ARCHIVE ASSET: {artwork.fullResUrl.split('/').pop()}</span>
        <span>DRAG TO PAN · SCROLL OR DOUBLE-CLICK TO ZOOM</span>
      </div>
    </div>
  );
};
