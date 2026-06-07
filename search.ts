import type {
  CategoryCode,
  Dealer,
  FilterOption,
  Listing,
  Market,
  MarketCode,
  PricePoint,
  WatchModel
} from "@/lib/types";

export const markets: Market[] = [
  { code: "CN", label: "中國", currency: "CNY", locale: "zh-CN" },
  { code: "JP", label: "日本", currency: "JPY", locale: "ja-JP" },
  { code: "HK", label: "香港", currency: "HKD", locale: "zh-HK" },
  { code: "EU", label: "歐洲", currency: "EUR", locale: "de-DE" },
  { code: "US", label: "美國", currency: "USD", locale: "en-US" }
];

export const categories: Record<CategoryCode, string> = {
  diver: "潛水錶",
  chronograph: "計時碼錶",
  dress: "正裝錶",
  gmt: "GMT/兩地時間",
  perpetual: "萬年曆",
  moonphase: "月相",
  pilot: "飛行錶",
  "steel-sport": "運動鋼錶",
  other: "其他"
};

export const watches: WatchModel[] = [
  {
    id: "submariner-124060",
    brand: "Rolex",
    model: "Submariner",
    reference: "124060",
    category: "diver",
    categoryLabel: categories.diver,
    image: "/images/watch-hero.png",
    summary: "經典無日期潛水錶，鋼款流通性高。",
    marketStats: [
      stat("CN", 93600, "CNY", 1.8),
      stat("JP", 2060000, "JPY", 0.7),
      stat("HK", 102500, "HKD", 1.1),
      stat("EU", 12200, "EUR", -0.4),
      stat("US", 13200, "USD", 0.5)
    ]
  },
  {
    id: "speedmaster-3861",
    brand: "Omega",
    model: "Speedmaster Moonwatch",
    reference: "310.30.42.50.01.002",
    category: "chronograph",
    categoryLabel: categories.chronograph,
    image: "/images/watch-hero.png",
    summary: "手上鍊計時碼錶，完整配件價格更穩。",
    marketStats: [
      stat("CN", 49200, "CNY", 0.4),
      stat("JP", 1060000, "JPY", -0.3),
      stat("HK", 54500, "HKD", 0.8),
      stat("EU", 6500, "EUR", 0.2),
      stat("US", 7100, "USD", 0.6)
    ]
  },
  {
    id: "nautilus-5711",
    brand: "Patek Philippe",
    model: "Nautilus",
    reference: "5711/1A",
    category: "steel-sport",
    categoryLabel: categories["steel-sport"],
    image: "/images/watch-hero.png",
    summary: "高端運動鋼錶代表，市場價差受配件與年份影響大。",
    marketStats: [
      stat("CN", 835000, "CNY", -1.2),
      stat("JP", 18100000, "JPY", -0.6),
      stat("HK", 912000, "HKD", -0.9),
      stat("EU", 107000, "EUR", -1.6),
      stat("US", 116000, "USD", -0.8)
    ]
  },
  {
    id: "royal-oak-15500",
    brand: "Audemars Piguet",
    model: "Royal Oak",
    reference: "15500ST",
    category: "steel-sport",
    categoryLabel: categories["steel-sport"],
    image: "/images/watch-hero.png",
    summary: "整合式鍊帶與八角錶圈，亞洲市場詢問度高。",
    marketStats: [
      stat("CN", 318000, "CNY", 0.9),
      stat("JP", 6900000, "JPY", 1.0),
      stat("HK", 346000, "HKD", 1.4),
      stat("EU", 40700, "EUR", 0.1),
      stat("US", 44200, "USD", 0.6)
    ]
  },
  {
    id: "tank-must-large",
    brand: "Cartier",
    model: "Tank Must Large",
    reference: "WSTA0053",
    category: "dress",
    categoryLabel: categories.dress,
    image: "/images/watch-hero.png",
    summary: "入門正裝方錶，尺寸與錶帶狀態決定成交速度。",
    marketStats: [
      stat("CN", 21200, "CNY", 0.2),
      stat("JP", 458000, "JPY", 0.5),
      stat("HK", 23300, "HKD", -0.2),
      stat("EU", 2780, "EUR", 0.1),
      stat("US", 3020, "USD", 0.3)
    ]
  },
  {
    id: "black-bay-gmt",
    brand: "Tudor",
    model: "Black Bay GMT",
    reference: "M79830RB",
    category: "gmt",
    categoryLabel: categories.gmt,
    image: "/images/watch-hero.png",
    summary: "兩地時間功能實用，旅行需求帶動穩定流通。",
    marketStats: [
      stat("CN", 23800, "CNY", 1.1),
      stat("JP", 515000, "JPY", 1.4),
      stat("HK", 26200, "HKD", 0.9),
      stat("EU", 3120, "EUR", 0.8),
      stat("US", 3380, "USD", 1.0)
    ]
  }
];

