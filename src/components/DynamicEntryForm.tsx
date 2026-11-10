"use client";

import React, { useState } from "react";
import { Blueprint, DynamicEntry, UserProfile } from "@/types/database";
import { Award, Check, X, Sparkles } from "lucide-react";

interface DynamicEntryFormProps {
  blueprint: Blueprint;
  databaseId: string;
  communityId: string;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: DynamicEntry) => void;
}

export const DynamicEntryForm: React.FC<DynamicEntryFormProps> = ({
  blueprint,
  databaseId,
  communityId,
  currentUser,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [useSpotlightToken, setUseSpotlightToken] = useState(false);

  if (!isOpen) return null;

  // Compute live metric score
  let currentScore = 0;
  blueprint.sections.forEach((sec) => {
    sec.fields.forEach((field) => {
      const val = formData[field.id];
      if (val !== undefined && val !== null && String(val).trim() !== "") {
        currentScore += field.weightPercent || 5;
      }
    });
  });
  const metricScore = Math.min(100, currentScore);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData({ ...formData, [fieldId]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEntry: DynamicEntry = {
      id: `entry-${Date.now()}`,
      databaseId,
      communityId,
      blueprintId: blueprint.id,
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      status: currentUser.role === "founder" || currentUser.role === "leader" ? "published" : "pending_review",
      authorId: currentUser.id,
      isBoosted: useSpotlightToken,
      metricScore,
      data: formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#F7F1E5] text-[#1F2A1C] w-full max-w-3xl rounded-3xl shadow-2xl border-2 border-[#749B64] p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D5CBB9] pb-4">
          <div>
            <h3 className="text-xl font-bold font-serif text-[#344B2D]">
              New Standardized Entry ({blueprint.name})
            </h3>
            <p className="text-xs text-stone-600">Schema enforced by active blueprint v{blueprint.version}</p>
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
            <span className="text-sm font-extrabold text-[#4A6541]">{metricScore}% / 100%</span>
          </div>
          <div className="w-full bg-[#DFD6C2] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#749B64] h-full transition-all duration-300"
              style={{ width: `${metricScore}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Main Title & Subtitle */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 grid sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold block mb-1">Entry Title (e.g. Common Name / Thesis) *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entry Title..."
                className="w-full p-2.5 bg-[#F7F1E5] border border-stone-300 rounded-xl font-medium focus:ring-1 focus:ring-[#749B64]"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Subtitle / Scientific Name</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Subtitle or Scientific Classification..."
                className="w-full p-2.5 bg-[#F7F1E5] border border-stone-300 rounded-xl italic focus:ring-1 focus:ring-[#749B64]"
              />
            </div>
          </div>

          {/* Dynamic Blueprint Sections */}
          {blueprint.sections.map((section) => (
            <div key={section.id} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <h4 className="font-bold text-[#4A6541] text-xs uppercase tracking-wider">
                  {section.title} ({section.tierWeightPercent}%)
                </h4>
                <span className="text-[10px] font-bold bg-[#EFE8D8] text-stone-700 px-2 py-0.5 rounded-full">
                  Tier {section.tier}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {section.fields.map((field) => (
                  <div key={field.id} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                    <label className="font-semibold block mb-1 text-stone-800">
                      {field.label} {field.required && <span className="text-red-600">*</span>}
                      <span className="text-[10px] text-stone-500 font-normal ml-1">({field.weightPercent}%)</span>
                    </label>

                    {field.type === "textarea" ? (
                      <textarea
                        rows={3}
                        required={field.required}
                        value={formData[field.id] || ""}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={`Enter ${field.label}...`}
                        className="w-full p-2.5 bg-[#F7F1E5] border border-stone-300 rounded-xl"
                      />
                    ) : field.type === "number" ? (
                      <input
                        type="number"
                        required={field.required}
                        value={formData[field.id] || ""}
                        onChange={(e) => handleFieldChange(field.id, Number(e.target.value))}
                        className="w-full p-2.5 bg-[#F7F1E5] border border-stone-300 rounded-xl"
                      />
                    ) : field.type === "image" || field.type === "audio" || field.type === "video" || field.type === "map" ? (
                      <input
                        type="url"
                        required={field.required}
                        value={formData[field.id] || ""}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder="https://... (URL or asset path)"
                        className="w-full p-2.5 bg-[#F7F1E5] border border-stone-300 rounded-xl font-mono text-[11px]"
                      />
                    ) : (
                      <input
                        type="text"
                        required={field.required}
                        value={formData[field.id] || ""}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={`Enter ${field.label}...`}
                        className="w-full p-2.5 bg-[#F7F1E5] border border-stone-300 rounded-xl"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Spotlight Token Option */}
          {currentUser.spotlightTokens > 0 && currentUser.role !== "founder" && (
            <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Burn 1 Spotlight Token
                </span>
                <p className="text-[11px] text-amber-800">
                  Injects this proposal with top priority review without revealing your identity.
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

          {/* Form Actions */}
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
              <span>Publish Entry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
