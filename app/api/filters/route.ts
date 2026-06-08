import { NextResponse } from "next/server";
import { getFilterOptions, markets } from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    markets,
    filters: getFilterOptions()
  });
}
