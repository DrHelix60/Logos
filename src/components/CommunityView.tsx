"use client";

import React, { useState } from "react";
import { Blueprint, Community, DatabaseModel, DynamicEntry, UserProfile } from "@/types/database";
import { Database, Layers, PlusCircle, ArrowLeft, BookOpen, ChevronRight, Sparkles } from "lucide-react";

interface CommunityViewProps {
  community: Community;
  databases: DatabaseModel[];
  blueprints: Blueprint[];
  entries: DynamicEntry[];
  currentUser: UserProfile;
  onBack: () => void;
  onOpenCreateDatabase: () => void;
  onOpenBlueprintStudio: () => void;
  onSelectDatabase: (db: DatabaseModel) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  community,
  databases,
  blueprints,
  entries,
  currentUser,
  onBack,
  onOpenCreateDatabase,
  onOpenBlueprintStudio,
  onSelectDatabase,
}) => {
  const [activeTab, setActiveTab] = useState<"databases" | "blueprints">("databases");

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-[#D5CBB9] pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-stone-700 hover:text-[#344B2D] font-medium text-sm transition bg-[#EBE3D0] hover:bg-[#DFD6C2] px-4 py-2 rounded-xl"
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
      <div className="bg-[#6F9560] text-white p-8 rounded-3xl shadow-figma border-2 border-[#5A7C4F] space-y-3">
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
          <span>Databases ({databases.length})</span>
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
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-serif text-[#344B2D]">
                Databases in Canon
              </h3>
              <p className="text-xs text-stone-600">The accepted modular datasets standardizing this school of thought</p>
            </div>

            {currentUser.role === "founder" || currentUser.role === "leader" ? (
              <button
                onClick={onOpenCreateDatabase}
                className="bg-[#749B64] hover:bg-[#5E8450] text-white px-5 py-2 rounded-2xl text-xs font-bold shadow-md transition flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Database</span>
              </button>
            ) : null}
          </div>

          {databases.length === 0 ? (
            <div className="bg-[#EFE8D8] border-2 border-dashed border-[#D5CBB9] rounded-3xl p-12 text-center space-y-4">
              <Database className="w-12 h-12 text-[#749B64] mx-auto opacity-60" />
              <h4 className="text-base font-bold font-serif text-[#344B2D]">No databases created in this canon yet</h4>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                First, design a Blueprint in the Blueprint Studio, then create a database linked to that blueprint.
              </p>
              {blueprints.length > 0 ? (
                <button
                  onClick={onOpenCreateDatabase}
                  className="bg-[#4A6541] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow hover:bg-[#344B2D] transition"
                >
                  Create Your First Database
                </button>
              ) : (
                <button
                  onClick={onOpenBlueprintStudio}
                  className="bg-[#749B64] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow hover:bg-[#5E8450] transition"
                >
                  Design First Blueprint
                </button>
              )}
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
                      <span>{dbEntries.length} Entries</span>
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

      {/* Tab 2: Blueprints Studio List */}
      {activeTab === "blueprints" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-serif text-[#344B2D]">
                Registered Blueprints
              </h3>
              <p className="text-xs text-stone-600">The structural schemas defining data tiers, field types, and scoring</p>
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
              <h4 className="text-base font-bold font-serif text-[#344B2D]">No blueprints designed yet</h4>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Use the Blueprint Studio to craft the exact sections, field types, and 0–100% metric weights you designed.
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
                          <strong>{s.title}</strong> — {s.tierWeightPercent}% ({s.fields.length} fields)
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
    </div>
  );
};
