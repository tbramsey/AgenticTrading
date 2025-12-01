import React, { useState, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from "recharts";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const USE_MOCK_DATA = false;

interface SectorData {
  name: string;
  value: number;
  total_amount?: number;
}

interface SectorChartProps {
  className?: string;
}

const MOCK_DATA: SectorData[] = [
  { name: "Technology", value: 35.5, total_amount: 35500 },
  { name: "Healthcare", value: 20.0, total_amount: 20000 },
  { name: "Finance", value: 15.0, total_amount: 15000 },
  { name: "Consumer Discretionary", value: 10.5, total_amount: 10500 },
  { name: "Energy", value: 8.0, total_amount: 8000 },
  { name: "Industrials", value: 6.0, total_amount: 6000 },
  { name: "Utilities", value: 5.0, total_amount: 5000 },
];

const COLORS = [
  "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b",
  "#ef4444", "#6366f1", "#ec4899", "#64748b"
];

const RADIAN = Math.PI / 180;

interface RenderActiveShapeProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: SectorData;
  percent: number;
  value: number;
}

const renderActiveShape = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, value } =
    props as RenderActiveShapeProps;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#1e293b"
        className="text-xs font-semibold"
      >
        {`${value}%`}
      </text>
    </g>
  );
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as SectorData;
    return (
      <div className="rounded-lg border border-border/60 bg-popover px-3 py-2 text-xs shadow-md">
        <p className="font-semibold text-foreground">{data.name}</p>
        <p className="text-muted-foreground">Allocation: {data.value}%</p>
        {data.total_amount && (
          <p className="text-[11px] text-muted-foreground">
            Est. Value: ${data.total_amount.toLocaleString()}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function SectorChart({ className }: SectorChartProps) {
  const [data, setData] = useState<SectorData[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      let result: SectorData[];

      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        result = MOCK_DATA;
      } else {
        const response = await fetch("http://127.0.0.1:5000/sectors");
        console.log("FETCHED SECTOR DATA");
        if (!response.ok) {
          console.log("FAILED TO FETCH SECTOR DATA");
          throw new Error(`Error: ${response.statusText}`);
        }
        result = await response.json();
        console.log("FETCHED SECTOR DATA SUCCESSFULLY");
      }

      const sortedData = result.sort((a: SectorData, b: SectorData) => b.value - a.value);
      setData(sortedData);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch sector data:", err);
      setError("Unable to load sector data. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const handleUpdate = () => {
      setTimeout(() => {
        fetchData();
      }, 1000);
    };

    window.addEventListener("portfolioUpdated", handleUpdate);
    return () => window.removeEventListener("portfolioUpdated", handleUpdate);
  }, [fetchData]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <Card className={cn("h-full w-full border-border/70 bg-card shadow-sm", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-border/70 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">Sector allocation</CardTitle>
          <CardDescription>Breakdown of exposure by sector.</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="h-full pt-6">
        {loading && (
          <div className="flex h-[320px] flex-col items-center justify-center gap-3 rounded-lg border border-border/60 bg-muted/30">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading sector data…</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex h-[320px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-destructive/50 bg-destructive/5 px-4 text-center">
            <p className="text-sm font-medium text-destructive">{error}</p>
            <Button size="sm" variant="outline" onClick={fetchData}>
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="flex h-[320px] items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/30 text-sm text-muted-foreground">
            No sector data available.
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={3}
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={onPieEnter}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="rgba(255,255,255,1)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "transparent" }}
                  wrapperStyle={{ outline: "none" }}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: 16,
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#94a3b8",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
