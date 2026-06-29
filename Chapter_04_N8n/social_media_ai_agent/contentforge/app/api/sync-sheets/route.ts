import { NextResponse } from "next/server";
import { getAllRows } from "@/lib/excelManager";
import { syncAllRowsToSheet, isSheetsConfigured } from "@/lib/googleSheetsManager";

export async function POST() {
  if (!isSheetsConfigured()) {
    return NextResponse.json(
      { error: "Google Sheets not configured. Add GOOGLE_SERVICE_ACCOUNT_JSON to .env.local." },
      { status: 400 }
    );
  }
  try {
    const rows = await getAllRows();
    const { sheetId, url } = await syncAllRowsToSheet(rows);
    return NextResponse.json({
      message: `Synced ${rows.length} rows to Google Sheets.`,
      count: rows.length,
      sheetId,
      url,
    });
  } catch (err) {
    console.error("[sync-sheets]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
