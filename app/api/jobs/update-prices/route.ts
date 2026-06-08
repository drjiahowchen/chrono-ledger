import { NextResponse } from "next/server";
import { getMarketProvider } from "@/lib/providers/market-provider";

export async function POST() {
  const provider = getMarketProvider();
  const result = await provider.updatePrices();

  return NextResponse.json({
    message: "價格資料已更新",
    result
  });
}

export async function GET() {
  return POST();
}
