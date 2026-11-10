"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UserGuide } from "@/components/UserGuide";
import { SidebarFilter } from "@/components/SidebarFilter";
import { SpeciesGrid } from "@/components/SpeciesGrid";
import { SpeciesDetail } from "@/components/SpeciesDetail";
import { CreateEntryModal } from "@/components/CreateEntryModal";
import { 
  exportDatabaseBinary, 
  getAllBlueprints, 
  getAllDatabases, 
  getAllEntries, 
  getAllProfiles, 
  importDatabaseBinary, 
  initDatabase, 
  insertEntry, 
  resetDatabaseToSeed, 
  updateEntryStatus 
} from "@/lib/db";
import { filterEntries } from "@/lib/filter-engine";
import { downloadEntryZip, downloadSingleFile } from "@/lib/zip-archiver";
import { Blueprint, DatabaseModel, FilterState, SpeciesEntry, UserProfile } from "@/types/database";
import { initialProfiles, animalSpeciesBlueprint } from "@/lib/seed-data";
import { saveAs } from "file-saver";
import { Database, Filter, Layers, PlusCircle, CheckCircle, Clock } from "lucide-react";

export default function Home() {
  const [isDbReady, setIsDbReady] = useState(false);
  const [currentTab, setCurrentTab] = useState<"guide" | "database">("database");
  const [selectedEntry, setSelectedEntry] = useState<SpeciesEntry | null>(null);

  // Database models
  const [entries, setEntries] = useState<SpeciesEntry[]>([]);
  const [databases, setDatabases] = useState<DatabaseModel[]>([]);
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>(initialProfiles);
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(initialProfiles[0]);

  // Modal & Download states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    selectedClasses: [],
    classMode: "or",
    selectedSizes: [],
    sizeMode: "or",
    selectedDiets: [],
    dietMode: "or",
    selectedActivities: [],
    activityMode: "or",
    selectedHabitats: [],
    habitatMode: "or",
    selectedBiomes: [],
    biomeMode: "or",
  });

  // Initialize SQLite WASM on mount
  useEffect(() => {
    async function setup() {
      try {
        await initDatabase();
        const loadedEntries = await getAllEntries();
        const loadedDbs = await getAllDatabases();
        const loadedBps = await getAllBlueprints();
        const loadedProfiles = await getAllProfiles();

        setEntries(loadedEntries);
        setDatabases(loadedDbs);
        setBlueprints(loadedBps);
        if (loadedProfiles.length > 0) {
          setProfiles(loadedProfiles);
          setCurrentProfile(loadedProfiles[0]);
        }
        setIsDbReady(true);
      } catch (err) {
        console.error("Failed to initialize in-browser SQLite WASM:", err);
      }
    }
    setup();
  }, []);

  // Compute available filter options dynamically from records
  const availableOptions = useMemo(() => {
    const classes = Array.from(new Set(entries.map((e) => e.data.class).filter(Boolean)));
    const diets = ["Hypercarnivore", "Carnivore", "Inverticarnivore", "Herbivore", "Omnivore"];
    const sizes = ["Size 1", "Size 2", "Size 3", "Size 4", "Micro-mammal"];
    const activities = ["Diurnal", "Nocturnal", "Crepuscular", "Cathemeral"];
    const habitats = Array.from(new Set(entries.flatMap((e) => e.data.habitats || [])));
    const biomes = Array.from(new Set(entries.flatMap((e) => e.data.biomes || [])));

    return {
      classes: classes.length ? classes : ["Mammals", "Aves", "Reptiles"],
      sizes,
      diets,
      activities,
      habitats: habitats.length ? habitats : ["Woodland", "Meadow", "Deciduous Forest", "Taiga", "Tundra", "Steppe"],
      biomes: biomes.length ? biomes : ["Cold", "Warm Temperate", "Boreal", "Montane"],
    };
  }, [entries]);

  // Reactive filtered entries
  const filteredEntries = useMemo(() => {
    return filterEntries(entries, filters);
  }, [entries, filters]);

  // Handlers
  const handleCreateEntry = async (newEntry: SpeciesEntry) => {
    await insertEntry(newEntry);
    const updated = await getAllEntries();
    setEntries(updated);
    setSelectedEntry(newEntry);
  };

  const handleApproveEntry = async (id: string) => {
    await updateEntryStatus(id, "published");
    const updated = await getAllEntries();
    setEntries(updated);
    if (selectedEntry?.id === id) {
      const refreshed = updated.find((e) => e.id === id) || null;
      setSelectedEntry(refreshed);
    }
  };

  const handleExportDb = async () => {
    const binary = await exportDatabaseBinary();
    const blob = new Blob([binary as unknown as BlobPart], { type: "application/x-sqlite3" });
    saveAs(blob, `logos_database_snapshot_${new Date().toISOString().slice(0, 10)}.sqlite`);
  };

  const handleImportDb = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    await importDatabaseBinary(bytes);
    const updated = await getAllEntries();
    setEntries(updated);
    alert("Database snapshot successfully loaded into local SQLite WASM!");
  };

  const handleResetDb = async () => {
    if (confirm("Reset the in-browser SQLite database back to seed entries?")) {
      await resetDatabaseToSeed();
      const updated = await getAllEntries();
      setEntries(updated);
      setSelectedEntry(null);
    }
  };

  const handleDownloadZip = async (entry: SpeciesEntry) => {
    try {
      setIsDownloadingZip(true);
      await downloadEntryZip(entry);
    } catch (err) {
      console.error("ZIP packaging error:", err);
      alert("ZIP packaging initiated. Check your downloads.");
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F1E5]">
      {/* Platform Header */}
      <Header
        currentTab={selectedEntry ? "entry" : currentTab}
        onTabChange={(tab) => {
          setSelectedEntry(null);
          setCurrentTab(tab);
        }}
        currentProfile={currentProfile}
        profiles={profiles}
        onProfileChange={(p) => setCurrentProfile(p)}
        onExportDb={handleExportDb}
        onImportDb={handleImportDb}
        onResetDb={handleResetDb}
        pendingProposalsCount={entries.filter((e) => e.status === "pending_review").length}
        onOpenCreateEntry={() => setIsCreateModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {!isDbReady ? (
          <div className="text-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-[#749B64] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-stone-600 font-semibold">Starting in-browser SQLite WASM engine...</p>
          </div>
        ) : selectedEntry ? (
          /* Single Species Entry Detail Page */
          <SpeciesDetail
            entry={selectedEntry}
            onBack={() => setSelectedEntry(null)}
            currentUser={currentProfile}
            onDownloadSingle={downloadSingleFile}
            onDownloadZip={handleDownloadZip}
            onApproveEntry={handleApproveEntry}
            isDownloadingZip={isDownloadingZip}
          />
        ) : currentTab === "guide" ? (
          /* Home & User Guide Page */
          <UserGuide onGoToDatabase={() => setCurrentTab("database")} />
        ) : (
          /* Species Database Browser & Filtering */
          <div className="space-y-6">
            {/* Database Scope Breadcrumb Header */}
            <div className="bg-[#EFE8D8] border border-[#D5CBB9] p-5 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                  <span>Living Organisms</span>
                  <span>&gt;</span>
                  <span>Animals</span>
                  <span>&gt;</span>
                  <span className="text-[#344B2D] font-bold">Eurasian Mammals (Database)</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#344B2D]">
                  Species Database Browser
                </h2>
                <p className="text-xs text-stone-600">
                  Standardized entries using the <strong>Animal Species Blueprint</strong> (Scored 0–100% Core Completion Metric)
                </p>
              </div>

              {currentProfile.role !== "visitor" && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-[#749B64] hover:bg-[#5E8450] text-white px-5 py-2.5 rounded-2xl text-xs font-bold shadow-md transition flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Propose New Species</span>
                </button>
              )}
            </div>

            {/* Split Layout: Sidebar Filters + Species Cards Grid */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <SidebarFilter
                filters={filters}
                onChange={setFilters}
                availableOptions={availableOptions}
                totalMatches={filteredEntries.length}
              />

              <SpeciesGrid
                entries={filteredEntries}
                onSelectEntry={(entry) => setSelectedEntry(entry)}
                onDownloadZip={handleDownloadZip}
              />
            </div>
          </div>
        )}
      </main>

      {/* Entry Creation Modal */}
      <CreateEntryModal
        blueprint={blueprints[0] || animalSpeciesBlueprint}
        databaseId="db-eurasian-mammals"
        currentUser={currentProfile}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEntry}
      />

      {/* Platform Footer */}
      <Footer />
    </div>
  );
}
