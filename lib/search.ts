import { dealers, getTrend, listings, markets, watches } from "@/lib/data";
import type { CategoryCode, MarketCode, SearchResult, WatchModel } from "@/lib/types";

export interface SearchParams {
  q?: string;
  market?: MarketCode | "all";
  brand?: string;
  category?: CategoryCode | "all";
}

export function searchMarket(params: SearchParams): SearchResult {
  const q = (params.q ?? "").trim().toLowerCase();
  const market = params.market ?? "all";
  const brand = params.brand ?? "all";
  const category = params.category ?? "all";

  const filteredWatches = watches.filter((watch) => {
    const matchesQuery =
      q.length === 0 ||
      [watch.brand, watch.model, watch.reference, watch.categoryLabel]
        .join(" ")
        .toLowerCase()
        .includes(q);
    const matchesBrand = brand === "all" || watch.brand === brand;
    const matchesCategory = category === "all" || watch.category === category;

    return matchesQuery && matchesBrand && matchesCategory;
  });

  const selectedMarket = market === "all" ? "HK" : market;
  const filteredListings = listings.filter((listing) => {
    const hasWatch = filteredWatches.some((watch) => watch.id === listing.watchId);
    const matchesMarket = market === "all" || listing.market === market;
    return hasWatch && matchesMarket;
  });

  const filteredDealers = dealers.filter((dealer) => {
    const hasListing = filteredListings.some((listing) => listing.dealerId === dealer.id);
    const matchesMarket = market === "all" || dealer.market === market;
    return hasListing && matchesMarket;
  });

  const defaultWatch = filteredWatches[0] ?? watches[0];
  const summary = summarize(filteredWatches, selectedMarket);

  return {
    filters: {
      q,
      market,
      brand,
      category
    },
    summary: {
      ...summary,
      resultCount: filteredWatches.length,
      updatedAt: "2026-06-07"
    },
    trend: getTrend(defaultWatch.id, selectedMarket),
    watches: filteredWatches,
    listings: filteredListings,
    dealers: filteredDealers
  };
}

export function getWatchDetail(id: string, market: MarketCode = "HK") {
  const watch = watches.find((item) => item.id === id);

  if (!watch) {
    return null;
  }

  const relatedListings = listings.filter(
    (listing) => listing.watchId === watch.id && listing.market === market
  );
  const relatedDealers = dealers.filter((dealer) =>
    relatedListings.some((listing) => listing.dealerId === dealer.id)
  );

  return {
    watch,
    trend: getTrend(watch.id, market),
    listings: relatedListings,
    dealers: relatedDealers
  };
}

function summarize(items: WatchModel[], market: MarketCode) {
  const marketInfo = markets.find((item) => item.code === market) ?? markets[2];
  const stats = items
    .map((watch) => watch.marketStats.find((stat) => stat.market === market))
    .filter(Boolean);

  if (stats.length === 0) {
    return {
      averagePrice: 0,
      currency: marketInfo.currency,
      deltaPercent: 0
    };
  }

  return {
    averagePrice: Math.round(
      stats.reduce((total, stat) => total + (stat?.averagePrice ?? 0), 0) / stats.length
    ),
    currency: marketInfo.currency,
    deltaPercent:
      Math.round(
        (stats.reduce((total, stat) => total + (stat?.deltaPercent ?? 0), 0) / stats.length) * 10
      ) / 10
  };
}
