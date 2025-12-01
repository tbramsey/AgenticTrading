import React, { useState, useEffect } from "react";
import { Treemap, Tooltip, ResponsiveContainer, Cell } from "recharts";
import SettingsButton from "@/components/settingsButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PortfolioItem {
  symbol: string;
  weight: number;
  description?: string;
}

interface NormalizedData {
  name: string;
  size: number;
  description: string;
}

const MOCK_PORTFOLIO: PortfolioItem[] = [
  { symbol: "AAPL", weight: 20, description: "Apple Inc." },
  { symbol: "MSFT", weight: 18, description: "Microsoft Corp." },
  { symbol: "GOOG", weight: 15, description: "Alphabet Inc." },
  { symbol: "AMZN", weight: 12, description: "Amazon.com Inc." },
  { symbol: "NVDA", weight: 10, description: "NVIDIA Corp." },
  { symbol: "JPM", weight: 8, description: "JPMorgan Chase" },
  { symbol: "UNH", weight: 7, description: "UnitedHealth Group" },
  { symbol: "XOM", weight: 5, description: "Exxon Mobil Corp." },
  { symbol: "HD", weight: 5, description: "Home Depot Inc." },
];

const PortfolioTreemap: React.FC = () => {
  const [data, setData] = useState(() => {
    const saved = sessionStorage.getItem("portfolioData");
    return saved ? JSON.parse(saved) : MOCK_PORTFOLIO;
  });
  const [diversification, setDiversification] = useState<number>(5);
  const [maxRisk, setMaxRisk] = useState<number>(50);
  const [sectors, setSectors] = useState<string[]>([
    "INDUSTRIALS",
    "HEALTHCARE",
    "TECHNOLOGY",
    "UTILITIES",
    "FINANCIAL SERVICES",
    "BASIC MATERIALS",
    "CONSUMER CYCLICAL",
    "REAL ESTATE",
    "COMMUNICATION SERVICES",
    "CONSUMER DEFENSIVE",
    "ENERGY"
  ]);

  const fetchPortfolio = async (div: number, risk: number, sectors: string[]) => {
    try {
      const res = await fetch(
         `http://127.0.0.1:5000/portfolio?diversification=${div}&max_risk=${risk}&sectors=${sectors.join(",")}`
      );
      const portfolio: PortfolioItem[] = await res.json();
      console.log("Params:", { div, risk, sectors });
      console.log("Fetched portfolio:", portfolio);
      if (Array.isArray(portfolio) && portfolio.length > 0) {
        setData(portfolio);
        sessionStorage.setItem("portfolioData", JSON.stringify(portfolio));
      } else {
        setData(MOCK_PORTFOLIO);
        sessionStorage.setItem("portfolioData", JSON.stringify(MOCK_PORTFOLIO));
      }

      window.dispatchEvent(new Event("portfolioUpdated"));
    } catch (err) {
      console.error("Error fetching portfolio:", err);
      setData(MOCK_PORTFOLIO);
      sessionStorage.setItem("portfolioData", JSON.stringify(MOCK_PORTFOLIO));

      window.dispatchEvent(new Event("portfolioUpdated"));
    }
  };

  useEffect(() => {
    if (data.length === 0) {
      fetchPortfolio(diversification, maxRisk, sectors);
    }
  }, []);

  const handleApply = (newDiver: number, newRisk: number, sectors: string[]) => {
    console.log("Applying new settings:", newDiver, newRisk, sectors);
    setDiversification(newDiver);
    setMaxRisk(newRisk);
    setSectors(sectors);
    fetchPortfolio(newDiver, newRisk, sectors);
  };

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card className="h-full w-full border-border/70 bg-card shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-border/70 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">Allocation treemap</CardTitle>
            <CardDescription>Waiting for portfolio data…</CardDescription>
          </div>
          <SettingsButton
            onApply={handleApply}
            defaultDiver={diversification}
            defaultRisk={maxRisk}
          />
        </CardHeader>
        <CardContent className="flex h-full items-center justify-center p-8 text-sm text-muted-foreground">
          No portfolio data available
        </CardContent>
      </Card>
    );
  }

  const normalizedInput: PortfolioItem[] = data.map((d: any) =>
    Array.isArray(d) && d.length >= 2
      ? { symbol: d[0], weight: d[1], description: d[2] }
      : d
  );

  const total = normalizedInput.reduce((acc, d) => acc + (Number(d.weight) || 0), 0);

  const normalizedData: NormalizedData[] = (total > 0
    ? normalizedInput
    : normalizedInput.map((d) => ({ ...d, weight: 1 })))
    .map((d) => ({
      name: d.symbol,
      size: ((Number(d.weight) || 0) / (total > 0 ? total : normalizedInput.length)) * 100,
      description: d.description || "",
    }));

  const getColor = (index: number) => {
    const golden = 137.50776405003785;
    const hue = Math.round((index * golden) % 360);
    return `hsl(${hue}, 65%, 55%)`;
  };

  return (
    <Card className="h-full w-full border-border/70 bg-card shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-border/70 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">Allocation treemap</CardTitle>
          <CardDescription>
            Visualizes holding weights with your current preferences.
          </CardDescription>
        </div>
        <SettingsButton
          onApply={handleApply}
          defaultDiver={diversification}
          defaultRisk={maxRisk}
        />
      </CardHeader>

      <CardContent className="h-full px-4 pb-6 pt-4">
        <div className="h-[420px] w-full min-h-[360px] rounded-xl border border-border/50 bg-muted/20 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={normalizedData}
              dataKey="size"
              stroke="hsl(var(--border))"
              ratio={4 / 3}
              isAnimationActive={false}
            >
              {normalizedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(index)} />
              ))}
              <Tooltip
                wrapperStyle={{ maxWidth: "460px" }}
                content={({ payload }) => {
                  if (payload && payload.length && payload[0].payload) {
                    const { name, size, description } = payload[0].payload as NormalizedData;
                    return (
                      <div className="rounded-lg border border-border/60 bg-popover px-3 py-2 text-xs shadow-md">
                        <div className="font-semibold text-foreground">{name}</div>
                        <div className="text-muted-foreground">Weight: {Number(size).toFixed(2)}%</div>
                        {description && (
                          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                            {description}
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioTreemap;
