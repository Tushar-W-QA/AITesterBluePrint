import { NextResponse } from "next/server";
import fs from "fs";
import { EXCEL_PATH } from "@/lib/excelManager";

export async function GET() {
  if (!fs.existsSync(EXCEL_PATH)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
  const buffer = fs.readFileSync(EXCEL_PATH);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="content_calendar.xlsx"`,
    },
  });
}
