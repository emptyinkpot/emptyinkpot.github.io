import crypto from "node:crypto";
import {
  getRuntimeDbPool,
  mysqlDate,
  toEpoch,
} from "@/lib/runtime-db";

const defaultSource = {
  id: "pinterest-saved-pins",
  sourceType: "pinterest_saved",
  provider:
    process.env.VISUAL_PINTEREST_PROVIDER ||
    (process.env.APIFY_PINTEREST_DATASET_ID || process.env.APIFY_PINTEREST_TASK_ID ? "apify_dataset" : "pinterest_api"),
  sourceUrl: "https://www.pinterest.com/emptyinkstand/_pins/",
  boardId: process.env.PINTEREST_BOARD_ID || "",
  title: "Pinterest Saved Pins",
  collectionTitle: "Pinterest / Saved Pins",
  partitionPattern: [6, 4, 9, 12],
  syncIntervalSeconds: 600,
};

const fallbackPalette = {
  dominant: "#6b2d5c",
  colors: ["#6b2d5c", "#c9a227", "#f5f1e8", "#2f5d50", "#1f1b18"],
};

export async function ensureDefaultVisualSources() {
  const db = await getRuntimeDbPool();
  const now = mysqlDate();
  await db.execute(
    `
      INSERT INTO visual_sources
        (id, source_type, provider, source_url, board_id, provider_config_json, title, collection_title, partition_pattern_json, sync_interval_seconds, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        source_type = VALUES(source_type),
        provider = VALUES(provider),
        source_url = VALUES(source_url),
        board_id = IF(VALUES(board_id) != '', VALUES(board_id), board_id),
        title = VALUES(title),
        collection_title = VALUES(collection_title),
        partition_pattern_json = VALUES(partition_pattern_json),
        sync_interval_seconds = VALUES(sync_interval_seconds),
        updated_at = VALUES(updated_at)
    `,
    [
      defaultSource.id,
      defaultSource.sourceType,
      defaultSource.provider,
      defaultSource.sourceUrl,
      defaultSource.boardId,
      defaultSource.title,
      defaultSource.collectionTitle,
      JSON.stringify(defaultSource.partitionPattern),
      defaultSource.syncIntervalSeconds,
      now,
      now,
    ],
  );
}

export async function readVisualSnapshot() {
  await ensureDefaultVisualSources();
  const db = await getRuntimeDbPool();
  const [sources] = await db.execute("SELECT * FROM visual_sources ORDER BY id ASC");
  const collections = [];
  const sourceReports = [];

  for (const source of sources) {
    const [pins] = await db.execute(
      `
        SELECT * FROM visual_pins
        WHERE source_id = ? AND deleted_at IS NULL
        ORDER BY position_index ASC, first_seen_at ASC
      `,
      [source.id],
    );
    const normalizedPins = pins.map(normalizePin);
    collections.push(...toPartitionCollections(source, normalizedPins));
    sourceReports.push(normalizeSource(source, normalizedPins.length));
  }

  return {
    version: 1,
    mode: "bookmark-mirror",
    downloaded: false,
    generatedAt: new Date().toISOString(),
    sources: sourceReports,
    collections,
  };
}

