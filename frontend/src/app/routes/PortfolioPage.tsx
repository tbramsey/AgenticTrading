// pages/PortfolioPage.js
import React from "react";
import PortfolioTreemap from "../../components/PortfolioTreemap";
import PriceChart from "../../components/PriceChart";
import LaunchButton from "../../components/LaunchButton";
import News from "../../components/News";

export function PortfolioPage() {
  return (
    <div 
      style={{ 
        display: "flex", 
        flexDirection: "row", 
        width: "100%", 
        height: "100%",
        padding: "20px", 
        gap: "20px",
        boxSizing: "border-box",
        overflow: "hidden" // Prevents the main window from scrolling
      }}
    >
      
      {/* Left Side: Main Content (Takes 60% of space) */}
      <div style={{ flex: "4", display: "flex", flexDirection: "column", minWidth: 0 }}>
        
        {/* Chart Section - CHANGED: Removed fixed 500px width */}
        <div style={{ height: "40%", width: "100%", marginBottom: "20px" }}>
          {/* Ensure your <PriceChart /> inside handles width="100%" */}
          <PriceChart />
        </div>

        {/* News Section - Takes remaining vertical space */}
        <div style={{ flex: 1, overflowY: "auto"}}>
          <News />
        </div>
      </div>

      {/* Right Side: Treemap & Buttons (Takes 40% of space) */}
      {/* CHANGED: Removed fixed 800px width, using flex ratio instead */}
      <div style={{ flex: "6", display: "flex", flexDirection: "column", gap: "20px", height: "80vh" }}>
        
        {/* Treemap container taking most of the right column */}
        <div style={{ flex: 1, width: "100%", minHeight: 0 }}>
             {/* Ensure PortfolioTreemap inside handles width="100%" */}
            <PortfolioTreemap />
            <LaunchButton />
        </div>
      </div>

    </div>
  );
}
export default PortfolioPage;