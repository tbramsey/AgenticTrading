import React, { useEffect, useState } from "react";
import PortfolioTreemap from "./components/PortfolioTreemap.jsx";

const App = () => {
  const [portfolio, setPortfolio] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/portfolio")
      .then((res) => res.json())
      .then((data) => setPortfolio(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: 20, height: "100vh", width: "50vw" }}>
      <h2>Portfolio Treemap</h2>
      <PortfolioTreemap data={portfolio} />
    </div>
  );
};

export default App;
