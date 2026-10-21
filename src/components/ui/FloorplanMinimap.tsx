import React, { useState } from 'react';
import { ARTWORKS, Artwork } from '../../data/artworks';

interface FloorplanMinimapProps {
  isOpen: boolean;
  onClose: () => void;
  scrollProgress: number;
  onTeleport: (targetProgress: number) => void;
  onSelectArtwork?: (artwork: Artwork) => void;
  inspectedArtworkId?: string | null;
}

export const FloorplanMinimap: React.FC<FloorplanMinimapProps> = ({
  isOpen,
  onClose,
  scrollProgress,
  onTeleport,
  onSelectArtwork,
  inspectedArtworkId
}) => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'catalog'>('blueprint');
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'room-1' | 'room-2' | 'room-3' | 'room-4' | 'room-5'>('all');

  if (!isOpen) return null;

  const currentZone =
    scrollProgress < 0.06
      ? 'foyer'
      : scrollProgress < 0.22
      ? 'room-1'
      : scrollProgress < 0.42
      ? 'room-2'
      : scrollProgress < 0.62
      ? 'room-3'
      : scrollProgress < 0.78
      ? 'room-4'
      : scrollProgress < 0.92
      ? 'room-5'
      : 'desk';

  const rooms = [
    {
      num: '00',
      id: 'foyer',
      name: 'GRAND FOYER',
      desc: 'Curatorial Inscriptions & Exhibition Portal',
      works: 'ENTRY',
      target: 0.015,
      svgY: 274,
      svgH: 30
    },
    {
      num: '01',
      id: 'room-1',
      name: 'ROOM I · SEP 2020 – MAR 2022',
      desc: 'Works 01–05 · Paint Tool SAI & Clip Studio Paint',
      works: '01–05',
      target: 0.11,
      svgY: 224,
      svgH: 44
    },
    {
      num: '02',
      id: 'room-2',
      name: 'ROOM II · APR 2022 – SEP 2022',
      desc: 'Works 06–10 · The Kinetic Celestial Rotunda',
      works: '06–10',
      target: 0.31,
      svgY: 168,
      svgH: 50
    },
    {
      num: '03',
      id: 'room-3',
      name: 'ROOM III · MAY 2023 – OCT 2024',
      desc: 'Works 11–15 · Salon & Junetta Series',
      works: '11–15',
      target: 0.51,
      svgY: 112,
      svgH: 50
    },
    {
      num: '04',
      id: 'room-4',
      name: 'ROOM IV · MAR 2026 – JUN 2026',
      desc: 'Works 16–23 · The Drawing Studio (Procreate on iPad)',
      works: '16–23',
      target: 0.70,
      svgY: 66,
      svgH: 40
    },
    {
      num: '05',
      id: 'room-5',
      name: 'ROOM V · AUG 2026 – SEP 2026',
      desc: 'Works 24–31 · The Master Study Archive',
      works: '24–31',
      target: 0.85,
      svgY: 26,
      svgH: 36
    },
    {
      num: '06',
      id: 'desk',
      name: 'CURATORIAL DESK',
      desc: 'Exhibition Statement & Inquiries',
      works: 'DESK',
      target: 0.985,
      svgY: 4,
      svgH: 18
    }
  ];

  // Map scrollProgress (0 -> 1) to vertical SVG coordinate (bottom 292 -> top 12)
  const visitorSvgY = 292 - Math.max(0, Math.min(1, scrollProgress)) * 278;

  const filteredArtworks = ARTWORKS.filter(art =>
    catalogFilter === 'all' ? true : art.room === catalogFilter
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#101217] border border-white/15 p-6 sm:p-8 max-w-4xl w-full relative shadow-2xl">
        {/* Header & Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#cba76b] uppercase block mb-1">
              ARCHITECTURAL DIRECTORY & ARCHIVE
            </span>
            <h3 className="font-serif text-lg font-bold text-white tracking-wide">
              Exhibition Spatial Plan & Complete Works
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('blueprint')}
              className={`px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase border transition-colors ${
                activeTab === 'blueprint'
                  ? 'bg-[#cba76b] text-black border-[#cba76b] font-bold'
                  : 'bg-white/[0.03] text-neutral-400 border-white/10 hover:text-white'
              }`}
            >
              SPATIAL PLAN (6 HALLS)
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase border transition-colors ${
                activeTab === 'catalog'
                  ? 'bg-[#cba76b] text-black border-[#cba76b] font-bold'
                  : 'bg-white/[0.03] text-neutral-400 border-white/10 hover:text-white'
              }`}
            >
              CATALOG INDEX (31 WORKS)
            </button>
            <button
              onClick={onClose}
              className="px-2.5 py-1.5 text-xs font-mono text-neutral-400 hover:text-white border border-white/15 hover:border-white/30 transition-colors ml-2"
              title="Close Directory (Esc)"
            >
              ESC
            </button>
          </div>
        </div>

        {activeTab === 'blueprint' ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Interactive Top-Down Architectural Blueprint SVG */}
            <div className="md:col-span-5 bg-[#0b0d11] border border-white/10 p-4 flex flex-col items-center justify-center relative">
              <div className="w-full flex items-center justify-between text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
                <span>NORTH FINALE ↑</span>
                <span>SCALE 1:250</span>
              </div>

              <svg
                viewBox="0 0 180 310"
                className="w-full max-h-[52vh] select-none"
                aria-label="Museum Architectural Blueprint"
              >
                {/* Subtle Blueprint Grid Lines */}
                <defs>
                  <pattern id="bp-grid" width="18" height="18" patternUnits="userSpaceOnUse">
                    <path
                      d="M 18 0 L 0 0 0 18"
                      fill="none"
                      stroke="rgba(255,255,255,0.03)"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="180" height="310" fill="url(#bp-grid)" />

                {/* Central Promenade Axis Line */}
                <line
                  x1="90"
                  y1="14"
                  x2="90"
                  y2="296"
                  stroke="rgba(203,167,107,0.18)"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />

                {/* Room 06: Curatorial Desk */}
                <g
                  onClick={() => {
                    onTeleport(0.985);
                    onClose();
                  }}
                  className="cursor-pointer group"
                >
                  <rect
                    x="48"
                    y="4"
                    width="84"
                    height="18"
                    fill={currentZone === 'desk' ? 'rgba(203,167,107,0.18)' : 'rgba(255,255,255,0.02)'}
                    stroke={currentZone === 'desk' ? '#cba76b' : 'rgba(255,255,255,0.22)'}
                    strokeWidth="1.2"
                  />
                  <text x="90" y="15.5" textAnchor="middle" fill="#cba76b" fontSize="6.5" fontFamily="monospace">
                    06 · DESK
                  </text>
                </g>

                {/* Room 05: The Study Archive */}
                <g
                  onClick={() => {
                    onTeleport(0.85);
                    onClose();
                  }}
                  className="cursor-pointer"
                >
                  <rect
                    x="36"
                    y="26"
                    width="108"
                    height="36"
                    fill={currentZone === 'room-5' ? 'rgba(203,167,107,0.18)' : 'rgba(255,255,255,0.02)'}
                    stroke={currentZone === 'room-5' ? '#cba76b' : 'rgba(255,255,255,0.22)'}
                    strokeWidth="1.2"
                  />
                  {/* Center Glass Vitrine */}
                  <rect
                    x="78"
                    y="38"
                    width="24"
                    height="12"
                    fill="none"
                    stroke="rgba(203,167,107,0.5)"
                    strokeWidth="0.8"
                  />
                  <text x="90" y="34" textAnchor="middle" fill="#d8d2c7" fontSize="6" fontFamily="monospace">
                    05 · ARCHIVE
                  </text>
                </g>

                {/* Room 04: The Drawing Studio */}
                <g
                  onClick={() => {
                    onTeleport(0.70);
                    onClose();
                  }}
                  className="cursor-pointer"
                >
                  <rect
                    x="36"
                    y="66"
                    width="108"
                    height="40"
                    fill={currentZone === 'room-4' ? 'rgba(203,167,107,0.18)' : 'rgba(255,255,255,0.02)'}
                    stroke={currentZone === 'room-4' ? '#cba76b' : 'rgba(255,255,255,0.22)'}
                    strokeWidth="1.2"
                  />
                  <text x="90" y="88" textAnchor="middle" fill="#d8d2c7" fontSize="6" fontFamily="monospace">
                    04 · STUDIO
                  </text>
                </g>

                {/* Room 03: Pavilion II · Visions */}
                <g
                  onClick={() => {
                    onTeleport(0.51);
                    onClose();
                  }}
                  className="cursor-pointer"
                >
                  <rect
                    x="30"
                    y="112"
                    width="120"
                    height="50"
                    fill={currentZone === 'room-3' ? 'rgba(203,167,107,0.18)' : 'rgba(255,255,255,0.02)'}
                    stroke={currentZone === 'room-3' ? '#cba76b' : 'rgba(255,255,255,0.22)'}
                    strokeWidth="1.2"
                  />
                  {/* Flagship MW-16 Focal Marker */}
                  <line x1="76" y1="114" x2="104" y2="114" stroke="#cba76b" strokeWidth="2" />
                  <text x="90" y="140" textAnchor="middle" fill="#d8d2c7" fontSize="6.5" fontFamily="monospace">
                    03 · PAVILION II
                  </text>
                </g>

                {/* Room 02: The Central Rotunda (Octagonal Vault) */}
                <g
                  onClick={() => {
                    onTeleport(0.31);
                    onClose();
                  }}
                  className="cursor-pointer"
                >
                  <polygon
                    points="52,168 128,168 152,182 152,204 128,218 52,218 28,204 28,182"
                    fill={currentZone === 'room-2' ? 'rgba(203,167,107,0.18)' : 'rgba(255,255,255,0.02)'}
                    stroke={currentZone === 'room-2' ? '#cba76b' : 'rgba(255,255,255,0.25)'}
                    strokeWidth="1.2"
                  />
                  <circle
                    cx="90"
                    cy="193"
                    r="11"
                    fill="none"
                    stroke="rgba(203,167,107,0.45)"
                    strokeWidth="0.9"
                    strokeDasharray="2 2"
                  />
                  <text x="90" y="195" textAnchor="middle" fill="#cba76b" fontSize="6" fontFamily="monospace">
                    02 · ROTUNDA
                  </text>
                </g>

                {/* Room 01: Pavilion I · Genesis */}
                <g
                  onClick={() => {
                    onTeleport(0.11);
                    onClose();
                  }}
                  className="cursor-pointer"
                >
                  <rect
                    x="34"
                    y="224"
                    width="112"
                    height="44"
                    fill={currentZone === 'room-1' ? 'rgba(203,167,107,0.18)' : 'rgba(255,255,255,0.02)'}
                    stroke={currentZone === 'room-1' ? '#cba76b' : 'rgba(255,255,255,0.22)'}
                    strokeWidth="1.2"
                  />
                  {/* Focal MW-03 Marker */}
                  <line x1="65" y1="226" x2="92" y2="226" stroke="#cba76b" strokeWidth="2" />
                  <text x="90" y="249" textAnchor="middle" fill="#d8d2c7" fontSize="6.5" fontFamily="monospace">
                    01 · PAVILION I
                  </text>
                </g>

                {/* Room 00: Grand Foyer */}
                <g
                  onClick={() => {
                    onTeleport(0.015);
                    onClose();
                  }}
                  className="cursor-pointer"
                >
                  <rect
                    x="44"
                    y="274"
                    width="92"
                    height="28"
                    fill={currentZone === 'foyer' ? 'rgba(203,167,107,0.18)' : 'rgba(255,255,255,0.02)'}
                    stroke={currentZone === 'foyer' ? '#cba76b' : 'rgba(255,255,255,0.22)'}
                    strokeWidth="1.2"
                  />
                  <text x="90" y="290" textAnchor="middle" fill="#d8d2c7" fontSize="6.5" fontFamily="monospace">
                    00 · FOYER
                  </text>
                </g>

                {/* Live Visitor Position Marker & Viewing Cone */}
                <g transform={`translate(90, ${visitorSvgY})`} className="pointer-events-none">
                  <polygon points="0,0 -11,-16 11,-16" fill="rgba(203,167,107,0.28)" />
                  <circle cx="0" cy="0" r="4.5" fill="#cba76b" />
                  <circle cx="0" cy="0" r="8" fill="none" stroke="#cba76b" strokeWidth="1" opacity="0.6" />
                </g>
              </svg>

              <div className="w-full flex items-center justify-between text-[9px] font-mono text-neutral-500 uppercase tracking-widest mt-2">
                <span>SOUTH ENTRY ↓</span>
                <span className="text-[#cba76b]">● YOU ARE HERE ({Math.round(scrollProgress * 100)}%)</span>
              </div>
            </div>

            {/* Right: Gallery Directory Ledger */}
            <div className="md:col-span-7 divide-y divide-white/5 max-h-[56vh] overflow-y-auto pr-1">
              {rooms.map(room => {
                const isCurrent = currentZone === room.id;
                return (
                  <button
                    key={room.id}
                    onClick={() => {
                      onTeleport(room.target);
                      onClose();
                    }}
                    className={`w-full text-left py-3 px-3 flex items-center justify-between transition-all duration-150 group ${
                      isCurrent
                        ? 'bg-[#cba76b]/10 border-l-2 border-[#cba76b]'
                        : 'hover:bg-white/[0.03] border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-xs font-bold text-[#cba76b] w-6">
                        {room.num}
                      </span>
                      <div>
                        <span className="font-serif text-sm font-semibold text-white tracking-wide group-hover:text-[#cba76b] transition-colors">
                          {room.name}
                        </span>
                        <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                          {room.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] tracking-wider text-neutral-500 uppercase">
                        {room.works}
                      </span>
                      {isCurrent ? (
                        <span className="font-mono text-[9px] bg-[#cba76b] text-black font-bold px-2 py-0.5 tracking-wider">
                          HERE
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-neutral-500 group-hover:text-white transition-colors">
                          ENTER →
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Visual Catalog Index Tab (All 32 Works) */
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                <button
                  onClick={() => setCatalogFilter('all')}
                  className={`px-2.5 py-1 uppercase tracking-wider border transition-colors ${
                    catalogFilter === 'all'
                      ? 'border-[#cba76b] text-[#cba76b] bg-[#cba76b]/10 font-bold'
                      : 'border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  ALL (31)
                </button>
                <button
                  onClick={() => setCatalogFilter('room-1')}
                  className={`px-2 py-1 uppercase tracking-wider border transition-colors ${
                    catalogFilter === 'room-1'
                      ? 'border-[#cba76b] text-[#cba76b] bg-[#cba76b]/10 font-bold'
                      : 'border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  ROOM I (5)
                </button>
                <button
                  onClick={() => setCatalogFilter('room-2')}
                  className={`px-2 py-1 uppercase tracking-wider border transition-colors ${
                    catalogFilter === 'room-2'
                      ? 'border-[#cba76b] text-[#cba76b] bg-[#cba76b]/10 font-bold'
                      : 'border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  ROOM II (5)
                </button>
                <button
                  onClick={() => setCatalogFilter('room-3')}
                  className={`px-2 py-1 uppercase tracking-wider border transition-colors ${
                    catalogFilter === 'room-3'
                      ? 'border-[#cba76b] text-[#cba76b] bg-[#cba76b]/10 font-bold'
                      : 'border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  ROOM III (5)
                </button>
                <button
                  onClick={() => setCatalogFilter('room-4')}
                  className={`px-2 py-1 uppercase tracking-wider border transition-colors ${
                    catalogFilter === 'room-4'
                      ? 'border-[#cba76b] text-[#cba76b] bg-[#cba76b]/10 font-bold'
                      : 'border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  ROOM IV (8)
                </button>
                <button
                  onClick={() => setCatalogFilter('room-5')}
                  className={`px-2 py-1 uppercase tracking-wider border transition-colors ${
                    catalogFilter === 'room-5'
                      ? 'border-[#cba76b] text-[#cba76b] bg-[#cba76b]/10 font-bold'
                      : 'border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  ROOM V (8)
                </button>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 uppercase hidden sm:inline">
                SELECT ANY WORK TO INSPECT IN 3D
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[52vh] overflow-y-auto pr-1">
              {filteredArtworks.map(art => {
                const isSelected = inspectedArtworkId === art.id;
                return (
                  <button
                    key={art.id}
                    onClick={() => {
                      if (onSelectArtwork) {
                        onSelectArtwork(art);
                      }
                      onClose();
                    }}
                    className={`group text-left bg-[#0b0d11] border p-2.5 transition-all duration-150 flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#cba76b] bg-[#cba76b]/10'
                        : 'border-white/10 hover:border-[#cba76b]/60 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="aspect-[4/3] w-full bg-[#07080a] mb-2.5 overflow-hidden flex items-center justify-center border border-white/5">
                      <img
                        src={art.textureUrl}
                        alt={art.title || art.catalogIndex}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[9px] font-mono text-[#cba76b] uppercase tracking-wider mb-0.5">
                        <span>{art.id.toUpperCase()}</span>
                        <span className="text-neutral-500">{art.year}</span>
                      </div>
                      <h4 className="font-serif text-xs font-semibold text-white truncate group-hover:text-[#cba76b] transition-colors">
                        {art.title || art.catalogIndex}
                      </h4>
                      <p className="font-mono text-[9px] text-neutral-500 truncate mt-0.5">
                        {art.roomName}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Ledger */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-400">
          <span>CURATION: 32 WORKS · 6 ARCHITECTURAL HALLS</span>
          <span className="text-[#cba76b]">
            {activeTab === 'blueprint' ? 'CLICK ANY HALL ON BLUEPRINT OR LIST TO TELEPORT' : 'CLICK ANY WORK TO FRAME IN GALLERY'}
          </span>
        </div>
      </div>
    </div>
  );
};
