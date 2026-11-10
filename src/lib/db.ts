import initSqlJs, { Database, SqlJsStatic } from "sql.js";
import { Blueprint, DatabaseModel, SchoolOfThought, SpeciesEntry, UserProfile } from "@/types/database";
import { animalSpeciesBlueprint, initialDatabases, initialProfiles, initialSchoolOfThought, initialSpeciesEntries } from "./seed-data";

const STORAGE_KEY = "logos_sqlite_db_v1";

let SQLInstance: SqlJsStatic | null = null;
let dbInstance: Database | null = null;

export async function getSqlInstance(): Promise<SqlJsStatic> {
  if (SQLInstance) return SQLInstance;
  SQLInstance = await initSqlJs({
    locateFile: () => "/sql-wasm.wasm",
  });
  return SQLInstance;
}

export async function initDatabase(): Promise<Database> {
  if (dbInstance) return dbInstance;

  const SQL = await getSqlInstance();

  // Try loading saved database binary from localStorage/IndexedDB
  let savedData: Uint8Array | null = null;
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const binStr = atob(raw);
        const len = binStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binStr.charCodeAt(i);
        }
        savedData = bytes;
      } catch (e) {
        console.warn("Failed to load saved SQLite database, starting fresh:", e);
      }
    }
  }

  if (savedData) {
    dbInstance = new SQL.Database(savedData);
  } else {
    dbInstance = new SQL.Database();
    initSchemaAndSeed(dbInstance);
    saveDatabase(dbInstance);
  }

  return dbInstance;
}

function initSchemaAndSeed(db: Database) {
  // DDL
  db.run(`
    CREATE TABLE IF NOT EXISTS schools_of_thought (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      curator_role TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS databases (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      scope_description TEXT NOT NULL,
      default_blueprint_id TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS blueprints (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      version TEXT NOT NULL,
      domain TEXT NOT NULL,
      definition_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY,
      database_id TEXT NOT NULL,
      blueprint_id TEXT NOT NULL,
      common_name TEXT NOT NULL,
      scientific_name TEXT NOT NULL,
      status TEXT NOT NULL,
      author_id TEXT NOT NULL,
      is_boosted INTEGER NOT NULL,
      metric_score INTEGER NOT NULL,
      data_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_profiles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      reputation_score INTEGER NOT NULL,
      accepted_proposals INTEGER NOT NULL,
      total_proposals INTEGER NOT NULL,
      spotlight_tokens INTEGER NOT NULL
    );
  `);

  // Seed School
  const s = initialSchoolOfThought;
  db.run(`INSERT INTO schools_of_thought VALUES (?, ?, ?, ?)`, [s.id, s.name, s.description, s.curatorRole]);

  // Seed Databases
  for (const d of initialDatabases) {
    db.run(`INSERT INTO databases VALUES (?, ?, ?, ?)`, [d.id, d.name, d.scopeDescription, d.defaultBlueprintId]);
  }

  // Seed Blueprint
  const b = animalSpeciesBlueprint;
  db.run(`INSERT INTO blueprints VALUES (?, ?, ?, ?, ?)`, [b.id, b.name, b.version, b.domain, JSON.stringify(b)]);

  // Seed Profiles
  for (const p of initialProfiles) {
    db.run(
      `INSERT INTO user_profiles VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [p.id, p.name, p.role, p.reputationScore, p.acceptedProposals, p.totalProposals, p.spotlightTokens]
    );
  }

  // Seed Species Entries
  for (const e of initialSpeciesEntries) {
    db.run(
      `INSERT INTO entries VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        e.id,
        e.databaseId,
        e.blueprintId,
        e.commonName,
        e.scientificName,
        e.status,
        e.authorId,
        e.isBoosted ? 1 : 0,
        e.metricScore,
        JSON.stringify(e.data),
        e.createdAt,
        e.updatedAt,
      ]
    );
  }
}

export function saveDatabase(db: Database) {
  if (typeof window === "undefined") return;
  try {
    const data = db.export();
    let binary = "";
    const len = data.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(data[i]);
    }
    const base64 = btoa(binary);
    localStorage.setItem(STORAGE_KEY, base64);
  } catch (err) {
    console.error("Failed to save SQLite database to localStorage:", err);
  }
}

export async function exportDatabaseBinary(): Promise<Uint8Array> {
  const db = await initDatabase();
  return db.export();
}

