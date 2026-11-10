"use client";

import React, { useState } from "react";
import { Blueprint, BlueprintField, BlueprintFieldType, BlueprintSection } from "@/types/database";
import { Plus, Trash2, Layers, Award, Check, X, ArrowLeft } from "lucide-react";

interface BlueprintStudioProps {
  communityId: string;
  domain: string;
  onSave: (blueprint: Blueprint) => void;
  onCancel: () => void;
}

export const BlueprintStudio: React.FC<BlueprintStudioProps> = ({
  communityId,
  domain,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [sections, setSections] = useState<BlueprintSection[]>([
    {
      id: "sec-1",
      title: "Tier 1: Basic Components",
      tier: 1,
      tierWeightPercent: 25,
      fields: [
        { id: "f-1", label: "Common Name", type: "text", required: true, weightPercent: 5 },
        { id: "f-2", label: "Scientific Name", type: "text", required: true, weightPercent: 5 },
      ],
    },
  ]);

  // Compute total weights
  const totalSectionWeight = sections.reduce((sum, s) => sum + s.tierWeightPercent, 0);

  const addSection = () => {
    const newTier = ((sections.length % 4) + 1) as 1 | 2 | 3 | 4;
    const newSec: BlueprintSection = {
      id: `sec-${Date.now()}`,
      title: `Tier ${newTier}: New Section`,
      tier: newTier,
      tierWeightPercent: 25,
      fields: [
        { id: `f-${Date.now()}`, label: "Field Name", type: "text", required: true, weightPercent: 5 },
      ],
    };
    setSections([...sections, newSec]);
  };

  const removeSection = (secId: string) => {
    setSections(sections.filter((s) => s.id !== secId));
  };

  const updateSection = (secId: string, updates: Partial<BlueprintSection>) => {
    setSections(sections.map((s) => (s.id === secId ? { ...s, ...updates } : s)));
  };

  const addField = (secId: string) => {
    const newField: BlueprintField = {
      id: `f-${Date.now()}`,
      label: "New Field",
      type: "text",
      required: false,
      weightPercent: 5,
    };
    setSections(
      sections.map((s) => (s.id === secId ? { ...s, fields: [...s.fields, newField] } : s))
    );
  };

  const removeField = (secId: string, fieldId: string) => {
    setSections(
      sections.map((s) => (s.id === secId ? { ...s, fields: s.fields.filter((f) => f.id !== fieldId) } : s))
    );
  };

  const updateField = (secId: string, fieldId: string, updates: Partial<BlueprintField>) => {
    setSections(
      sections.map((s) =>
        s.id === secId
          ? {
              ...s,
              fields: s.fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f)),
            }
          : s
      )
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please enter a Blueprint Name.");
      return;
    }

    const blueprint: Blueprint = {
      id: `bp-${Date.now()}`,
      communityId,
      name,
      version,
      domain,
      sections,
      createdAt: new Date().toISOString(),
    };

    onSave(blueprint);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D5CBB9] pb-4">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-stone-700 hover:text-[#344B2D] font-medium text-sm transition bg-[#EBE3D0] hover:bg-[#DFD6C2] px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Studio</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="bg-[#E2D8C3] px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#344B2D] flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#749B64]" />
            <span>Total Sections Weight: {totalSectionWeight}%</span>
            {totalSectionWeight !== 100 && (
              <span className="text-amber-700 font-semibold">(Ideal: 100%)</span>
            )}
          </div>

          <button
            onClick={handleSave}
            className="bg-[#749B64] hover:bg-[#5E8450] text-white px-6 py-2 rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Publish Blueprint</span>
          </button>
        </div>
      </div>

      {/* Blueprint Basic Identifiers */}
      <div className="bg-white p-6 rounded-3xl border border-[#D5CBB9] shadow-sm space-y-4">
        <h2 className="text-2xl font-bold font-serif text-[#344B2D] flex items-center gap-2">
          <Layers className="w-6 h-6 text-[#749B64]" />
          <span>Blueprint Creator Studio</span>
        </h2>
        <p className="text-xs text-stone-600">
          Define the required sections, field types, and scoring criteria that entries in this school of thought must follow.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 pt-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-stone-700 mb-1">Blueprint Name *</label>
            <input
              type="text"
              placeholder="e.g. Animal Species Blueprint"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm p-2.5 bg-[#F7F1E5] border border-[#D5CBB9] rounded-xl font-medium focus:ring-2 focus:ring-[#749B64]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Version</label>
            <input
              type="text"
              placeholder="1.0.0"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full text-sm p-2.5 bg-[#F7F1E5] border border-[#D5CBB9] rounded-xl font-mono"
            />
          </div>
        </div>
      </div>

      {/* Sections & Fields Builder */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-serif text-[#344B2D]">
            Blueprint Sections ({sections.length})
          </h3>
          <button
            onClick={addSection}
            className="bg-[#4A6541] hover:bg-[#344B2D] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Section</span>
          </button>
        </div>

        {sections.map((section, secIdx) => (
          <div
            key={section.id}
            className="bg-[#EFE8D8] border-2 border-[#D5CBB9] rounded-3xl p-6 shadow-sm space-y-4"
          >
            {/* Section Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D5CBB9] pb-3">
              <div className="flex items-center gap-3 flex-1">
                <span className="w-7 h-7 rounded-full bg-[#749B64] text-white flex items-center justify-center font-bold text-xs">
                  {secIdx + 1}
                </span>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                  className="font-bold text-base text-[#344B2D] bg-transparent border-b border-transparent hover:border-stone-400 focus:border-[#749B64] focus:outline-none flex-1"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-stone-700">
                  <label className="font-semibold">Tier:</label>
                  <select
                    value={section.tier}
                    onChange={(e) => updateSection(section.id, { tier: Number(e.target.value) as 1 | 2 | 3 | 4 })}
                    className="bg-[#F7F1E5] border border-[#D5CBB9] rounded-lg p-1 text-xs font-bold"
                  >
                    <option value={1}>Tier 1</option>
                    <option value={2}>Tier 2</option>
                    <option value={3}>Tier 3</option>
                    <option value={4}>Tier 4</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-stone-700">
                  <label className="font-semibold">Section Weight:</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={section.tierWeightPercent}
                    onChange={(e) => updateSection(section.id, { tierWeightPercent: Number(e.target.value) })}
                    className="w-16 bg-[#F7F1E5] border border-[#D5CBB9] rounded-lg p-1 text-xs font-bold text-center"
                  />
                  <span>%</span>
                </div>

                <button
                  onClick={() => removeSection(section.id)}
                  className="text-stone-400 hover:text-red-700 transition p-1"
                  title="Delete Section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Fields List */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block">
                Fields in this Section ({section.fields.length}):
              </span>

              <div className="grid gap-2">
                {section.fields.map((field) => (
                  <div
                    key={field.id}
                    className="bg-[#F7F1E5] border border-[#D5CBB9] rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs"
                  >
                    {/* Label */}
                    <div className="flex-1 min-w-[180px]">
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(section.id, field.id, { label: e.target.value })}
                        className="w-full text-xs font-semibold text-[#1F2A1C] bg-transparent border-b border-stone-300 focus:border-[#749B64] focus:outline-none p-1"
                        placeholder="Field Label (e.g. Diet, Activity, Vocalization)"
                      />
                    </div>

                    {/* Field Type */}
                    <div className="flex items-center gap-2">
                      <select
                        value={field.type}
                        onChange={(e) => updateField(section.id, field.id, { type: e.target.value as BlueprintFieldType })}
                        className="bg-white border border-[#D5CBB9] rounded-lg px-2 py-1 text-xs font-medium"
                      >
                        <option value="text">Text (Single-line)</option>
                        <option value="textarea">Textarea (Multi-line paragraph)</option>
                        <option value="number">Number</option>
                        <option value="multiselect">Multiselect (Tags / Preferences)</option>
                        <option value="audio">Audio (Vocalizations / Clips)</option>
                        <option value="image">Image (Illustration / Photo)</option>
                        <option value="video">Video (YouTube / Embed)</option>
                        <option value="map">Map (Distribution Cartography)</option>
                      </select>
                    </div>

                    {/* Field Weight */}
                    <div className="flex items-center gap-1 text-xs text-stone-600">
                      <span>Weight:</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={field.weightPercent}
                        onChange={(e) => updateField(section.id, field.id, { weightPercent: Number(e.target.value) })}
                        className="w-14 bg-white border border-[#D5CBB9] rounded-lg p-1 text-xs font-bold text-center"
                      />
                      <span>%</span>
                    </div>

                    {/* Required Checkbox */}
                    <label className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(section.id, field.id, { required: e.target.checked })}
                        className="w-3.5 h-3.5 accent-[#749B64]"
                      />
                      <span>Req</span>
                    </label>

                    {/* Delete Field */}
                    <button
                      onClick={() => removeField(section.id, field.id)}
                      className="text-stone-400 hover:text-red-700 transition p-1"
                      title="Remove field"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addField(section.id)}
                className="text-xs font-bold text-[#4A6541] hover:text-[#344B2D] flex items-center gap-1 pt-2 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Field to this Section</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
