import { handleRouteError } from "@/lib/openlist-runtime";
import { rebuildOpenListIndex } from "@/lib/openlist-index";

export async function POST(request) {
  try {
    const body = await readOptionalJson(request);
    const result = await rebuildOpenListIndex(body);

    return Response.json({
      ok: true,
      path: result.path,
      generatedAt: result.index.generatedAt,
      roots: result.index.roots,
      maxDepth: result.index.maxDepth,
      maxFiles: result.index.maxFiles,
      stats: result.index.stats,
      errors: result.index.errors,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

async function readOptionalJson(request) {
  const text = await request.text();
  if (!text.trim()) return {};
  try {
    return JSON.parse(text);
  } catch {
    const error = new Error("request body must be valid JSON.");
    error.status = 400;
    throw error;
  }
}
