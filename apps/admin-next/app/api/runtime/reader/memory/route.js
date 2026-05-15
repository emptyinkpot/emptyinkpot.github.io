import {
  databaseGatewayFetch,
  handleRuntimeDbError,
  readJson,
} from "@/lib/runtime-db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const upstream = new URLSearchParams();
    for (const key of ["objectId", "limit"]) {
      const value = searchParams.get(key);
      if (value) upstream.set(key, value);
    }
    const suffix = upstream.toString() ? `?${upstream.toString()}` : "";
    const body = await databaseGatewayFetch(`/myblog/runtime/reader/memory${suffix}`);
    return Response.json(body);
  } catch (error) {
    return handleRuntimeDbError(error);
  }
}

export async function POST(request) {
  try {
    const body = await readJson(request);
    const result = await databaseGatewayFetch("/myblog/runtime/reader/memory", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return Response.json(result);
  } catch (error) {
    return handleRuntimeDbError(error);
  }
}
