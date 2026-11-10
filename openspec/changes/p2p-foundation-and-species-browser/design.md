# Design

## Context

See `proposal.md` for overall motivation. The application is a client-side scientific database designed to run with $0 hosting fees on GitHub Pages or as an offline PWA. The user interface directly reflects the Figma design system established in the "Logos" project file:
- Primary palette: `@ScienceXI` sage-green (`#749B64`), forest accent (`#4A6541`), cream backgrounds (`#F7F1E5` / `#EAE3D2`), and dark slate typography.
- UI Hierarchy: Top Navigation Bar with Science XI badge, breadcrumbs, Header, Content Area, and multi-tier Footer.

## Goals / Non-Goals

**Goals:**
- Deliver a responsive web application deployable directly to GitHub Pages (`output: 'export'`).
- Execute an in-browser SQLite database (via SQLite WASM) with OPFS or IndexedDB persistence.
- Provide responsive UI components mirroring the Figma layout for Home, User Guide, Species Entry (Grey Wolf, Common Shrew, Pygmy Shrew, Mountain Shrew), and Sidebar Filters.
- Support "Pertenece a uno" (OR) and "Incluido en todos" (AND) category-level filter logic.
- Support audio vocalization playback, video embeds (e.g. YouTube shrew caravan), and client-side ZIP packaging of entry assets using JSZip.

**Non-Goals:**
- User authentication, crypto key generation, and role permissions (scheduled for Phase 2).
- Dynamic custom blueprint builder studio (scheduled for Phase 4).
- Peer-to-peer WebRTC live syncing mesh (Phase 2/3 - Phase 1 uses snapshot export/import).

## Decisions

### 1. Client Framework: Next.js (Static Export) + Tailwind CSS
- **Decision**: Use React / Next.js configured with `output: 'export'` and Tailwind CSS.
- **Rationale**: Generates static HTML/JS/CSS that hosts free on GitHub Pages. Tailwind makes adapting the Figma `@ScienceXI` green design tokens, cards, and rounded containers clean and maintainable.
- **Alternatives Considered**: Vite + React SPA (Next.js provides built-in routing, layout conventions, and easy expansion if serverless functions are ever desired).

### 2. Embedded Database: In-Browser SQLite WASM + Persistence Layer
- **Decision**: Run SQLite WASM directly in the client browser with an IndexedDB / OPFS virtual file system.
- **Rationale**: Gives full relational SQL querying, zero server operational costs, complete offline capability, and portable `.sqlite` database snapshot export.
- **Alternatives Considered**: In-memory JSON stores (lacks relational integrity, cannot easily scale to thousands of species or complex taxonomic queries).

### 3. Client-Side Archive Packaging (JSZip)
- **Decision**: Use `jszip` and browser download triggers for the "Download All Files" feature.
- **Rationale**: Assembles all images, vector diagrams, and audio files for an entry into a ZIP file locally on the client device without sending requests to a backend archive server.

### 4. Data Seeding & Blueprint Structure
- **Decision**: Pre-seed the database with the Animal Species Blueprint and the 4 reference species from Figma (*Canis lupus*, *Sorex araneus*, *Sorex minutus*, *Sorex alpinus*).
- **Rationale**: Allows immediate validation of the UI against the exact visual designs in Figma, including the Core Completion Metric and Nominate Species references.

## Risks / Trade-offs

- **[Browser Storage Limits]** → Large media files (videos) are embedded via streaming URLs (YouTube) rather than raw blobs inside the SQLite database, keeping SQLite database snapshots lightweight (< 10MB).
- **[Private / Incognito Browsing OPFS Restrictions]** → Fallback gracefully to in-memory SQLite with a visual banner alerting the user to export their database snapshot to save changes.
