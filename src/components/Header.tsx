"use client";

import React, { useState } from "react";
import { UserProfile, UserRole } from "@/types/database";
import { ShieldCheck, User, Eye, Database, FileSpreadsheet, Download, RefreshCw, Upload } from "lucide-react";

interface HeaderProps {
  currentTab: "guide" | "database" | "entry";
  onTabChange: (tab: "guide" | "database") => void;
  currentProfile: UserProfile;
  profiles: UserProfile[];
  onProfileChange: (profile: UserProfile) => void;
  onExportDb: () => void;
  onImportDb: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetDb: () => void;
  pendingProposalsCount?: number;
  onOpenCreateEntry?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  currentProfile,
  profiles,
  onProfileChange,
  onExportDb,
  onImportDb,
  onResetDb,
  pendingProposalsCount = 0,
  onOpenCreateEntry,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "leader":
        return <ShieldCheck className="w-4 h-4 text-emerald-800" />;
      case "member":
        return <User className="w-4 h-4 text-blue-800" />;
      case "visitor":
        return <Eye className="w-4 h-4 text-stone-700" />;
    }
  };

  return (
    <header className="w-full bg-[#749B64] border-b-4 border-[#5E8450] shadow-figma text-white sticky top-0 z-40">
      {/* Top utility sub-bar */}
      <div className="bg-[#4A6541] px-4 py-1.5 text-xs flex justify-between items-center text-[#E5EFE2]">
        <div className="flex items-center space-x-4">
          <span className="font-semibold tracking-wider flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            LOGOS P2P RUNTIME (SQLite WASM)
          </span>
          <span className="hidden md:inline text-[#C0D4BC]">| School: Empirical Organismal Taxonomy</span>
        </div>

        {/* Database & Profile quick controls */}
        <div className="flex items-center space-x-3">
          <label className="cursor-pointer hover:text-white flex items-center gap-1">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import DB</span>
            <input type="file" accept=".sqlite,.db" className="hidden" onChange={onImportDb} />
          </label>
          <button onClick={onExportDb} className="hover:text-white flex items-center gap-1">
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export DB</span>
          </button>
          <button onClick={onResetDb} title="Reset to initial seed data" className="hover:text-white flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Role switcher toggle */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="bg-[#344B2D] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 text-xs font-medium text-white hover:bg-[#283C22] transition"
            >
              {getRoleIcon(currentProfile.role)}
              <span className="capitalize">{currentProfile.role}: {currentProfile.name.split(" ")[0]}</span>
              {currentProfile.spotlightTokens > 0 && (
                <span className="bg-amber-400 text-stone-900 font-bold px-1.5 rounded-full text-[10px]" title="Spotlight Tokens available">
                  ★{currentProfile.spotlightTokens}
                </span>
              )}
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-1.5 w-64 bg-[#F7F1E5] text-stone-900 rounded-xl shadow-2xl border border-[#D5CBB9] py-2 z-50">
                <div className="px-3 py-1.5 border-b border-stone-200 text-xs font-bold text-stone-600">
                  Switch Active Role (Test Mode)
                </div>
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onProfileChange(p);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#EAE3D2] transition ${
                      currentProfile.id === p.id ? "bg-[#DFD7C3] font-bold" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {getRoleIcon(p.role)}
                      <div>
                        <div>{p.name}</div>
                        <div className="text-[10px] text-stone-500 capitalize">{p.role} • Rep: {p.reputationScore}%</div>
                      </div>
                    </div>
                    {p.spotlightTokens > 0 && (
                      <span className="text-amber-700 font-semibold text-[10px]">★ {p.spotlightTokens} token</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Emblem & Branding */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange("guide")}>
          <div className="w-14 h-14 rounded-full bg-[#F7F1E5] border-2 border-[#4A6541] flex items-center justify-center shadow-md text-[#4A6541] font-bold text-center leading-tight">
            <span className="text-[11px] tracking-widest font-serif">
              LOGOS<br />
              <span className="text-[8px] font-sans font-normal text-stone-600">CANON</span>
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#F7F1E5] font-serif">Logos</h1>
            <p className="text-xs text-[#E0EBDC] font-medium">Standardized Organismal Database</p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
          <button
            onClick={() => onTabChange("guide")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              currentTab === "guide"
                ? "bg-[#4A6541] text-white shadow-inner font-semibold"
                : "text-[#EBF3E8] hover:bg-[#5E8450] hover:text-white"
            }`}
          >
            Home / Guide
          </button>
          <button
            onClick={() => onTabChange("database")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
              currentTab === "database"
                ? "bg-[#4A6541] text-white shadow-inner font-semibold"
                : "text-[#EBF3E8] hover:bg-[#5E8450] hover:text-white"
            }`}
          >
            <Database className="w-4 h-4" />
            Species Database
          </button>

          {/* Quick links to definitions as seen on Figma */}
          <span className="hidden lg:inline text-[#9BBA8E]">|</span>
          <button onClick={() => onTabChange("database")} className="hidden lg:inline px-2.5 py-1 text-xs text-[#DCE8D8] hover:text-white">
            Taxonomy
          </button>
          <button onClick={() => onTabChange("database")} className="hidden lg:inline px-2.5 py-1 text-xs text-[#DCE8D8] hover:text-white">
            Biome
          </button>
          <button onClick={() => onTabChange("database")} className="hidden lg:inline px-2.5 py-1 text-xs text-[#DCE8D8] hover:text-white">
            Ecology
          </button>
          <button onClick={() => onTabChange("database")} className="hidden lg:inline px-2.5 py-1 text-xs text-[#DCE8D8] hover:text-white">
            Ethology
          </button>
        </nav>

        {/* Action pills */}
        <div className="flex items-center space-x-2">
          {currentProfile.role !== "visitor" && onOpenCreateEntry && (
            <button
              onClick={onOpenCreateEntry}
              className="bg-[#2D4525] text-[#F7F1E5] hover:bg-[#20321A] px-4 py-2 rounded-full text-xs font-bold tracking-wide shadow-md transition flex items-center gap-1.5"
            >
              <span>+ Propose Entry</span>
            </button>
          )}

          <div className="bg-[#F4EDE0] text-[#344B2D] px-5 py-2 rounded-full text-xs font-bold tracking-wide shadow-md border border-[#D5CBB9] select-none">
            Biology Canon
          </div>
        </div>
      </div>
    </header>
  );
};
