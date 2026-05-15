export function getDataBaseGatewayConfig() {
  const baseUrl = process.env.MYBLOG_DATABASE_GATEWAY_URL || process.env.DATABASE_GATEWAY_URL || "";
  const apiKey = process.env.MYBLOG_DATABASE_GATEWAY_API_KEY || process.env.DATABASE_GATEWAY_API_KEY || "";
  return {
    baseUrl: baseUrl.replace(/\/+$/, ""),
    apiKey,
  };
}

export function hasDataBaseGatewayConfig() {
  const config = getDataBaseGatewayConfig();
  return Boolean(config.baseUrl);
}

export async function databaseGatewayFetch(path, options = {}) {
  const config = getDataBaseGatewayConfig();
  if (!config.baseUrl) {
    throw new Error("MYBLOG_DATABASE_GATEWAY_URL is not configured.");
  }

  const headers = new Headers(options.headers || {});
  if (config.apiKey && !headers.has("X-DataBase-Api-Key")) {
    headers.set("X-DataBase-Api-Key", config.apiKey);
  }

  const hasBody = options.body != null;
  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${config.baseUrl}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });
  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!response.ok) {
    const message = body?.message || body?.error || `DataBase Gateway request failed: ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body;
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export function handleRuntimeDbError(error) {
  const status = hasDataBaseGatewayConfig() ? error?.status || 500 : 503;
  return Response.json(
    {
      ok: false,
      error: error?.message || "DataBase Gateway runtime request failed.",
    },
    { status },
  );
}
