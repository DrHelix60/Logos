# Design

## Context

See `proposal.md` for overall motivation. **Logos** is a domain-agnostic social media and database network for knowledge standardization, designed to operate with $0 server hosting costs on GitHub Pages or as an offline PWA.

The design strictly decouples:
1. **The Logos Platform**: Generic architecture for Schools of Thought (communities), Canons (curated database sets), Blueprints (structural schemas), and in-browser P2P database storage.
2. **The Flagship Tenant**: The author's **Biology School of Thought (`@ScienceXI`)**, implementing the author's Animal Species Blueprint and showcasing his specific scientific taxonomy and definitions for 4 pilot species.

The user interface reflects the `@ScienceXI` Figma design system:
- Palette: Sage-green (`#749B64`), forest accent (`#4A6541`), cream surfaces (`#F7F1E5` / `#EAE3D2`), and dark slate typography.
- Layout: Responsive Top Navigation, Breadcrumbs, Content Canvas, and Multi-tier Footer.

## Goals / Non-Goals

**Goals:**
- Deliver a responsive web application deployable directly to GitHub Pages (`output: 'export'`).
- Execute an in-browser SQLite database (via SQLite WASM) with OPFS or IndexedDB persistence.
- Provide a blueprint-driven entry rendering engine that maps structured records into standardized visual cards.
- Render the flagship Biology School of Thought (`@ScienceXI`), including Home, User Guide, Species Entry (Grey Wolf, Common Shrew, Pygmy Shrew, Mountain Shrew), and Sidebar Filters.
- Support "Pertenece a uno" (OR) and "Incluido en todos" (AND) category-level filter logic.
- Support audio vocalization playback, video embeds (e.g. YouTube shrew caravan), and client-side ZIP packaging of entry assets using JSZip.

**Non-Goals:**
- User authentication, crypto key generation, and anonymous review tokens (scheduled for Phase 2).
- Dynamic visual blueprint builder studio (scheduled for Phase 4).
- Peer-to-peer WebRTC live syncing mesh (Phase 2/3 - Phase 1 uses snapshot export/import).

## Decisions

### 1. Architectural Decoupling: Logos Core vs. Domain Tenants
- **Decision**: Structure the data schema and components so that Logos Core manages `schools_of_thought`, `canons`, `databases`, and `blueprints`, while entries are treated as blueprint-compliant records.
- **Rationale**: Ensures the platform is not hardcoded exclusively for biology, allowing future expansion into physics, engineering, or philosophy without architectural refactoring.

### 2. Client Framework: Next.js (Static Export) + Tailwind CSS
- **Decision**: Use React / Next.js configured with `output: 'export'` and Tailwind CSS.
- **Rationale**: Generates static HTML/JS/CSS that hosts free on GitHub Pages. Tailwind makes adapting the Figma `@ScienceXI` green design tokens, cards, and rounded containers clean and maintainable.

### 3. Embedded Database: In-Browser SQLite WASM + Persistence Layer
- **Decision**: Run SQLite WASM directly in the client browser with an IndexedDB / OPFS virtual file system.
- **Rationale**: Gives full relational SQL querying, zero server operational costs, complete offline capability, and portable `.sqlite` database snapshot export.

### 4. Client-Side Archive Packaging (JSZip)
- **Decision**: Use `jszip` and browser download triggers for the "Download All Files" feature.
- **Rationale**: Assembles all images, vector diagrams, and audio files for an entry into a ZIP file locally on the client device without sending requests to a backend archive server.

### 5. Data Seeding & Blueprint Structure
- **Decision**: Pre-seed the database with the Animal Species Blueprint and the 4 reference species from Figma (*Canis lupus*, *Sorex araneus*, *Sorex minutus*, *Sorex alpinus*).
- **Rationale**: Validates the blueprint rendering pipeline against real, high-detail scientific entries containing vocalizations, tracks, distribution maps, and the 0-100% Core Completion Metric.

## Risks / Trade-offs

- **[Browser Storage Limits]** → Large media files (videos) are embedded via streaming URLs (YouTube) rather than raw blobs inside the SQLite database, keeping SQLite database snapshots lightweight (< 10MB).
- **[Private / Incognito Browsing OPFS Restrictions]** → Fallback gracefully to in-memory SQLite with a visual banner alerting the user to export their database snapshot to save changes.
