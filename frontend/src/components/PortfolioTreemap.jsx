import React from "react";
import {
  Treemap,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const PortfolioTreemap = ({ data }) => {
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
    "#845EC2", "#D65DB1", "#FF6F91", "#FFC75F",
    "#008E9B", "#4B4453"
  ];

  if (!Array.isArray(data) || data.length === 0) {
    return <div style={{ padding: 16 }}>No portfolio data available</div>;
  }

  // Normalize weights if they don’t sum to 100
  const total = data.reduce((acc, d) => acc + (Number(d.weight) || 0), 0);

  // if total is zero, give each entry an equal size to avoid division by zero
  const normalizedData = (total > 0 ? data : data.map(d => ({ ...d, weight: 1 })))
    .map((d) => ({
      name: d.symbol,
      size: ((Number(d.weight) || 0) / (total > 0 ? total : data.length)) * 100
    }));

  return (
    <div style={{ width: "100%", height: 500 }}>
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={normalizedData}
          dataKey="size"
          stroke="#fff"
          fill="#8884d8"
          ratio={4 / 3} // use 'ratio' prop for Treemap
        >
          {normalizedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
          <Tooltip
            content={({ payload }) => {
              if (payload && payload.length && payload[0].payload) {
                const { name, size } = payload[0].payload;
                return (
                  <div
                    style={{
                      background: "rgba(0, 0, 0, 0.75)",
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