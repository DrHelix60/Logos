# Proposal

## Why

Scientific biological databases are currently centralized, expensive to maintain, and often gatekeep contributions through academic pedigree rather than empirical merit. Furthermore, rigid top-down taxonomic classifications create irreconcilable conflicts when different research groups disagree on species boundaries.

To solve this, we are building **Logos**: a local-first, zero-server-cost scientific database platform. This first change establishes the user-facing foundation: a complete client-side species browser adhering to the `@ScienceXI` visual system from Figma, powered by an embedded local database (SQLite WASM) that requires $0 in server hosting, with support for rich multimedia (audio vocalizations, tracks, distribution maps, and video embeds) and asset bundle downloads.

## What Changes

- **P2P Local-First Database Core**: Embeds a zero-server SQLite WASM engine running directly in the browser via OPFS / IndexedDB, seeded with biological species data (*Grey Wolf*, *Common Shrew*, *Pygmy Shrew*, *Mountain Shrew*).
- **Navigation & Brand Experience**: Implements the `@ScienceXI` visual identity (custom sage-green design system, responsive navigation, Home & User Guide pages, and breadcrumbs connecting Biology to Science).
- **Advanced Taxonomy & Characteristic Filtering**: Provides multi-category filtering (Class, Size, Diet, Activity, Habitat, Biome) with user-selectable logic per category: "Pertenece a uno" (OR) vs. "Incluido en todos" (AND).
- **Species Entry Display Engine**: Renders dynamic species entries structured according to the Animal Species Blueprint:
  - *Tier 1*: Header (Common & Scientific names, nominate status), Size, Diet, Activity.
  - *Tier 2*: Ethology, Vocalization audio player, Video embeds, Skeletal & Human scale comparison illustrations.
  - *Tier 3*: Ecology (trophic level, Eltonian niche), Habitat & Biome cards, Current Recognised Distribution, Expected Distribution, and Last Glacial Maximum (LGM) maps.
  - *Tier 4*: Anatomy & Physiology, Tracks and Identification comparison.
  - *Metric*: Dynamic 0-100% Core Completion Metric score badge.
- **Media Asset Exporting**: Enables instant downloading of individual entry files (audio, illustrations, maps) or one-click ZIP packaging of all assets for an entry.

## Capabilities

### New Capabilities
- `species-browser`: Viewing and navigating species entries, taxonomic hierarchies, and multi-criteria filters with AND/OR logic per category.
- `p2p-database`: Running embedded local-first SQLite in the browser with seed data and snapshot import/export for zero server costs.
- `media-asset-download`: Downloading individual media files or generating full-entry ZIP bundles on the client side.

### Modified Capabilities
*(None - this is the foundational change for the project).*

## Impact

- **Frontend Application**: Creates a modern Next.js / React application configured for static export (GitHub Pages deployable).
- **Client Storage**: Adds `@sqlite.org/sqlite-wasm` or sql.js with local persistence.
- **File Packaging**: Adds `jszip` and `file-saver` for client-side archive generation.
- **Dependencies**: No paid cloud backend or hosted database required.
