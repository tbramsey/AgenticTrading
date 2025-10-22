import React from "react";
import { Treemap, Tooltip, ResponsiveContainer, Cell } from "recharts";

const PortfolioTreemap = ({ data, showChart = false }) => {
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
    "#845EC2", "#D65DB1", "#FF6F91", "#FFC75F",
    "#008E9B", "#4B4453"
  ];

  if (!Array.isArray(data) || data.length === 0) {
    return <div style={{ padding: 16 }}>No portfolio data available</div>;
  }

  // Convert tuples to objects if needed
  const normalizedInput = data.map((d) => {
    if (Array.isArray(d) && d.length === 2) {
      return { symbol: d[0], weight: d[1] };
    }
    return d; // assume already {symbol, weight}
  });

  const total = normalizedInput.reduce((acc, d) => acc + (Number(d.weight) || 0), 0);

  const normalizedData = (total > 0 ? normalizedInput : normalizedInput.map(d => ({ ...d, weight: 1 })))
    .map((d) => ({
      name: d.symbol,
      size: ((Number(d.weight) || 0) / (total > 0 ? total : normalizedInput.length)) * 100
    }));

  // Dynamic color generator
  const getColor = (index) => {
    const hue = (index * 360) / normalizedData.length;
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <div style={{ width: "100%", height: 500, border: "None" }}>
        <ResponsiveContainer width="100%" height="100%">
          <Treemap data={normalizedData} dataKey="size" stroke="#fff" ratio={4 / 3} isAnimationActive={false}>
            {normalizedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(index)} />
            ))}
            <Tooltip
              content={({ payload }) => {
                if (payload && payload.length && payload[0].payload) {
                  const { name, size } = payload[0].payload;
                  return (
                    <div
                      style={{
                        background: "rgba(0,0,0,0.75)",
                        color: "#fff",
                        padding: "5px 10px",
                        borderRadius: 5
                      }}
                    >
                      <strong>{name}</strong>
                      <br />
                      Weight: {Number(size).toFixed(2)}%
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
