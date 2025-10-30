import React, { useEffect, useState } from "react";
import PortfolioTreemap from "./components/PortfolioTreemap.jsx";
import PriceChart from "./components/PriceChart.jsx";


const App = () => {
  return (
    <div style={{
        height: "300px",
        width: "800px",
      }}
    >
      <PortfolioTreemap/>
      <PriceChart/>
    </div>
  );
};

export default App;
