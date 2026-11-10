import React from "react";
import { BookOpen, CheckCircle2, Filter, Layers, Award, ArrowRight } from "lucide-react";

interface UserGuideProps {
  onGoToDatabase: () => void;
}

export const UserGuide: React.FC<UserGuideProps> = ({ onGoToDatabase }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">
      {/* Intro Header Card matching Figma Frame 68:46 */}
      <section className="text-center space-y-6">
        <div className="inline-block bg-[#6F9560] text-white px-10 py-3 rounded-2xl shadow-figma text-2xl font-bold tracking-wide border-2 border-[#5A7C4F]">
          User Guide
        </div>

        <p className="text-stone-800 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
          In this section of the platform you can find all the animal species recognized by this project. 
          You can filter them by different criteria from the sidebar. In case you don’t understand a term, 
          the concepts below explain the empirical criteria and standardized blueprints applied here.
        </p>

        <div className="bg-[#EBE3D0] border-l-4 border-[#749B64] p-5 rounded-r-xl text-left max-w-2xl mx-auto shadow-sm">
          <h4 className="font-bold text-[#344B2D] text-sm uppercase tracking-wide mb-1">
            What &quot;Recognized&quot; Means in this Canon:
          </h4>
          <p className="text-stone-700 text-sm leading-relaxed">
            <strong>Recognized</strong> means it has both been considered and accepted under empirical standards. 
            The lack of a species may mean it was considered and then unified into another species (demoted to a subspecies 
            category as part of an absorbed lineage), or that it has not yet been reviewed by community leaders.
          </p>
        </div>
      </section>

      {/* Filters section matching Figma Frame 75:12 */}
      <section className="text-center space-y-6">
        <div className="inline-block bg-[#6F9560] text-white px-10 py-3 rounded-2xl shadow-figma text-2xl font-bold tracking-wide border-2 border-[#5A7C4F]">
          Filtering Logic
        </div>

        <p className="text-stone-800 text-base leading-relaxed max-w-2xl mx-auto">
          You will be able to filter animals by their <strong>Class, Size, Diet, Activity Pattern, Habitat, and Biome</strong>. 
          For categories that apply, you have the option to specify whether all filters must apply at the same time or at least one:
        </p>

        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
          <div className="bg-[#F7F1E5] border border-[#D5CBB9] p-4 rounded-xl shadow-sm">
            <span className="inline-block bg-[#749B64] text-white text-xs font-bold px-2.5 py-1 rounded-md mb-2">
              Pertenece a uno (OR)
            </span>
            <p className="text-xs text-stone-700">
              Matches any animal that possesses <em>at least one</em> of the selected values within this category.
            </p>
          </div>

          <div className="bg-[#F7F1E5] border border-[#D5CBB9] p-4 rounded-xl shadow-sm">
            <span className="inline-block bg-[#4A6541] text-white text-xs font-bold px-2.5 py-1 rounded-md mb-2">
              Incluido en todos (AND)
            </span>
            <p className="text-xs text-stone-700">
              Strict matching: The species <em>must satisfy all</em> selected criteria simultaneously (e.g. inhabit both Woodland and Meadow).
            </p>
          </div>
        </div>
      </section>

      {/* Defining a Species & Bottom-Up Taxonomy */}
      <section className="space-y-6 bg-[#EFE8D8] p-8 rounded-3xl border border-[#D5CBB9] shadow-sm">
        <div className="flex items-center gap-3 border-b border-[#D5CBB9] pb-4">
          <BookOpen className="w-6 h-6 text-[#4A6541]" />
          <h3 className="text-2xl font-bold font-serif text-[#344B2D]">Core Scientific Definitions</h3>
        </div>

        <div className="space-y-4 text-sm text-stone-800 leading-relaxed">
          <h4 className="text-base font-bold text-[#4A6541]">1. The Species Criterion (Reproduction + Ecological Niche)</h4>
          <p className="italic bg-[#F7F1E5] p-4 rounded-xl border border-[#DFD6C2] text-stone-900 font-serif">
            &quot;The largest group of organisms that share the same niche in which any two or more individuals 
            of the appropriate sexes or mating types can produce fertile offspring when capable of sexual reproduction.&quot;
          </p>
          <p>
            Reproductive isolation alone does not justify declaring distinct species unless breeding barriers or post-zygotic 
            infertility are proven. When populations are merely geographically isolated but remain fertile and hold homologous 
            ecological roles, they are classified as <strong>subspecies</strong>.
          </p>

          <h4 className="text-base font-bold text-[#4A6541] pt-4">2. Bottom-Up Taxonomy</h4>
          <p>
            Traditional taxonomy imposes arbitrary top-down ranks that break down under evolutionary divergence. 
            Logos organizes clades from the bottom up:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
            <li><strong>Species:</strong> Cohesive group sharing the same ecological niche and fertile reproduction.</li>
            <li><strong>Family:</strong> Group of morphologically similar species sharing a single common ancestor.</li>
            <li><strong>Order:</strong> Group of families sharing unique traits with a single common ancestor.</li>
            <li><strong>Class:</strong> An immutable functional tag grouping clades that share unique key characteristics (e.g. Mammalia, Aves).</li>
          </ul>
        </div>
      </section>

      {/* Core Completion Metric (100%) */}
      <section className="space-y-6 bg-white p-8 rounded-3xl border border-[#D5CBB9] shadow-sm">
        <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
          <Award className="w-6 h-6 text-amber-600" />
          <h3 className="text-2xl font-bold font-serif text-[#344B2D]">The Core Completion Metric (100% Total)</h3>
        </div>

        <p className="text-sm text-stone-700">
          Every proposed entry is automatically scored against the 4-Tier Blueprint evaluation metric:
        </p>

        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#F7F9F6] border border-[#D5E2D0]">
            <span className="font-bold text-[#4A6541] text-sm block mb-1">Tier 1: Basics (25%)</span>
            <p className="text-stone-600">5% each for Common Name, Scientific Name, Size, Diet (standardized term), and Activity Pattern.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F9F6] border border-[#D5E2D0]">
            <span className="font-bold text-[#4A6541] text-sm block mb-1">Tier 2: The Solidifiers (40%)</span>
            <p className="text-stone-600">20% Ethology (at least 4 sub-topics) + 20% Media (Core visuals + Taxon-critical media like vocalizations or displays).</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F9F6] border border-[#D5E2D0]">
            <span className="font-bold text-[#4A6541] text-sm block mb-1">Tier 3: The Context (25%)</span>
            <p className="text-stone-600">15% Ecology (Trophic level, Eltonian niche) + 10% Habitat & Biome preferences.</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F9F6] border border-[#D5E2D0]">
            <span className="font-bold text-[#4A6541] text-sm block mb-1">Tier 4: Supplementary (10%)</span>
            <p className="text-stone-600">5% Anatomy & Physiology (structures, metabolism) + 5% Distribution maps.</p>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={onGoToDatabase}
            className="inline-flex items-center gap-2 bg-[#749B64] hover:bg-[#5E8450] text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md transition"
          >
            <span>Explore the Species Database</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
