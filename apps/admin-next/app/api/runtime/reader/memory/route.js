import {
  getRuntimeDbPool,
  handleRuntimeDbError,
  mysqlDate,
  readJson,
  toEpoch,
} from "@/lib/runtime-db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const objectId = String(searchParams.get("objectId") || "").trim();
    const limit = Math.max(1, Math.min(50, Number(searchParams.get("limit") || 20)));
    const db = await getRuntimeDbPool();

    if (objectId) {
      const [rows] = await db.execute("SELECT * FROM reader_memory WHERE object_id = ? LIMIT 1", [objectId]);
      return Response.json({ ok: true, item: rows[0] ? normalizeMemory(rows[0]) : null });
    }

    const [rows] = await db.execute(
      `SELECT * FROM reader_memory ORDER BY last_read_at DESC LIMIT ${limit}`,
    );

    return Response.json({ ok: true, items: rows.map(normalizeMemory) });
  } catch (error) {
    return handleRuntimeDbError(error);
  }
}

export async function POST(request) {
  try {
    const body = await readJson(request);
    const objectId = String(body.objectId || body.id || "").trim();
    const objectTypeInput = String(body.objectType || body.type || "article").trim();
    const objectType = objectId.startsWith("book:") ? "book" : objectTypeInput;
    const title = String(body.title || "Untitled").trim();
    const href = String(body.href || "");
    const hasProgress = Object.prototype.hasOwnProperty.call(body, "progress")
      || Object.prototype.hasOwnProperty.call(body, "percent");
    const hasLocation = Object.prototype.hasOwnProperty.call(body, "location");
    const hasScrollTop = Object.prototype.hasOwnProperty.call(body, "scrollTop");
    const progress = hasProgress ? clamp01(Number(body.progress ?? body.percent ?? 0)) : 0;
    const scrollTop = hasScrollTop ? Math.max(0, Number(body.scrollTop || 0)) : 0;
    const now = mysqlDate(body.updatedAt || body.lastReadAt || Date.now());
    const locationJson = hasLocation && body.location != null ? JSON.stringify(body.location) : null;

    if (!objectId) {
      return Response.json({ ok: false, error: "objectId is required." }, { status: 400 });
    }

    const db = await getRuntimeDbPool();
    await db.execute(
      `
        INSERT INTO reader_memory
          (object_id, object_type, title, href, progress, location_json, scroll_top, last_read_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          object_type = VALUES(object_type),
          title = VALUES(title),
          href = VALUES(href),
          progress = IF(?, VALUES(progress), progress),
          location_json = IF(?, VALUES(location_json), location_json),
          scroll_top = IF(?, VALUES(scroll_top), scroll_top),
          last_read_at = VALUES(last_read_at),
          updated_at = VALUES(updated_at)
      `,
      [
        objectId,
        objectType,
        title,
        href,
        progress,
        locationJson,
        scrollTop,
        now,
        now,
        now,
        hasProgress ? 1 : 0,
        hasLocation ? 1 : 0,
        hasScrollTop ? 1 : 0,
      ],
    );

    const [rows] = await db.execute("SELECT * FROM reader_memory WHERE object_id = ? LIMIT 1", [objectId]);

    return Response.json({
      ok: true,
      item: rows[0] ? normalizeMemory(rows[0]) : null,
    });
  } catch (error) {
    return handleRuntimeDbError(error);
  }
}

function normalizeMemory(row) {
  return {
    id: row.object_id,
    objectId: row.object_id,
    objectType: row.object_type,
    title: row.title,
    href: row.href || "",
    progress: Number(row.progress || 0),
    location: parseJson(row.location_json),
    scrollTop: Number(row.scroll_top || 0),
    timestamp: toEpoch(row.created_at),
    lastReadAt: toEpoch(row.last_read_at),
    updatedAt: toEpoch(row.updated_at),
  };
}

function parseJson(value) {
  if (!value) return null;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function clamp01(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}
