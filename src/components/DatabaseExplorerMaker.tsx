"use client";

import React, { useState } from "react";
import { Blueprint, ExplorerConfig, ExplorerFilterField } from "@/types/database";
import { ArrowLeft, Check, Sliders, Search, Filter, LayoutGrid, List, Table, Eye, Sparkles } from "lucide-react";

interface DatabaseExplorerMakerProps {
  blueprint: Blueprint;
  initialConfig?: ExplorerConfig;
  databaseName: string;
  onSave: (config: ExplorerConfig) => void;
  onCancel: () => void;
}

export const DatabaseExplorerMaker: React.FC<DatabaseExplorerMakerProps> = ({
  blueprint,
  initialConfig,
  databaseName,
  onSave,
  onCancel,
}) => {
  // Collect all fields from all sections of the blueprint
  const allFields = blueprint.sections.flatMap((sec) =>
    sec.fields.map((f) => ({ ...f, sectionTitle: sec.title }))
  );

  const [searchFields, setSearchFields] = useState<string[]>(
    initialConfig?.searchFields || ["title", "subtitle"]
  );

  const [filterFields, setFilterFields] = useState<ExplorerFilterField[]>(
    initialConfig?.filterFields ||
      allFields
        .filter((f) => f.type === "multiselect" || f.type === "text" || f.type === "number")
        .slice(0, 4)
        .map((f) => ({
          fieldId: f.id,
          label: f.label,
          filterType: f.type === "number" ? "range" : f.type === "multiselect" ? "multiselect" : "select",
          logic: "or",
        }))
  );

  const [cardVisibleFields, setCardVisibleFields] = useState<string[]>(
    initialConfig?.cardVisibleFields || allFields.slice(0, 3).map((f) => f.id)
  );

  const [defaultLayout, setDefaultLayout] = useState<"grid" | "table" | "list">(
    initialConfig?.defaultLayout || "grid"
  );

  const [defaultSortField, setDefaultSortField] = useState<string>(
    initialConfig?.defaultSortField || "metricScore"
  );
  const [defaultSortOrder, setDefaultSortOrder] = useState<"asc" | "desc">(
    initialConfig?.defaultSortOrder || "desc"
  );

  // Toggle search field
  const toggleSearchField = (fieldId: string) => {
    if (searchFields.includes(fieldId)) {
      setSearchFields(searchFields.filter((id) => id !== fieldId));
    } else {
      setSearchFields([...searchFields, fieldId]);
    }
  };

  // Toggle filter field
  const toggleFilterField = (fieldId: string) => {
    const existing = filterFields.find((f) => f.fieldId === fieldId);
    if (existing) {
      setFilterFields(filterFields.filter((f) => f.fieldId !== fieldId));
    } else {
      const fieldDef = allFields.find((f) => f.id === fieldId);
      if (!fieldDef) return;
      const newFilter: ExplorerFilterField = {
        fieldId: fieldDef.id,
        label: fieldDef.label,
        filterType: fieldDef.type === "number" ? "range" : fieldDef.type === "multiselect" ? "multiselect" : "select",
        logic: "or",
      };
      setFilterFields([...filterFields, newFilter]);
    }
  };

  const updateFilterField = (fieldId: string, updates: Partial<ExplorerFilterField>) => {
    setFilterFields(
      filterFields.map((f) => (f.fieldId === fieldId ? { ...f, ...updates } : f))
    );
  };

  // Toggle card badge field
  const toggleCardVisibleField = (fieldId: string) => {
    if (cardVisibleFields.includes(fieldId)) {
      setCardVisibleFields(cardVisibleFields.filter((id) => id !== fieldId));
    } else {
      setCardVisibleFields([...cardVisibleFields, fieldId]);
    }
  };

  const handleSave = () => {
    const config: ExplorerConfig = {
      searchFields,
      filterFields,
      cardVisibleFields,
      defaultLayout,
      defaultSortField,
      defaultSortOrder,
    };
    onSave(config);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#D5CBB9] pb-4">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-stone-700 hover:text-[#344B2D] font-medium text-sm transition bg-[#EBE3D0] hover:bg-[#DFD6C2] px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Explorer Maker</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="bg-[#749B64] hover:bg-[#5E8450] text-white px-6 py-2 rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Save Explorer Customization</span>
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="bg-white p-6 rounded-3xl border border-[#D5CBB9] space-y-1 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-[#4A6541] uppercase tracking-wider">
          <Sliders className="w-4 h-4" />
          <span>Database Explorer Maker</span>
        </div>
        <h1 className="text-2xl font-bold font-serif text-[#344B2D]">
          Customize Explorer for: {databaseName}
        </h1>
        <p className="text-xs text-stone-600">
          Define how researchers and members query, filter, sort, and visualize records in this database based on the {blueprint.name} schema.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Search Bar Indexing */}
          <div className="bg-white p-6 rounded-3xl border border-[#D5CBB9] space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-bold text-sm text-[#344B2D] flex items-center gap-2">
                <Search className="w-4 h-4 text-[#749B64]" />
                <span>1. Search Bar Indexing</span>
              </h3>
              <span className="text-[11px] text-stone-500">
                {searchFields.length} fields indexed
              </span>
            </div>
            <p className="text-xs text-stone-600">
              Select which fields are evaluated when users type queries in the search bar:
            </p>

            <div className="grid sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100">
                <input
                  type="checkbox"
                  checked={searchFields.includes("title")}
                  onChange={() => toggleSearchField("title")}
                  className="rounded text-[#749B64] focus:ring-[#749B64]"
                />
                <span className="font-semibold text-stone-800">Primary Title</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100">
                <input
                  type="checkbox"
                  checked={searchFields.includes("subtitle")}
                  onChange={() => toggleSearchField("subtitle")}
                  className="rounded text-[#749B64] focus:ring-[#749B64]"
                />
                <span className="font-semibold text-stone-800">Subtitle / Alt Label</span>
              </label>

              {allFields.map((f) => (
                <label
                  key={f.id}
                  className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100"
                >
                  <input
                    type="checkbox"
                    checked={searchFields.includes(f.id)}
                    onChange={() => toggleSearchField(f.id)}
                    className="rounded text-[#749B64] focus:ring-[#749B64]"
                  />
                  <div className="truncate">
                    <span className="font-medium text-stone-800">{f.label}</span>
                    <span className="text-[10px] text-stone-500 ml-1">({f.type})</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Section 2: Explorer Filter Controls */}
          <div className="bg-white p-6 rounded-3xl border border-[#D5CBB9] space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-bold text-sm text-[#344B2D] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#749B64]" />
                <span>2. Filter Options & Sidebar Controls</span>
              </h3>
              <span className="text-[11px] text-stone-500">
                {filterFields.length} active filters
              </span>
            </div>
            <p className="text-xs text-stone-600">
              Select which schema properties appear as interactive filters in the explorer:
            </p>

            {/* Field selector chips */}
            <div className="flex flex-wrap gap-1.5 pb-2">
              {allFields.map((f) => {
                const isSelected = filterFields.some((fl) => fl.fieldId === f.id);
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleFilterField(f.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-medium transition ${
                      isSelected
                        ? "bg-[#4A6541] text-white shadow-sm font-bold"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-300"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {f.label}
                  </button>
                );
              })}
            </div>

            {/* Configured filters list */}
            {filterFields.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-stone-700 block">
                  Active Filter Properties:
                </span>
                {filterFields.map((fl) => {
                  const fieldDef = allFields.find((f) => f.id === fl.fieldId);
                  return (
                    <div
                      key={fl.fieldId}
                      className="p-3 rounded-2xl bg-[#F7F1E5] border border-[#D5CBB9] flex flex-wrap items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <strong className="text-[#344B2D] text-sm block">
                          {fl.label}
                        </strong>
                        <span className="text-[10px] text-stone-500">
                          Blueprint Field: {fieldDef?.label} ({fieldDef?.type})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Control type */}
                        <select
                          value={fl.filterType}
                          onChange={(e) =>
                            updateFilterField(fl.fieldId, {
                              filterType: e.target.value as any,
                            })
                          }
                          className="bg-white border border-[#D5CBB9] rounded-lg px-2 py-1 text-xs"
                        >
                          <option value="multiselect">Multi-Select (Tags)</option>
                          <option value="select">Dropdown</option>
                          <option value="range">Range / Bounds</option>
                          <option value="text">Exact Text</option>
                        </select>

                        {/* Logic */}
                        <select
                          value={fl.logic}
                          onChange={(e) =>
                            updateFilterField(fl.fieldId, {
                              logic: e.target.value as any,
                            })
                          }
                          className="bg-white border border-[#D5CBB9] rounded-lg px-2 py-1 text-xs"
                        >
                          <option value="or">OR (Any Match)</option>
                          <option value="and">AND (All Match)</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => toggleFilterField(fl.fieldId)}
                          className="text-stone-400 hover:text-red-700 font-bold px-1.5"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 3: Summary Card Visible Fields */}
          <div className="bg-white p-6 rounded-3xl border border-[#D5CBB9] space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-bold text-sm text-[#344B2D] flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#749B64]" />
                <span>3. Entry Card Summary Badges</span>
              </h3>
              <span className="text-[11px] text-stone-500">
                {cardVisibleFields.length} badges displayed
              </span>
            </div>
            <p className="text-xs text-stone-600">
              Select which blueprint attributes are visibly highlighted on the summary card when browsing:
            </p>

            <div className="flex flex-wrap gap-1.5">
              {allFields.map((f) => {
                const isChecked = cardVisibleFields.includes(f.id);
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => toggleCardVisibleField(f.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-medium transition ${
                      isChecked
                        ? "bg-[#344B2D] text-white font-bold"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-300"
                    }`}
                  >
                    {isChecked ? "● " : "○ "}
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Default Layout & Sort */}
          <div className="bg-white p-6 rounded-3xl border border-[#D5CBB9] space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-[#344B2D] flex items-center gap-2 border-b border-stone-100 pb-2">
              <LayoutGrid className="w-4 h-4 text-[#749B64]" />
              <span>4. Default Layout & Sorting Rules</span>
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold block mb-1 text-stone-700">Default View Layout</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDefaultLayout("grid")}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-semibold transition ${
                      defaultLayout === "grid"
                        ? "bg-[#4A6541] text-white border-[#4A6541]"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span>Grid</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDefaultLayout("table")}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-semibold transition ${
                      defaultLayout === "table"
                        ? "bg-[#4A6541] text-white border-[#4A6541]"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    <Table className="w-4 h-4" />
                    <span>Table</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDefaultLayout("list")}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-semibold transition ${
                      defaultLayout === "list"
                        ? "bg-[#4A6541] text-white border-[#4A6541]"
                        : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    <List className="w-4 h-4" />
                    <span>List</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1 text-stone-700">Default Sort Criterion</label>
                <div className="space-y-2">
                  <select
                    value={defaultSortField}
                    onChange={(e) => setDefaultSortField(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-[#D5CBB9] rounded-xl"
                  >
                    <option value="metricScore">Metric Score</option>
                    <option value="title">Alphabetical Title</option>
                    <option value="createdAt">Creation Timestamp</option>
                    {allFields.map((f) => (
                      <option key={f.id} value={f.id}>
                        Field: {f.label}
                      </option>
                    ))}
                  </select>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDefaultSortOrder("desc")}
                      className={`flex-1 py-1 rounded-lg text-xs font-semibold ${
                        defaultSortOrder === "desc"
                          ? "bg-[#344B2D] text-white"
                          : "bg-stone-100 text-stone-700 border border-stone-200"
                      }`}
                    >
                      High to Low / Z-A
                    </button>
                    <button
                      type="button"
                      onClick={() => setDefaultSortOrder("asc")}
                      className={`flex-1 py-1 rounded-lg text-xs font-semibold ${
                        defaultSortOrder === "asc"
                          ? "bg-[#344B2D] text-white"
                          : "bg-stone-100 text-stone-700 border border-stone-200"
                      }`}
                    >
                      Low to High / A-Z
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Mockup Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-20 bg-[#F7F1E5] p-6 rounded-3xl border-2 border-[#749B64] space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#D5CBB9] pb-2">
              <span className="text-xs font-bold text-[#344B2D] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#749B64]" />
                Live Explorer Preview
              </span>
              <span className="text-[10px] bg-[#4A6541] text-white px-2 py-0.5 rounded-full capitalize">
                {defaultLayout} view
              </span>
            </div>

            {/* Mock Search Bar */}
            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-stone-600">Search Toolbar:</div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <div className="w-full text-xs pl-8 pr-3 py-2 bg-white rounded-xl border border-[#D5CBB9] text-stone-400 select-none">
                  Search across {searchFields.length} indexed properties...
                </div>
              </div>
            </div>

            {/* Mock Filter Bar */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-stone-600">Active Filter Controls:</div>
              {filterFields.length === 0 ? (
                <div className="text-[11px] text-stone-500 italic p-2 bg-stone-100 rounded-xl">
                  No filters selected yet. Pick fields from step 2.
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {filterFields.map((fl) => (
                    <span
                      key={fl.fieldId}
                      className="text-[11px] bg-white border border-[#D5CBB9] px-2.5 py-1 rounded-lg text-stone-700 font-medium flex items-center gap-1 shadow-2xs"
                    >
                      <Filter className="w-2.5 h-2.5 text-[#749B64]" />
                      <span>{fl.label}</span>
                      <span className="text-[9px] uppercase font-bold text-stone-400">
                        [{fl.filterType}]
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Mock Sample Record Card */}
            <div className="space-y-1.5 pt-2 border-t border-[#D5CBB9]">
              <div className="text-[11px] font-semibold text-stone-600">Card Layout Preview:</div>
              <div className="bg-white p-4 rounded-2xl border border-[#D5CBB9] space-y-2 shadow-2xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-stone-900 font-serif text-sm">
                      Sample Knowledge Entry
                    </h4>
                    <p className="text-[10px] text-stone-500 italic">
                      Standardized Reference Record
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#4A6541] bg-[#EFE8D8] px-2 py-0.5 rounded-full">
                    95% Score
                  </span>
                </div>

                {cardVisibleFields.length > 0 && (
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-1">
                    {cardVisibleFields.map((fId) => {
                      const f = allFields.find((fld) => fld.id === fId);
                      if (!f) return null;
                      return (
                        <span
                          key={f.id}
                          className="text-[10px] bg-[#EFE8D8] text-stone-700 px-2 py-0.5 rounded-md font-medium"
                        >
                          <strong>{f.label}:</strong> (Value)
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="w-full bg-[#749B64] hover:bg-[#5E8450] text-white py-2.5 rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Apply Explorer Configuration</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
