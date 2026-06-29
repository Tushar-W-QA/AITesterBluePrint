import cron from "node-cron";
import { runPipeline } from "./pipeline";
export { getNextRun } from "./utils";

let scheduled = false;

export function startScheduler(): void {
  if (scheduled) return;
  scheduled = true;

  cron.schedule("0 9 * * *", async () => {
    console.log("[Scheduler] 09:00 trigger — running pipeline");
    await runPipeline();
  });

  console.log("[Scheduler] Cron scheduled for 09:00 daily");
}