export async function syncVisualSource(sourceId = defaultSource.id) {
  await ensureDefaultVisualSources();
  const db = await getRuntimeDbPool();
  const [rows] = await db.execute("SELECT * FROM visual_sources WHERE id = ? LIMIT 1", [sourceId]);
  const source = rows[0];
  if (!source) {
    return { ok: false, error: `Unknown visual source: ${sourceId}`, status: 404 };
  }

  const runId = `visual-sync:${source.id}:${Date.now()}`;
  const startedAt = mysqlDate();
  await db.execute(
    "INSERT INTO visual_sync_runs (id, source_id, provider, status, started_at) VALUES (?, ?, ?, 'running', ?)",
    [runId, source.id, source.provider || "pinterest_api", startedAt],
  );
  await db.execute(
    "UPDATE visual_sources SET sync_status = 'running', last_error = NULL, updated_at = ? WHERE id = ?",
    [startedAt, source.id],
  );

  try {
    const pins = await fetchSourcePins(source);
    const now = mysqlDate();
    await upsertPins(db, source, pins, now);

    const activeIds = pins.map((pin) => pin.pinId);
    if (activeIds.length) {
      const placeholders = activeIds.map(() => "?").join(", ");
      await db.execute(
        `
          UPDATE visual_pins
          SET deleted_at = ?, last_seen_at = ?
          WHERE source_id = ? AND deleted_at IS NULL AND pin_id NOT IN (${placeholders})
        `,
        [now, now, source.id, ...activeIds],
      );
    }

    const snapshotHash = hashPins(pins);
    await db.execute(
      `
        UPDATE visual_sources
        SET last_cursor = NULL,
            last_synced_at = ?,
            sync_status = 'ok',
            pins_snapshot_hash = ?,
            last_error = NULL,
            updated_at = ?
        WHERE id = ?
      `,
      [now, snapshotHash, now, source.id],
    );
    await db.execute(
      `
        UPDATE visual_sync_runs
        SET status = 'ok', synced_items = ?, active_items = ?, snapshot_hash = ?, finished_at = ?
        WHERE id = ?
      `,
      [pins.length, pins.length, snapshotHash, now, runId],
    );

    return {
      ok: true,
      sourceId: source.id,
      syncedItems: pins.length,
      snapshotHash,
      downloaded: false,
    };
  } catch (error) {
    const now = mysqlDate();
    const message = error?.message || "Visual source sync failed.";
    await db.execute(
      "UPDATE visual_sources SET sync_status = 'error', last_error = ?, updated_at = ? WHERE id = ?",
      [message, now, source.id],
    );
    await db.execute(
      "UPDATE visual_sync_runs SET status = 'error', error = ?, finished_at = ? WHERE id = ?",
      [message, now, runId],
    );
    return { ok: false, sourceId: source.id, error: message, status: 502 };
  }
}

async function fetchSourcePins(source) {
  if (source.provider === "pinterest_api") return fetchPinterestPins(source);
  if (source.provider === "apify_dataset") return fetchApifyDatasetPins(source);
  throw new Error(`Unsupported visual source provider: ${source.provider}`);
}

async function fetchPinterestPins(source) {
  const token = process.env.PINTEREST_ACCESS_TOKEN || "";
  if (!token) {
    throw new Error("PINTEREST_ACCESS_TOKEN is not configured. Use an official Pinterest API token or switch provider.");
  }

  const boardId = source.board_id || process.env.PINTEREST_BOARD_ID || "";
  if (!boardId) {
    throw new Error("PINTEREST_BOARD_ID or visual_sources.board_id is required for official board pin sync.");
  }

  const output = [];
  let bookmark = "";
  let page = 0;
  do {
    const url = new URL(`https://api.pinterest.com/v5/boards/${encodeURIComponent(boardId)}/pins`);
    url.searchParams.set("page_size", "100");
    if (bookmark) url.searchParams.set("bookmark", bookmark);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(`Pinterest API ${response.status}: ${payload?.message || payload?.error || "request failed"}`);
    }

    const items = Array.isArray(payload.items) ? payload.items : [];
    for (const item of items) {
      const normalized = normalizePinterestPin(item, output.length);
      if (normalized) output.push(normalized);
    }
    bookmark = payload.bookmark || "";
    page += 1;
  } while (bookmark && page < 100);

  return output;
}

