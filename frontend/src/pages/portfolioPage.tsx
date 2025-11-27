// pages/PortfolioPage.js
import React from "react";
import PortfolioTreemap from "@/components/PortfolioTreemap";
import PriceChart from "@/components/PriceChart";
import LaunchButton from "@/components/LaunchButton";

export function PortfolioPage() {
  return (
    <div className="h-[calc(100vh-4rem)] w-full overflow-y-auto p-6">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Portfolio</h1>
        <p className="text-muted-foreground">
          Track performance, adjust risk, and deploy the latest allocation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.9fr]">
        <PriceChart className="h-full" />

        <div className="grid grid-rows-[minmax(360px,1fr)_auto] gap-6">
          <PortfolioTreemap />
          <LaunchButton />
        </div>
      </div>
    </div>
  );
}
export default PortfolioPage;
