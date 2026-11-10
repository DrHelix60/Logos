"use client";

import React, { useState } from "react";
import { Blueprint, DatabaseModel } from "@/types/database";
import { X, Check, Database } from "lucide-react";

interface CreateDatabaseModalProps {
  communityId: string;
  blueprints: Blueprint[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (database: DatabaseModel) => void;
}

export const CreateDatabaseModal: React.FC<CreateDatabaseModalProps> = ({
  communityId,
  blueprints,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [scopeDescription, setScopeDescription] = useState("");
  const [selectedBlueprintId, setSelectedBlueprintId] = useState(
    blueprints[0]?.id || ""
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newDb: DatabaseModel = {
      id: `db-${Date.now()}`,
      communityId,
      name: name.trim(),
      scopeDescription: scopeDescription.trim() || "Canonical database scope.",
      blueprintId: selectedBlueprintId || (blueprints[0]?.id ?? ""),
      createdAt: new Date().toISOString(),
    };

    onSubmit(newDb);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#F7F1E5] text-[#1F2A1C] w-full max-w-md rounded-3xl shadow-2xl border-2 border-[#749B64] p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#D5CBB9] pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#4A6541]" />
            <h3 className="text-xl font-bold font-serif text-[#344B2D]">
              Create Database
            </h3>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-900 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold block mb-1 text-stone-700">Database Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. European Mammals"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm p-3 bg-white border border-[#D5CBB9] rounded-xl focus:ring-2 focus:ring-[#749B64]"
            />
          </div>

          <div>
            <label className="font-bold block mb-1 text-stone-700">Scope Description</label>
            <textarea
              rows={2}
              placeholder="e.g. Living Organisms > Animals > European Mammals"
              value={scopeDescription}
              onChange={(e) => setScopeDescription(e.target.value)}
              className="w-full text-sm p-3 bg-white border border-[#D5CBB9] rounded-xl focus:ring-2 focus:ring-[#749B64]"
            />
          </div>

          <div>
            <label className="font-bold block mb-1 text-stone-700">Associated Blueprint *</label>
            {blueprints.length > 0 ? (
              <select
                value={selectedBlueprintId}
                onChange={(e) => setSelectedBlueprintId(e.target.value)}
                className="w-full text-sm p-3 bg-white border border-[#D5CBB9] rounded-xl focus:ring-2 focus:ring-[#749B64]"
              >
                {blueprints.map((bp) => (
                  <option key={bp.id} value={bp.id}>
                    {bp.name} (v{bp.version})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-red-700 font-semibold p-2 bg-red-50 rounded-lg">
                No blueprints found in this community. Please design a blueprint first!
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#D5CBB9]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={blueprints.length === 0}
              className="bg-[#749B64] hover:bg-[#5E8450] text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Create Database</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
