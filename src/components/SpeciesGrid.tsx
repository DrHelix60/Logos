"use client";

import React from "react";
import { SpeciesEntry } from "@/types/database";
import { Award, ArrowRight, FileArchive, Clock, Sparkles } from "lucide-react";

interface SpeciesGridProps {
  entries: SpeciesEntry[];
  onSelectEntry: (entry: SpeciesEntry) => void;
  onDownloadZip: (entry: SpeciesEntry) => void;
}

export const SpeciesGrid: React.FC<SpeciesGridProps> = ({
  entries,
  onSelectEntry,
  onDownloadZip,
}) => {
  if (entries.length === 0) {
    return (
      <div className="flex-1 bg-[#EFE8D8] border border-[#D5CBB9] rounded-3xl p-12 text-center space-y-4">
        <h3 className="text-xl font-bold font-serif text-[#344B2D]">No entries match your current filters</h3>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Try loosening your filter criteria or changing matching modes from &quot;Incluido en todos&quot; (AND) to &quot;Pertenece a uno&quot; (OR).
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-2 gap-6 items-start">
      {entries.map((entry) => {
        const data = entry.data;
        return (
          <div
            key={entry.id}
            className="bg-[#6F9560] text-white rounded-3xl overflow-hidden shadow-figma border-2 border-[#5A7C4F] flex flex-col justify-between hover:shadow-xl transition duration-300 group"
          >
            {/* Image Header with Nominate Badge */}
            <div className="relative aspect-[16/10] bg-stone-900 overflow-hidden cursor-pointer" onClick={() => onSelectEntry(entry)}>
              <img
                src={data.media.heroImage}
                alt={entry.commonName}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

              {/* Status & Nominate Badges */}
              <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                <span className="bg-[#4A6541]/90 backdrop-blur-sm text-[#F7F1E5] text-[11px] font-bold px-3 py-1 rounded-full shadow border border-[#5E8450]">
                  {data.class}
                </span>

                <div className="flex items-center gap-1.5">
                  {entry.status === "pending_review" && (
                    <span className="bg-amber-500 text-stone-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                      <Clock className="w-3 h-3" /> Review Queue
                    </span>
                  )}
                  {entry.isBoosted && (
                    <span className="bg-amber-400 text-stone-950 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                      <Sparkles className="w-2.5 h-2.5" /> Boosted
                    </span>
                  )}
                  <span className="bg-[#2D4525]/90 backdrop-blur-sm text-amber-300 font-extrabold text-xs px-2.5 py-1 rounded-full shadow flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    {entry.metricScore}%
                  </span>
                </div>
              </div>

              {/* Bottom Image Overlay Title */}
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="text-2xl font-bold font-serif tracking-tight text-white drop-shadow-md">
                  {entry.commonName}
                </h3>
                <p className="text-xs italic font-serif text-[#DDECD8] drop-shadow">
                  {entry.scientificName}
                </p>
              </div>
            </div>

            {/* Content Body matching Figma Pill Style */}
            <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
              <div className="space-y-2 text-xs">
                {data.nominateReference && (
                  <p className="text-[11px] text-[#F7F1E5] font-semibold bg-[#4A6541] px-2.5 py-1 rounded-lg truncate">
                    ★ {data.nominateReference}
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="bg-[#4A6541] px-2.5 py-1 rounded-md font-medium">
                    Diet: {data.diet.split("(")[0].trim()}
                  </span>
                  <span className="bg-[#4A6541] px-2.5 py-1 rounded-md font-medium">
                    Activity: {data.activity}
                  </span>
                  <span className="bg-[#4A6541] px-2.5 py-1 rounded-md font-medium">
                    Size: {data.sizeWeight}
                  </span>
                </div>

                <div className="pt-1">
                  <span className="text-[11px] text-[#DDECD8] font-bold block mb-1">Habitats:</span>
                  <div className="flex flex-wrap gap-1">
                    {data.habitats.slice(0, 4).map((h, i) => (
                      <span key={i} className="bg-[#344B2D] text-[10px] px-2 py-0.5 rounded-md text-[#E5EFE2]">
                        {h}
                      </span>
                    ))}
                    {data.habitats.length > 4 && (
                      <span className="text-[10px] text-[#DDECD8] self-center">
                        +{data.habitats.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[#5A7C4F] flex items-center justify-between gap-2">
                <button
                  onClick={() => onDownloadZip(entry)}
                  className="bg-[#4A6541] hover:bg-[#344B2D] text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow"
                  title="Download all assets as ZIP"
                >
                  <FileArchive className="w-3.5 h-3.5" />
                  <span>ZIP</span>
                </button>

                <button
                  onClick={() => onSelectEntry(entry)}
                  className="bg-[#F7F1E5] hover:bg-white text-[#344B2D] px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm ml-auto"
                >
                  <span>Open Entry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
