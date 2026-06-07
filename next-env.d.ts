import { NextRequest, NextResponse } from "next/server";
import { getWatchDetail } from "@/lib/search";
import type { MarketCode } from "@/lib/types";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = context.params;
  const market = (request.nextUrl.searchParams.get("market") as MarketCode | null) ?? "HK";
  const detail = getWatchDetail(id, market);

  if (!detail) {
    return NextResponse.json({ message: "找不到錶款" }, { status: 404 });
  }

  return NextResponse.json(detail);
}
