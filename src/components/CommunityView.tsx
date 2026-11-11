"use client";

import React, { useState } from "react";
import { Blueprint, Community, DatabaseModel, DynamicEntry, UserProfile } from "@/types/database";
import { Database, Layers, PlusCircle, ArrowLeft, ChevronRight, BookmarkPlus, Check, X } from "lucide-react";

interface CommunityViewProps {
  community: Community;
  databases: DatabaseModel[];
  allAvailableDatabases: DatabaseModel[];
  blueprints: Blueprint[];
  entries: DynamicEntry[];
  currentUser: UserProfile;
  onBack: () => void;
  onOpenCreateDatabase: () => void;
  onOpenBlueprintStudio: () => void;
  onSelectDatabase: (db: DatabaseModel) => void;
  onAdoptDatabase: (dbId: string) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  community,
  databases,
  allAvailableDatabases,
  blueprints,
  entries,
  currentUser,
  onBack,
  onOpenCreateDatabase,
  onOpenBlueprintStudio,
  onSelectDatabase,
  onAdoptDatabase,
}) => {
  const [activeTab, setActiveTab] = useState<"databases" | "blueprints">("databases");
  const [isAdoptModalOpen, setIsAdoptModalOpen] = useState(false);

  // Available independent databases that are not already in this community's canon
  const adoptableDatabases = allAvailableDatabases.filter(
    (d) => !databases.some((cd) => cd.id === d.id)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-[#D5CBB9] pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-stone-700 hover:text-[#344B2D] font-medium text-xs transition bg-[#EBE3D0] hover:bg-[#DFD6C2] px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Logos Network</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-[#4A6541] text-[#F7F1E5] px-3 py-1.5 rounded-full font-bold">
            Discipline: {community.discipline}
          </span>
        </div>
      </div>

      {/* Community Banner */}
      <div className="bg-[#6F9560] text-white p-7 sm:p-8 rounded-3xl shadow-figma border-2 border-[#5A7C4F] space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#DDECD8] bg-[#4A6541] px-3 py-1 rounded-full">
          School of Thought
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif">{community.name}</h1>
        <p className="text-sm sm:text-base text-[#EBF4E9] max-w-3xl leading-relaxed">
          {community.scopePrinciples}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[#D5CBB9] pb-3">
        <button
          onClick={() => setActiveTab("databases")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-sm ${
            activeTab === "databases"
              ? "bg-[#4A6541] text-white"
              : "bg-[#EFE8D8] text-stone-700 hover:bg-[#DFD6C2]"
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Canon Databases ({databases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("blueprints")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-sm ${
            activeTab === "blueprints"
              ? "bg-[#4A6541] text-white"
              : "bg-[#EFE8D8] text-stone-700 hover:bg-[#DFD6C2]"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Blueprints ({blueprints.length})</span>
        </button>
      </div>

      {/* Tab 1: Databases / Canon */}
      {activeTab === "databases" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold font-serif text-[#344B2D]">
                Databases in Canon
              </h3>
              <p className="text-xs text-stone-600">
                The accepted datasets standardizing this school of thought
              </p>
            </div>

            <div className="flex items-center gap-2">
              {adoptableDatabases.length > 0 && (
                <button
                  onClick={() => setIsAdoptModalOpen(true)}
                  className="bg-white hover:bg-stone-50 text-[#344B2D] border border-[#D5CBB9] px-4 py-2 rounded-2xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5"
                >
                  <BookmarkPlus className="w-4 h-4 text-[#749B64]" />
                  <span>Adopt Database ({adoptableDatabases.length})</span>
                </button>
              )}

              <button
                onClick={onOpenCreateDatabase}
                className="bg-[#749B64] hover:bg-[#5E8450] text-white px-5 py-2 rounded-2xl text-xs font-bold shadow-md transition flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Create Database</span>
              </button>
            </div>
          </div>

          {databases.length === 0 ? (
            <div className="bg-[#EFE8D8] border-2 border-dashed border-[#D5CBB9] rounded-3xl p-12 text-center space-y-4">
              <Database className="w-12 h-12 text-[#749B64] mx-auto opacity-60" />
              <h4 className="text-base font-bold font-serif text-[#344B2D]">
                No databases currently in this canon
              </h4>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Create a new database governed by a blueprint, or adopt existing independent databases into this school.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={onOpenCreateDatabase}
                  className="bg-[#4A6541] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow hover:bg-[#344B2D] transition"
                >
                  Create Database
                </button>
                {adoptableDatabases.length > 0 && (
                  <button
                    onClick={() => setIsAdoptModalOpen(true)}
                    className="bg-white border border-[#D5CBB9] text-[#344B2D] px-6 py-2.5 rounded-xl text-xs font-bold shadow-2xs hover:bg-stone-50 transition"
                  >
                    Adopt Existing Database
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {databases.map((db) => {
                const dbEntries = entries.filter((e) => e.databaseId === db.id);
                const bp = blueprints.find((b) => b.id === db.blueprintId);
                return (
                  <div
                    key={db.id}
                    onClick={() => onSelectDatabase(db)}
                    className="bg-white p-6 rounded-3xl border border-[#D5CBB9] shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#749B64] bg-[#749B64]/10 px-2 py-0.5 rounded-md">
                        {bp ? bp.name : "Custom Schema"}
                      </span>
                      <h4 className="text-xl font-bold font-serif text-[#344B2D] group-hover:text-[#4A6541] transition">
                        {db.name}
                      </h4>
                      <p className="text-xs text-stone-600 line-clamp-2">{db.scopeDescription}</p>
                    </div>

                    <div className="pt-6 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <span>{dbEntries.length} Records</span>
                      <span className="text-[#4A6541] font-bold flex items-center gap-1 group-hover:translate-x-1 transition">
                        Open <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Blueprints */}
      {activeTab === "blueprints" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-serif text-[#344B2D]">
                Blueprints in Scope
              </h3>
              <p className="text-xs text-stone-600">
                Schemas defining structured tiers, attribute types, and quantitative scoring
              </p>
            </div>

            <button
              onClick={onOpenBlueprintStudio}
              className="bg-[#749B64] hover:bg-[#5E8450] text-white px-5 py-2 rounded-2xl text-xs font-bold shadow-md transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Design Blueprint</span>
            </button>
          </div>

          {blueprints.length === 0 ? (
            <div className="bg-[#EFE8D8] border-2 border-dashed border-[#D5CBB9] rounded-3xl p-12 text-center space-y-4">
              <Layers className="w-12 h-12 text-[#749B64] mx-auto opacity-60" />
              <h4 className="text-base font-bold font-serif text-[#344B2D]">No blueprints registered</h4>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Use the Blueprint Studio to craft the exact sections, property types, and 0–100% metric weights for this domain.
              </p>
              <button
                onClick={onOpenBlueprintStudio}
                className="bg-[#749B64] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow hover:bg-[#5E8450] transition"
              >
                Launch Blueprint Studio
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {blueprints.map((bp) => (
                <div key={bp.id} className="bg-white p-6 rounded-3xl border border-[#D5CBB9] shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                        Version {bp.version}
                      </span>
                      <h4 className="text-xl font-bold font-serif text-[#344B2D]">{bp.name}</h4>
                    </div>
                    <span className="text-xs bg-[#4A6541] text-white px-2.5 py-1 rounded-full font-semibold">
                      {bp.domain}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-stone-600">
                    <span className="font-bold text-stone-800 block">Sections Defined ({bp.sections.length}):</span>
                    <ul className="list-disc pl-4 space-y-1">
                      {bp.sections.map((s) => (
                        <li key={s.id}>
                          <strong>{s.title}</strong> — {s.tierWeightPercent}% ({s.fields.length} attributes)
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Adopt Database Modal */}
      {isAdoptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#F7F1E5] text-[#1F2A1C] w-full max-w-lg rounded-3xl shadow-2xl border-2 border-[#749B64] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#D5CBB9] pb-3">
              <h3 className="text-lg font-bold font-serif text-[#344B2D] flex items-center gap-2">
                <BookmarkPlus className="w-5 h-5 text-[#4A6541]" />
                <span>Adopt Database into Canon</span>
              </h3>
              <button
                onClick={() => setIsAdoptModalOpen(false)}
                className="text-stone-500 hover:text-stone-900 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Select an independent or external database to adopt into <strong>{community.name}</strong>&apos;s canon:
            </p>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {adoptableDatabases.map((db) => (
                <div
                  key={db.id}
                  className="bg-white p-3.5 rounded-2xl border border-[#D5CBB9] flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h4 className="font-bold text-[#344B2D]">{db.name}</h4>
                    <p className="text-[11px] text-stone-500 line-clamp-1">{db.scopeDescription}</p>
                  </div>
                  <button
                    onClick={() => {
                      onAdoptDatabase(db.id);
                      setIsAdoptModalOpen(false);
                    }}
                    className="bg-[#749B64] hover:bg-[#5E8450] text-white px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 shrink-0"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Adopt</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#D5CBB9] flex justify-end">
              <button
                onClick={() => setIsAdoptModalOpen(false)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
