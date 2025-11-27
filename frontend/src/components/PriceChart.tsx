import React, { useEffect, useState, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import DateButton from "./dateButton";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Point {
  date: string;
  portfolio_value: number;
}

// Optional: Allow passing standard props like className or style
interface PortfolioLineChartProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function PortfolioLineChart({ className, style }: PortfolioLineChartProps) {
  const [dataPoints, setDataPoints] = useState<Point[]>([]);
  const [startDate, setStartDate] = useState<string>("2024-11-01");
  const [selectedYears, setSelectedYears] = useState<number>(1);

  const fetchPortfolio = useCallback((date: string) => {
    fetch(`http://127.0.0.1:5000/portfolio/current?startdate=${date}`)
      .then((res) => res.json())
      .then((json) => setDataPoints(json))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetchPortfolio(startDate);
    const handleUpdate = () => {
      setTimeout(() => fetchPortfolio(startDate), 500);
    };
    window.addEventListener("portfolioUpdated", handleUpdate);
    return () => window.removeEventListener("portfolioUpdated", handleUpdate);
  }, [fetchPortfolio, startDate]);

  const handleDateApply = (startDate: string, years: number) => {
    setStartDate(startDate);
    setSelectedYears(years);
  };

  // --- Data Processing ---
  const labels = dataPoints?.map((p) => p.date) || [];
  const values = dataPoints?.map((p) => p.portfolio_value) || [];
  const lastValue = values.length > 0 ? values[values.length - 1] : 0;
  const firstValue = values.length > 0 ? values[0] : 0;
  
  const formattedLabel = values.length > 0 ? `${lastValue.toFixed(2)}%` : "Loading...";
  const isPositive = lastValue >= firstValue;
  const lineColor = isPositive ? "#26a69a" : "#e53935";

  const data = {
    labels,
    datasets: [
      {
        data: values,
        borderColor: lineColor,
        backgroundColor: isPositive ? "rgba(38,166,154,0.2)" : "rgba(229,57,53,0.2)",
        pointBackgroundColor: lineColor,
        pointBorderColor: "#ffffff",
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 5,
        hitRadius: 10,
        hoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    // IMPORTANT: This allows the chart to stretch to fit the parent's height
    maintainAspectRatio: false, 
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { display: false },
        grid: { display: false },
        border: { display: false },
      },
      y: {
        ticks: { display: false },
        grid: { display: false },
        border: { display: false },
      },
    },
  };

  if (!Array.isArray(dataPoints)) {
    console.error("Invalid data format:", dataPoints);
    return <div>No portfolio data</div>;
  }

  return (
    // 1. Outer container takes 100% of parent size
    <div 
      className={className}
      style={{ 
        width: "100%", 
        height: "100%", 
        display: "flex", 
        flexDirection: "column", 
        ...style 
      }}
    >
      {/* Header: Flex-shrink 0 ensures it doesn't get squished */}
      <div style={{ flexShrink: 0, textAlign: "center", marginBottom: "10px" }}>
        <label
          style={{
            color: isPositive ? "green" : "red",
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          {selectedYears}-Year ({formattedLabel})
        </label>
      </div>

      {/* Chart Container: Flex-grow 1 takes all available remaining space */}
      <div style={{ flexGrow: 1, position: "relative", minHeight: 0 }}>
        <Line options={options} data={data} />
      </div>

      {/* Footer: Flex-shrink 0 ensures buttons sit at the bottom */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          marginTop: "10px",
          justifyContent: "center", // Centers buttons
        }}
      >
        <DateButton years={1} onApply={handleDateApply} />
        <DateButton years={2} onApply={handleDateApply} />
        <DateButton years={5} onApply={handleDateApply} />
        <DateButton years={10} onApply={handleDateApply} />
      </div>
    </div>
  );
}