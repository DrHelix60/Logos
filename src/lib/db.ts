import initSqlJs, { Database, SqlJsStatic } from "sql.js";
import { Blueprint, Community, DatabaseModel, DynamicEntry, UserProfile, UserRole } from "@/types/database";
import { initialProfiles } from "./seed-data";

const STORAGE_KEY = "logos_sqlite_db_v2_empty";

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
    initSchema(dbInstance);
    saveDatabase(dbInstance);
  }

  return dbInstance;
}

function initSchema(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS communities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      discipline TEXT NOT NULL,
      scope_principles TEXT NOT NULL,
      creator_id TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS databases (
      id TEXT PRIMARY KEY,
      community_id TEXT NOT NULL,
      name TEXT NOT NULL,
      scope_description TEXT NOT NULL,
      blueprint_id TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS blueprints (
      id TEXT PRIMARY KEY,
      community_id TEXT NOT NULL,
      name TEXT NOT NULL,
      version TEXT NOT NULL,
      domain TEXT NOT NULL,
      sections_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY,
      database_id TEXT NOT NULL,
      community_id TEXT NOT NULL,
      blueprint_id TEXT NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT,
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
      full_name TEXT NOT NULL,
      display_name TEXT NOT NULL,
      role TEXT NOT NULL,
      reputation_score INTEGER NOT NULL,
      accepted_proposals INTEGER NOT NULL,
      total_proposals INTEGER NOT NULL,
      spotlight_tokens INTEGER NOT NULL
    );
  `);

  // Pre-seed ONLY the founder account
  for (const p of initialProfiles) {
    db.run(
      `INSERT OR REPLACE INTO user_profiles VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [p.id, p.fullName, p.displayName, p.role, p.reputationScore, p.acceptedProposals, p.totalProposals, p.spotlightTokens]
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
    console.error("Failed to save SQLite database:", err);
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

export async function resetDatabaseToClean(): Promise<void> {
  const SQL = await getSqlInstance();
  dbInstance = new SQL.Database();
  initSchema(dbInstance);
  saveDatabase(dbInstance);
}

// --- Communities ---
export async function getAllCommunities(): Promise<Community[]> {
  const db = await initDatabase();
  const res = db.exec("SELECT * FROM communities ORDER BY created_at DESC");
  if (!res.length) return [];
  return res[0].values.map((row) => ({
    id: row[0] as string,
    name: row[1] as string,
    discipline: row[2] as string,
    scopePrinciples: row[3] as string,
    creatorId: row[4] as string,
    createdAt: row[5] as string,
  }));
}

export async function insertCommunity(comm: Community): Promise<void> {
  const db = await initDatabase();
  db.run(
    `INSERT OR REPLACE INTO communities VALUES (?, ?, ?, ?, ?, ?)`,
    [comm.id, comm.name, comm.discipline, comm.scopePrinciples, comm.creatorId, comm.createdAt]
  );
  saveDatabase(db);
}

// --- Databases ---
export async function getDatabasesByCommunity(communityId: string): Promise<DatabaseModel[]> {
  const db = await initDatabase();
  const stmt = db.prepare("SELECT * FROM databases WHERE community_id = ? ORDER BY created_at DESC");
  stmt.bind([communityId]);
  const results: DatabaseModel[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    results.push({
      id: row.id as string,
      communityId: row.community_id as string,
      name: row.name as string,
      scopeDescription: row.scope_description as string,
      blueprintId: row.blueprint_id as string,
      createdAt: row.created_at as string,
    });
  }
  stmt.free();
  return results;
}

export async function insertDatabase(database: DatabaseModel): Promise<void> {
  const db = await initDatabase();
  db.run(
    `INSERT OR REPLACE INTO databases VALUES (?, ?, ?, ?, ?, ?)`,
    [database.id, database.communityId, database.name, database.scopeDescription, database.blueprintId, database.createdAt]
  );
  saveDatabase(db);
}

// --- Blueprints ---
export async function getBlueprintsByCommunity(communityId: string): Promise<Blueprint[]> {
  const db = await initDatabase();
  const stmt = db.prepare("SELECT * FROM blueprints WHERE community_id = ? ORDER BY created_at DESC");
  stmt.bind([communityId]);
  const results: Blueprint[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    results.push({
      id: row.id as string,
      communityId: row.community_id as string,
      name: row.name as string,
      version: row.version as string,
      domain: row.domain as string,
      sections: JSON.parse(row.sections_json as string),
      createdAt: row.created_at as string,
    });
  }
  stmt.free();
  return results;
}

export async function insertBlueprint(bp: Blueprint): Promise<void> {
  const db = await initDatabase();
  db.run(
    `INSERT OR REPLACE INTO blueprints VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [bp.id, bp.communityId, bp.name, bp.version, bp.domain, JSON.stringify(bp.sections), bp.createdAt]
  );
  saveDatabase(db);
}

// --- Entries ---
export async function getEntriesByDatabase(databaseId: string): Promise<DynamicEntry[]> {
  const db = await initDatabase();
  const stmt = db.prepare("SELECT * FROM entries WHERE database_id = ? ORDER BY created_at DESC");
  stmt.bind([databaseId]);
  const results: DynamicEntry[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    results.push({
      id: row.id as string,
      databaseId: row.database_id as string,
      communityId: row.community_id as string,
      blueprintId: row.blueprint_id as string,
      title: row.title as string,
      subtitle: (row.subtitle as string) || undefined,
      status: row.status as "published" | "pending_review",
      authorId: row.author_id as string,
      isBoosted: Boolean(row.is_boosted),
      metricScore: Number(row.metric_score),
      data: JSON.parse(row.data_json as string),
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    });
  }
  stmt.free();
  return results;
}

export async function insertEntry(entry: DynamicEntry): Promise<void> {
  const db = await initDatabase();
  db.run(
    `INSERT OR REPLACE INTO entries VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      entry.id,
      entry.databaseId,
      entry.communityId,
      entry.blueprintId,
      entry.title,
      entry.subtitle || "",
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

// --- All Databases ---
export async function getAllDatabases(): Promise<DatabaseModel[]> {
  const db = await initDatabase();
  const res = db.exec("SELECT * FROM databases ORDER BY created_at DESC");
  if (!res.length) return [];
  return res[0].values.map((row) => ({
    id: row[0] as string,
    communityId: row[1] as string,
    name: row[2] as string,
    scopeDescription: row[3] as string,
    blueprintId: row[4] as string,
    createdAt: row[5] as string,
  }));
}

// --- All Blueprints ---
export async function getAllBlueprints(): Promise<Blueprint[]> {
  const db = await initDatabase();
  const res = db.exec("SELECT * FROM blueprints ORDER BY created_at DESC");
  if (!res.length) return [];
  return res[0].values.map((row) => ({
    id: row[0] as string,
    communityId: row[1] as string,
    name: row[2] as string,
    version: row[3] as string,
    domain: row[4] as string,
    sections: JSON.parse(row[5] as string),
    createdAt: row[6] as string,
  }));
}

// --- All Entries ---
export async function getAllEntries(): Promise<DynamicEntry[]> {
  const db = await initDatabase();
  const res = db.exec("SELECT * FROM entries ORDER BY created_at DESC");
  if (!res.length) return [];
  return res[0].values.map((row) => ({
    id: row[0] as string,
    databaseId: row[1] as string,
    communityId: row[2] as string,
    blueprintId: row[3] as string,
    title: row[4] as string,
    subtitle: (row[5] as string) || undefined,
    status: row[6] as "published" | "pending_review",
    authorId: row[7] as string,
    isBoosted: Boolean(row[8]),
    metricScore: Number(row[9]),
    data: JSON.parse(row[10] as string),
    createdAt: row[11] as string,
    updatedAt: row[12] as string,
  }));
}

// --- Profiles ---
export async function getAllProfiles(): Promise<UserProfile[]> {
  const db = await initDatabase();
  const res = db.exec("SELECT * FROM user_profiles");
  if (!res.length) return [];
  return res[0].values.map((row) => ({
    id: row[0] as string,
    fullName: row[1] as string,
    displayName: row[2] as string,
    role: row[3] as UserRole,
    reputationScore: Number(row[4]),
    acceptedProposals: Number(row[5]),
    totalProposals: Number(row[6]),
    spotlightTokens: Number(row[7]),
  }));
}
