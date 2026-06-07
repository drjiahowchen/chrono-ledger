import { NextRequest, NextResponse } from "next/server";
import { dealers, listings } from "@/lib/data";
import type { MarketCode } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const market = searchParams.get("market") as MarketCode | "all" | null;
  const watchId = searchParams.get("watchId");

  const filtered = dealers.filter((dealer) => {
    const matchesMarket = !market || market === "all" || dealer.market === market;
    const matchesWatch =
      !watchId ||
      listings.some((listing) => listing.watchId === watchId && listing.dealerId === dealer.id);

    return matchesMarket && matchesWatch;
  });

  return NextResponse.json({ dealers: filtered });
}
