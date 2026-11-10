# Spec Delta

## Purpose

Enables scientific researchers and visitors to download individual media files or package all visual, auditory, and cartographic assets of a species entry into a consolidated archive.

## ADDED Requirements

### Requirement: Single File Asset Download
The system SHALL provide immediate download actions for individual media assets attached to a species entry, including audio vocalizations, footprint tracks, scale illustrations, and distribution maps.

#### Scenario: Downloading a vocalization audio file
- **WHEN** the user clicks the download icon on a vocalization or map asset
- **THEN** the system triggers download of the specific asset file with its standard media filename

### Requirement: Bulk Entry Asset Packaging
The system SHALL generate and trigger download of a single ZIP archive containing all media files associated with a given species entry.

#### Scenario: Downloading all files for an entry
- **WHEN** the user clicks "Download All Files" on a species entry page
- **THEN** the system packages the entry's images, audio clips, and vector assets into a named ZIP archive and initiates browser download
