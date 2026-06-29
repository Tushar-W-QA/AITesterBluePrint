import { runAgent1, runAgent2, runAgent3 } from "./agents";
import { getTodayRow, getAllRows, upsertRow } from "./excelManager";
import { syncAllRowsToSheet, isSheetsConfigured } from "./googleSheetsManager";

export interface PipelineState {
  running: boolean;
  currentStep: string;
  lastRun: string | null;
  error: string | null;
  currentTopic: string | null;
}

const state: PipelineState = {
  running: false,
  currentStep: "idle",
  lastRun: null,
  error: null,
  currentTopic: null,
};

export function getPipelineState(): PipelineState {
  return { ...state };
}

async function sheetSync() {
  if (isSheetsConfigured()) {
    state.currentStep = "Syncing to Google Sheets";
    const allRows = await getAllRows();
    await syncAllRowsToSheet(allRows);
  }
}

/** Auto-scheduled / manual trigger — generates topic first, then content */
export async function runPipeline(): Promise<void> {
  if (state.running) {
    console.log("[Pipeline] Already running, skipping.");
    return;
  }

  state.running = true;
  state.error = null;
  console.log("[Pipeline] Starting auto pipeline...");

  try {
    state.currentStep = "Agent 1: Generating topic";
    const existing = await getTodayRow();
    let topic: string;
    if (existing?.topic) {
      topic = existing.topic;
      console.log(`[Pipeline] Reusing today's topic: ${topic}`);
    } else {
      topic = await runAgent1();
    }
    state.currentTopic = topic;

    state.currentStep = "Agent 2: Writing content";
    const row = await getTodayRow();
    if (!row?.linkedinPost) {
      await runAgent2(topic);
    } else {
      console.log("[Pipeline] Content already written, skipping Agent 2.");
    }

    state.currentStep = "Agent 3: Generating image prompts";
    const row2 = await getTodayRow();
    if (!row2?.mediumImagePrompt) {
      await runAgent3(topic);
    } else {
      console.log("[Pipeline] Image prompts done, skipping Agent 3.");
    }

    await sheetSync();

    state.currentStep = "Done";
    state.lastRun = new Date().toISOString();
    console.log("[Pipeline] Auto pipeline complete.");
  } catch (err) {
    state.error = err instanceof Error ? err.message : String(err);
    state.currentStep = "Error";
    console.error("[Pipeline] Error:", err);
  } finally {
    state.running = false;
  }
}

/** Manual trigger — uses the topic the user typed in the UI */
export async function runPipelineWithTopic(topic: string): Promise<void> {
  if (state.running) {
    console.log("[Pipeline] Already running, skipping.");
    return;
  }

  state.running = true;
  state.error = null;
  state.currentTopic = topic;
  console.log(`[Pipeline] Starting manual pipeline for: "${topic}"`);

  const today = new Date().toISOString().split("T")[0];

  try {
    // Write row with the user-supplied topic, mark Pending
    state.currentStep = "Saving topic";
    await upsertRow({ date: today, topic, status: "Pending" });

    state.currentStep = "Agent 2: Writing content";
    await runAgent2(topic);

    state.currentStep = "Agent 3: Generating image prompts";
    await runAgent3(topic);

    await sheetSync();

    state.currentStep = "Done";
    state.lastRun = new Date().toISOString();
    console.log(`[Pipeline] Manual pipeline complete for: "${topic}"`);
  } catch (err) {
    state.error = err instanceof Error ? err.message : String(err);
    state.currentStep = "Error";
    console.error("[Pipeline] Error:", err);
  } finally {
    state.running = false;
  }
}
