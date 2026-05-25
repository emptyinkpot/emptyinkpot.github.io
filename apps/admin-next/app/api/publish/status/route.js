import { readPublishState } from "@/lib/publish-runtime";

export async function GET() {
  return Response.json(readPublishState());
}
