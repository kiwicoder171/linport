import React, { useState } from 'react';
import { museumAudio } from '../../utils/audio';
import { Artwork, EXHIBITION_METADATA } from '../../data/artworks';

interface MuseumHUDProps {
  scrollProgress: number;
  onOpenMinimap: () => void;
  isInspecting: boolean;
  activeArtwork: Artwork | null;
  onInspectActive: () => void;
  onOpenHelp: () => void;
}

export const MuseumHUD: React.FC<MuseumHUDProps> = ({
  scrollProgress,
  onOpenMinimap,
  isInspecting,
  activeArtwork,
  onInspectActive,
  onOpenHelp
}) => {
  const [isAudioActive, setIsAudioActive] = useState(false);

  const toggleAudio = () => {
    const active = museumAudio.toggle();
    setIsAudioActive(active);
  };

  const getZoneInfo = () => {
    if (scrollProgress < 0.06) return { num: '00', name: 'GRAND FOYER', range: 'ENTRANCE & CURATORIAL OVERVIEW' };
    if (scrollProgress < 0.22) return { num: '01', name: 'PAVILION I · GENESIS', range: 'MASTERWORKS 01–05' };
    if (scrollProgress < 0.42) return { num: '02', name: 'THE CENTRAL ROTUNDA', range: 'MASTERWORKS 06–10 · KINETIC DOME' };
    if (scrollProgress < 0.62) return { num: '03', name: 'PAVILION II · VISIONS', range: 'MASTERWORKS 11–16 · SALON HORIZON' };
    if (scrollProgress < 0.78) return { num: '04', name: 'THE DRAWING STUDIO', range: 'STUDIES 01–08 · ATELIER PINBOARDS' };
    if (scrollProgress < 0.92) return { num: '05', name: 'THE STUDY ARCHIVE', range: 'STUDIES 09–16 · ARCHIVAL SHOWCASE' };
    return { num: '06', name: 'CURATORIAL DESK', range: 'RETROSPECTIVE MONOGRAPH & INQUIRIES' };
  };

  const zone = getZoneInfo();
  const pct = Math.round(scrollProgress * 100);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-6 sm:p-8">
      {/* Top Header Bar */}
      <header className="flex items-start justify-between">
        {/* Gallery Masthead */}
        <div className="pointer-events-auto select-none">
          <h1 className="font-serif text-base sm:text-lg font-bold tracking-[0.25em] text-[#f2ede4] leading-tight">
            {EXHIBITION_METADATA.artist.toUpperCase()}
          </h1>
          <p className="text-[10px] font-mono tracking-[0.2em] text-[#cba76b] uppercase mt-0.5">
            {EXHIBITION_METADATA.exhibitionTitle.toUpperCase()}
          </p>
        </div>

        {/* Minimalist Top Utility Toolbar */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Ambience Toggle */}
          <button
            onClick={toggleAudio}
            className={`px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase transition-all duration-200 border ${
              isAudioActive
                ? 'bg-[#cba76b] text-black border-[#cba76b] font-bold shadow-lg shadow-[#cba76b]/15'
                : 'bg-[#121418]/80 text-neutral-400 border-white/10 hover:text-white hover:border-white/25 backdrop-blur-md'
            }`}
            title="Toggle Binaural Gallery Ambience (432Hz)"
          >
            {isAudioActive ? 'SOUND: ON' : 'SOUND: OFF'}
          </button>

          {/* Floorplan Directory */}
          <button
            onClick={onOpenMinimap}
            className="px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase bg-[#121418]/80 text-neutral-300 border border-white/10 hover:text-white hover:border-white/25 transition-all duration-200 backdrop-blur-md"
            title="Open Exhibition Floorplan (M)"
          >
            INDEX (M)
          </button>

          {/* Guide Modal Toggle */}
          <button
            onClick={onOpenHelp}
            className="px-2.5 py-1.5 text-[10px] font-mono text-neutral-400 bg-[#121418]/80 border border-white/10 hover:text-white hover:border-white/25 transition-all duration-200 backdrop-blur-md"
            title="Exhibition Navigation Guide"
          >
            ?
          </button>
        </div>
      </header>

      {/* Bottom Architectural Floor Status & Framing Cue */}
      <footer className="flex flex-col sm:flex-row items-end sm:items-end justify-between gap-4">
        {/* Left: Architectural Location Ledger */}
        <div
          className={`pointer-events-auto select-none transition-opacity duration-300 ${
            isInspecting ? 'opacity-25 hover:opacity-100' : 'opacity-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-[#cba76b] tracking-wider">
              {zone.num}
            </span>
            <span className="text-white/20">/</span>
            <span className="font-serif text-xs font-bold tracking-[0.16em] text-white">
              {zone.name}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-1.5">
            <p className="text-[10px] font-mono tracking-wider text-neutral-400">
              {zone.range}
            </p>
            <div className="w-24 h-[1px] bg-white/15 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-[#cba76b] transition-all duration-150"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-neutral-500">{pct}%</span>
          </div>
        </div>

        {/* Center/Right: Quiet Framing Trigger OR Curatorial Inquiries */}
        {activeArtwork && !isInspecting ? (
          <div className="pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button
              onClick={onInspectActive}
              className="bg-[#121418]/90 border border-[#cba76b]/60 hover:border-[#cba76b] px-4 py-2 text-left flex items-center gap-3 backdrop-blur-xl shadow-2xl transition-all duration-200 group active:scale-[0.99]"
            >
              <div className="w-1.5 h-1.5 bg-[#cba76b]" />
              <div>
                <span className="block text-[9px] font-mono tracking-widest text-[#cba76b] uppercase">
                  ACTIVE FRAME
                </span>
                <span className="font-serif text-xs font-semibold text-white group-hover:text-[#cba76b] transition-colors">
                  {activeArtwork.title || activeArtwork.catalogIndex}
                </span>
              </div>
              <span className="font-mono text-[10px] text-black bg-[#cba76b] font-bold px-2 py-0.5 ml-2 tracking-wider">
                INSPECT ↵
              </span>
            </button>
          </div>
        ) : scrollProgress >= 0.93 && !isInspecting ? (
          <div className="pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2">
            <a
              href={EXHIBITION_METADATA.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#121418]/90 border border-white/15 hover:border-[#cba76b] px-3.5 py-2 text-[10px] font-mono tracking-wider text-neutral-300 hover:text-white backdrop-blur-xl transition-all duration-200 flex items-center gap-2"
            >
              <span className="text-[#cba76b]">IG:</span> @{EXHIBITION_METADATA.socials.instagramHandle} ↗
            </a>
            <a
              href={`mailto:${EXHIBITION_METADATA.socials.email}`}
              className="bg-[#cba76b] text-black hover:bg-[#dfbd7f] font-mono font-bold text-[10px] tracking-wider px-3.5 py-2 transition-all duration-200 shadow-lg shadow-[#cba76b]/15"
            >
              INQUIRE / EMAIL ✉
            </a>
          </div>
        ) : null}
      </footer>
    </div>
  );
};
