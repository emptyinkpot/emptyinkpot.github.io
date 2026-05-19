const databaseGatewayClientModulePath =
  "../../../../apps/admin-next/lib/database-gateway-client.mjs"

type DatabaseGatewayClient = {
  getDataBaseGatewayConfig: () => { baseUrl: string; apiKey: string }
  getMyBlogVisualSnapshot: () => Promise<unknown>
  hasDataBaseGatewayConfig: () => boolean
}

type VisualSnapshot = {
  version?: number
  mode?: string
  generatedAt?: string
  sources?: Array<{
    id?: string
    syncStatus?: string
  }>
  collections?: unknown[]
  pinsBySource?: Record<string, unknown[]>
}

export async function loadMyBlogDatabaseBridgeSummary() {
  const client = await loadDatabaseGatewayClient()
  const gateway = client.getDataBaseGatewayConfig()
  if (!client.hasDataBaseGatewayConfig()) {
    return {
      status: "disabled",
      adapter: "apps/admin-next/lib/database-gateway-client.mjs",
      gateway: { configured: false, baseUrl: "" },
    }
  }

  try {
    const snapshot = (await client.getMyBlogVisualSnapshot()) as VisualSnapshot
    return {
      status: "connected",
      adapter: "apps/admin-next/lib/database-gateway-client.mjs",
      gateway: { configured: true, baseUrl: gateway.baseUrl },
      snapshot: summarizeSnapshot(snapshot),
    }
  } catch (error) {
    return {
      status: "error",
      adapter: "apps/admin-next/lib/database-gateway-client.mjs",
      gateway: { configured: true, baseUrl: gateway.baseUrl },
      error: error instanceof Error ? error.message : String(error),
      code:
        typeof (error as { status?: number } | undefined)?.status === "number"
          ? (error as { status?: number }).status
          : null,
    }
  }
}

async function loadDatabaseGatewayClient() {
  return (await import(databaseGatewayClientModulePath)) as DatabaseGatewayClient
}

function summarizeSnapshot(snapshot: VisualSnapshot) {
  const sources = Array.isArray(snapshot?.sources) ? snapshot.sources : []
  const collections = Array.isArray(snapshot?.collections) ? snapshot.collections : []
  const pinsBySource = snapshot?.pinsBySource || {}
  const pinCount = Object.values(pinsBySource).reduce(
    (total, pins) => total + (Array.isArray(pins) ? pins.length : 0),
    0,
  )

  return {
    version: snapshot?.version ?? null,
    mode: snapshot?.mode ?? "",
    generatedAt: snapshot?.generatedAt ?? "",
    sourceCount: sources.length,
    collectionCount: collections.length,
    pinCount,
    sourceIds: sources.map((source) => source.id).filter(Boolean),
    syncStatusCounts: sources.reduce<Record<string, number>>((counts, source) => {
      const key = source?.syncStatus || "unknown"
      counts[key] = (counts[key] || 0) + 1
      return counts
    }, {}),
  }
}
