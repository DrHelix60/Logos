# Tasks

## 1. Setup & Design Foundation

- [x] 1.1 Initialize Next.js application with TypeScript, Tailwind CSS, and static export configuration (`output: 'export'`) and verify build succeeds.
- [x] 1.2 Define design tokens, color variables (`#749B64`, `#4A6541`, `#F7F1E5`), and typography in Tailwind configuration.

## 2. In-Browser P2P SQLite Database Layer

- [x] 2.1 Set up in-browser SQLite WASM runtime with client-side persistence and verify in-memory and persisted query execution.
- [x] 2.2 Define database schema for Schools of Thought, Canons, Blueprints, and Entries, and load initial seed data for the Biology School of Thought (Grey Wolf, Common Shrew, Pygmy Shrew, Mountain Shrew).
- [x] 2.3 Implement database snapshot export and import functions and verify that exporting and re-importing preserves record integrity.

## 3. UI Shell, Navigation & Role Switcher

- [x] 3.1 Implement Navigation Header (with emblem, navigation links, and "Back to Biology" action), Role Switcher (Visitor / Member / Community Leader), and multi-column Footer matching the Figma design.
- [x] 3.2 Implement Home Page and User Guide view presenting project purpose, terminology, and concept definitions as laid out in Figma.

## 4. Knowledge Browser & Filter Engine

- [x] 4.1 Build sidebar filter component supporting Class, Size, Diet, Activity, Habitat, and Biome categories.
- [x] 4.2 Implement category-level filter logic toggles ("Pertenece a uno" [OR] vs. "Incluido en todos" [AND]) and verify reactive filtering against database records.

## 5. Blueprint-Driven Entry Display & Authoring Form

- [x] 5.1 Build Entry header card displaying common name, scientific name, nominate species badge, physical dimensions, diet, and activity pattern.
- [x] 5.2 Build Ethology, Ecology (trophic level, Eltonian niche), and Anatomy & Physiology sections.
- [x] 5.3 Implement Vocalization audio player with custom controls, YouTube video embed container, and footprint tracks / scale comparison cards.
- [x] 5.4 Implement Distribution section displaying Current Recognised Distribution, Expected Distribution, and Last Glacial Maximum (LGM) maps.
- [x] 5.5 Implement dynamic Core Completion Metric calculation engine and visual percentage badge.
- [x] 5.6 Implement "Create New Entry" blueprint authoring form allowing users to submit new species records into the database with real-time metric calculation.

## 6. Media Asset Export & Final Integration

- [x] 6.1 Implement single-file asset download buttons for audio clips, diagrams, and maps.
- [x] 6.2 Implement "Download All Files" client-side ZIP packaging using JSZip and verify download of the complete media archive.
- [x] 6.3 Run static build validation (`npm run build`), verify that all pages generate as static HTML/CSS/JS, and test all interactive features.
