"use client";

import React, { useState, useMemo } from "react";
import { Blueprint, Community, DatabaseModel, DynamicEntry, UserProfile } from "@/types/database";
import { ArrowLeft, PlusCircle, Search, Award, Sparkles, FileText, ChevronRight, Filter } from "lucide-react";

interface DatabaseEntriesViewProps {
  community: Community;
  database: DatabaseModel;
  blueprint: Blueprint;
  entries: DynamicEntry[];
  currentUser: UserProfile;
  onBack: () => void;
  onOpenCreateEntry: () => void;
  onSelectEntry: (entry: DynamicEntry) => void;
}

export const DatabaseEntriesView: React.FC<DatabaseEntriesViewProps> = ({
  community,
  database,
  blueprint,
  entries,
  currentUser,
  onBack,
  onOpenCreateEntry,
  onSelectEntry,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "pending_review">("all");

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.subtitle && e.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        JSON.stringify(e.data).toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || e.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [entries, searchQuery, statusFilter]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-[#D5CBB9] pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-stone-700 hover:text-[#344B2D] font-medium text-sm transition bg-[#EBE3D0] hover:bg-[#DFD6C2] px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {community.name}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-[#4A6541] text-white px-3 py-1.5 rounded-full font-bold">
            Blueprint: {blueprint.name} v{blueprint.version}
          </span>
        </div>
      </div>

      {/* Database Header Card */}
      <div className="bg-[#6F9560] text-white p-8 rounded-3xl shadow-figma border-2 border-[#5A7C4F] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#DDECD8] bg-[#4A6541] px-3 py-1 rounded-full">
            Canonical Database • {community.discipline}
          </span>

          <span className="text-xs font-semibold text-[#EBF4E9] bg-[#3A5630] px-3 py-1 rounded-full">
            {entries.length} Total Entries
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold font-serif">{database.name}</h1>
        <p className="text-sm sm:text-base text-[#EBF4E9] max-w-3xl leading-relaxed">
          {database.scopeDescription}
        </p>

        <div className="pt-2">
          <button
            onClick={onOpenCreateEntry}
            className="bg-[#F7F1E5] text-[#344B2D] hover:bg-[#EBE2CF] px-6 py-2.5 rounded-2xl text-xs font-bold tracking-wide shadow-md transition inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-[#4A6541]" />
            <span>+ Author New Entry</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#EFE8D8] p-4 rounded-3xl border border-[#D5CBB9]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search entries in this database..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-white rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-2 focus:ring-[#749B64]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-stone-600 hidden sm:inline" />
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                statusFilter === "all"
                  ? "bg-[#4A6541] text-white font-bold"
                  : "bg-white text-stone-700 hover:bg-[#DFD6C2] border border-[#D5CBB9]"
              }`}
            >
              All ({entries.length})
            </button>
            <button
              onClick={() => setStatusFilter("published")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                statusFilter === "published"
                  ? "bg-[#4A6541] text-white font-bold"
                  : "bg-white text-stone-700 hover:bg-[#DFD6C2] border border-[#D5CBB9]"
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setStatusFilter("pending_review")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                statusFilter === "pending_review"
                  ? "bg-[#4A6541] text-white font-bold"
                  : "bg-white text-stone-700 hover:bg-[#DFD6C2] border border-[#D5CBB9]"
              }`}
            >
              Pending
            </button>
          </div>
        </div>
      </div>

      {/* Entries List / Grid */}
      <section className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="bg-[#EFE8D8] border-2 border-dashed border-[#D5CBB9] rounded-3xl p-12 text-center space-y-4">
            <FileText className="w-14 h-14 text-[#749B64] mx-auto opacity-70" />
            <h3 className="text-lg font-bold font-serif text-[#344B2D]">
              {entries.length === 0
                ? "No Entries in this Database Yet"
                : "No Entries Match Your Search"}
            </h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
              {entries.length === 0
                ? `This database is ready. Author the first entry using the ${blueprint.name} blueprint.`
                : "Try adjusting your search query or status filter."}
            </p>
            {entries.length === 0 && (
              <button
                onClick={onOpenCreateEntry}
                className="bg-[#4A6541] text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-md hover:bg-[#344B2D] transition inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Author First Entry</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => onSelectEntry(entry)}
                className="bg-white p-6 rounded-3xl border border-[#D5CBB9] shadow-sm hover:shadow-lg hover:border-[#749B64] transition cursor-pointer flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A6541] bg-[#749B64]/15 px-2.5 py-0.5 rounded-full">
                      {entry.status}
                    </span>

                    <span className="text-xs font-bold text-[#4A6541] bg-[#EFE8D8] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      {entry.metricScore}%
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold font-serif text-[#344B2D] group-hover:text-[#4A6541] transition">
                      {entry.title}
                    </h3>
                    {entry.subtitle && (
                      <p className="text-xs italic text-stone-600 font-serif mt-0.5">
                        {entry.subtitle}
                      </p>
                    )}
                  </div>

                  {entry.isBoosted && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Spotlight Boosted</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                  <span className="text-[#4A6541] font-bold flex items-center gap-1 group-hover:translate-x-1 transition">
                    View <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
