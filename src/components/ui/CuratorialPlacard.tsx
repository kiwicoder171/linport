import React, { useState, useEffect } from 'react';
import { Artwork, ARTWORKS } from '../../data/artworks';

interface CuratorialPlacardProps {
  artwork: Artwork | null;
  onClose: () => void;
  onOpenLightbox: () => void;
  onNavigateArtwork?: (direction: 'next' | 'prev') => void;
}

export const CuratorialPlacard: React.FC<CuratorialPlacardProps> = ({
  artwork,
  onClose,
  onOpenLightbox,
  onNavigateArtwork
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reset copied state when artwork changes
  useEffect(() => {
    setCopiedLink(false);
  }, [artwork?.id]);

  // Toggle minimization with 'h' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'h' || e.key === 'H') {
        setIsMinimized(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!artwork) return null;

  const currentIndex = ARTWORKS.findIndex(a => a.id === artwork.id);
  const totalArtworks = ARTWORKS.length;
  const isMasterwork = artwork.hall === 'hall-1';

  const handleCopyDeepLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${artwork.id}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Minimized Archival Folio Tab (100% unobstructed full-screen viewing)
  if (isMinimized) {
    return (
      <div className="fixed bottom-8 right-8 z-40 pointer-events-auto animate-in fade-in duration-200">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-[#101217]/95 border border-[#cba76b]/60 hover:border-[#cba76b] px-4 py-2.5 flex items-center gap-3 backdrop-blur-xl shadow-2xl transition-all duration-200 group active:scale-[0.99]"
          title="Expand Exhibition Folio (H)"
        >
          <div className="w-1.5 h-1.5 bg-[#cba76b]" />
          <span className="font-mono text-[10px] tracking-widest uppercase text-[#cba76b]">
            FOLIO {artwork.id.toUpperCase()}
          </span>
          <span className="text-white/20">/</span>
          <span className="font-serif text-xs font-semibold text-white">
            {artwork.title || artwork.catalogIndex}
          </span>
          <span className="font-mono text-[10px] text-neutral-400 ml-1">
            [{currentIndex + 1}/{totalArtworks}]
          </span>
          <span className="text-[10px] font-mono text-black bg-[#cba76b] font-bold px-1.5 py-0.5 ml-1">
            OPEN
          </span>
        </button>
      </div>
    );
  }

  // Full Gallery Exhibition Folio (Clean Architectural Spec Sheet)
  return (
    <div className="fixed bottom-8 right-8 z-40 w-80 sm:w-88 max-w-sm pointer-events-auto animate-in fade-in slide-in-from-right-4 duration-200">
      <div className="bg-[#101217]/95 border border-white/15 p-6 shadow-2xl backdrop-blur-2xl text-white relative">
        {/* Top Folio Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-[#cba76b] uppercase font-bold">
              {isMasterwork ? 'MASTERWORK FOLIO' : 'STUDY ARCHIVE'}
            </span>
            <span className="text-white/20">·</span>
            <span className="text-[10px] font-mono tracking-wider text-neutral-400">
              {String(currentIndex + 1).padStart(2, '0')}/{String(totalArtworks).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Sequential Prev/Next */}
            {onNavigateArtwork && (
              <>
                <button
                  onClick={() => onNavigateArtwork('prev')}
                  className="px-2 py-0.5 text-[10px] font-mono text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
                  title="Previous Artwork (Left Arrow)"
                >
                  ←
                </button>
                <button
                  onClick={() => onNavigateArtwork('next')}
                  className="px-2 py-0.5 text-[10px] font-mono text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
                  title="Next Artwork (Right Arrow)"
                >
                  →
                </button>
              </>
            )}

            {/* Minimize */}
            <button
              onClick={() => setIsMinimized(true)}
              className="px-2 py-0.5 text-[10px] font-mono text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 transition-colors ml-1"
              title="Minimize Folio (H)"
            >
              _
            </button>

            {/* Close / Return */}
            <button
              onClick={onClose}
              className="px-2 py-0.5 text-[10px] font-mono text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
              title="Return to Walkthrough (Esc)"
            >
              ×
            </button>
          </div>
        </div>

        {/* Artwork Formal Title & Catalog Index */}
        <h2 className="font-serif text-xl font-bold text-[#f5efe4] tracking-wide leading-snug mb-1">
          {artwork.title || artwork.catalogIndex}
        </h2>
        <p className="text-[10px] font-mono tracking-widest text-[#cba76b] uppercase mb-4">
          {artwork.catalogIndex} · {artwork.roomName || 'Exhibition Hall'}
        </p>

        {/* Technical Spec Ledger (Clean Typographic Lines, No Gimmick Icons) */}
        <div className="space-y-2 py-3 border-y border-white/10 mb-4 text-[11px] font-mono">
          <div className="flex items-baseline justify-between">
            <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Medium</span>
            <span className="text-neutral-200 text-right">{artwork.medium}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Date</span>
            <span className="text-neutral-200">{artwork.year}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Dimensions</span>
            <span className="text-neutral-200">{artwork.width} × {artwork.height} px</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Accession</span>
            <span className="text-neutral-400 text-[10px]">{artwork.id.toUpperCase()}</span>
          </div>
        </div>

        {/* Curatorial Annotation */}
        <p className="text-xs text-neutral-300 leading-relaxed font-light italic mb-5">
          "{artwork.notes}"
        </p>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLightbox}
            className="flex-1 py-2.5 px-3 bg-[#cba76b] hover:bg-[#dfbc7f] text-black font-mono text-[10px] font-bold tracking-widest uppercase transition-all duration-150 active:scale-[0.99] text-center"
          >
            Inspect 1:1 Archival
          </button>
          <button
            onClick={handleCopyDeepLink}
            className="py-2.5 px-3 bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/15 font-mono text-[10px] tracking-wider uppercase transition-all duration-150 active:scale-[0.99]"
            title="Copy direct link to this artwork"
          >
            {copiedLink ? 'COPIED ✓' : 'SHARE'}
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-3 bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/15 font-mono text-[10px] tracking-wider uppercase transition-all duration-150 active:scale-[0.99]"
          >
            ESC
          </button>
        </div>
      </div>
    </div>
  );
};
