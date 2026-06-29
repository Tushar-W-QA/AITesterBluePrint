import { NextResponse } from "next/server";
import { getPipelineState } from "@/lib/pipeline";
import { getNextRun } from "@/lib/utils";
import { validateGroqKey } from "@/lib/agents";
import { isSheetsConfigured, getCachedSheetUrl } from "@/lib/googleSheetsManager";

export async function GET() {
  try {
    const [pipelineState, groqKeyValid] = await Promise.all([
      getPipelineState(),
      validateGroqKey(),
    ]);
    return NextResponse.json({
      ...pipelineState,
      groqKeyValid,
      nextRun: getNextRun(),
      sheetsConfigured: isSheetsConfigured(),
      sheetUrl: getCachedSheetUrl(),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
