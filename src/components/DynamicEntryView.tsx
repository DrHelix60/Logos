"use client";

import React, { useState } from "react";
import { Blueprint, DynamicEntry } from "@/types/database";
import { Award, ArrowLeft, Download, FileArchive, Volume2, MapPin, ExternalLink } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface DynamicEntryViewProps {
  entry: DynamicEntry;
  blueprint: Blueprint;
  onBack: () => void;
}

export const DynamicEntryView: React.FC<DynamicEntryViewProps> = ({
  entry,
  blueprint,
  onBack,
}) => {
  const [isZipping, setIsZipping] = useState(false);

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folderName = `${entry.title.toLowerCase().replace(/\s+/g, "_")}_entry`;
      const folder = zip.folder(folderName) || zip;

      folder.file("blueprint.json", JSON.stringify(blueprint, null, 2));
      folder.file("entry_data.json", JSON.stringify(entry, null, 2));
      folder.file(
        "README.txt",
        `Logos Knowledge Standardization Entry\nTitle: ${entry.title}\nSubtitle: ${entry.subtitle || "N/A"}\nBlueprint: ${blueprint.name} v${blueprint.version}\nMetric Score: ${entry.metricScore}%\n`
      );

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `${folderName}.zip`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <article className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D5CBB9] pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-stone-700 hover:text-[#344B2D] font-medium text-sm transition bg-[#EBE3D0] hover:bg-[#DFD6C2] px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Database</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="bg-[#4A6541] text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow">
            <Award className="w-4 h-4" />
            <span>{entry.metricScore}% Metric Score</span>
          </div>

          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="bg-[#749B64] hover:bg-[#5E8450] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 disabled:opacity-50"
          >
            <FileArchive className="w-4 h-4" />
            <span>{isZipping ? "Packaging ZIP..." : "Download All Files (ZIP)"}</span>
          </button>
        </div>
      </div>

      {/* Main Entry Header Card */}
      <div className="bg-[#6F9560] text-white p-8 rounded-3xl shadow-figma border-2 border-[#5A7C4F] space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#DDECD8] bg-[#4A6541] px-3 py-1 rounded-full">
          {blueprint.name} v{blueprint.version}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif">{entry.title}</h1>
        {entry.subtitle && (
          <p className="text-lg italic font-serif text-[#DDECD8]">{entry.subtitle}</p>
        )}
      </div>

      {/* Dynamic Sections Rendered from Blueprint */}
      <div className="space-y-6">
        {blueprint.sections.map((section) => (
          <section key={section.id} className="space-y-4">
            <div className="inline-block bg-[#6F9560] text-white px-8 py-2.5 rounded-2xl shadow-sm text-lg font-bold tracking-wide border border-[#5A7C4F]">
              {section.title}
            </div>

            <div className="grid gap-4">
              {section.fields.map((field) => {
                const val = entry.data[field.id];
                if (!val) return null;

                if (field.type === "image") {
                  return (
                    <div key={field.id} className="bg-white p-4 rounded-3xl border border-[#D5CBB9] space-y-2 max-w-md">
                      <span className="font-bold text-xs text-[#344B2D] block">{field.label}</span>
                      <div className="rounded-2xl overflow-hidden aspect-video bg-stone-100 border">
                        <img src={val} alt={field.label} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  );
                }

                if (field.type === "map") {
                  return (
                    <div key={field.id} className="bg-white p-4 rounded-3xl border border-[#D5CBB9] space-y-2 max-w-md">
                      <span className="font-bold text-xs text-[#344B2D] block flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#749B64]" />
                        {field.label}
                      </span>
                      <div className="rounded-2xl overflow-hidden aspect-video bg-stone-100 border">
                        <img src={val} alt={field.label} className="w-full h-full object-contain" />
                      </div>
                    </div>
                  );
                }

                if (field.type === "audio") {
                  return (
                    <div key={field.id} className="bg-[#4A6541] text-white p-4 rounded-2xl flex items-center justify-between gap-4 max-w-xl">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-5 h-5 text-emerald-300" />
                        <span className="font-bold text-xs">{field.label}</span>
                      </div>
                      <audio controls src={val} className="h-8" />
                    </div>
                  );
                }

                if (field.type === "video") {
                  return (
                    <div key={field.id} className="bg-stone-900 p-4 rounded-3xl max-w-2xl border border-stone-800 space-y-2">
                      <span className="font-bold text-xs text-white block">{field.label}</span>
                      <div className="aspect-video w-full rounded-2xl overflow-hidden">
                        <iframe src={String(val).replace("watch?v=", "embed/")} className="w-full h-full" allowFullScreen />
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={field.id} className="bg-[#EFE8D8] p-5 rounded-2xl border border-[#D5CBB9] space-y-1">
                    <span className="font-bold text-xs text-[#344B2D] uppercase tracking-wide block">{field.label}</span>
                    <p className="text-sm text-stone-800 leading-relaxed font-medium">{String(val)}</p>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
};
