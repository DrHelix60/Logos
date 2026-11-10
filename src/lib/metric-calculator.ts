import { SpeciesEntryData } from "@/types/database";

export interface MetricBreakdown {
  total: number;
  tier1: { score: number; max: number };
  tier2: { score: number; max: number };
  tier3: { score: number; max: number };
  tier4: { score: number; max: number };
}

export function calculateCompletionMetric(data: Partial<SpeciesEntryData>): MetricBreakdown {
  // Tier 1: Basics (25% total - 5% each)
  let t1 = 0;
  if (data.commonName?.trim()) t1 += 5;
  if (data.scientificName?.trim()) t1 += 5;
  if (data.sizeWeight?.trim() || data.sizeLength?.trim()) t1 += 5;
  if (data.diet?.trim()) t1 += 5;
  if (data.activity?.trim()) t1 += 5;

  // Tier 2: The Solidifiers (40% total)
  let t2 = 0;
  // Ethology: 20%
  if (data.ethology?.summaryText?.trim() && data.ethology.summaryText.length > 30) {
    t2 += 20;
  } else if (data.ethology?.summaryText?.trim()) {
    t2 += 10;
  }
  // Media: Core visuals (10%) + Taxon-critical media (10%)
  if (data.media?.heroImage?.trim()) t2 += 10;
  if (data.media?.vocalizationAudio?.url || data.media?.videoEmbedUrl || (data.media?.gallery && data.media.gallery.length > 0)) {
    t2 += 10;
  }

  // Tier 3: Context (25% total)
  let t3 = 0;
  // Ecology (15%)
  if (data.ecology?.eltonianNiche?.trim()) t3 += 10;
  if (data.ecology?.trophicLevel) t3 += 5;
  // Habitat & Biomes (10%)
  if (data.habitats && data.habitats.length > 0) t3 += 5;
  if (data.biomes && data.biomes.length > 0) t3 += 5;

  // Tier 4: Supplementary (10% total)
  let t4 = 0;
  // Anatomy (5%)
  if (data.anatomy?.summaryText?.trim() || data.anatomy?.notableStructures?.trim()) t4 += 5;
  // Distribution (5%)
  if (data.distribution?.recognisedMapUrl || data.distribution?.expectedMapUrl) t4 += 5;

  const total = Math.min(100, t1 + t2 + t3 + t4);

  return {
    total,
    tier1: { score: t1, max: 25 },
    tier2: { score: t2, max: 40 },
    tier3: { score: t3, max: 25 },
    tier4: { score: t4, max: 10 },
  };
}
