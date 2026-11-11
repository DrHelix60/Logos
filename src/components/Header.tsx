"use client";

import React, { useState } from "react";
import { Community, DatabaseModel, DynamicEntry, UserProfile, UserRole } from "@/types/database";
import { ShieldCheck, User, Eye, Database, Download, RefreshCw, Upload, ChevronRight, Home, Layers } from "lucide-react";

interface HeaderProps {
  currentView: "platform" | "community" | "database" | "entry" | "blueprint_studio" | "explorer_maker";
  selectedCommunity: Community | null;
  selectedDatabase: DatabaseModel | null;
  selectedEntry: DynamicEntry | null;
  onNavigateHome: () => void;
  onNavigateCommunity: () => void;
  onNavigateDatabase: () => void;
  currentProfile: UserProfile;
  onExportDb: () => void;
  onImportDb: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetDb: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  selectedCommunity,
  selectedDatabase,
  selectedEntry,
  onNavigateHome,
  onNavigateCommunity,
  onNavigateDatabase,
  currentProfile,
  onExportDb,
  onImportDb,
  onResetDb,
}) => {
  const [showProfileDetails, setShowProfileDetails] = useState(false);

  return (
    <header className="w-full bg-[#749B64] border-b-4 border-[#5E8450] shadow-figma text-white sticky top-0 z-40">
      {/* Top utility sub-bar */}
      <div className="bg-[#4A6541] px-4 py-1.5 text-xs flex justify-between items-center text-[#E5EFE2]">
        <div className="flex items-center space-x-4">
          <span className="font-semibold tracking-wider flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            LOGOS P2P RUNTIME (SQLite WASM)
          </span>
          {selectedCommunity && (
            <span className="hidden md:inline text-[#C0D4BC]">
              | Discipline: {selectedCommunity.discipline}
            </span>
          )}
        </div>

        {/* Database & Profile quick controls */}
        <div className="flex items-center space-x-3">
          <label className="cursor-pointer hover:text-white flex items-center gap-1">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import DB</span>
            <input type="file" accept=".sqlite,.db" className="hidden" onChange={onImportDb} />
          </label>
          <button onClick={onExportDb} className="hover:text-white flex items-center gap-1" title="Export SQLite binary snapshot">
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export DB</span>
          </button>
          <button onClick={onResetDb} title="Reset to clean database" className="hover:text-white flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* User Profile Badge */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDetails(!showProfileDetails)}
              className="bg-[#344B2D] px-2.5 py-0.5 rounded-full flex items-center gap-1.5 text-xs font-medium text-white hover:bg-[#283C22] transition"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">{currentProfile.displayName}</span>
              <span className="text-[10px] bg-amber-400 text-stone-900 font-bold px-1.5 rounded-full uppercase tracking-wider">
                {currentProfile.role}
              </span>
            </button>

            {showProfileDetails && (
              <div className="absolute right-0 mt-2 w-72 bg-[#F7F1E5] text-stone-900 rounded-2xl shadow-2xl border border-[#D5CBB9] p-4 z-50 text-xs space-y-2">
                <div className="border-b border-stone-200 pb-2">
                  <div className="font-bold text-sm text-[#344B2D]">{currentProfile.displayName}</div>
                  <div className="text-[11px] text-stone-600 font-medium">{currentProfile.fullName}</div>
                </div>

                <div className="space-y-1 text-stone-700">
                  <div className="flex justify-between">
                    <span>Account Role:</span>
                    <strong className="capitalize text-emerald-800">{currentProfile.role}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Reputation:</span>
                    <strong>{currentProfile.reputationScore}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Spotlight Tokens:</span>
                    <strong className="text-amber-700">★ {currentProfile.spotlightTokens}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 text-[10px] text-stone-500 italic">
                  Pre-issued founder identity for local beta testing.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Emblem & Branding */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onNavigateHome}>
          <div className="w-12 h-12 rounded-full bg-[#F7F1E5] border-2 border-[#4A6541] flex items-center justify-center shadow-md text-[#4A6541] font-bold text-center leading-tight">
            <span className="text-[10px] tracking-widest font-serif">
              LOGOS<br />
              <span className="text-[7px] font-sans font-normal text-stone-600">NET</span>
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#F7F1E5] font-serif">Logos</h1>
            <p className="text-[11px] text-[#E0EBDC] font-medium">Standardized Knowledge Social Network</p>
          </div>
        </div>

        {/* Dynamic Breadcrumbs Navigation */}
        <nav className="flex items-center flex-wrap gap-1 sm:gap-2 text-xs text-[#E5EFE2]">
          <button
            onClick={onNavigateHome}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
              currentView === "platform"
                ? "bg-[#4A6541] font-bold text-white shadow-inner"
                : "hover:bg-[#5E8450] text-[#DCE8D8]"
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Logos Network</span>
          </button>

          {selectedCommunity && (
            <>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <button
                onClick={onNavigateCommunity}
                className={`px-2.5 py-1 rounded-lg transition ${
                  currentView === "community"
                    ? "bg-[#4A6541] font-bold text-white shadow-inner"
                    : "hover:bg-[#5E8450] text-[#DCE8D8]"
                }`}
              >
                {selectedCommunity.name}
              </button>
            </>
          )}

          {currentView === "blueprint_studio" && (
            <>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <span className="bg-[#4A6541] font-bold text-white px-2.5 py-1 rounded-lg shadow-inner flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-amber-300" />
                Blueprint Studio
              </span>
            </>
          )}

          {currentView === "explorer_maker" && (
            <>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <span className="bg-[#4A6541] font-bold text-white px-2.5 py-1 rounded-lg shadow-inner flex items-center gap-1">
                Explorer Maker
              </span>
            </>
          )}

          {selectedDatabase && (
            <>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <button
                onClick={onNavigateDatabase}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition ${
                  currentView === "database"
                    ? "bg-[#4A6541] font-bold text-white shadow-inner"
                    : "hover:bg-[#5E8450] text-[#DCE8D8]"
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>{selectedDatabase.name}</span>
              </button>
            </>
          )}

          {selectedEntry && currentView === "entry" && (
            <>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <span className="bg-[#4A6541] font-bold text-white px-2.5 py-1 rounded-lg shadow-inner">
                {selectedEntry.title}
              </span>
            </>
          )}
        </nav>

        {/* Right status badge */}
        <div className="hidden sm:flex items-center space-x-2">
          <div className="bg-[#F4EDE0] text-[#344B2D] px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-md border border-[#D5CBB9] select-none">
            {selectedCommunity ? selectedCommunity.discipline : "Knowledge Standardization"}
          </div>
        </div>
      </div>
    </header>
  );
};
