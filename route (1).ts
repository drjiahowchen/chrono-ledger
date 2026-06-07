import { MarketDashboard } from "@/components/market-dashboard";
import { getFilterOptions, markets } from "@/lib/data";
import { searchMarket } from "@/lib/search";

export default function Home() {
  const initialData = searchMarket({ market: "all", brand: "all", category: "all" });

  return (
    <main>
      <MarketDashboard
        initialData={initialData}
        markets={markets}
        filters={getFilterOptions()}
      />
    </main>
  );
}
