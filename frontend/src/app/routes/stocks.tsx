import PortfolioTreemap from "../../components/PortfolioTreemap";
import PriceChart from "../../components/PriceChart";

export function StocksPage() {
  return (
    <div className="p-6 flethx justify-center">
      <PortfolioTreemap />
      <PriceChart />
    </div>
  );
}

export default StocksPage;
