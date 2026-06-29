import { google } from "googleapis";
import { JWT } from "google-auth-library";
import fs from "fs";
import path from "path";
import type { ContentRow } from "./types";

const CONFIGURED_SHEET_ID = process.env.GOOGLE_SHEET_ID ?? "";
const USER_EMAIL = process.env.GOOGLE_SHARE_EMAIL ?? "tusharwarad2929@gmail.com";
const CACHE_FILE = path.join(process.cwd(), ".sheets-id-cache");

const HEADERS = [
  "Date", "Topic", "LinkedIn POST", "Medium Article", "IG Script",
  "YT Script", "Dev.to Article", "Status", "LinkedIn Image Prompt",
  "Medium Image Prompt", "IG Image Prompt", "Last Updated", "Error Message",
];

// In-memory cache so multiple calls within one process don't re-fetch
let _resolvedSheetId: string | null = null;

function getAuth(): JWT | null {
  const json = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!json) return null;
  try {
    const creds = JSON.parse(json) as { client_email: string; private_key: string };
    return new JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
      ],
    });
  } catch (err) {
    console.error("[GoogleSheets] Failed to parse service account JSON:", err);
    return null;
  }
}

function rowToValues(r: ContentRow): string[] {
  return [
    r.date, r.topic,
    r.linkedinPost ?? "", r.mediumArticle ?? "", r.igScript ?? "",
    r.ytScript ?? "", r.devtoArticle ?? "", r.status,
    r.linkedinImagePrompt ?? "", r.mediumImagePrompt ?? "", r.igImagePrompt ?? "",
    r.lastUpdated ?? "", r.errorMessage ?? "",
  ];
}

/**
 * Resolves which sheet to use. Priority:
 * 1. In-memory cache (fastest)
 * 2. Disk cache file (.sheets-id-cache)
 * 3. Try GOOGLE_SHEET_ID from env (only if service account has access)
 * 4. Create a brand-new sheet, auto-share with USER_EMAIL, cache it
 */
async function resolveSheetId(auth: JWT): Promise<string> {
  if (_resolvedSheetId) return _resolvedSheetId;

  // Disk cache
  if (fs.existsSync(CACHE_FILE)) {
    const cached = fs.readFileSync(CACHE_FILE, "utf-8").trim();
    if (cached) {
      _resolvedSheetId = cached;
      console.log(`[GoogleSheets] Using cached sheet ID: ${cached}`);
      return cached;
    }
  }

  const sheets = google.sheets({ version: "v4", auth });
  const drive = google.drive({ version: "v3", auth });

  // Try configured sheet first
  if (CONFIGURED_SHEET_ID) {
    try {
      await sheets.spreadsheets.get({ spreadsheetId: CONFIGURED_SHEET_ID });
      _resolvedSheetId = CONFIGURED_SHEET_ID;
      fs.writeFileSync(CACHE_FILE, CONFIGURED_SHEET_ID);
      console.log(`[GoogleSheets] Using configured sheet: ${CONFIGURED_SHEET_ID}`);
      return CONFIGURED_SHEET_ID;
    } catch {
      console.log("[GoogleSheets] Configured sheet not accessible — creating a new one.");
    }
  }

  // Create a new sheet owned by the service account
  const created = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title: "ContentForge — Content Calendar" },
      sheets: [{
        properties: { title: "Content Calendar", gridProperties: { frozenRowCount: 1 } },
      }],
    },
  });

  const newId = created.data.spreadsheetId!;
  console.log(`[GoogleSheets] Created new sheet: ${newId}`);

  // Auto-share with user so they can open it in their browser
  await drive.permissions.create({
    fileId: newId,
    requestBody: { type: "user", role: "writer", emailAddress: USER_EMAIL },
    sendNotificationEmail: false,
  });
  console.log(`[GoogleSheets] Shared with ${USER_EMAIL}`);

  // Persist so future restarts reuse the same sheet
  fs.writeFileSync(CACHE_FILE, newId);
  _resolvedSheetId = newId;
  return newId;
}

async function ensureHeaders(auth: JWT, sheetId: string): Promise<void> {
  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "A1:M1",
  });

  if (res.data.values?.[0]?.[0] === "Date") return; // already set

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: "A1:M1",
    valueInputOption: "RAW",
    requestBody: { values: [HEADERS] },
  });

  // Bold + freeze header row, auto-resize columns
  const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const sid = meta.data.sheets?.[0]?.properties?.sheetId ?? 0;
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: {
      requests: [
        {
          repeatCell: {
            range: { sheetId: sid, startRowIndex: 0, endRowIndex: 1 },
            cell: {
              userEnteredFormat: {
                textFormat: { bold: true },
                backgroundColor: { red: 0.2, green: 0.2, blue: 0.2 },
              },
            },
            fields: "userEnteredFormat(textFormat,backgroundColor)",
          },
        },
        {
          autoResizeDimensions: {
            dimensions: { sheetId: sid, dimension: "COLUMNS", startIndex: 0, endIndex: 13 },
          },
        },
      ],
    },
  });
  console.log("[GoogleSheets] Headers written and formatted.");
}

export async function syncAllRowsToSheet(rows: ContentRow[]): Promise<{ sheetId: string; url: string }> {
  const auth = getAuth();
  if (!auth) throw new Error("Google Sheets credentials not configured.");

  const sheetId = await resolveSheetId(auth);
  await ensureHeaders(auth, sheetId);

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.clear({
    spreadsheetId: sheetId,
    range: "A2:M1000",
  });

  if (rows.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "A2",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: rows.map(rowToValues) },
    });
  }

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
  console.log(`[GoogleSheets] Synced ${rows.length} rows → ${url}`);
  return { sheetId, url };
}

export async function upsertRowToSheet(row: ContentRow): Promise<void> {
  const auth = getAuth();
  if (!auth) return;

  const sheetId = await resolveSheetId(auth);
  await ensureHeaders(auth, sheetId);

  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: "A:A" });
  const allDates = res.data.values ?? [];
  const rowIndex = allDates.findIndex((r) => r[0] === row.date);

  if (rowIndex > 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `A${rowIndex + 1}:M${rowIndex + 1}`,
      valueInputOption: "RAW",
      requestBody: { values: [rowToValues(row)] },
    });
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "A:A",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [rowToValues(row)] },
    });
  }
}

export function isSheetsConfigured(): boolean {
  return !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
}

export function getCachedSheetUrl(): string | null {
  if (_resolvedSheetId) return `https://docs.google.com/spreadsheets/d/${_resolvedSheetId}/edit`;
  if (fs.existsSync(CACHE_FILE)) {
    const id = fs.readFileSync(CACHE_FILE, "utf-8").trim();
    if (id) return `https://docs.google.com/spreadsheets/d/${id}/edit`;
  }
  return null;
}
