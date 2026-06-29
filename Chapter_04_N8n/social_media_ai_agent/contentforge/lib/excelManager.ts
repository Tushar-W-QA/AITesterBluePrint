import ExcelJS from "exceljs";
import path from "path";
import { Mutex } from "async-mutex";
import type { ContentRow, ContentStatus } from "./types";
import { EXCEL_COLUMNS } from "./types";
import fs from "fs";

const EXCEL_PATH = path.join(process.cwd(), "content_calendar.xlsx");
const mutex = new Mutex();

function rowToContent(row: ExcelJS.Row): ContentRow | null {
  const date = row.getCell(1).text?.trim();
  const topic = row.getCell(2).text?.trim();
  if (!date || !topic) return null;
  return {
    date,
    topic,
    linkedinPost: row.getCell(3).text || "",
    mediumArticle: row.getCell(4).text || "",
    igScript: row.getCell(5).text || "",
    ytScript: row.getCell(6).text || "",
    devtoArticle: row.getCell(7).text || "",
    status: (row.getCell(8).text || "Pending") as ContentStatus,
    linkedinImagePrompt: row.getCell(9).text || "",
    mediumImagePrompt: row.getCell(10).text || "",
    igImagePrompt: row.getCell(11).text || "",
    lastUpdated: row.getCell(12).text || "",
    errorMessage: row.getCell(13).text || "",
  };
}

async function ensureWorkbook(): Promise<ExcelJS.Workbook> {
  const wb = new ExcelJS.Workbook();
  if (!fs.existsSync(EXCEL_PATH)) {
    const ws = wb.addWorksheet("Content Calendar");
    ws.addRow(EXCEL_COLUMNS);
    ws.getRow(1).font = { bold: true };
    ws.columns = EXCEL_COLUMNS.map(() => ({ width: 30 }));
    await wb.xlsx.writeFile(EXCEL_PATH);
    return wb;
  }
  await wb.xlsx.readFile(EXCEL_PATH);
  return wb;
}

export async function getAllRows(): Promise<ContentRow[]> {
  return mutex.runExclusive(async () => {
    const wb = await ensureWorkbook();
    const ws = wb.getWorksheet(1)!;
    const rows: ContentRow[] = [];
    ws.eachRow((row, i) => {
      if (i === 1) return;
      const cr = rowToContent(row);
      if (cr) rows.push(cr);
    });
    return rows.reverse();
  });
}

export async function getTodayRow(): Promise<ContentRow | null> {
  const today = new Date().toISOString().split("T")[0];
  const rows = await getAllRows();
  return rows.find((r) => r.date === today) ?? null;
}

export async function upsertRow(data: Partial<ContentRow> & { date: string; topic: string }): Promise<void> {
  await mutex.runExclusive(async () => {
    const wb = await ensureWorkbook();
    const ws = wb.getWorksheet(1)!;
    let targetRowNum = -1;
    ws.eachRow((row, i) => {
      if (i === 1) return;
      if (row.getCell(1).text?.trim() === data.date) targetRowNum = i;
    });

    const now = new Date().toISOString();
    const values = [
      data.date,
      data.topic,
      data.linkedinPost ?? "",
      data.mediumArticle ?? "",
      data.igScript ?? "",
      data.ytScript ?? "",
      data.devtoArticle ?? "",
      data.status ?? "Pending",
      data.linkedinImagePrompt ?? "",
      data.mediumImagePrompt ?? "",
      data.igImagePrompt ?? "",
      now,
      data.errorMessage ?? "",
    ];

    if (targetRowNum > 0) {
      const row = ws.getRow(targetRowNum);
      values.forEach((v, i) => row.getCell(i + 1).value = v as string);
      row.commit();
    } else {
      ws.addRow(values);
    }

    await wb.xlsx.writeFile(EXCEL_PATH);
  });
}

export async function getExcelStats(): Promise<{ path: string; modified: string; rowCount: number }> {
  const stat = fs.existsSync(EXCEL_PATH) ? fs.statSync(EXCEL_PATH) : null;
  const rows = await getAllRows();
  return {
    path: EXCEL_PATH,
    modified: stat ? stat.mtime.toISOString() : "",
    rowCount: rows.length,
  };
}

export { EXCEL_PATH };
