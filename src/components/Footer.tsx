import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#749B64] border-t-4 border-[#5E8450] text-[#F7F1E5] mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Emblem */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
          <div className="w-20 h-20 rounded-full bg-[#F7F1E5] border-4 border-[#4A6541] flex items-center justify-center shadow-lg text-[#4A6541] font-bold">
            <span className="text-sm font-serif tracking-widest text-center">
              LOGOS<br />
              <span className="text-[9px] font-sans font-normal text-stone-600">CANON</span>
            </span>
          </div>
          <div>
            <h3 className="font-bold text-lg font-serif">Logos Knowledge Platform</h3>
            <p className="text-xs text-[#DEEADC]">Empirical standardisation for the scientific community</p>
          </div>
        </div>

        {/* Center Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2 text-sm text-[#EAE3D2]">
          <span className="font-semibold text-white col-span-full mb-1 text-xs uppercase tracking-wider">
            Canonical Concepts
          </span>
          <a href="#guide" className="hover:text-white transition">Home / Guide</a>
          <a href="#database" className="hover:text-white transition">Species Database</a>
          <a href="#taxonomy" className="hover:text-white transition">Taxonomy Ranks</a>
          <a href="#biome" className="hover:text-white transition">Biomes & Climate</a>
          <a href="#ecology" className="hover:text-white transition">Eltonian Niche</a>
          <a href="#ethology" className="hover:text-white transition">Ethology Rules</a>
        </div>

        {/* Right Action buttons */}
        <div className="flex flex-col space-y-3 w-full sm:w-auto">
          <div className="bg-[#F4EDE0] text-[#344B2D] px-6 py-2.5 rounded-full text-xs font-bold text-center shadow-md border border-[#D5CBB9] select-none">
            Biology Canon
          </div>
          <div className="bg-[#E2D8C3] text-[#4A6541] px-6 py-2.5 rounded-full text-xs font-bold text-center shadow-md border border-[#C5BBA7] select-none">
            Empirical Taxonomy
          </div>
        </div>
      </div>

      <div className="bg-[#4A6541] py-3 text-center text-xs text-[#C5D9BE] border-t border-[#3D5535]">
        Peer-to-Peer & Zero Server Cost • In-Browser SQLite WASM Database • Logos Project
      </div>
    </footer>
  );
};
