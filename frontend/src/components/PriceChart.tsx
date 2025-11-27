import React, { useEffect, useState, useCallback, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchPortfolio = useCallback((date: string) => {
    setIsLoading(true);
    fetch(`http://127.0.0.1:5000/portfolio/current?startdate=${date}`)
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json)) {
          setDataPoints(json);
        } else {
          console.error("Invalid portfolio/current response:", json);
          setDataPoints([]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
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
  const dateOptions = useMemo(() => [1, 2, 5, 10], []);

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
    <Card
      className={cn(
        "h-full min-h-[360px] w-full border-border/70 bg-card shadow-sm",
        className
      )}
      style={style}
    >
      <CardHeader className="flex flex-col gap-2 border-b border-border/70 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Portfolio performance
          </CardTitle>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              isPositive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
            )}
          >
            {selectedYears}-Year ({formattedLabel})
          </span>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Last updated values from your backend service.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex h-full flex-col gap-4 p-6">
        <div className="relative min-h-[240px] flex-1">
          <Line options={options} data={data} />
          {isLoading && (
            <div className="bg-background/70 absolute inset-0 flex items-center justify-center rounded-lg text-sm text-muted-foreground backdrop-blur">
              Refreshing data…
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {dateOptions.map((years) => {
            const today = new Date();
            const pastDate = new Date();
            pastDate.setFullYear(today.getFullYear() - years);
            const formattedPastDate = pastDate.toISOString().split("T")[0];

            const isActive = selectedYears === years;

            return (
              <Button
                key={years}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full px-4",
                  isActive && "shadow-sm"
                )}
                onClick={() => handleDateApply(formattedPastDate, years)}
              >
                {years} Year{years > 1 ? "s" : ""}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
