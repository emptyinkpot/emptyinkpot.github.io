import { getOpenListFile, handleRouteError, resolveRawUrl } from "@/lib/openlist-runtime";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path") || "";
    const file = await getOpenListFile(path);
    const rawUrl = resolveRawUrl(file?.raw_url || "");

    if (!rawUrl) {
      return Response.json({ ok: false, error: "OpenList did not return raw_url." }, { status: 502 });
    }

    const upstream = await fetch(rawUrl, {
      headers: { accept: request.headers.get("accept") || "*/*" },
      cache: "no-store",
    });

    if (!upstream.ok || !upstream.body) {
      return Response.json({ ok: false, error: `OpenList raw_url HTTP ${upstream.status}` }, { status: upstream.status || 502 });
    }

    const headers = new Headers();
    const contentType = upstream.headers.get("content-type");
    const contentLength = upstream.headers.get("content-length");
    if (contentType) headers.set("content-type", contentType);
    if (contentLength) headers.set("content-length", contentLength);
    headers.set("cache-control", "private, max-age=300");

    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
