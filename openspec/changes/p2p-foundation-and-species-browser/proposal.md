# Proposal

## Why

Human knowledge across sciences and humanities is deeply fragmented, arbitrarily classified, and siloed by institutional gatekeeping. There is currently no decentralized platform where independent thinkers and research groups can formally standardize knowledge through empirical structures.

**Logos** solves this as a decentralized, peer-to-peer social network and database system for **knowledge standardization**. Logos allows communities to form **Schools of Thought**, curate **Canons** of validated modular databases, and enforce structural **Blueprints** so that any entry proposed by contributors adheres to rigorous formatting, automated scoring, and peer review.

This first milestone builds the Logos core client runtime and user experience, using the author's **Biology School of Thought (`@ScienceXI`)** as the flagship demonstration.

## What Changes

- **Logos Knowledge & Blueprint Engine**: Implements the foundation for blueprint-driven data presentation, where entries are dynamically rendered according to their domain schema.
- **School of Thought & Canon Hierarchy**: Displays community groupings, navigation between broader scientific umbrellas and specific databases, and canonical database selection.
- **P2P Zero-Server Database Core**: Embeds SQLite WASM in the browser with OPFS/IndexedDB persistence and portable snapshot export/import ($0 server cost).
- **Flagship Implementation (Biology School of Thought)**: 
  - Seeds the platform with the author's Animal Species Blueprint (Tiers 1-4, Core Completion Metric).
  - Showcases the author's scientific contributions and terminology across 4 pilot species entries (*Canis lupus*, *Sorex araneus*, *Sorex minutus*, *Sorex alpinus*).
  - Advanced multi-category filtering with "Pertenece a uno" (OR) vs. "Incluido en todos" (AND) logic.
- **Media & Asset Exporting**: Enables instant downloading of individual assets or full-entry ZIP bundles.

## Capabilities

### New Capabilities
- `knowledge-browser`: Browsing Schools of Thought, modular databases, and blueprint-structured entries with multi-criteria category filters.
- `p2p-database`: Running embedded local-first SQLite in the browser with seed data and snapshot import/export for zero server costs.
- `media-asset-download`: Downloading individual media files or generating full-entry ZIP bundles on the client side.

### Modified Capabilities
*(None - this is the foundational change for the project).*

## Impact

- **Frontend Application**: Creates a modern Next.js / React application configured for static export (GitHub Pages deployable).
- **Client Storage**: Adds `@sqlite.org/sqlite-wasm` or sql.js with local persistence.
- **File Packaging**: Adds `jszip` and `file-saver` for client-side archive generation.
- **Dependencies**: No paid cloud backend or hosted database required.
