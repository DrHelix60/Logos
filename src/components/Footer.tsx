import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#749B64] border-t-4 border-[#5E8450] text-[#F7F1E5] mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Emblem */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#F7F1E5] border-2 border-[#4A6541] flex items-center justify-center shadow-lg text-[#4A6541] font-bold">
            <span className="text-xs font-serif tracking-widest text-center">
              LOGOS<br />
              <span className="text-[7px] font-sans font-normal text-stone-600">NET</span>
            </span>
          </div>
          <div>
            <h3 className="font-bold text-base font-serif">Logos Knowledge Platform</h3>
            <p className="text-xs text-[#DEEADC]">Empirical standardization for science and all disciplines</p>
          </div>
        </div>

        {/* Center Pillars */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#EAE3D2]">
          <span className="bg-[#4A6541] px-3 py-1 rounded-full text-white font-medium">Domain Agnostic</span>
          <span className="bg-[#4A6541] px-3 py-1 rounded-full text-white font-medium">Dynamic Blueprints</span>
          <span className="bg-[#4A6541] px-3 py-1 rounded-full text-white font-medium">Canonical Databases</span>
          <span className="bg-[#4A6541] px-3 py-1 rounded-full text-white font-medium">0–100% Metric Rubric</span>
        </div>

        {/* Right Info */}
        <div className="text-xs text-[#E2D8C3] text-center md:text-right space-y-1">
          <div className="font-semibold text-white">Client-Side Peer-to-Peer Runtime</div>
          <div>Zero server hosting costs • Portable SQLite WASM</div>
        </div>
      </div>

      <div className="bg-[#4A6541] py-2.5 text-center text-[11px] text-[#C5D9BE] border-t border-[#3D5535]">
        Logos • Open Knowledge Standardization • Founded by Rafael S.T.J.
      </div>
    </footer>
  );
};