async function fetchApifyDatasetPins(source) {
  const token = process.env.APIFY_TOKEN || "";
  if (!token) {
    throw new Error("APIFY_TOKEN is not configured. Configure an Apify scheduled scraper dataset/task for saved-pin mirror sync.");
  }

  const config = parseProviderConfig(source.provider_config_json);
  const datasetId = config.datasetId || process.env.APIFY_PINTEREST_DATASET_ID || "";
  const taskId = config.taskId || process.env.APIFY_PINTEREST_TASK_ID || "";
  const actorTaskId = datasetId || (taskId ? await fetchApifyTaskDatasetId(taskId, token) : "");
  if (!actorTaskId) {
    throw new Error("APIFY_PINTEREST_DATASET_ID or APIFY_PINTEREST_TASK_ID is required for Apify Pinterest mirror sync.");
  }

  const output = [];
  const pageSize = 1000;
  let offset = 0;
  while (offset < 100000) {
    const url = new URL(`https://api.apify.com/v2/datasets/${encodeURIComponent(actorTaskId)}/items`);
    url.searchParams.set("token", token);
    url.searchParams.set("format", "json");
    url.searchParams.set("clean", "true");
    url.searchParams.set("limit", String(pageSize));
    url.searchParams.set("offset", String(offset));

    const response = await fetch(url);
    const items = await response.json().catch(() => []);
    if (!response.ok) {
      throw new Error(`Apify dataset ${response.status}: ${items?.error?.message || "request failed"}`);
    }
    if (!Array.isArray(items) || !items.length) break;
    for (const item of items) {
      const normalized = normalizeApifyPinterestPin(item, output.length);
      if (normalized) output.push(normalized);
    }
    if (items.length < pageSize) break;
    offset += pageSize;
  }

  return output;
}

async function fetchApifyTaskDatasetId(taskId, token) {
  const url = new URL(`https://api.apify.com/v2/actor-tasks/${encodeURIComponent(taskId)}/runs/last`);
  url.searchParams.set("token", token);
  url.searchParams.set("status", "SUCCEEDED");
  const response = await fetch(url);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Apify task ${response.status}: ${payload?.error?.message || "request failed"}`);
  }
  return payload?.data?.defaultDatasetId || "";
}

function normalizePinterestPin(pin, positionIndex) {
  const pinId = String(pin.id || "").trim();
  const previewUrl =
    pin.media?.images?.["600x"]?.url ||
    pin.media?.images?.["400x300"]?.url ||
    pin.media?.images?.["150x150"]?.url ||
    pin.media?.image_cover_url ||
    "";
  if (!pinId || !previewUrl) return null;
  return {
    pinId,
    pinUrl: pin.link || `https://www.pinterest.com/pin/${pinId}/`,
    imagePreviewUrl: previewUrl,
    title: pin.title || pin.alt_text || "Pinterest Pin",
    description: pin.description || "",
    boardId: pin.board_id || "",
    positionIndex,
    raw: pin,
  };
}

