"use client";

import React, { useState, useMemo } from "react";
import { Blueprint, Community, DatabaseModel, UserProfile } from "@/types/database";
import {
  Landmark,
  PlusCircle,
  Search,
  Layers,
  Database,
  ChevronRight,
  ShieldCheck,
  Globe,
} from "lucide-react";

interface LogosPlatformHomeProps {
  currentUser: UserProfile;
  communities: Community[];
  databases: DatabaseModel[];
  blueprints: Blueprint[];
  onSelectCommunity: (comm: Community) => void;
  onSelectDatabase: (db: DatabaseModel) => void;
  onOpenCreateCommunity: () => void;
  onOpenCreateDatabase: () => void;
  onOpenBlueprintStudio: () => void;
}

export const LogosPlatformHome: React.FC<LogosPlatformHomeProps> = ({
  currentUser,
  communities,
  databases,
  blueprints,
  onSelectCommunity,
  onSelectDatabase,
  onOpenCreateCommunity,
  onOpenCreateDatabase,
  onOpenBlueprintStudio,
}) => {
  const [activeTab, setActiveTab] = useState<"communities" | "databases" | "blueprints">("communities");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("All");

  // Dynamically derive distinct disciplines from existing communities & blueprints (no hardcoded list)
  const existingDisciplines = useMemo(() => {
    const set = new Set<string>();
    communities.forEach((c) => c.discipline && set.add(c.discipline));
    blueprints.forEach((b) => b.domain && set.add(b.domain));
    return ["All", ...Array.from(set)];
  }, [communities, blueprints]);

  // Filtered lists
  const filteredCommunities = useMemo(() => {
    return communities.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.discipline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.scopePrinciples.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDiscipline =
        selectedDiscipline === "All" ||
        c.discipline.toLowerCase() === selectedDiscipline.toLowerCase();
      return matchesSearch && matchesDiscipline;
    });
  }, [communities, searchQuery, selectedDiscipline]);

  const filteredDatabases = useMemo(() => {
    return databases.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.scopeDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [databases, searchQuery]);

  const filteredBlueprints = useMemo(() => {
    return blueprints.filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.domain.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDiscipline =
        selectedDiscipline === "All" ||
        b.domain.toLowerCase() === selectedDiscipline.toLowerCase();
      return matchesSearch && matchesDiscipline;
    });
  }, [blueprints, searchQuery, selectedDiscipline]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Institutional Top Bar */}
      <section className="bg-white p-7 sm:p-8 rounded-3xl border border-[#D5CBB9] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#4A6541] tracking-wider uppercase">
            <Globe className="w-4 h-4" />
            <span>Open Knowledge Standardization Registry</span>
          </div>
          <h1 className="text-3xl font-bold font-serif text-[#344B2D]">
            Logos Registry
          </h1>
          <p className="text-xs text-stone-600">
            Decentralized archive of verified schools of thought, canonical datasets, and standardization blueprints.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onOpenCreateCommunity}
            className="bg-[#4A6541] hover:bg-[#344B2D] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Establish School</span>
          </button>

          <button
            onClick={onOpenCreateDatabase}
            className="bg-white hover:bg-stone-50 text-[#344B2D] border border-[#D5CBB9] px-4 py-2 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5 text-[#749B64]" />
            <span>New Database</span>
          </button>

          <button
            onClick={onOpenBlueprintStudio}
            className="bg-white hover:bg-stone-50 text-[#344B2D] border border-[#D5CBB9] px-4 py-2 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-[#749B64]" />
            <span>Design Blueprint</span>
          </button>
        </div>
      </section>

      {/* Main Registry Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D5CBB9] pb-3">
        <button
          onClick={() => setActiveTab("communities")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-sm ${
            activeTab === "communities"
              ? "bg-[#4A6541] text-white"
              : "bg-[#EFE8D8] text-stone-700 hover:bg-[#DFD6C2]"
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Schools of Thought ({communities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("databases")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-sm ${
            activeTab === "databases"
              ? "bg-[#4A6541] text-white"
              : "bg-[#EFE8D8] text-stone-700 hover:bg-[#DFD6C2]"
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Knowledge Databases ({databases.length})</span>
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
          <span>Standard Blueprints ({blueprints.length})</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#EFE8D8] p-4 rounded-3xl border border-[#D5CBB9]">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search registry by title, domain, or scope..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-white rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-2 focus:ring-[#749B64]"
          />
        </div>

        {/* Dynamic Discipline Selector (if any defined) */}
        {existingDisciplines.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {existingDisciplines.map((d) => (
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
        )}
      </div>

      {/* TAB 1: SCHOOLS OF THOUGHT */}
      {activeTab === "communities" && (
        <section className="space-y-4">
          {filteredCommunities.length === 0 ? (
            <div className="bg-[#EFE8D8] border-2 border-dashed border-[#D5CBB9] rounded-3xl p-12 text-center space-y-4">
              <Landmark className="w-12 h-12 text-[#749B64] mx-auto opacity-70" />
              <h3 className="text-base font-bold font-serif text-[#344B2D]">
                {communities.length === 0
                  ? "No Schools of Thought Registered"
                  : "No Schools Match Search Criteria"}
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                {communities.length === 0
                  ? "Establish a new School of Thought to group canonical databases and define domain principles."
                  : "Try clearing your search query."}
              </p>
              {communities.length === 0 && (
                <button
                  onClick={onOpenCreateCommunity}
                  className="bg-[#4A6541] text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-md hover:bg-[#344B2D] transition inline-flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Establish School of Thought</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map((c) => {
                const commDbs = databases.filter(
                  (d) => d.communityId === c.id || (c.canonDatabaseIds || []).includes(d.id)
                );
                const commBps = blueprints.filter((b) => b.communityId === c.id);

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
                          {commDbs.length} Canon DBs
                        </span>
                        <span className="flex items-center gap-1 font-medium text-stone-700">
                          <Layers className="w-3.5 h-3.5 text-[#749B64]" />
                          {commBps.length} Blueprints
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
      )}

      {/* TAB 2: KNOWLEDGE DATABASES (INDEPENDENT & CANONICAL) */}
      {activeTab === "databases" && (
        <section className="space-y-4">
          {filteredDatabases.length === 0 ? (
            <div className="bg-[#EFE8D8] border-2 border-dashed border-[#D5CBB9] rounded-3xl p-12 text-center space-y-4">
              <Database className="w-12 h-12 text-[#749B64] mx-auto opacity-70" />
              <h3 className="text-base font-bold font-serif text-[#344B2D]">
                No Databases Registered
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                Databases can exist independently or be curated into schools of thought.
              </p>
              <button
                onClick={onOpenCreateDatabase}
                className="bg-[#4A6541] text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-md hover:bg-[#344B2D] transition inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Database</span>
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDatabases.map((db) => {
                const bp = blueprints.find((b) => b.id === db.blueprintId);
                const comm = communities.find((c) => c.id === db.communityId);

                return (
                  <div
                    key={db.id}
                    onClick={() => onSelectDatabase(db)}
                    className="bg-white p-6 rounded-3xl border border-[#D5CBB9] shadow-sm hover:shadow-lg hover:border-[#749B64] transition cursor-pointer flex flex-col justify-between group space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A6541] bg-[#749B64]/15 px-2.5 py-0.5 rounded-full">
                          {comm ? `Canon: ${comm.name}` : "Independent"}
                        </span>
                        <span className="text-[10px] text-stone-500">
                          {bp ? `v${bp.version}` : ""}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold font-serif text-[#344B2D] group-hover:text-[#4A6541] transition">
                        {db.name}
                      </h3>

                      <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                        {db.scopeDescription}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <span className="text-stone-600 font-medium">
                        Schema: {bp ? bp.name : "Custom"}
                      </span>

                      <span className="text-[#4A6541] font-bold flex items-center gap-1 group-hover:translate-x-1 transition">
                        Explore <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* TAB 3: STANDARD BLUEPRINTS */}
      {activeTab === "blueprints" && (
        <section className="space-y-4">
          {filteredBlueprints.length === 0 ? (
            <div className="bg-[#EFE8D8] border-2 border-dashed border-[#D5CBB9] rounded-3xl p-12 text-center space-y-4">
              <Layers className="w-12 h-12 text-[#749B64] mx-auto opacity-70" />
              <h3 className="text-base font-bold font-serif text-[#344B2D]">
                No Blueprints Registered
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                Blueprints define structured schemas, property types, and 0–100% metric weights.
              </p>
              <button
                onClick={onOpenBlueprintStudio}
                className="bg-[#4A6541] text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-md hover:bg-[#344B2D] transition inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Design Blueprint</span>
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {filteredBlueprints.map((bp) => (
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
        </section>
      )}
    </div>
  );
};
