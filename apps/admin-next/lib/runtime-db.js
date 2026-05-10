import mysql from "mysql2/promise";

let pool;
let schemaReady;

export function getRuntimeDbConfig() {
  return {
    host: process.env.MYBLOG_DB_HOST || process.env.DB_HOST || "",
    port: Number(process.env.MYBLOG_DB_PORT || process.env.DB_PORT || 3306),
    user: process.env.MYBLOG_DB_USER || process.env.DB_USER || "",
    password: process.env.MYBLOG_DB_PASSWORD || process.env.DB_PASSWORD || "",
    database: process.env.MYBLOG_DB_NAME || process.env.DB_NAME || "myblog_runtime",
  };
}

export function hasRuntimeDbConfig() {
  const config = getRuntimeDbConfig();
  return Boolean(config.host && config.user && config.password && config.database);
}

export async function getRuntimeDbPool() {
  if (!hasRuntimeDbConfig()) {
    throw new Error("MyBlog runtime database is not configured.");
  }

  if (!pool) {
    const config = getRuntimeDbConfig();
    pool = mysql.createPool({
      ...config,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      connectTimeout: 15000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      charset: "utf8mb4",
    });
  }

  await ensureRuntimeSchema();
  return pool;
}

export async function ensureRuntimeSchema() {
  if (schemaReady) return schemaReady;

  schemaReady = (async () => {
    const db = pool;
    if (!db) throw new Error("Runtime database pool is not initialized.");

    await db.query(`
      CREATE TABLE IF NOT EXISTS reader_memory (
        object_id VARCHAR(191) PRIMARY KEY,
        object_type VARCHAR(32) NOT NULL,
        title TEXT NOT NULL,
        href TEXT NULL,
        progress DOUBLE NOT NULL DEFAULT 0,
        location_json JSON NULL,
        scroll_top INT NOT NULL DEFAULT 0,
        last_read_at DATETIME(3) NOT NULL,
        created_at DATETIME(3) NOT NULL,
        updated_at DATETIME(3) NOT NULL,
        INDEX idx_reader_memory_last_read_at (last_read_at),
        INDEX idx_reader_memory_type_last_read_at (object_type, last_read_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS reader_highlights (
        id VARCHAR(191) PRIMARY KEY,
        object_id VARCHAR(191) NOT NULL,
        object_type VARCHAR(32) NOT NULL,
        title TEXT NOT NULL,
        text TEXT NOT NULL,
        color VARCHAR(32) NOT NULL DEFAULT 'gold',
        note TEXT NULL,
        anchor_json JSON NULL,
        created_at DATETIME(3) NOT NULL,
        updated_at DATETIME(3) NOT NULL,
        INDEX idx_reader_highlights_object (object_id, updated_at),
        INDEX idx_reader_highlights_type_updated (object_type, updated_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS visual_sources (
        id VARCHAR(191) PRIMARY KEY,
        source_type VARCHAR(48) NOT NULL,
        provider VARCHAR(48) NOT NULL DEFAULT 'pinterest_api',
        source_url TEXT NOT NULL,
        board_id VARCHAR(191) NULL,
        provider_config_json JSON NULL,
        title TEXT NOT NULL,
        collection_title TEXT NOT NULL,
        partition_pattern_json JSON NULL,
        sync_interval_seconds INT NOT NULL DEFAULT 600,
        last_cursor TEXT NULL,
        last_synced_at DATETIME(3) NULL,
        sync_status VARCHAR(32) NOT NULL DEFAULT 'idle',
        pins_snapshot_hash VARCHAR(64) NULL,
        last_error TEXT NULL,
        created_at DATETIME(3) NOT NULL,
        updated_at DATETIME(3) NOT NULL,
        INDEX idx_visual_sources_status (sync_status),
        INDEX idx_visual_sources_synced (last_synced_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await ensureColumn(db, "visual_sources", "provider_config_json", "provider_config_json JSON NULL AFTER board_id");

    await db.query(`
      CREATE TABLE IF NOT EXISTS visual_pins (
        source_id VARCHAR(191) NOT NULL,
        pin_id VARCHAR(191) NOT NULL,
        pin_url TEXT NOT NULL,
        image_preview_url TEXT NOT NULL,
        title TEXT NULL,
        description TEXT NULL,
        board_id VARCHAR(191) NULL,
        position_index INT NOT NULL DEFAULT 0,
        downloaded TINYINT(1) NOT NULL DEFAULT 0,
        raw_json JSON NULL,
        first_seen_at DATETIME(3) NOT NULL,
        last_seen_at DATETIME(3) NOT NULL,
        deleted_at DATETIME(3) NULL,
        PRIMARY KEY (source_id, pin_id),
        INDEX idx_visual_pins_active (source_id, deleted_at, position_index),
        INDEX idx_visual_pins_seen (source_id, last_seen_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS visual_sync_runs (
        id VARCHAR(191) PRIMARY KEY,
        source_id VARCHAR(191) NOT NULL,
        provider VARCHAR(48) NOT NULL,
        status VARCHAR(32) NOT NULL,
        synced_items INT NOT NULL DEFAULT 0,
        active_items INT NOT NULL DEFAULT 0,
        snapshot_hash VARCHAR(64) NULL,
        error TEXT NULL,
        started_at DATETIME(3) NOT NULL,
        finished_at DATETIME(3) NULL,
        INDEX idx_visual_sync_runs_source_started (source_id, started_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);


    await db.query(`
      CREATE TABLE IF NOT EXISTS personal_secret_entries (
        id VARCHAR(191) PRIMARY KEY,
        namespace VARCHAR(96) NOT NULL DEFAULT 'default',
        label VARCHAR(191) NOT NULL,
        account VARCHAR(191) NULL,
        secret_type VARCHAR(48) NOT NULL DEFAULT 'password',
        secret_value LONGTEXT NOT NULL,
        url TEXT NULL,
        note TEXT NULL,
        tags_json JSON NULL,
        metadata_json JSON NULL,
        visibility VARCHAR(32) NOT NULL DEFAULT 'private',
        created_at DATETIME(3) NOT NULL,
        updated_at DATETIME(3) NOT NULL,
        last_used_at DATETIME(3) NULL,
        deleted_at DATETIME(3) NULL,
        INDEX idx_personal_secret_namespace (namespace, deleted_at, updated_at),
        INDEX idx_personal_secret_label (label),
        INDEX idx_personal_secret_type (secret_type, deleted_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  })();

  return schemaReady;
}

async function ensureColumn(db, table, column, definition) {
  const [rows] = await db.query(
    `
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?
      LIMIT 1
    `,
    [table, column],
  );
  if (!rows.length) {
    await db.query(`ALTER TABLE ${table} ADD COLUMN ${definition}`);
  }
}

export function mysqlDate(value = Date.now()) {
  const date = value instanceof Date ? value : new Date(Number(value) || Date.now());
  return date.toISOString().slice(0, 23).replace("T", " ");
}

export function toEpoch(value) {
  if (!value) return Date.now();
  const time = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isFinite(time) ? time : Date.now();
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export function handleRuntimeDbError(error) {
  const status = hasRuntimeDbConfig() ? 500 : 503;
  return Response.json(
    {
      ok: false,
      error: error?.message || "Runtime database request failed.",
    },
    { status },
  );
}
