import { searchMarket, type SearchParams } from "@/lib/search";
import type { SearchResult } from "@/lib/types";

export interface MarketProvider {
  name: string;
  search(params: SearchParams): Promise<SearchResult>;
  updatePrices(): Promise<{ source: string; updated: number; updatedAt: string }>;
}

export const demoProvider: MarketProvider = {
  name: "demo-provider",
  async search(params) {
    return searchMarket(params);
  },
  async updatePrices() {
    return {
      source: "demo-provider",
      updated: 30,
      updatedAt: new Date().toISOString()
    };
  }
};

export function getMarketProvider(): MarketProvider {
  const hasWatchCharts = Boolean(process.env.WATCHCHARTS_API_KEY);
  const hasEbay = Boolean(process.env.EBAY_CLIENT_ID);

  if (!hasWatchCharts && !hasEbay) {
    return demoProvider;
  }

  // External adapters can be swapped in here without changing API contracts.
  return demoProvider;
}