export const dealers: Dealer[] = [
  dealer("d-cn-01", "京時計社", "CN", "上海", "Chrono24 合作來源", "https://www.chrono24.com"),
  dealer("d-jp-01", "Tokyo Watch Gallery", "JP", "東京", "eBay Browse API", "https://www.ebay.com"),
  dealer("d-hk-01", "中環名錶行", "HK", "香港中環", "合作錶商", "https://www.chrono24.hk"),
  dealer("d-eu-01", "Milano Horology", "EU", "米蘭", "WatchCharts 來源", "https://watchcharts.com"),
  dealer("d-us-01", "West Coast Time", "US", "洛杉磯", "eBay Browse API", "https://www.ebay.com")
];

export const listings: Listing[] = watches.flatMap((watch, index) =>
  markets.map((market, marketIndex) => {
    const marketStat = watch.marketStats.find((item) => item.market === market.code);
    const dealerForMarket = dealers.find((item) => item.market === market.code) ?? dealers[0];

    return {
      id: `${watch.id}-${market.code}`,
      watchId: watch.id,
      dealerId: dealerForMarket.id,
      market: market.code,
      country: market.label,
      currency: market.currency,
      price: marketStat?.averagePrice ?? 0,
      year: 2019 + ((index + marketIndex) % 5),
      condition: ["良好", "未拋光", "附盒單", "近全新"][(index + marketIndex) % 4],
      externalUrl: dealerForMarket.websiteUrl
    };
  })
);

export function getFilterOptions(): FilterOption[] {
  const brandOptions = Array.from(new Set(watches.map((watch) => watch.brand)))
    .sort()
    .map((brand, index) => ({
      kind: "brand" as const,
      label: brand,
      value: brand,
      weight: index + 1
    }));

  const categoryOptions = Object.entries(categories).map(([value, label], index) => ({
    kind: "category" as const,
    label,
    value,
    weight: index + 1
  }));

  return [...brandOptions, ...categoryOptions];
}

export function getTrend(watchId: string, market: MarketCode): PricePoint[] {
  const watch = watches.find((item) => item.id === watchId) ?? watches[0];
  const statForMarket = watch.marketStats.find((item) => item.market === market) ?? watch.marketStats[0];
  const today = new Date("2026-06-07T00:00:00+08:00");

  return Array.from({ length: 30 }, (_, index) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (29 - index));
    const wave = Math.sin(index / 3) * 0.018 + (index - 15) * 0.0009;

    return {
      watchId,
      market,
      currency: statForMarket.currency,
      price: Math.round(statForMarket.averagePrice * (1 + wave)),
      source: "demo-provider",
      observedAt: day.toISOString()
    };
  });
}

function stat(market: MarketCode, averagePrice: number, currency: string, deltaPercent: number) {
  return {
    market,
    averagePrice,
    currency,
    deltaPercent,
    updatedAt: "2026-06-07"
  };
}

function dealer(
  id: string,
  name: string,
  market: MarketCode,
  location: string,
  source: string,
  websiteUrl: string
): Dealer {
  return {
    id,
    name,
    market,
    location,
    websiteUrl,
    contactUrl: `${websiteUrl}?inquiry=chronoledger`,
    source,
    rating: 4.6,
    verified: true
  };
}
