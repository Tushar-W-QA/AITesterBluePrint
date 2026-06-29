import { NextResponse } from "next/server";
import { getTodayRow } from "@/lib/excelManager";

export async function GET() {
  try {
    const row = await getTodayRow();
    return NextResponse.json({ row });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
