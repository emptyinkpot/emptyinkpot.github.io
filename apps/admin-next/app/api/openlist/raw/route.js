import { createCachedSourceResponse, getCachedOpenListSource } from "@/lib/openlist-file-cache";
import { handleRouteError } from "@/lib/openlist-runtime";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const source = await getCachedOpenListSource({
      path: searchParams.get("path") || "",
      modified: searchParams.get("modified") || "",
      size: searchParams.get("size") || "",
    });

    if (!source) {
      return Response.json(
        {
          ok: false,
          error: "OpenList source file is not cached. Run /api/openlist/files/prewarm after indexing.",
        },
        {
          status: 404,
          headers: {
            "cache-control": "private, max-age=60",
            "x-openlist-file-cache": "miss",
          },
        },
      );
    }

    return createCachedSourceResponse(source, request);
  } catch (error) {
    return handleRouteError(error);
  }
}
