import { FilterState, SpeciesEntry } from "@/types/database";

export function filterEntries(entries: SpeciesEntry[], filters: FilterState): SpeciesEntry[] {
  return entries.filter((entry) => {
    const data = entry.data;

    // 1. Search Query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchName =
        entry.commonName.toLowerCase().includes(q) ||
        entry.scientificName.toLowerCase().includes(q) ||
        (data.diet && data.diet.toLowerCase().includes(q)) ||
        (data.ecology && data.ecology.eltonianNiche.toLowerCase().includes(q)) ||
        data.habitats.some((h) => h.toLowerCase().includes(q)) ||
        data.biomes.some((b) => b.toLowerCase().includes(q));

      if (!matchName) return false;
    }

    // 2. Class Filter
    if (filters.selectedClasses.length > 0) {
      if (!filters.selectedClasses.includes(data.class)) {
        return false;
      }
    }

    // 3. Diet Filter (OR vs AND)
    if (filters.selectedDiets.length > 0) {
      if (filters.dietMode === "or") {
        const matchesAny = filters.selectedDiets.some((d) => data.diet.toLowerCase().includes(d.toLowerCase()));
        if (!matchesAny) return false;
      } else {
        const matchesAll = filters.selectedDiets.every((d) => data.diet.toLowerCase().includes(d.toLowerCase()));
        if (!matchesAll) return false;
      }
    }

    // 4. Activity Filter
    if (filters.selectedActivities.length > 0) {
      if (!filters.selectedActivities.includes(data.activity)) {
        return false;
      }
    }

    // 5. Habitat Filter (OR vs AND)
    if (filters.selectedHabitats.length > 0) {
      if (filters.habitatMode === "or") {
        const matchesAny = filters.selectedHabitats.some((h) =>
          data.habitats.some((eh) => eh.toLowerCase().includes(h.toLowerCase()))
        );
        if (!matchesAny) return false;
      } else {
        const matchesAll = filters.selectedHabitats.every((h) =>
          data.habitats.some((eh) => eh.toLowerCase().includes(h.toLowerCase()))
        );
        if (!matchesAll) return false;
      }
    }

    // 6. Biome Filter (OR vs AND)
    if (filters.selectedBiomes.length > 0) {
      if (filters.biomeMode === "or") {
        const matchesAny = filters.selectedBiomes.some((b) =>
          data.biomes.some((eb) => eb.toLowerCase().includes(b.toLowerCase()))
        );
        if (!matchesAny) return false;
      } else {
        const matchesAll = filters.selectedBiomes.every((b) =>
          data.biomes.some((eb) => eb.toLowerCase().includes(b.toLowerCase()))
        );
        if (!matchesAll) return false;
      }
    }

    return true;
  });
}
