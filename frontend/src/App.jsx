import React from "react";
import PortfolioTreemap from "./components/PortfolioTreemap";

const App = () => {
  const portfolio = [
    { symbol: "AAPL", weight: 25 },
    { symbol: "MSFT", weight: 18 },
    { symbol: "GOOG", weight: 12 },
    { symbol: "AMZN", weight: 9 },
    { symbol: "TSLA", weight: 8 },
    { symbol: "NVDA", weight: 6 },
    { symbol: "BRK.B", weight: 5 },
    { symbol: "META", weight: 4 },
    { symbol: "V", weight: 7 },
    { symbol: "JNJ", weight: 6 }
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Portfolio Treemap</h2>
      <PortfolioTreemap data={portfolio} />
    </div>
  );
};

export default App;
