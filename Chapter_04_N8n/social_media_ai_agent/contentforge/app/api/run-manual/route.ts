import { NextResponse } from "next/server";
import { getPipelineState } from "@/lib/pipeline";
import { runPipelineWithTopic } from "@/lib/pipeline";

export async function POST(req: Request) {
  try {
    const body = await req.json() as { topic?: string };
    const topic = body.topic?.trim();
    if (!topic) {
      return NextResponse.json({ error: "topic is required" }, { status: 400 });
    }

    const state = getPipelineState();
    if (state.running) {
      return NextResponse.json({ error: "Pipeline is already running. Please wait." }, { status: 409 });
    }

    // Fire and forget — UI polls /api/status + /api/today for live updates
    runPipelineWithTopic(topic).catch(console.error);

    return NextResponse.json({ message: `Pipeline started for: "${topic}"`, topic });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
