import { getCachedOpenListCover } from "@/lib/openlist-cover";
import { handleRouteError } from "@/lib/openlist-runtime";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cover = await getCachedOpenListCover({
      path: searchParams.get("path") || "",
      modified: searchParams.get("modified") || "",
      size: searchParams.get("size") || "",
    });

    if (!cover) {
      return Response.json(
        {
          ok: false,
          error: "No embedded cover was detected for this OpenList book.",
        },
        {
          status: 404,
          headers: {
            "cache-control": "private, max-age=300",
          },
        },
      );
    }

    return new Response(cover.body, {
      status: 200,
      headers: {
        "content-type": cover.contentType,
        "cache-control": "public, max-age=31536000, immutable",
        "x-openlist-cover-cache": cover.cacheStatus,
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
