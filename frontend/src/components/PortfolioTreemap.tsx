import React, { useState, useEffect } from "react";
import { Treemap, Tooltip, ResponsiveContainer, Cell } from "recharts";
import SettingsButton from "./SettingsButton";

interface PortfolioTreemapProps {
  showChart?: boolean;
}

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

const PortfolioTreemap: React.FC<PortfolioTreemapProps> = ({ showChart = false }) => {
  const [data, setData] = useState<PortfolioItem[]>([]);
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
      setData(portfolio);
      window.dispatchEvent(new Event("portfolioUpdated"));


      try {
        window.dispatchEvent(new Event("portfolioUpdated"));
      } catch {
        // ignore in environments without window
      }
    } catch (err) {
      console.error("Error fetching portfolio:", err);
    }
  };

  useEffect(() => {
    fetchPortfolio(diversification, maxRisk, sectors);
  }, []);

  const handleApply = (newDiver: number, newRisk: number, sectors: string[]) => {
    setDiversification(newDiver);
    setMaxRisk(newRisk);
    setSectors(sectors);
    fetchPortfolio(newDiver, newRisk, sectors);
  };

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ position: "relative", width: "100%", height: "10%" }}>
          <SettingsButton
            onApply={handleApply}
            defaultDiver={diversification}
            defaultRisk={maxRisk}
          />
        </div>
        No portfolio data available
      </div>
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
    <div style={{ width: "600px", height: "300px", border: "none", margin: 0, padding: 0 }}>
      <div style={{ position: "relative", width: "100%", height: "10%" }}>
        <SettingsButton
          onApply={handleApply}
          defaultDiver={diversification}
          defaultRisk={maxRisk}
        />
      </div>

      <ResponsiveContainer width="100%" height="90%">
        <Treemap
          data={normalizedData}
          dataKey="size"
          stroke="#fff"
          ratio={4 / 3}
          isAnimationActive={false}
        >
          {normalizedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(index)} />
          ))}
          <Tooltip
            wrapperStyle={{ maxWidth: "500px" }}
            content={({ payload }) => {
              if (payload && payload.length && payload[0].payload) {
                const { name, size, description } = payload[0].payload as NormalizedData;
                return (
                  <div
                    style={{
                      background: "rgba(0,0,0,0.75)",
                      color: "#fff",
                      padding: "5px 10px",
                      borderRadius: 5,
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    <strong>{name}</strong>
                    <br />
                    Weight: {Number(size).toFixed(2)}%
                    <br />
                    <div style={{ fontSize: "0.7em" }}>{description}</div>
                  </div>
                );
              }
              return null;
            }}
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioTreemap;
