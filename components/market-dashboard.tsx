"use client";

import Image from "next/image";
import { ArrowUpRight, ExternalLink, Mail, RefreshCw, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import type {
  CategoryCode,
  Dealer,
  FilterOption,
  Market,
  MarketCode,
  SearchResult,
  WatchModel
} from "@/lib/types";

interface MarketDashboardProps {
  initialData: SearchResult;
  markets: Market[];
  filters: FilterOption[];
}

const marketAll = "all";

export function MarketDashboard({ initialData, markets, filters }: MarketDashboardProps) {
  const [data, setData] = useState(initialData);
  const [query, setQuery] = useState("");
  const [market, setMarket] = useState<MarketCode | "all">("all");
  const [brand, setBrand] = useState("all");
  const [category, setCategory] = useState<CategoryCode | "all">("all");
  const [selectedWatchId, setSelectedWatchId] = useState(initialData.watches[0]?.id ?? "");
  const [isPending, startTransition] = useTransition();
  const [notice, setNotice] = useState("");

  const brandOptions = filters.filter((item) => item.kind === "brand");
  const categoryOptions = filters.filter((item) => item.kind === "category");
  const selectedWatch = data.watches.find((watch) => watch.id === selectedWatchId) ?? data.watches[0];
  const selectedDealers = getDealersForWatch(data, selectedWatch?.id);
  const selectedListing = selectedWatch
    ? data.listings.find((listing) => listing.watchId === selectedWatch.id)
    : undefined;
  const hasFilters = query || market !== "all" || brand !== "all" || category !== "all";

  const trendPath = useMemo(() => buildTrendPath(data.trend.map((point) => point.price)), [data.trend]);

  function updateSearch(next: {
    q?: string;
    market?: MarketCode | "all";
    brand?: string;
    category?: CategoryCode | "all";
  }) {
    const nextQuery = next.q ?? query;
    const nextMarket = next.market ?? market;
    const nextBrand = next.brand ?? brand;
    const nextCategory = next.category ?? category;

    setQuery(nextQuery);
    setMarket(nextMarket);
    setBrand(nextBrand);
    setCategory(nextCategory);
    setNotice("");

    startTransition(async () => {
      const params = new URLSearchParams({
        q: nextQuery,
        market: nextMarket,
        brand: nextBrand,
        category: nextCategory
      });
      const response = await fetch(`/api/search?${params.toString()}`);
      const result = (await response.json()) as SearchResult;
      setData(result);
      setSelectedWatchId(result.watches[0]?.id ?? "");
    });
  }

  function clearFilters() {
    updateSearch({ q: "", market: "all", brand: "all", category: "all" });
  }

  async function sendInquiry(dealer: Dealer) {
    if (!selectedWatch) {
      return;
    }

    await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        watchId: selectedWatch.id,
        dealerId: dealer.id,
        userContact: "visitor@chronoledger.local",
        message: `我想詢問 ${selectedWatch.brand} ${selectedWatch.model} 的二手行情與庫存。`
      })
    });
    setNotice("詢價已建立，可再前往錶商網站確認庫存。");
  }

  return (
    <div className="min-h-screen px-4 py-5 text-porcelain sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <header className="flex flex-col gap-4 border-b border-champagne/15 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-champagne/70">二手機械錶行情</p>
            <h1 className="mt-1 text-3xl font-semibold text-porcelain sm:text-4xl">ChronoLedger</h1>
          </div>
          <nav className="flex flex-wrap items-center gap-2 text-sm text-porcelain/66">
            {["行情", "錶商", "提醒", "收藏"].map((item) => (
              <a
                key={item}
                className="rounded-full border border-champagne/12 px-4 py-2 transition hover:border-gold/50 hover:text-champagne"
                href="#market"
              >
                {item}
              </a>
            ))}
          </nav>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]" id="market">
          <div className="luxury-panel rounded-lg p-4 sm:p-5">
            <div className="flex flex-col gap-3 xl:flex-row">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">搜尋</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-champagne/60" />
                <input
                  className="h-12 w-full rounded-md border border-champagne/14 bg-black/35 pl-11 pr-4 text-base text-porcelain placeholder:text-porcelain/42"
                  placeholder="搜尋品牌、型號或編號"
                  value={query}
                  onChange={(event) => updateSearch({ q: event.target.value })}
                />
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[520px]">
                <Select
                  label="市場"
                  value={market}
                  onChange={(value) => updateSearch({ market: value as MarketCode | "all" })}
                >
                  <option value={marketAll}>全部市場</option>
                  {markets.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.label}
                    </option>
                  ))}
                </Select>
                <Select label="品牌" value={brand} onChange={(value) => updateSearch({ brand: value })}>
                  <option value="all">全部品牌</option>
                  {brandOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </Select>
                <Select
                  label="產品類別"
                  value={category}
                  onChange={(value) => updateSearch({ category: value as CategoryCode | "all" })}
                >
                  <option value="all">全部類別</option>
                  {categoryOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-porcelain/58">
                <SlidersHorizontal className="h-4 w-4 text-gold" />
                <span>{isPending ? "更新篩選結果..." : `找到 ${data.summary.resultCount} 款二手錶`}</span>
              </div>
              {hasFilters ? (
                <button
                  className="inline-flex items-center gap-2 rounded-md border border-champagne/16 px-3 py-2 text-sm text-champagne transition hover:border-gold hover:bg-gold/10"
                  onClick={clearFilters}
                  type="button"
                >
                  <X className="h-4 w-4" />
                  清除篩選
                </button>
              ) : null}
            </div>
          </div>

          <div className="luxury-panel rounded-lg p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-porcelain/56">今日均價</p>
                <p className="mt-2 text-3xl font-semibold text-porcelain">
                  {formatMoney(data.summary.averagePrice, data.summary.currency)}
                </p>
              </div>
              <div className="rounded-md border border-gold/24 bg-gold/10 px-3 py-2 text-right">
                <p className="text-xs text-champagne/70">近 30 日</p>
                <p className={data.summary.deltaPercent >= 0 ? "text-gold" : "text-red-300"}>
                  {data.summary.deltaPercent >= 0 ? "+" : ""}
                  {data.summary.deltaPercent}%
                </p>
              </div>
            </div>
            <div className="mt-4 h-24 rounded-md border border-champagne/12 bg-black/28 p-3">
              <svg viewBox="0 0 320 72" className="h-full w-full" role="img" aria-label="近 30 日價格走勢">
                <path d="M0 56 H320" stroke="rgba(230,212,166,0.12)" />
                <path d="M0 32 H320" stroke="rgba(230,212,166,0.08)" />
                <path d={trendPath} fill="none" stroke="#c9a765" strokeLinecap="round" strokeWidth="3" />
              </svg>
            </div>
            <p className="mt-3 flex items-center gap-2 text-sm text-porcelain/52">
              <RefreshCw className="h-4 w-4 text-gold" />
              每日更新，最後更新 {data.summary.updatedAt}
            </p>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="luxury-panel rounded-lg p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">錶款結果</h2>
              <span className="text-sm text-porcelain/48">品牌名稱保留原文</span>
            </div>
            <div className="grid gap-3">
              {data.watches.length > 0 ? (
                data.watches.map((watch) => (
                  <WatchRow
                    key={watch.id}
                    active={watch.id === selectedWatch?.id}
                    market={market === "all" ? "HK" : market}
                    watch={watch}
                    onSelect={() => setSelectedWatchId(watch.id)}
                  />
                ))
              ) : (
                <div className="rounded-md border border-champagne/14 bg-black/25 p-8 text-center text-porcelain/62">
                  找不到符合條件的錶款，請調整品牌或產品類別。
                </div>
              )}
            </div>
          </div>

          <aside className="flex flex-col gap-5">
            <div className="luxury-panel overflow-hidden rounded-lg">
              <div className="relative aspect-[16/10] bg-black">
                <Image
                  alt="無商標高級機械錶"
                  className="object-cover"
                  fill
                  priority
                  src={selectedWatch?.image ?? "/images/watch-hero.png"}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
              </div>
              <div className="p-4 sm:p-5">
                <p className="text-sm text-champagne/70">{selectedWatch?.categoryLabel ?? "產品類別"}</p>
                <h2 className="mt-1 text-2xl font-semibold">
                  {selectedWatch ? `${selectedWatch.brand} ${selectedWatch.model}` : "選擇錶款"}
                </h2>
                <p className="mt-2 text-sm text-porcelain/58">編號 {selectedWatch?.reference ?? "-"}</p>
                <p className="mt-3 text-sm leading-6 text-porcelain/68">{selectedWatch?.summary}</p>
                {selectedListing ? (
                  <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                    <Info label="年份" value={`${selectedListing.year}`} />
                    <Info label="錶況" value={selectedListing.condition} />
                    <Info label="地區" value={selectedListing.country} />
                  </div>
                ) : null}
              </div>
            </div>

            <div className="luxury-panel rounded-lg p-4 sm:p-5">
              <h2 className="text-xl font-semibold">錶商聯絡</h2>
              <div className="mt-4 grid gap-3">
                {selectedDealers.length > 0 ? (
                  selectedDealers.map((dealer) => (
                    <div key={dealer.id} className="rounded-md border border-champagne/12 bg-black/25 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-porcelain">{dealer.name}</p>
                          <p className="mt-1 text-sm text-porcelain/52">
                            {dealer.location} · {dealer.verified ? "已驗證" : "未驗證"}
                          </p>
                        </div>
                        <span className="text-sm text-gold">{dealer.rating.toFixed(1)}</span>
                      </div>
                      <p className="mt-3 text-xs text-porcelain/44">來源：{dealer.source}</p>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <a
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-gold px-3 text-sm font-medium text-black transition hover:bg-champagne"
                          href={dealer.websiteUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <ExternalLink className="h-4 w-4" />
                          前往網站
                        </a>
                        <button
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-champagne/20 px-3 text-sm text-champagne transition hover:border-gold hover:bg-gold/10"
                          onClick={() => sendInquiry(dealer)}
                          type="button"
                        >
                          <Mail className="h-4 w-4" />
                          發送詢價
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-md border border-champagne/14 bg-black/25 p-6 text-sm text-porcelain/62">
                    目前沒有符合條件的錶商。
                  </div>
                )}
              </div>
              {notice ? <p className="mt-3 text-sm text-champagne">{notice}</p> : null}
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

function Select({
  children,
  label,
  onChange,
  value
}: {
  children: React.ReactNode;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-porcelain/48">{label}</span>
      <select
        className="h-12 w-full rounded-md border border-champagne/14 bg-black/35 px-3 text-sm text-porcelain"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {children}
      </select>
    </label>
  );
}

function WatchRow({
  active,
  market,
  onSelect,
  watch
}: {
  active: boolean;
  market: MarketCode;
  onSelect: () => void;
  watch: WatchModel;
}) {
  const stat = watch.marketStats.find((item) => item.market === market) ?? watch.marketStats[0];

  return (
    <button
      className={`grid gap-3 rounded-md border p-4 text-left transition sm:grid-cols-[1fr_150px_90px] sm:items-center ${
        active
          ? "border-gold/70 bg-gold/10"
          : "border-champagne/12 bg-black/22 hover:border-gold/38 hover:bg-gold/5"
      }`}
      onClick={onSelect}
      type="button"
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-porcelain">
            {watch.brand} {watch.model}
          </p>
          <span className="rounded border border-champagne/14 px-2 py-0.5 text-xs text-champagne/78">
            {watch.categoryLabel}
          </span>
        </div>
        <p className="mt-1 text-sm text-porcelain/50">編號 {watch.reference}</p>
      </div>
      <div>
        <p className="text-xs text-porcelain/42">今日均價</p>
        <p className="mt-1 font-semibold text-porcelain">{formatMoney(stat.averagePrice, stat.currency)}</p>
      </div>
      <div className={stat.deltaPercent >= 0 ? "text-gold" : "text-red-300"}>
        <span className="inline-flex items-center gap-1">
          <ArrowUpRight className="h-4 w-4" />
          {stat.deltaPercent >= 0 ? "+" : ""}
          {stat.deltaPercent}%
        </span>
      </div>
    </button>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-champagne/12 bg-black/25 p-3">
      <p className="text-xs text-porcelain/42">{label}</p>
      <p className="mt-1 text-sm text-porcelain">{value}</p>
    </div>
  );
}

function getDealersForWatch(data: SearchResult, watchId?: string) {
  if (!watchId) {
    return [];
  }

  const dealerIds = new Set(
    data.listings.filter((listing) => listing.watchId === watchId).map((listing) => listing.dealerId)
  );

  return data.dealers.filter((dealer) => dealerIds.has(dealer.id));
}

function buildTrendPath(values: number[]) {
  if (values.length === 0) {
    return "M 0 36";
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 320;
      const y = 62 - ((value - min) / range) * 52;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function formatMoney(value: number, currency: string) {
  if (value === 0) {
    return "-";
  }

  return new Intl.NumberFormat("zh-Hant", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value);
}
