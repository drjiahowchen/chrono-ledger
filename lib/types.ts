export type MarketCode = "CN" | "JP" | "HK" | "EU" | "US";

export type CategoryCode =
  | "diver"
  | "chronograph"
  | "dress"
  | "gmt"
  | "perpetual"
  | "moonphase"
  | "pilot"
  | "steel-sport"
  | "other";

export type FilterKind = "brand" | "category";

export interface FilterOption {
  kind: FilterKind;
  label: string;
  value: string;
  weight: number;
}

export interface Market {
  code: MarketCode;
  label: string;
  currency: string;
  locale: string;
}

export interface PricePoint {
  watchId: string;
  market: MarketCode;
  currency: string;
  price: number;
  source: string;
  observedAt: string;
}

export interface WatchModel {
  id: string;
  brand: string;
  model: string;
  reference: string;
  category: CategoryCode;
  categoryLabel: string;
  image: string;
  summary: string;
  marketStats: {
    market: MarketCode;
    averagePrice: number;
    currency: string;
    deltaPercent: number;
    updatedAt: string;
  }[];
}

export interface Dealer {
  id: string;
  name: string;
  market: MarketCode;
  location: string;
  websiteUrl: string;
  contactUrl: string;
  source: string;
  rating: number;
  verified: boolean;
}

export interface Listing {
  id: string;
  watchId: string;
  dealerId: string;
  market: MarketCode;
  country: string;
  currency: string;
  price: number;
  year: number;
  condition: string;
  externalUrl: string;
}

export interface Inquiry {
  watchId: string;
  dealerId: string;
  userContact: string;
  message: string;
  createdAt: string;
}

export interface SearchResult {
  filters: {
    q: string;
    market: MarketCode | "all";
    brand: string;
    category: CategoryCode | "all";
  };
  summary: {
    averagePrice: number;
    currency: string;
    deltaPercent: number;
    resultCount: number;
    updatedAt: string;
  };
  trend: PricePoint[];
  watches: WatchModel[];
  listings: Listing[];
  dealers: Dealer[];
}
