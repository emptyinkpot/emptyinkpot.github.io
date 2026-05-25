import { runPublishAction } from "@/lib/publish-runtime";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const result = await runPublishAction("rollback", body);
  return Response.json(result, { status: result.ok ? 200 : 500 });
}
