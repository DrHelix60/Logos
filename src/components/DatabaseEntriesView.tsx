"use client";

import React, { useState, useMemo } from "react";
import { Blueprint, Community, DatabaseModel, DynamicEntry, UserProfile } from "@/types/database";
import {
  ArrowLeft,
  PlusCircle,
  Search,
  Award,
  Sparkles,
  FileText,
  ChevronRight,
  Filter,
  Sliders,
  LayoutGrid,
  List,
  Table as TableIcon,
  RotateCcw,
} from "lucide-react";

interface DatabaseEntriesViewProps {
  community?: Community | null;
  database: DatabaseModel;
  blueprint: Blueprint;
  entries: DynamicEntry[];
  currentUser: UserProfile;
  onBack: () => void;
  onOpenCreateEntry: () => void;
  onSelectEntry: (entry: DynamicEntry) => void;
  onOpenExplorerMaker?: () => void;
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
  onOpenExplorerMaker,
}) => {
  const config = database.explorerConfig;

  // Layout mode
  const [layout, setLayout] = useState<"grid" | "table" | "list">(
    config?.defaultLayout || "grid"
  );

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Status Filter
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "pending_review">("all");

  // Dynamic Filters State: { [fieldId: string]: string }
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  // Sort State
  const [sortBy, setSortBy] = useState<string>(config?.defaultSortField || "metricScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    config?.defaultSortOrder || "desc"
  );

  // Flatten all blueprint fields for label lookups
  const allFields = useMemo(() => {
    return blueprint.sections.flatMap((s) => s.fields);
  }, [blueprint]);

  // Derive distinct options for configured filter fields from existing entries
  const filterOptionsByField = useMemo(() => {
    if (!config?.filterFields) return {};
    const map: Record<string, string[]> = {};
    config.filterFields.forEach((fl) => {
      const vals = new Set<string>();
      entries.forEach((e) => {
        const val = e.data[fl.fieldId];
        if (Array.isArray(val)) {
          val.forEach((v) => v && vals.add(String(v)));
        } else if (val !== undefined && val !== null && String(val).trim() !== "") {
          vals.add(String(val));
        }
      });
      map[fl.fieldId] = Array.from(vals);
    });
    return map;
  }, [config, entries]);

  // Filtering & Sorting pipeline
  const filteredAndSortedEntries = useMemo(() => {
    let result = entries.filter((e) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const searchFields = config?.searchFields || ["title", "subtitle"];
        const matches = searchFields.some((fId) => {
          if (fId === "title") return e.title.toLowerCase().includes(q);
          if (fId === "subtitle") return e.subtitle?.toLowerCase().includes(q);
          const val = e.data[fId];
          if (val === undefined || val === null) return false;
          return String(val).toLowerCase().includes(q);
        });
        if (!matches) return false;
      }

      // 2. Status Filter
      if (statusFilter !== "all" && e.status !== statusFilter) {
        return false;
      }

      // 3. Dynamic Blueprint Filters
      for (const [fId, selectedVal] of Object.entries(activeFilters)) {
        if (!selectedVal || selectedVal === "ALL") continue;
        const entryVal = e.data[fId];
        if (Array.isArray(entryVal)) {
          if (!entryVal.map(String).includes(selectedVal)) return false;
        } else {
          if (String(entryVal) !== selectedVal) return false;
        }
      }

      return true;
    });

    // Sort
    result.sort((a, b) => {
      let valA: any = a.metricScore;
      let valB: any = b.metricScore;

      if (sortBy === "title") {
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
      } else if (sortBy === "createdAt") {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      } else if (sortBy !== "metricScore") {
        valA = a.data[sortBy] ?? "";
        valB = b.data[sortBy] ?? "";
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [entries, searchQuery, statusFilter, activeFilters, sortBy, sortOrder, config]);

  const handleFilterChange = (fieldId: string, val: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [fieldId]: val,
    }));
  };

  const handleResetFilters = () => {
    setActiveFilters({});
    setSearchQuery("");
    setStatusFilter("all");
  };

  const visibleCardFieldIds = config?.cardVisibleFields || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between border-b border-[#D5CBB9] pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-stone-700 hover:text-[#344B2D] font-medium text-xs transition bg-[#EBE3D0] hover:bg-[#DFD6C2] px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{community ? `Back to ${community.name}` : "Back to Registry"}</span>
        </button>

        <div className="flex items-center gap-2">
          {onOpenExplorerMaker && (
            <button
              onClick={onOpenExplorerMaker}
              className="bg-white hover:bg-stone-50 text-[#344B2D] border border-[#D5CBB9] px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              <Sliders className="w-3.5 h-3.5 text-[#749B64]" />
              <span>Customize Explorer</span>
            </button>
          )}

          <span className="text-xs bg-[#4A6541] text-white px-3 py-1.5 rounded-full font-bold">
            Schema: {blueprint.name} (v{blueprint.version})
          </span>
        </div>
      </div>

      {/* Database Institutional Header */}
      <div className="bg-[#6F9560] text-white p-7 sm:p-8 rounded-3xl shadow-figma border-2 border-[#5A7C4F] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#DDECD8] bg-[#4A6541] px-3 py-1 rounded-full">
            {community ? `Canonical Dataset • ${community.discipline}` : "Independent Knowledge Database"}
          </span>

          <span className="text-xs font-semibold text-[#EBF4E9] bg-[#3A5630] px-3 py-1 rounded-full">
            {entries.length} Total Records
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold font-serif">{database.name}</h1>
        <p className="text-sm sm:text-base text-[#EBF4E9] max-w-3xl leading-relaxed">
          {database.scopeDescription}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenCreateEntry}
            className="bg-[#F7F1E5] text-[#344B2D] hover:bg-[#EBE2CF] px-6 py-2.5 rounded-2xl text-xs font-bold tracking-wide shadow-md transition inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-[#4A6541]" />
            <span>+ Author New Entry</span>
          </button>
        </div>
      </div>

      {/* Configured Explorer Controls Toolbar */}
      <div className="bg-[#EFE8D8] p-5 rounded-3xl border border-[#D5CBB9] space-y-4">
        {/* Top search & layout controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${database.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-white rounded-xl border border-[#D5CBB9] focus:outline-none focus:ring-2 focus:ring-[#749B64]"
            />
          </div>

          {/* Layout & Sort switcher */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-white border border-[#D5CBB9] rounded-xl px-2.5 py-1.5 font-medium"
            >
              <option value="metricScore">Sort: Metric Score</option>
              <option value="title">Sort: Title (A-Z)</option>
              <option value="createdAt">Sort: Date Added</option>
              {allFields.slice(0, 3).map((f) => (
                <option key={f.id} value={f.id}>
                  Sort: {f.label}
                </option>
              ))}
            </select>

            {/* Layout Toggles */}
            <div className="flex items-center bg-white rounded-xl border border-[#D5CBB9] p-0.5">
              <button
                type="button"
                onClick={() => setLayout("grid")}
                title="Grid cards"
                className={`p-1.5 rounded-lg transition ${
                  layout === "grid" ? "bg-[#4A6541] text-white" : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setLayout("table")}
                title="Data table"
                className={`p-1.5 rounded-lg transition ${
                  layout === "table" ? "bg-[#4A6541] text-white" : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setLayout("list")}
                title="Compact list"
                className={`p-1.5 rounded-lg transition ${
                  layout === "list" ? "bg-[#4A6541] text-white" : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Filters Bar configured via Explorer Maker */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#D5CBB9]/60 text-xs">
          <span className="font-bold text-stone-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#749B64]" />
            Filters:
          </span>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-white border border-[#D5CBB9] rounded-xl px-2.5 py-1 text-xs"
          >
            <option value="all">Status: All</option>
            <option value="published">Published</option>
            <option value="pending_review">Pending Review</option>
          </select>

          {/* Custom configured filters from explorerConfig */}
          {config?.filterFields?.map((fl) => {
            const options = filterOptionsByField[fl.fieldId] || [];
            return (
              <select
                key={fl.fieldId}
                value={activeFilters[fl.fieldId] || "ALL"}
                onChange={(e) => handleFilterChange(fl.fieldId, e.target.value)}
                className="bg-white border border-[#D5CBB9] rounded-xl px-2.5 py-1 text-xs font-medium"
              >
                <option value="ALL">{fl.label}: All</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            );
          })}

          {(searchQuery || statusFilter !== "all" || Object.keys(activeFilters).length > 0) && (
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-semibold text-stone-600 hover:text-[#344B2D] flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#DFD6C2]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Explorer Content Display */}
      <section className="space-y-4">
        {filteredAndSortedEntries.length === 0 ? (
          <div className="bg-[#EFE8D8] border-2 border-dashed border-[#D5CBB9] rounded-3xl p-12 text-center space-y-4">
            <FileText className="w-14 h-14 text-[#749B64] mx-auto opacity-70" />
            <h3 className="text-lg font-bold font-serif text-[#344B2D]">
              {entries.length === 0
                ? "No Entries in this Database Yet"
                : "No Entries Match Current Filters"}
            </h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
              {entries.length === 0
                ? `Standardize records in this database using the ${blueprint.name} blueprint schema.`
                : "Try adjusting or clearing your search filters."}
            </p>
            {entries.length === 0 ? (
              <button
                onClick={onOpenCreateEntry}
                className="bg-[#4A6541] text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-md hover:bg-[#344B2D] transition inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Author First Entry</span>
              </button>
            ) : (
              <button
                onClick={handleResetFilters}
                className="bg-[#749B64] text-white px-5 py-2 rounded-xl text-xs font-bold shadow hover:bg-[#5E8450] transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : layout === "grid" ? (
          /* GRID VIEW */
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredAndSortedEntries.map((entry) => (
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

                  {/* Configured Visible Badges */}
                  {visibleCardFieldIds.length > 0 && (
                    <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-1">
                      {visibleCardFieldIds.map((fId) => {
                        const val = entry.data[fId];
                        const f = allFields.find((fld) => fld.id === fId);
                        if (!val || !f) return null;
                        const displayVal = Array.isArray(val) ? val.join(", ") : String(val);
                        return (
                          <span
                            key={fId}
                            className="text-[10px] bg-[#EFE8D8] text-stone-700 px-2 py-0.5 rounded-md font-medium"
                          >
                            <strong>{f.label}:</strong> {displayVal}
                          </span>
                        );
                      })}
                    </div>
                  )}

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
        ) : layout === "table" ? (
          /* TABLE VIEW */
          <div className="bg-white rounded-3xl border border-[#D5CBB9] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#EFE8D8] text-stone-800 font-bold border-b border-[#D5CBB9]">
                  <tr>
                    <th className="p-3.5">Title</th>
                    <th className="p-3.5">Subtitle</th>
                    <th className="p-3.5">Metric Score</th>
                    <th className="p-3.5">Status</th>
                    {visibleCardFieldIds.map((fId) => {
                      const f = allFields.find((fld) => fld.id === fId);
                      return <th key={fId} className="p-3.5">{f?.label || fId}</th>;
                    })}
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredAndSortedEntries.map((entry) => (
                    <tr
                      key={entry.id}
                      onClick={() => onSelectEntry(entry)}
                      className="hover:bg-stone-50 cursor-pointer transition"
                    >
                      <td className="p-3.5 font-bold text-[#344B2D] font-serif">{entry.title}</td>
                      <td className="p-3.5 text-stone-600 italic">{entry.subtitle || "—"}</td>
                      <td className="p-3.5">
                        <span className="font-bold text-[#4A6541] bg-[#EFE8D8] px-2 py-0.5 rounded-full">
                          {entry.metricScore}%
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-[10px] font-bold uppercase text-[#4A6541] bg-[#749B64]/15 px-2 py-0.5 rounded-full">
                          {entry.status}
                        </span>
                      </td>
                      {visibleCardFieldIds.map((fId) => {
                        const val = entry.data[fId];
                        return (
                          <td key={fId} className="p-3.5 text-stone-700">
                            {val ? (Array.isArray(val) ? val.join(", ") : String(val)) : "—"}
                          </td>
                        );
                      })}
                      <td className="p-3.5 text-stone-500">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3.5 text-right font-bold text-[#4A6541]">
                        Open →
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* LIST VIEW */
          <div className="space-y-3">
            {filteredAndSortedEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => onSelectEntry(entry)}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-[#D5CBB9] shadow-2xs hover:shadow-md hover:border-[#749B64] transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold font-serif text-[#344B2D] group-hover:text-[#4A6541] transition">
                      {entry.title}
                    </h3>
                    {entry.subtitle && (
                      <span className="text-xs text-stone-500 italic">({entry.subtitle})</span>
                    )}
                  </div>
                  {visibleCardFieldIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-[11px] text-stone-600">
                      {visibleCardFieldIds.map((fId) => {
                        const val = entry.data[fId];
                        const f = allFields.find((fld) => fld.id === fId);
                        if (!val || !f) return null;
                        return (
                          <span key={fId}>
                            <strong className="text-stone-700">{f.label}:</strong>{" "}
                            {Array.isArray(val) ? val.join(", ") : String(val)}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="font-bold text-[#4A6541] bg-[#EFE8D8] px-3 py-1 rounded-full">
                    {entry.metricScore}% Score
                  </span>
                  <span className="text-stone-400 group-hover:translate-x-1 transition font-bold text-[#4A6541]">
                    Open →
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
