"use client";

import React from "react";
import { FilterState } from "@/types/database";
import { Filter, SlidersHorizontal, Check, RefreshCw } from "lucide-react";

interface SidebarFilterProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  availableOptions: {
    classes: string[];
    sizes: string[];
    diets: string[];
    activities: string[];
    habitats: string[];
    biomes: string[];
  };
  totalMatches: number;
}

export const SidebarFilter: React.FC<SidebarFilterProps> = ({
  filters,
  onChange,
  availableOptions,
  totalMatches,
}) => {
  const toggleArrayItem = (arr: string[], item: string): string[] => {
    return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
  };

  const handleReset = () => {
    onChange({
      searchQuery: "",
      selectedClasses: [],
      classMode: "or",
      selectedSizes: [],
      sizeMode: "or",
      selectedDiets: [],
      dietMode: "or",
      selectedActivities: [],
      activityMode: "or",
      selectedHabitats: [],
      habitatMode: "or",
      selectedBiomes: [],
      biomeMode: "or",
    });
  };

  return (
    <aside className="w-full lg:w-80 bg-[#EFE8D8] border border-[#D5CBB9] rounded-3xl p-5 shadow-sm space-y-6">
      {/* Header bar matching Figma Frame 25:5 */}
      <div className="flex items-center justify-between border-b border-[#D5CBB9] pb-3">
        <div className="flex items-center gap-2 text-[#344B2D] font-bold text-lg font-serif">
          <Filter className="w-5 h-5 text-[#4A6541]" />
          <span>Filtros</span>
          <span className="text-xs font-sans font-normal bg-[#749B64] text-white px-2 py-0.5 rounded-full">
            {totalMatches} found
          </span>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-stone-600 hover:text-[#344B2D] flex items-center gap-1 transition"
          title="Reset all filters"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Search by name, diet, or habitat..."
          value={filters.searchQuery}
          onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
          className="w-full px-3.5 py-2 text-xs bg-[#F7F1E5] border border-[#D5CBB9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#749B64] placeholder-stone-400"
        />
      </div>

      <div className="space-y-5 text-xs text-stone-800">
        {/* Category: Clase */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-bold text-[#344B2D] text-sm">
            <span>Clase (Taxon)</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 pl-1">
            {availableOptions.classes.map((cls) => {
              const active = filters.selectedClasses.includes(cls);
              return (
                <button
                  key={cls}
                  onClick={() => onChange({ ...filters, selectedClasses: toggleArrayItem(filters.selectedClasses, cls) })}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left transition ${
                    active ? "bg-[#749B64] text-white border-[#5E8450] font-semibold" : "bg-[#F7F1E5] border-[#D5CBB9] hover:bg-[#E2D8C3]"
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${active ? "bg-white text-[#749B64]" : "border-stone-400"}`}>
                    {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </span>
                  <span className="truncate">{cls}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category: Dieta */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-bold text-[#344B2D] text-sm">
            <span>Dieta</span>
            <div className="flex items-center bg-[#E2D8C3] p-0.5 rounded-md text-[10px]">
              <button
                onClick={() => onChange({ ...filters, dietMode: "or" })}
                className={`px-1.5 py-0.5 rounded ${filters.dietMode === "or" ? "bg-[#749B64] text-white font-bold" : "text-stone-600"}`}
              >
                Pertenece a uno
              </button>
              <button
                onClick={() => onChange({ ...filters, dietMode: "and" })}
                className={`px-1.5 py-0.5 rounded ${filters.dietMode === "and" ? "bg-[#4A6541] text-white font-bold" : "text-stone-600"}`}
              >
                En todos
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 pl-1">
            {availableOptions.diets.map((diet) => {
              const active = filters.selectedDiets.includes(diet);
              return (
                <button
                  key={diet}
                  onClick={() => onChange({ ...filters, selectedDiets: toggleArrayItem(filters.selectedDiets, diet) })}
                  className={`px-2.5 py-1 rounded-lg border transition ${
                    active ? "bg-[#749B64] text-white border-[#5E8450] font-semibold" : "bg-[#F7F1E5] border-[#D5CBB9] hover:bg-[#E2D8C3]"
                  }`}
                >
                  {diet}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category: Actividad */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-bold text-[#344B2D] text-sm">
            <span>Actividad</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pl-1">
            {availableOptions.activities.map((act) => {
              const active = filters.selectedActivities.includes(act);
              return (
                <button
                  key={act}
                  onClick={() => onChange({ ...filters, selectedActivities: toggleArrayItem(filters.selectedActivities, act) })}
                  className={`px-2.5 py-1 rounded-lg border transition ${
                    active ? "bg-[#749B64] text-white border-[#5E8450] font-semibold" : "bg-[#F7F1E5] border-[#D5CBB9] hover:bg-[#E2D8C3]"
                  }`}
                >
                  {act}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category: Hábitat (with AND/OR toggle matching Figma) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-bold text-[#344B2D] text-sm">
            <span>Hábitat</span>
            <div className="flex items-center bg-[#E2D8C3] p-0.5 rounded-md text-[10px]">
              <button
                onClick={() => onChange({ ...filters, habitatMode: "or" })}
                className={`px-1.5 py-0.5 rounded ${filters.habitatMode === "or" ? "bg-[#749B64] text-white font-bold" : "text-stone-600"}`}
                title="Pertenece a uno"
              >
                Uno (OR)
              </button>
              <button
                onClick={() => onChange({ ...filters, habitatMode: "and" })}
                className={`px-1.5 py-0.5 rounded ${filters.habitatMode === "and" ? "bg-[#4A6541] text-white font-bold" : "text-stone-600"}`}
                title="Incluido en todos"
              >
                Todos (AND)
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 pl-1">
            {availableOptions.habitats.map((hab) => {
              const active = filters.selectedHabitats.includes(hab);
              return (
                <button
                  key={hab}
                  onClick={() => onChange({ ...filters, selectedHabitats: toggleArrayItem(filters.selectedHabitats, hab) })}
                  className={`px-2 py-1 rounded-lg border text-left truncate transition ${
                    active ? "bg-[#749B64] text-white border-[#5E8450] font-semibold" : "bg-[#F7F1E5] border-[#D5CBB9] hover:bg-[#E2D8C3]"
                  }`}
                >
                  {hab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category: Bioma */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-bold text-[#344B2D] text-sm">
            <span>Bioma</span>
            <div className="flex items-center bg-[#E2D8C3] p-0.5 rounded-md text-[10px]">
              <button
                onClick={() => onChange({ ...filters, biomeMode: "or" })}
                className={`px-1.5 py-0.5 rounded ${filters.biomeMode === "or" ? "bg-[#749B64] text-white font-bold" : "text-stone-600"}`}
              >
                Uno (OR)
              </button>
              <button
                onClick={() => onChange({ ...filters, biomeMode: "and" })}
                className={`px-1.5 py-0.5 rounded ${filters.biomeMode === "and" ? "bg-[#4A6541] text-white font-bold" : "text-stone-600"}`}
              >
                Todos (AND)
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 pl-1">
            {availableOptions.biomes.map((bio) => {
              const active = filters.selectedBiomes.includes(bio);
              return (
                <button
                  key={bio}
                  onClick={() => onChange({ ...filters, selectedBiomes: toggleArrayItem(filters.selectedBiomes, bio) })}
                  className={`px-2.5 py-1 rounded-lg border transition ${
                    active ? "bg-[#749B64] text-white border-[#5E8450] font-semibold" : "bg-[#F7F1E5] border-[#D5CBB9] hover:bg-[#E2D8C3]"
                  }`}
                >
                  {bio}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
};
