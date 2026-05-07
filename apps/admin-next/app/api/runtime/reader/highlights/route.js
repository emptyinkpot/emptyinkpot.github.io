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
    const objectId = String(searchParams.get("objectId") || searchParams.get("articleId") || "").trim();
    const limit = Math.max(1, Math.min(200, Number(searchParams.get("limit") || 100)));
    const db = await getRuntimeDbPool();

    if (objectId) {
      const [rows] = await db.execute(
        `SELECT * FROM reader_highlights WHERE object_id = ? ORDER BY updated_at DESC LIMIT ${limit}`,
        [objectId],
      );
      return Response.json({ ok: true, items: rows.map(normalizeHighlight) });
    }

    const [rows] = await db.execute(
      `SELECT * FROM reader_highlights ORDER BY updated_at DESC LIMIT ${limit}`,
    );

    return Response.json({ ok: true, items: rows.map(normalizeHighlight) });
  } catch (error) {
    return handleRuntimeDbError(error);
  }
}

export async function POST(request) {
  try {
    const body = await readJson(request);
    const id = String(body.id || "").trim();
    const objectId = String(body.objectId || body.articleId || "").trim();
    const objectType = String(body.objectType || body.type || "article").trim();
    const title = String(body.title || "Untitled").trim();
    const text = String(body.text || "").trim();
    const color = String(body.color || "gold").trim();
    const note = body.note == null ? null : String(body.note);
    const now = mysqlDate(body.updatedAt || Date.now());
    const createdAt = mysqlDate(body.createdAt || body.updatedAt || Date.now());
    const anchorJson = body.anchor == null ? null : JSON.stringify(body.anchor);

    if (!id || !objectId || !text) {
      return Response.json({ ok: false, error: "id, objectId and text are required." }, { status: 400 });
    }

    const db = await getRuntimeDbPool();
    await db.execute(
      `
        INSERT INTO reader_highlights
          (id, object_id, object_type, title, text, color, note, anchor_json, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          object_id = VALUES(object_id),
          object_type = VALUES(object_type),
          title = VALUES(title),
          text = VALUES(text),
          color = VALUES(color),
          note = VALUES(note),
          anchor_json = VALUES(anchor_json),
          updated_at = VALUES(updated_at)
      `,
      [id, objectId, objectType, title, text, color, note, anchorJson, createdAt, now],
    );

    return Response.json({
      ok: true,
      item: {
        id,
        articleId: objectId,
        objectId,
        objectType,
        title,
        text,
        color,
        note: note || "",
        anchor: body.anchor ?? null,
        createdAt: toEpoch(createdAt),
        updatedAt: toEpoch(now),
      },
    });
  } catch (error) {
    return handleRuntimeDbError(error);
  }
}

function normalizeHighlight(row) {
  return {
    id: row.id,
    articleId: row.object_id,
    objectId: row.object_id,
    objectType: row.object_type,
    title: row.title,
    text: row.text,
    color: row.color || "gold",
    note: row.note || "",
    anchor: parseJson(row.anchor_json),
    createdAt: toEpoch(row.created_at),
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
