# Spec Delta

## Purpose

Enables scientific community members and visitors to explore biological species entries, inspect comprehensive anatomical/ecological/ethological attributes according to the Animal Species Blueprint, and filter species with custom category-specific logic.

## ADDED Requirements

### Requirement: Navigation and Visual Brand
The system SHALL present the `@ScienceXI` sage-green visual identity, responsive navigation header, footer, Home overview, and User Guide explaining project concepts and terms.

#### Scenario: User navigates between Home and User Guide
- **WHEN** the user visits the root page or clicks "Home" or "User Guide"
- **THEN** the system displays the corresponding section with breadcrumbs and links back to the broader science and biology portals

### Requirement: Multi-Category Filtering with Configurable Logic
The system SHALL provide sidebar filters for Class, Size, Diet, Activity, Habitat, and Biome, allowing users to toggle category-specific matching mode between "Pertenece a uno" (OR) and "Incluido en todos" (AND).

#### Scenario: User filters species by multiple criteria
- **WHEN** the user selects "Mammals" under Class and selects "Herbivore" with "Pertenece a uno" logic
- **THEN** the species listing dynamically updates to show only entries satisfying the selected constraints

#### Scenario: User switches to strict multi-filter matching
- **WHEN** the user selects multiple habitats and chooses "Incluido en todos"
- **THEN** only species that inhabit all selected habitats are displayed

### Requirement: Comprehensive Species Entry Rendering
The system SHALL display species entries structured according to the Animal Species Blueprint, rendering basic taxonomy, nominate species references, metrics, ethology, ecology, anatomy, vocalizations, video embeds, and distribution maps.

#### Scenario: Viewing a species entry
- **WHEN** the user opens a species entry such as Grey Wolf or Common Shrew
- **THEN** the system displays the complete card sections including size dimensions, diet classification, activity cycle, vocalization player, scale illustrations, and distribution maps

### Requirement: Core Completion Metric Calculation
The system SHALL compute and display a 0-100% Core Completion Metric score on every species entry based on the presence of foundational, solidifying, contextual, and supplementary attributes.

#### Scenario: Metric display on entry page
- **WHEN** a species entry is rendered
- **THEN** the system displays the calculated Core Completion percentage badge reflecting the completeness of the entry's blueprint data