export async function importDatabaseBinary(fileData: Uint8Array): Promise<void> {
  const SQL = await getSqlInstance();
  dbInstance = new SQL.Database(fileData);
  saveDatabase(dbInstance);
}

export async function resetDatabaseToSeed(): Promise<void> {
  const SQL = await getSqlInstance();
  dbInstance = new SQL.Database();
  initSchemaAndSeed(dbInstance);
  saveDatabase(dbInstance);
}

// Queries
export async function getAllEntries(): Promise<SpeciesEntry[]> {
  const db = await initDatabase();
  const res = db.exec("SELECT * FROM entries ORDER BY created_at DESC");
  if (!res.length) return [];

  const columns = res[0].columns;
  const values = res[0].values;

  return values.map((row) => {
    const entry: Record<string, unknown> = {};
    columns.forEach((col, idx) => {
      entry[col] = row[idx];
    });

    return {
      id: entry.id as string,
      databaseId: entry.database_id as string,
      blueprintId: entry.blueprint_id as string,
      commonName: entry.common_name as string,
      scientificName: entry.scientific_name as string,
      status: entry.status as "published" | "pending_review",
      authorId: entry.author_id as string,
      isBoosted: Boolean(entry.is_boosted),
      metricScore: Number(entry.metric_score),
      data: JSON.parse(entry.data_json as string),
      createdAt: entry.created_at as string,
      updatedAt: entry.updated_at as string,
    };
  });
}

export async function getEntryById(id: string): Promise<SpeciesEntry | null> {
  const db = await initDatabase();
  const stmt = db.prepare("SELECT * FROM entries WHERE id = ?");
  stmt.bind([id]);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return {
      id: row.id as string,
      databaseId: row.database_id as string,
      blueprintId: row.blueprint_id as string,
      commonName: row.common_name as string,
      scientificName: row.scientific_name as string,
      status: row.status as "published" | "pending_review",
      authorId: row.author_id as string,
      isBoosted: Boolean(row.is_boosted),
      metricScore: Number(row.metric_score),
      data: JSON.parse(row.data_json as string),
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }
  stmt.free();
  return null;
}

export async function insertEntry(entry: SpeciesEntry): Promise<void> {
  const db = await initDatabase();
  db.run(
    `INSERT OR REPLACE INTO entries VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      entry.id,
      entry.databaseId,
      entry.blueprintId,
      entry.commonName,
      entry.scientificName,
      entry.status,
      entry.authorId,
      entry.isBoosted ? 1 : 0,
      entry.metricScore,
      JSON.stringify(entry.data),
      entry.createdAt,
      entry.updatedAt,
    ]
  );
  saveDatabase(db);
}

export async function updateEntryStatus(id: string, status: "published" | "pending_review"): Promise<void> {
  const db = await initDatabase();
  db.run("UPDATE entries SET status = ?, updated_at = ? WHERE id = ?", [status, new Date().toISOString(), id]);
  saveDatabase(db);
}

export async function getAllDatabases(): Promise<DatabaseModel[]> {
  const db = await initDatabase();
  const res = db.exec("SELECT * FROM databases");
  if (!res.length) return [];
  return res[0].values.map((row) => ({
    id: row[0] as string,
    name: row[1] as string,
    scopeDescription: row[2] as string,
    defaultBlueprintId: row[3] as string,
  }));
}

export async function getAllBlueprints(): Promise<Blueprint[]> {
  const db = await initDatabase();
  const res = db.exec("SELECT * FROM blueprints");
  if (!res.length) return [];
  return res[0].values.map((row) => JSON.parse(row[4] as string));
}

export async function getAllProfiles(): Promise<UserProfile[]> {
  const db = await initDatabase();
  const res = db.exec("SELECT * FROM user_profiles");
  if (!res.length) return [];
  return res[0].values.map((row) => ({
    id: row[0] as string,
    name: row[1] as string,
    role: row[2] as "leader" | "member" | "visitor",
    reputationScore: Number(row[3]),
    acceptedProposals: Number(row[4]),
    totalProposals: Number(row[5]),
    spotlightTokens: Number(row[6]),
  }));
}

export async function updateUserProfile(profile: UserProfile): Promise<void> {
  const db = await initDatabase();
  db.run(
    `INSERT OR REPLACE INTO user_profiles VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      profile.id,
      profile.name,
      profile.role,
      profile.reputationScore,
      profile.acceptedProposals,
      profile.totalProposals,
      profile.spotlightTokens,
    ]
  );
  saveDatabase(db);
}
