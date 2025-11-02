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

interface Point { date: string; portfolio_value: number; }

export default function PortfolioLineChart() {
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

  const labels = dataPoints.map((p) => p.date);
  const values = dataPoints.map((p) => p.portfolio_value);
  const lastValue = values?.[values.length - 1];
  const formattedLabel = lastValue !== undefined ? `${lastValue.toFixed(2)}%` : "";

  const isPositive = values[values.length - 1] >= values[0];
  const lineColor = isPositive ? "#26a69a" : "#e53935";

  const data = {
    labels,
    datasets: [
      {
        data: values,
        borderColor: lineColor,
        backgroundColor: isPositive
          ? "rgba(38,166,154,0.2)"
          : "rgba(229,57,53,0.2)",
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
    <div style={{ width: "600px", height: "400px", border: "none" }}>
      <div style={{
            color: lastValue > 0 ? "green" : "red",
            fontWeight: "bold",
            textAlign: "center", width: "100%"
          }}>
        <label
          style={{
            color: lastValue > 0 ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {selectedYears}-Year ({formattedLabel})
        </label>
      </div>

      <Line options={options} data={data} />
      <div style={{
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        marginTop: "10px",
      }}>
        <DateButton years={1} onApply={handleDateApply} />
        <DateButton years={2} onApply={handleDateApply} />
        <DateButton years={5} onApply={handleDateApply} />
        <DateButton years={10} onApply={handleDateApply} />
      </div>
    </div>
  );
}
