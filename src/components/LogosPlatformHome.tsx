"use client";

import React, { useState } from "react";
import { Blueprint, Community, DatabaseModel, UserProfile } from "@/types/database";
import { Landmark, PlusCircle, Search, Layers, Database, ChevronRight, Sparkles, BookOpen, ShieldCheck, Share2 } from "lucide-react";

interface LogosPlatformHomeProps {
  currentUser: UserProfile;
  communities: Community[];
  databases: DatabaseModel[];
  blueprints: Blueprint[];
  onSelectCommunity: (comm: Community) => void;
  onOpenCreateCommunity: () => void;
}

export const LogosPlatformHome: React.FC<LogosPlatformHomeProps> = ({
  currentUser,
  communities,
  databases,
  blueprints,
  onSelectCommunity,
  onOpenCreateCommunity,
}) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const disciplines = [
    "All",
    "Biology",
    "Philosophy",
    "Physics",
    "Chemistry",
    "Economics",
    "Engineering",
    "Arts & Humanities",
  ];

  const filteredCommunities = communities.filter((c) => {
    const matchesDiscipline =
      selectedDiscipline === "All" ||
      c.discipline.toLowerCase() === selectedDiscipline.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.scopePrinciples.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.discipline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiscipline && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <section className="bg-gradient-to-br from-[#6F9560] to-[#4F7343] text-white p-8 sm:p-10 rounded-3xl shadow-figma border-2 border-[#5A7C4F] space-y-5 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#3A5630]/80 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-semibold text-[#DDECD8] border border-[#7BA66C]/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Decentralized Knowledge Standardization • $0 Server Hosting Cost</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight leading-tight">
            Logos Knowledge Network
          </h1>

          <p className="text-sm sm:text-base text-[#EBF4E9] max-w-2xl leading-relaxed">
            A domain-agnostic platform organizing schools of thought through validated blueprints, 
            canonical database groupings, and rigorous verification metrics.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCreateCommunity}
              className="bg-[#F7F1E5] text-[#344B2D] hover:bg-[#EBE2CF] px-6 py-2.5 rounded-2xl text-xs font-bold tracking-wide shadow-md transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-[#4A6541]" />
              <span>Establish School of Thought</span>
            </button>

            <div className="text-xs bg-[#344B2D]/60 px-4 py-2 rounded-2xl border border-[#7BA66C]/30 text-[#DDECD8] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Logged in as: <strong>{currentUser.displayName}</strong> ({currentUser.role})</span>
            </div>
          </div>
        </div>

        {/* Decorative background watermark */}
        <div className="absolute right-4 -bottom-10 opacity-10 pointer-events-none select-none text-[180px] font-serif font-black">
          LOGOS
        </div>
      </section>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#EFE8D8] p-4 rounded-3xl border border-[#D5CBB9]">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search schools of thought..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-white rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-2 focus:ring-[#749B64]"
          />
        </div>

        {/* Discipline Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {disciplines.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDiscipline(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                selectedDiscipline === d
                  ? "bg-[#4A6541] text-white shadow-sm font-bold"
                  : "bg-white text-stone-700 hover:bg-[#DFD6C2] border border-[#D5CBB9]"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Communities Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-serif text-[#344B2D]">
              Established Schools of Thought
            </h2>
            <p className="text-xs text-stone-600">
              Browse communities or establish a new canon for your field of study.
            </p>
          </div>

          <button
            onClick={onOpenCreateCommunity}
            className="bg-[#749B64] hover:bg-[#5E8450] text-white px-5 py-2 rounded-2xl text-xs font-bold shadow-md transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Establish School</span>
          </button>
        </div>

        {filteredCommunities.length === 0 ? (
          <div className="bg-[#EFE8D8] border-2 border-dashed border-[#D5CBB9] rounded-3xl p-12 text-center space-y-4">
            <Landmark className="w-14 h-14 text-[#749B64] mx-auto opacity-70" />
            <h3 className="text-lg font-bold font-serif text-[#344B2D]">
              {communities.length === 0
                ? "No Schools of Thought Established Yet"
                : "No Schools Match Your Filter"}
            </h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
              {communities.length === 0
                ? "Logos starts completely pristine. As Founder, you can now establish your first community (e.g. Biology, Philosophy, or any discipline), design its blueprint, and build its canon."
                : "Try resetting your search query or discipline filter to see all communities."}
            </p>
            {communities.length === 0 && (
              <button
                onClick={onOpenCreateCommunity}
                className="bg-[#4A6541] text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-md hover:bg-[#344B2D] transition inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Establish First School of Thought</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((c) => {
              const commDatabases = databases.filter((d) => d.communityId === c.id);
              const commBlueprints = blueprints.filter((b) => b.communityId === c.id);

              return (
                <div
                  key={c.id}
                  onClick={() => onSelectCommunity(c)}
                  className="bg-white p-6 rounded-3xl border border-[#D5CBB9] shadow-sm hover:shadow-lg hover:border-[#749B64] transition cursor-pointer flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A6541] bg-[#749B64]/15 px-2.5 py-0.5 rounded-full">
                        {c.discipline}
                      </span>
                      <span className="text-[10px] text-stone-500">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-serif text-[#344B2D] group-hover:text-[#4A6541] transition">
                      {c.name}
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {c.scopePrinciples}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-medium text-stone-700">
                        <Database className="w-3.5 h-3.5 text-[#749B64]" />
                        {commDatabases.length} DBs
                      </span>
                      <span className="flex items-center gap-1 font-medium text-stone-700">
                        <Layers className="w-3.5 h-3.5 text-[#749B64]" />
                        {commBlueprints.length} Blueprints
                      </span>
                    </div>

                    <span className="text-[#4A6541] font-bold flex items-center gap-1 group-hover:translate-x-1 transition">
                      Enter <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Architectural Pillars / Informational Section */}
      <section className="bg-[#EFE8D8] rounded-3xl p-8 border border-[#D5CBB9] space-y-6">
        <h3 className="text-lg font-bold font-serif text-[#344B2D]">
          How Logos Standardizes Knowledge
        </h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs text-stone-700">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#749B64] text-white flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="font-bold text-[#344B2D] text-sm">Schools of Thought</h4>
            <p className="text-stone-600 leading-relaxed">
              Domain-agnostic communities grouping canonical knowledge under agreed scope and empirical principles.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#749B64] text-white flex items-center justify-center font-bold">
              2
            </div>
            <h4 className="font-bold text-[#344B2D] text-sm">Blueprint Studio</h4>
            <p className="text-stone-600 leading-relaxed">
              Visual schema design establishing multi-tiered data structures and weighted 0–100% verification metrics.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#749B64] text-white flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="font-bold text-[#344B2D] text-sm">Canonical Databases</h4>
            <p className="text-stone-600 leading-relaxed">
              Modular databases governed by specific blueprints, housing verified, standardized knowledge entries.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#749B64] text-white flex items-center justify-center font-bold">
              4
            </div>
            <h4 className="font-bold text-[#344B2D] text-sm">P2P & Zero Cost</h4>
            <p className="text-stone-600 leading-relaxed">
              Powered by in-browser SQLite WASM with instantaneous zero-cost portable database exports and client ZIP packaging.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
