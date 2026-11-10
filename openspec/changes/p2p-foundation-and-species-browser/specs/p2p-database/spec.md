# Spec Delta

## Purpose

Provides a zero-server, local-first database runtime executing SQLite WASM in the client browser, maintaining species records offline and supporting portable snapshot import/export.

## ADDED Requirements

### Requirement: Local-First In-Browser SQLite Runtime
The system SHALL run an embedded SQLite database engine entirely inside the client browser without requiring connection to a central paid database server.

#### Scenario: Initial database initialization
- **WHEN** the user loads the application for the first time
- **THEN** the system initializes the local SQLite database in browser storage and seeds it with default species data

### Requirement: Offline Data Persistence
The system SHALL persist database records across browser sessions using client-side Origin Private File System (OPFS) or IndexedDB backing.

#### Scenario: Reloading application preserves records
- **WHEN** the user closes or reloads the browser tab
- **THEN** previously stored entries and changes remain available locally without data loss

### Requirement: Database Snapshot Export and Import
The system SHALL allow users to export the local database state into a portable file and import database files created by peers.

#### Scenario: User exports local database bundle
- **WHEN** the user clicks "Export Database"
- **THEN** the system prompts download of the complete SQLite database snapshot file

#### Scenario: User imports peer database snapshot
- **WHEN** the user uploads a valid database snapshot file
- **THEN** the system verifies the schema and loads the species entries into the local database
