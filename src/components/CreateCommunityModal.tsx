"use client";

import React, { useState } from "react";
import { Community, UserProfile } from "@/types/database";
import { X, Check, Landmark, Sparkles } from "lucide-react";

interface CreateCommunityModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (community: Community) => void;
}

export const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [discipline, setDiscipline] = useState("Biology");
  const [scopePrinciples, setScopePrinciples] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCommunity: Community = {
      id: `comm-${Date.now()}`,
      name: name.trim(),
      discipline,
      scopePrinciples: scopePrinciples.trim() || "Empirical standardization of domain knowledge through validated blueprints.",
      creatorId: currentUser.id,
      createdAt: new Date().toISOString(),
    };

    onSubmit(newCommunity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#F7F1E5] text-[#1F2A1C] w-full max-w-lg rounded-3xl shadow-2xl border-2 border-[#749B64] p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#D5CBB9] pb-3">
          <div className="flex items-center gap-2">
            <Landmark className="w-6 h-6 text-[#4A6541]" />
            <h3 className="text-xl font-bold font-serif text-[#344B2D]">
              Establish School of Thought
            </h3>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-900 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold block mb-1 text-stone-700">Community Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Empirical Biology Guild"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm p-3 bg-white border border-[#D5CBB9] rounded-xl focus:ring-2 focus:ring-[#749B64]"
            />
          </div>

          <div>
            <label className="font-bold block mb-1 text-stone-700">Discipline / Field of Knowledge *</label>
            <select
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              className="w-full text-sm p-3 bg-white border border-[#D5CBB9] rounded-xl focus:ring-2 focus:ring-[#749B64]"
            >
              <option value="Biology">Biology (Life Sciences)</option>
              <option value="Philosophy">Philosophy (Ethics, Logic, Epistemology)</option>
              <option value="Physics">Physics & Astronomy</option>
              <option value="Chemistry">Chemistry & Materials</option>
              <option value="Economics">Economics & Social Sciences</option>
              <option value="Engineering">Engineering & Computer Science</option>
              <option value="Arts & Humanities">Arts & Humanities</option>
            </select>
          </div>

          <div>
            <label className="font-bold block mb-1 text-stone-700">Core Scope & Principles</label>
            <textarea
              rows={4}
              placeholder="Describe this school's foundational criteria, verification standards, and scope..."
              value={scopePrinciples}
              onChange={(e) => setScopePrinciples(e.target.value)}
              className="w-full text-sm p-3 bg-white border border-[#D5CBB9] rounded-xl focus:ring-2 focus:ring-[#749B64]"
            />
          </div>

          <div className="bg-[#EFE8D8] p-3 rounded-xl border border-[#D5CBB9] text-[11px] text-stone-600">
            Founder: <strong>{currentUser.displayName}</strong> ({currentUser.fullName})
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
              className="bg-[#749B64] hover:bg-[#5E8450] text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Create Community</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
