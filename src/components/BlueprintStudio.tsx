"use client";

import React, { useState } from "react";
import { Blueprint, BlueprintField, BlueprintFieldType, BlueprintSection } from "@/types/database";
import { Plus, Trash2, Layers, Award, Check, X, ArrowLeft } from "lucide-react";

interface BlueprintStudioProps {
  communityId?: string;
  defaultDomain?: string;
  onSave: (blueprint: Blueprint) => void;
  onCancel: () => void;
}

export const BlueprintStudio: React.FC<BlueprintStudioProps> = ({
  communityId,
  defaultDomain = "",
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [domain, setDomain] = useState(defaultDomain);
  const [sections, setSections] = useState<BlueprintSection[]>([
    {
      id: "sec-1",
      title: "Tier 1: Core Identifiers",
      tier: 1,
      tierWeightPercent: 25,
      fields: [
        { id: "f-1", label: "Primary Title / Designation", type: "text", required: true, weightPercent: 10 },
        { id: "f-2", label: "Canonical Classification", type: "text", required: true, weightPercent: 10 },
      ],
    },
  ]);

  // Compute total weights
  const totalSectionWeight = sections.reduce((sum, s) => sum + s.tierWeightPercent, 0);

  const addSection = () => {
    const newTier = ((sections.length % 4) + 1) as 1 | 2 | 3 | 4;
    const newSec: BlueprintSection = {
      id: `sec-${Date.now()}`,
      title: `Tier ${newTier}: Structural Component`,
      tier: newTier,
      tierWeightPercent: 25,
      fields: [
        { id: `f-${Date.now()}`, label: "Attribute Name", type: "text", required: false, weightPercent: 5 },
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
      label: "New Attribute",
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
      communityId: communityId || undefined,
      name: name.trim(),
      version: version.trim() || "1.0.0",
      domain: domain.trim() || "Universal Standard",
      sections,
      creatorId: "usr-founder-rafael",
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
          className="inline-flex items-center gap-2 text-stone-700 hover:text-[#344B2D] font-medium text-xs transition bg-[#EBE3D0] hover:bg-[#DFD6C2] px-4 py-2 rounded-xl"
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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold font-serif text-[#344B2D] flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#749B64]" />
            <span>Blueprint Specification Studio</span>
          </h2>
          <span className="text-xs bg-[#EFE8D8] text-stone-700 px-3 py-1 rounded-full font-semibold">
            {communityId ? "Community Blueprint" : "Independent / Universal Blueprint"}
          </span>
        </div>
        <p className="text-xs text-stone-600">
          Formulate the hierarchical schema, field typologies, and quantitative 0–100% metric rubric for standardization.
        </p>

        <div className="grid sm:grid-cols-4 gap-4 pt-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-stone-700 mb-1">Blueprint Schema Name *</label>
            <input
              type="text"
              placeholder="e.g. Standard Physical Constants, Chemical Species Spec"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs p-2.5 bg-[#F7F1E5] border border-[#D5CBB9] rounded-xl font-medium focus:ring-2 focus:ring-[#749B64]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Discipline / Domain</label>
            <input
              type="text"
              placeholder="e.g. Physics, Epistemology, Biology"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full text-xs p-2.5 bg-[#F7F1E5] border border-[#D5CBB9] rounded-xl font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Version Spec</label>
            <input
              type="text"
              placeholder="1.0.0"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full text-xs p-2.5 bg-[#F7F1E5] border border-[#D5CBB9] rounded-xl font-mono"
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
                  title="Remove Section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Fields List */}
            <div className="space-y-3">
              {section.fields.map((field) => (
                <div
                  key={field.id}
                  className="bg-white p-4 rounded-2xl border border-[#D5CBB9] flex flex-wrap items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        placeholder="Field / Property Label"
                        value={field.label}
                        onChange={(e) => updateField(section.id, field.id, { label: e.target.value })}
                        className="w-full font-bold text-sm text-[#1F2A1C] bg-transparent border-b border-stone-200 focus:border-[#749B64] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Type selection */}
                    <div className="flex items-center gap-1">
                      <label className="text-stone-500 font-semibold">Type:</label>
                      <select
                        value={field.type}
                        onChange={(e) => updateField(section.id, field.id, { type: e.target.value as BlueprintFieldType })}
                        className="bg-[#F7F1E5] border border-[#D5CBB9] rounded-lg p-1.5 text-xs font-medium"
                      >
                        <option value="text">Text (Single Line)</option>
                        <option value="number">Number</option>
                        <option value="textarea">Text Area (Multi-line)</option>
                        <option value="multiselect">Multi-select / Tags</option>
                        <option value="image">Image Attachment / URL</option>
                        <option value="audio">Audio Clip</option>
                        <option value="video">Video Embed</option>
                        <option value="map">Map / Coordinate Visual</option>
                      </select>
                    </div>

                    {/* Unit if number */}
                    {field.type === "number" && (
                      <div className="flex items-center gap-1">
                        <label className="text-stone-500 font-semibold">Unit:</label>
                        <input
                          type="text"
                          placeholder="e.g. kg, nm, J"
                          value={field.unit || ""}
                          onChange={(e) => updateField(section.id, field.id, { unit: e.target.value })}
                          className="w-20 bg-[#F7F1E5] border border-[#D5CBB9] rounded-lg p-1.5 text-xs"
                        />
                      </div>
                    )}

                    {/* Options if multiselect */}
                    {field.type === "multiselect" && (
                      <div className="flex items-center gap-1">
                        <label className="text-stone-500 font-semibold">Options (comma-separated):</label>
                        <input
                          type="text"
                          placeholder="e.g. Alpha, Beta, Gamma"
                          value={field.options?.join(", ") || ""}
                          onChange={(e) =>
                            updateField(section.id, field.id, {
                              options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                            })
                          }
                          className="w-48 bg-[#F7F1E5] border border-[#D5CBB9] rounded-lg p-1.5 text-xs"
                        />
                      </div>
                    )}

                    {/* Metric weight */}
                    <div className="flex items-center gap-1">
                      <label className="text-stone-500 font-semibold">Score Weight:</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={field.weightPercent}
                        onChange={(e) => updateField(section.id, field.id, { weightPercent: Number(e.target.value) })}
                        className="w-14 bg-[#F7F1E5] border border-[#D5CBB9] rounded-lg p-1.5 text-xs font-bold text-center"
                      />
                      <span className="text-stone-500 font-semibold">%</span>
                    </div>

                    {/* Required Checkbox */}
                    <label className="flex items-center gap-1.5 cursor-pointer text-stone-700 font-semibold">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(section.id, field.id, { required: e.target.checked })}
                        className="rounded text-[#749B64] focus:ring-[#749B64]"
                      />
                      <span>Mandatory</span>
                    </label>

                    {/* Remove Field */}
                    <button
                      onClick={() => removeField(section.id, field.id)}
                      className="text-stone-400 hover:text-red-700 transition p-1"
                      title="Remove Field"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => addField(section.id)}
                className="w-full py-2.5 border-2 border-dashed border-[#D5CBB9] hover:border-[#749B64] rounded-2xl text-stone-600 hover:text-[#344B2D] font-bold text-xs flex items-center justify-center gap-1.5 transition bg-white/50"
              >
                <Plus className="w-4 h-4" />
                <span>Add Property Field to {section.title}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
