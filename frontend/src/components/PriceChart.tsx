// import React, { useState, useEffect } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";

// const PriceChart = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     let isMounted = true;

//     const fetchPortfolio = async () => {
//       try {
//         const res = await fetch("http://127.0.0.1:5000/portfolio/current");
//         if (!res.ok) {
//           console.error("portfolio/current fetch failed:", res.status);
//           return;
//         }
//         const json = await res.json();
//         if (isMounted) setData(json);
//       } catch (err) {
//         console.error("Error fetching portfolio:", err);
//       }
//     };

//     fetchPortfolio();

//     const handler = () => fetchPortfolio();
//     window.addEventListener("portfolioUpdated", handler);

//     return () => {
//       isMounted = false;
//       window.removeEventListener("portfolioUpdated", handler);
//     };
//   }, []);

//   return (
//     <ResponsiveContainer width={600} height={400}>
//       <LineChart data={data}>
//         <XAxis dataKey="date" />
//         <YAxis domain={["auto", "auto"]} />
//         <Tooltip />
//         <CartesianGrid strokeDasharray="3 3" />
//         <Line
//           type="monotone"
//           dataKey="portfolio_value"
//           stroke="#8884d8"
//           strokeWidth={2}
//           dot={false}
//         />
//       </LineChart>
//     </ResponsiveContainer>
//   );
// };

// export default PriceChart;



import React, { useEffect, useState } from "react";
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Point { date: string; portfolio_value: number; }

export default function PortfolioLineChart() {
  const [dataPoints, setDataPoints] = useState<Point[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/portfolio/current")
      .then((res) => res.json())
      .then((json) => setDataPoints(json))
      .catch((err) => console.error(err));
  }, []);

  const labels = dataPoints.map((p) => p.date);
  const values = dataPoints.map((p) => p.portfolio_value);

  const data = {
    labels,
    datasets: [
      {
        label: "Portfolio Value",
        data: values,
        borderColor: "#26a69a",
        backgroundColor: "rgba(38,166,154,0.2)",
        pointBackgroundColor: "#26a69a",
        pointBorderColor: "#ffffff",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#DDD" } },
    },
    scales: {
      x: {
        ticks: { color: "#BBB" },
        grid: { color: "rgba(100,100,100,0.3)" },
      },
      y: {
        ticks: { color: "#BBB" },
        grid: { color: "rgba(100,100,100,0.3)" },
      },
    },
  };

  return (
    <div style={{ width: "600px", height: "400px" }}>
      <Line options={options} data={data} />
    </div>
  );
}
