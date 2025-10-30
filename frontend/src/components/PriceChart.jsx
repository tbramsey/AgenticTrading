import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const PriceChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchPortfolio = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/portfolio/current");
        if (!res.ok) {
          console.error("portfolio/current fetch failed:", res.status);
          return;
        }
        const json = await res.json();
        if (isMounted) setData(json);
      } catch (err) {
        console.error("Error fetching portfolio:", err);
      }
    };

    fetchPortfolio();

    const handler = () => fetchPortfolio();
    window.addEventListener("portfolioUpdated", handler);

    return () => {
      isMounted = false;
      window.removeEventListener("portfolioUpdated", handler);
    };
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" />
        <Line
          type="monotone"
          dataKey="portfolio_value"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceChart;







// import React, { useEffect, useRef, useState } from "react";
// import { createChart } from "lightweight-charts";

// const PriceChart = () => {
//   const chartContainerRef = useRef();
//   const [data, setData] = useState([]);

//   // Fetch mock or live portfolio data
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

//         // Transform your mock data into chart-friendly format
//         const formattedData = json.map((item) => ({
//           time: item.date,
//           value: item.portfolio_value,
//         }));

//         if (isMounted) setData(formattedData);
//       } catch (err) {
//         console.error("Error fetching portfolio:", err);
//       }
//     };

//     fetchPortfolio();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   // Create and update the chart
//   useEffect(() => {
//     if (!chartContainerRef.current) return;

//     const chart = createChart(chartContainerRef.current, {
//       width: chartContainerRef.current.clientWidth,
//       height: 400,
//       layout: {
//         background: { color: "#ffffff" },
//         textColor: "#333",
//       },
//       grid: {
//         vertLines: { color: "#eee" },
//         horzLines: { color: "#eee" },
//       },
//       crosshair: { mode: 1 },
//       priceScale: { borderColor: "#ccc" },
//       timeScale: { borderColor: "#ccc" },
//     });

//     const lineSeries = chart.addSeries({
//       color: "#2962FF",
//       lineWidth: 2,
//     });

//     if (data.length > 0) {
//       lineSeries.setData(data);
//     }

//     const handleResize = () => {
//       chart.applyOptions({ width: chartContainerRef.current.clientWidth });
//     };

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       chart.remove();
//     };
//   }, [data]);

//   return <div ref={chartContainerRef} style={{ width: "100%", height: "400px" }} />;
// };

// export default PriceChart;
