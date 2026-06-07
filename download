import { NextRequest, NextResponse } from "next/server";
import { getMarketProvider } from "@/lib/providers/market-provider";
import type { CategoryCode, MarketCode } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const provider = getMarketProvider();

  const result = await provider.search({
    q: searchParams.get("q") ?? "",
    market: ((searchParams.get("market") as MarketCode | "all" | null) ?? "all"),
    brand: searchParams.get("brand") ?? "all",
    category: ((searchParams.get("category") as CategoryCode | "all" | null) ?? "all")
  });

  return NextResponse.json(result);
}
