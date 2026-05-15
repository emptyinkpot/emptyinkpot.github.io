import { createCachedSourceResponse, createOpenListSourceProxyResponse, getCachedOpenListSource } from "@/lib/openlist-file-cache";
import { handleRouteError } from "@/lib/openlist-runtime";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const input = {
      path: searchParams.get("path") || "",
      modified: searchParams.get("modified") || "",
      size: searchParams.get("size") || "",
    };
    let source = await getCachedOpenListSource(input);
    if (!source) return createOpenListSourceProxyResponse(input, request);

    return createCachedSourceResponse(source, request);
  } catch (error) {
    return handleRouteError(error);
  }
}
