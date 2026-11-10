"use client";

import React, { useState } from "react";
import { Blueprint, SpeciesEntry, SpeciesEntryData, UserProfile } from "@/types/database";
import { calculateCompletionMetric } from "@/lib/metric-calculator";
import { X, Award, Sparkles, Check } from "lucide-react";

interface CreateEntryModalProps {
  blueprint: Blueprint;
  databaseId: string;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: SpeciesEntry) => void;
}

export const CreateEntryModal: React.FC<CreateEntryModalProps> = ({
  blueprint,
  databaseId,
  currentUser,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [commonName, setCommonName] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [nominateReference, setNominateReference] = useState("");
  const [speciesClass, setSpeciesClass] = useState("Mammals");
  const [sizeWeight, setSizeWeight] = useState("");
  const [sizeLength, setSizeLength] = useState("");
  const [sizeHeight, setSizeHeight] = useState("");
  const [sizeCategory, setSizeCategory] = useState("Size 3");
  const [diet, setDiet] = useState("Inverticarnivore");
  const [activity, setActivity] = useState("Diurnal");
  const [ethologySummary, setEthologySummary] = useState("");
  const [trophicLevel, setTrophicLevel] = useState<number>(3);
  const [eltonianNiche, setEltonianNiche] = useState("");
  const [isKeystone, setIsKeystone] = useState(false);
  const [habitatsStr, setHabitatsStr] = useState("Woodland, Meadow");
  const [biomesStr, setBiomesStr] = useState("Temperate");
  const [heroImage, setHeroImage] = useState("");
  const [anatomySummary, setAnatomySummary] = useState("");
  const [useSpotlightToken, setUseSpotlightToken] = useState(false);

  if (!isOpen) return null;

  // Build partial entry data for live metric calculation
  const currentData: Partial<SpeciesEntryData> = {
    commonName,
    scientificName,
    sizeWeight,
    sizeLength,
    diet,
    activity,
    ethology: { summaryText: ethologySummary },
    ecology: {
      trophicLevel,
      eltonianNiche,
      immediateFoodWeb: "",
      isKeystone,
      abioticInteractions: "",
      summaryText: eltonianNiche,
    },
    anatomy: { notableStructures: anatomySummary, summaryText: anatomySummary },
    habitats: habitatsStr.split(",").map((s) => s.trim()).filter(Boolean),
    biomes: biomesStr.split(",").map((s) => s.trim()).filter(Boolean),
    media: {
      heroImage: heroImage || "https://images.unsplash.com/photo-1564865878688-9a244444042a?auto=format&fit=crop&w=800&q=80",
      gallery: [],
    },
    distribution: {},
  };

  const metric = calculateCompletionMetric(currentData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commonName.trim() || !scientificName.trim()) return;

    const fullData: SpeciesEntryData = {
      commonName,
      scientificName,
      nominateReference: nominateReference.trim() || undefined,
      class: speciesClass,
      sizeWeight: sizeWeight || "Unrecorded",
      sizeLength: sizeLength || "Unrecorded",
      sizeHeight: sizeHeight || undefined,
      sizeCategory,
      diet,
      activity,
      ethology: {
        summaryText: ethologySummary || "No detailed ethological notes recorded yet.",
      },
      ecology: {
        trophicLevel: Number(trophicLevel),
        eltonianNiche: eltonianNiche || "Generalist",
        immediateFoodWeb: "Recorded food web interactions pending review.",
        isKeystone,
        abioticInteractions: "Abiotic interactions pending review.",
        summaryText: eltonianNiche || "Ecological niche under evaluation.",
      },
      anatomy: {
        notableStructures: anatomySummary,
        summaryText: anatomySummary || "Standard nominate morphology.",
      },
      habitats: habitatsStr.split(",").map((s) => s.trim()).filter(Boolean),
      biomes: biomesStr.split(",").map((s) => s.trim()).filter(Boolean),
      media: {
        heroImage: heroImage || "https://images.unsplash.com/photo-1564865878688-9a244444042a?auto=format&fit=crop&w=800&q=80",
        gallery: [],
      },
      distribution: {},
    };

    const newEntry: SpeciesEntry = {
      id: `entry-${Date.now()}`,
      databaseId,
      blueprintId: blueprint.id,
      commonName,
      scientificName,
      // If submitted by leader, it's directly published; otherwise pending_review
      status: currentUser.role === "leader" ? "published" : "pending_review",
      authorId: currentUser.id,
      isBoosted: useSpotlightToken,
      metricScore: metric.total,
      data: fullData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#F7F1E5] text-[#1F2A1C] w-full max-w-2xl rounded-3xl shadow-2xl border-2 border-[#749B64] p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D5CBB9] pb-4">
          <div>
            <h3 className="text-xl font-bold font-serif text-[#344B2D]">
              Propose Entry ({blueprint.name})
            </h3>
            <p className="text-xs text-stone-600">Standardizing biological knowledge according to blueprint schema</p>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-900 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Completion Metric Bar */}
        <div className="bg-[#EFE8D8] p-4 rounded-2xl border border-[#D5CBB9] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#344B2D]">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              Live Core Completion Metric:
            </span>
            <span className="text-sm font-extrabold text-[#4A6541]">{metric.total}% / 100%</span>
          </div>
          <div className="w-full bg-[#DFD6C2] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#749B64] h-full transition-all duration-300"
              style={{ width: `${metric.total}%` }}
            />
          </div>
          <div className="grid grid-cols-4 gap-1 text-[10px] text-stone-600 text-center pt-1">
            <span>T1 Basics: {metric.tier1.score}%</span>
            <span>T2 Solid: {metric.tier2.score}%</span>
            <span>T3 Context: {metric.tier3.score}%</span>
            <span>T4 Supp: {metric.tier4.score}%</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Tier 1: Basics */}
          <div className="space-y-3 bg-white p-4 rounded-2xl border border-stone-200">
            <h4 className="font-bold text-[#4A6541] text-xs uppercase tracking-wider">Tier 1: Basic Identifiers (25%)</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Common Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eurasian Badger"
                  value={commonName}
                  onChange={(e) => setCommonName(e.target.value)}
                  className="w-full p-2 bg-[#F7F1E5] border border-stone-300 rounded-lg focus:ring-1 focus:ring-[#749B64]"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Scientific Name (Italics) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meles meles"
                  value={scientificName}
                  onChange={(e) => setScientificName(e.target.value)}
                  className="w-full p-2 bg-[#F7F1E5] border border-stone-300 rounded-lg focus:ring-1 focus:ring-[#749B64] italic"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Nominate Species Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Nominate species for Meles"
                  value={nominateReference}
                  onChange={(e) => setNominateReference(e.target.value)}
                  className="w-full p-2 bg-[#F7F1E5] border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Taxon Class</label>
                <select
                  value={speciesClass}
                  onChange={(e) => setSpeciesClass(e.target.value)}
                  className="w-full p-2 bg-[#F7F1E5] border border-stone-300 rounded-lg"
                >
                  <option value="Mammals">Mammals (Mammalia)</option>
                  <option value="Aves">Birds (Aves)</option>
                  <option value="Reptiles">Reptiles</option>
                  <option value="Amphibians">Amphibians</option>
                  <option value="Fishes">Fishes</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Weight Range</label>
                <input
                  type="text"
                  placeholder="e.g. 8-16kg"
                  value={sizeWeight}
                  onChange={(e) => setSizeWeight(e.target.value)}
                  className="w-full p-2 bg-[#F7F1E5] border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Diet Classification</label>
                <input
                  type="text"
                  placeholder="e.g. Omnivore (Earthworms, insects, tubers)"
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  className="w-full p-2 bg-[#F7F1E5] border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Activity Pattern</label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full p-2 bg-[#F7F1E5] border border-stone-300 rounded-lg"
                >
                  <option value="Nocturnal">Nocturnal</option>
                  <option value="Diurnal">Diurnal</option>
                  <option value="Crepuscular">Crepuscular</option>
                  <option value="Cathemeral">Cathemeral</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Size Category</label>
                <input
                  type="text"
                  placeholder="e.g. Size 3"
                  value={sizeCategory}
                  onChange={(e) => setSizeCategory(e.target.value)}
                  className="w-full p-2 bg-[#F7F1E5] border border-stone-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Tier 2: Ethology & Media */}
          <div className="space-y-3 bg-white p-4 rounded-2xl border border-stone-200">
            <h4 className="font-bold text-[#4A6541] text-xs uppercase tracking-wider">Tier 2: Ethology & Media (40%)</h4>
            <div>
              <label className="font-semibold block mb-1">Ethology Summary (Behaviors, Social, Mating)</label>
              <textarea
                rows={3}
                placeholder="Describe territorialism, socialization, seasonal habits, and nesting..."
                value={ethologySummary}
                onChange={(e) => setEthologySummary(e.target.value)}
                className="w-full p-2 bg-[#F7F1E5] border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Hero Image URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                className="w-full p-2 bg-[#F7F1E5] border border-stone-300 rounded-lg"
              />
            </div>
          </div>

          {/* Tier 3: Ecology & Habitat */}
          <div className="space-y-3 bg-white p-4 rounded-2xl border border-stone-200">
            <h4 className="font-bold text-[#4A6541] text-xs uppercase tracking-wider">Tier 3: Ecology & Habitat (25%)</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Eltonian Ecological Niche</label>
                <input
                  type="text"
                  placeholder="e.g. Fossorial Nocturnal Omnivorous Forager"
                  value={eltonianNiche}
                  onChange={(e) => setEltonianNiche(e.target.value)}
                  className="w-full p-2 bg-[#F7F1E5] border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Trophic Level (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={trophicLevel}
                  onChange={(e) => setTrophicLevel(Number(e.target.value))}
                  className="w-full p-2 bg-[#F7F1E5] border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Habitats (comma separated)</label>
                <input
                  type="text"
                  placeholder="Deciduous Forest, Woodland, Hedgerow"
                  value={habitatsStr}
                  onChange={(e) => setHabitatsStr(e.target.value)}
                  className="w-full p-2 bg-[#F7F1E5] border border-stone-300 rounded-lg"
                />
              </div>
              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="keystone"
                  checked={isKeystone}
                  onChange={(e) => setIsKeystone(e.target.checked)}
                  className="w-4 h-4 accent-[#749B64]"
                />
                <label htmlFor="keystone" className="font-semibold cursor-pointer">
                  Is Keystone Species?
                </label>
              </div>
            </div>
          </div>

          {/* Spotlight Token Wildcard Option */}
          {currentUser.spotlightTokens > 0 && currentUser.role === "member" && (
            <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Burn 1 Spotlight Token (Anti-Elitism Priority)
                </span>
                <p className="text-[11px] text-amber-800">
                  Injects your proposal anonymously into the top of the leader review queue. If accepted, you receive an outsized reputation boost!
                </p>
              </div>
              <input
                type="checkbox"
                checked={useSpotlightToken}
                onChange={(e) => setUseSpotlightToken(e.target.checked)}
                className="w-5 h-5 accent-amber-600 cursor-pointer"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D5CBB9]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#749B64] hover:bg-[#5E8450] text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{currentUser.role === "leader" ? "Publish to Database" : "Submit for Peer Validation"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
