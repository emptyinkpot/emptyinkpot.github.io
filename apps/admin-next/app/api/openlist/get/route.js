import { getOpenListFile, handleRouteError, publicFileInfo, readJson } from "@/lib/openlist-runtime";

export async function POST(request) {
  try {
    const body = await readJson(request);
    const path = String(body.path || "");
    const file = await getOpenListFile(path);

    return Response.json({
      ok: true,
      file: publicFileInfo(file, path),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