function normalizeApifyPinterestPin(item, positionIndex) {
  const rawUrl = item.pinUrl || item.url || item.link || item.sourceUrl || "";
  const pinId =
    String(item.id || item.pinId || "").trim() ||
    String(rawUrl).match(/\/pin\/([^/?#]+)/)?.[1] ||
    crypto.createHash("sha1").update(String(rawUrl || item.image || item.imageUrl || positionIndex)).digest("hex");
  const previewUrl =
    item.imagePreviewUrl ||
    item.imageUrl ||
    item.image ||
    item.images?.["600x"]?.url ||
    item.images?.orig?.url ||
    item.media?.images?.["600x"]?.url ||
    "";
  if (!pinId || !previewUrl) return null;
  return {
    pinId,
    pinUrl: rawUrl || `https://www.pinterest.com/pin/${pinId}/`,
    imagePreviewUrl: previewUrl,
    title: item.title || item.alt || item.altText || item.description || "Pinterest Pin",
    description: item.description || item.caption || "",
    boardId: item.boardId || item.board?.id || "",
    positionIndex,
    raw: item,
  };
}

function parseProviderConfig(value) {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function upsertPins(db, source, pins, now) {
  for (const pin of pins) {
    await db.execute(
      `
        INSERT INTO visual_pins
          (source_id, pin_id, pin_url, image_preview_url, title, description, board_id, position_index, downloaded, raw_json, first_seen_at, last_seen_at, deleted_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, NULL)
        ON DUPLICATE KEY UPDATE
          pin_url = VALUES(pin_url),
          image_preview_url = VALUES(image_preview_url),
          title = VALUES(title),
          description = VALUES(description),
          board_id = VALUES(board_id),
          position_index = VALUES(position_index),
          downloaded = 0,
          raw_json = VALUES(raw_json),
          last_seen_at = VALUES(last_seen_at),
          deleted_at = NULL
      `,
      [
        source.id,
        pin.pinId,
        pin.pinUrl,
        pin.imagePreviewUrl,
        pin.title,
        pin.description,
        pin.boardId,
        pin.positionIndex,
        JSON.stringify(pin.raw || {}),
        now,
        now,
      ],
    );
  }
}

function toPartitionCollections(source, pins) {
  const pattern = parsePattern(source.partition_pattern_json);
  const chunks = chunkByPattern(pins, pattern);
  return chunks.map((items, index) => ({
    id: `${source.id}-cluster-${index + 1}`,
    title: `${source.collection_title || source.title} · Cluster ${String(index + 1).padStart(2, "0")}`,
    source: "pinterest",
    sourceLabel: "PINTEREST MIRROR",
    summary: `${source.title} 当前镜像快照中的第 ${index + 1} 个视觉主题簇。`,
    mood: "Visual Bookmark Mirror",
    tags: ["pinterest", "visual reference", "mirror"],
    palette: fallbackPalette,
    coverImages: items.slice(0, 4).map((pin) => pin.image),
    images: items,
    cluster: `cluster-${index + 1}`,
    parentSourceId: source.id,
    partitionIndex: index,
    partitionSize: items.length,
    curationNote: `这个 collection 来自 ${source.title} 的镜像快照，是按 ${items.length} 张一组切出的视觉主题簇。系统只保存 Pinterest 预览图 URL、pin URL 和 metadata，不下载原图。`,
  }));
}

function chunkByPattern(items, pattern) {
  const chunks = [];
  let cursor = 0;
  let index = 0;
  while (cursor < items.length) {
    const size = Math.max(1, Number(pattern[index % pattern.length]) || 6);
    chunks.push(items.slice(cursor, cursor + size));
    cursor += size;
    index += 1;
  }
  return chunks;
}

function parsePattern(value) {
  const fallback = [6, 4, 9, 12];
  if (!value) return fallback;
  if (Array.isArray(value)) return value.length ? value : fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) && parsed.length ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function normalizePin(row) {
  return {
    id: `pin:${row.pin_id}`,
    title: row.title || "Pinterest Pin",
    image: row.image_preview_url,
    previewUrl: row.image_preview_url,
    type: "reference",
    source: "Pinterest",
    sourceUrl: row.pin_url,
    summary: row.description || row.title || "Pinterest mirrored pin",
    note: "由 Pinterest mirror sync 写入本地 DB 的收藏记录。当前阶段不下载原图，只保留平台预览图 URL、pin URL 和 metadata。",
    tags: ["pinterest", "visual reference"],
    palette: fallbackPalette,
    related: { visuals: [] },
  };
}

function normalizeSource(row, activeItems) {
  return {
    id: row.id,
    type: row.source_type,
    provider: row.provider,
    url: row.source_url,
    mode: "bookmark-mirror",
    downloaded: false,
    activeItems,
    syncStatus: row.sync_status,
    snapshotHash: row.pins_snapshot_hash || "",
    lastSyncedAt: row.last_synced_at ? toEpoch(row.last_synced_at) : null,
    lastError: row.last_error || "",
  };
}

function hashPins(pins) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(pins.map((pin) => [pin.pinId, pin.imagePreviewUrl, pin.positionIndex])))
    .digest("hex");
}
