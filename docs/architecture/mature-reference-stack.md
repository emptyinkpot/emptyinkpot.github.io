# Mature Reference Stack

## Blog Runtime

- Quartz: mature knowledge-blog publishing model
- Astro content collections: static projection with strong build-time control
- Next.js App Router: dynamic admin/service layer

## Database Layer

- NocoDB: SQL database UI and API layer
- Directus: headless data platform
- Supabase: managed DB + auth + storage
- PocketBase: compact backend for smaller deployments

## Content and Storage Layer

- OpenList: public file projection and external storage access
- Quark Drive: cold archive / user-accessible blob backend
- Tencent COS: object storage backend

## Orchestration and Ops

- n8n: workflow automation
- LangGraph: durable agent graph execution
- OpenHands: workspace execution loop
- Langfuse: tracing
- Helicone: observability

## Recommended Adoption Order for MyBlog

1. Keep MyBlog blog UI as the primary surface.
2. Keep `apps/admin-next` as the only DB authority.
3. Use DB only for dynamic runtime state and operator data.
4. Add a dedicated API contract before adding more tables.
5. If a richer DB admin experience is needed, add NocoDB or Directus as a sidecar, not as the core.
