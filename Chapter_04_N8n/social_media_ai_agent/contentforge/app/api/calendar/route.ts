import { NextResponse } from "next/server";
import { getAllRows } from "@/lib/excelManager";

export async function GET() {
  try {
    const rows = await getAllRows();
    return NextResponse.json({ rows });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
