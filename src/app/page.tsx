"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LogosPlatformHome } from "@/components/LogosPlatformHome";
import { CommunityView } from "@/components/CommunityView";
import { BlueprintStudio } from "@/components/BlueprintStudio";
import { DatabaseEntriesView } from "@/components/DatabaseEntriesView";
import { DynamicEntryView } from "@/components/DynamicEntryView";
import { CreateCommunityModal } from "@/components/CreateCommunityModal";
import { CreateDatabaseModal } from "@/components/CreateDatabaseModal";
import { DynamicEntryForm } from "@/components/DynamicEntryForm";
import {
  exportDatabaseBinary,
  getAllBlueprints,
  getAllCommunities,
  getAllDatabases,
  getAllEntries,
  getAllProfiles,
  importDatabaseBinary,
  initDatabase,
  insertBlueprint,
  insertCommunity,
  insertDatabase,
  insertEntry,
  resetDatabaseToClean,
} from "@/lib/db";
import {
  Blueprint,
  Community,
  DatabaseModel,
  DynamicEntry,
  UserProfile,
} from "@/types/database";
import { initialProfiles } from "@/lib/seed-data";
import { saveAs } from "file-saver";

type ViewMode = "platform" | "community" | "database" | "entry" | "blueprint_studio";

export default function Home() {
  const [isDbReady, setIsDbReady] = useState(false);
  const [view, setView] = useState<ViewMode>("platform");

  // Selected Entities
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseModel | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<DynamicEntry | null>(null);

  // Data Store
  const [communities, setCommunities] = useState<Community[]>([]);
  const [databases, setDatabases] = useState<DatabaseModel[]>([]);
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [entries, setEntries] = useState<DynamicEntry[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>(initialProfiles);
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(initialProfiles[0]);

  // Modals
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);
  const [isCreateDatabaseOpen, setIsCreateDatabaseOpen] = useState(false);
  const [isCreateEntryOpen, setIsCreateEntryOpen] = useState(false);

  // Reload all records from SQLite WASM
  const loadData = useCallback(async () => {
    try {
      const comms = await getAllCommunities();
      const dbs = await getAllDatabases();
      const bps = await getAllBlueprints();
      const ents = await getAllEntries();
      const profs = await getAllProfiles();

      setCommunities(comms);
      setDatabases(dbs);
      setBlueprints(bps);
      setEntries(ents);

      if (profs.length > 0) {
        setProfiles(profs);
        const founder = profs.find((p) => p.role === "founder") || profs[0];
        setCurrentProfile(founder);
      }
    } catch (e) {
      console.error("Error loading SQLite data:", e);
    }
  }, []);

  // Initialize SQLite WASM on mount
  useEffect(() => {
    async function setup() {
      try {
        await initDatabase();
        await loadData();
        setIsDbReady(true);
      } catch (err) {
        console.error("Failed to initialize in-browser SQLite WASM:", err);
      }
    }
    setup();
  }, [loadData]);

  // Navigation handlers
  const handleNavigateHome = () => {
    setSelectedCommunity(null);
    setSelectedDatabase(null);
    setSelectedEntry(null);
    setView("platform");
  };

  const handleNavigateCommunity = () => {
    if (selectedCommunity) {
      setSelectedDatabase(null);
      setSelectedEntry(null);
      setView("community");
    } else {
      setView("platform");
    }
  };

  const handleNavigateDatabase = () => {
    if (selectedDatabase) {
      setSelectedEntry(null);
      setView("database");
    } else if (selectedCommunity) {
      setView("community");
    } else {
      setView("platform");
    }
  };

  // Community creation
  const handleCommunitySubmit = async (newComm: Community) => {
    await insertCommunity(newComm);
    await loadData();
    setSelectedCommunity(newComm);
    setView("community");
  };

  // Database creation
  const handleDatabaseSubmit = async (newDb: DatabaseModel) => {
    await insertDatabase(newDb);
    await loadData();
  };

  // Blueprint publishing
  const handleSaveBlueprint = async (bp: Blueprint) => {
    await insertBlueprint(bp);
    await loadData();
    setView("community");
  };

  // Entry creation
  const handleEntrySubmit = async (newEntry: DynamicEntry) => {
    await insertEntry(newEntry);
    await loadData();
    setSelectedEntry(newEntry);
    setView("entry");
  };

  // Database snapshot controls
  const handleExportDb = async () => {
    const binary = await exportDatabaseBinary();
    const blob = new Blob([binary as unknown as BlobPart], {
      type: "application/x-sqlite3",
    });
    saveAs(blob, `logos_database_snapshot_${new Date().toISOString().slice(0, 10)}.sqlite`);
  };

  const handleImportDb = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    await importDatabaseBinary(bytes);
    await loadData();
    handleNavigateHome();
    alert("Database snapshot successfully loaded into local SQLite WASM!");
  };

  const handleResetDb = async () => {
    if (
      confirm(
        "Reset the in-browser SQLite database to a completely clean state? All custom communities, blueprints, and entries will be wiped."
      )
    ) {
      await resetDatabaseToClean();
      await loadData();
      handleNavigateHome();
    }
  };

  if (!isDbReady) {
    return (
      <div className="min-h-screen bg-[#F7F1E5] flex flex-col items-center justify-center p-4 text-[#344B2D] space-y-4">
        <div className="w-16 h-16 rounded-full border-4 border-[#749B64] border-t-transparent animate-spin"></div>
        <p className="font-serif font-bold text-lg">Initializing Logos P2P Runtime (SQLite WASM)...</p>
      </div>
    );
  }

  // Active community scoped data
  const communityDatabases = selectedCommunity
    ? databases.filter((d) => d.communityId === selectedCommunity.id)
    : [];
  const communityBlueprints = selectedCommunity
    ? blueprints.filter((b) => b.communityId === selectedCommunity.id)
    : [];
  const communityEntries = selectedCommunity
    ? entries.filter((e) => e.communityId === selectedCommunity.id)
    : [];

  // Active database scoped data
  const databaseEntries = selectedDatabase
    ? entries.filter((e) => e.databaseId === selectedDatabase.id)
    : [];
  const activeBlueprint = selectedDatabase
    ? blueprints.find((b) => b.id === selectedDatabase.blueprintId) || null
    : null;

  return (
    <div className="min-h-screen bg-[#F7F1E5] text-[#1F2A1C] flex flex-col font-sans selection:bg-[#749B64] selection:text-white">
      {/* Universal Header with Breadcrumbs & Founder Badge */}
      <Header
        currentView={view}
        selectedCommunity={selectedCommunity}
        selectedDatabase={selectedDatabase}
        selectedEntry={selectedEntry}
        onNavigateHome={handleNavigateHome}
        onNavigateCommunity={handleNavigateCommunity}
        onNavigateDatabase={handleNavigateDatabase}
        currentProfile={currentProfile}
        onExportDb={handleExportDb}
        onImportDb={handleImportDb}
        onResetDb={handleResetDb}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* VIEW 1: Platform Home (Outside Any Community) */}
        {view === "platform" && (
          <LogosPlatformHome
            currentUser={currentProfile}
            communities={communities}
            databases={databases}
            blueprints={blueprints}
            onSelectCommunity={(comm) => {
              setSelectedCommunity(comm);
              setView("community");
            }}
            onOpenCreateCommunity={() => setIsCreateCommunityOpen(true)}
          />
        )}

        {/* VIEW 2: Community Overview */}
        {view === "community" && selectedCommunity && (
          <CommunityView
            community={selectedCommunity}
            databases={communityDatabases}
            blueprints={communityBlueprints}
            entries={communityEntries}
            currentUser={currentProfile}
            onBack={handleNavigateHome}
            onOpenCreateDatabase={() => setIsCreateDatabaseOpen(true)}
            onOpenBlueprintStudio={() => setView("blueprint_studio")}
            onSelectDatabase={(db) => {
              setSelectedDatabase(db);
              setView("database");
            }}
          />
        )}

        {/* VIEW 3: Blueprint Studio */}
        {view === "blueprint_studio" && selectedCommunity && (
          <BlueprintStudio
            communityId={selectedCommunity.id}
            domain={selectedCommunity.discipline}
            onSave={handleSaveBlueprint}
            onCancel={() => setView("community")}
          />
        )}

        {/* VIEW 4: Database Entries List */}
        {view === "database" && selectedCommunity && selectedDatabase && activeBlueprint && (
          <DatabaseEntriesView
            community={selectedCommunity}
            database={selectedDatabase}
            blueprint={activeBlueprint}
            entries={databaseEntries}
            currentUser={currentProfile}
            onBack={handleNavigateCommunity}
            onOpenCreateEntry={() => setIsCreateEntryOpen(true)}
            onSelectEntry={(entry) => {
              setSelectedEntry(entry);
              setView("entry");
            }}
          />
        )}

        {/* VIEW 5: Dynamic Entry Detail */}
        {view === "entry" && selectedEntry && (
          <DynamicEntryView
            entry={selectedEntry}
            blueprint={
              blueprints.find((b) => b.id === selectedEntry.blueprintId) || {
                id: "unknown",
                communityId: "",
                name: "Standard Blueprint",
                version: "1.0",
                domain: "",
                sections: [],
                createdAt: "",
              }
            }
            onBack={handleNavigateDatabase}
          />
        )}
      </main>

      {/* Universal Footer */}
      <Footer />

      {/* Modals */}
      {isCreateCommunityOpen && (
        <CreateCommunityModal
          currentUser={currentProfile}
          isOpen={isCreateCommunityOpen}
          onClose={() => setIsCreateCommunityOpen(false)}
          onSubmit={handleCommunitySubmit}
        />
      )}

      {isCreateDatabaseOpen && selectedCommunity && (
        <CreateDatabaseModal
          communityId={selectedCommunity.id}
          blueprints={communityBlueprints}
          isOpen={isCreateDatabaseOpen}
          onClose={() => setIsCreateDatabaseOpen(false)}
          onSubmit={handleDatabaseSubmit}
        />
      )}

      {isCreateEntryOpen && selectedCommunity && selectedDatabase && activeBlueprint && (
        <DynamicEntryForm
          blueprint={activeBlueprint}
          databaseId={selectedDatabase.id}
          communityId={selectedCommunity.id}
          currentUser={currentProfile}
          isOpen={isCreateEntryOpen}
          onClose={() => setIsCreateEntryOpen(false)}
          onSubmit={handleEntrySubmit}
        />
      )}
    </div>
  );
}
