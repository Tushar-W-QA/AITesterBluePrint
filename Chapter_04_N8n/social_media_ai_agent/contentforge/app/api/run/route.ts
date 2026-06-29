import { NextResponse } from "next/server";
import { runPipeline, getPipelineState } from "@/lib/pipeline";

export async function POST() {
  const state = getPipelineState();
  if (state.running) {
    return NextResponse.json({ message: "Pipeline already running", state }, { status: 409 });
  }
  runPipeline().catch(console.error);
  return NextResponse.json({ message: "Pipeline started", state: getPipelineState() });
}
