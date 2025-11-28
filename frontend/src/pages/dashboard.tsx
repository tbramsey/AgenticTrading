import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowUpRight, BookOpen, DollarSign, MessageSquare, Newspaper, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"

const mockStocks = [
  { symbol: "NVDA", name: "NVIDIA Corp", price: 928.12, change: 3.42 },
  { symbol: "AAPL", name: "Apple Inc.", price: 194.33, change: 1.18 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 216.45, change: -0.92 },
  { symbol: "MSFT", name: "Microsoft", price: 412.87, change: 0.65 },
  { symbol: "AMZN", name: "Amazon", price: 178.01, change: 2.11 },
]

const mockNews = [
  { title: "Markets rally as CPI cools", source: "Financial Times", time: "2h ago" },
  { title: "AI chip demand outpaces forecasts", source: "Reuters", time: "3h ago" },
  { title: "Energy sector rotation gains momentum", source: "Bloomberg", time: "5h ago" },
]

const lesson = {
  title: "How to size positions with Kelly Criterion",
  summary:
    "A practical guide to balancing upside with drawdown control using fractional Kelly sizing and volatility caps.",
  cta: "Continue in Education",
}

const brokerage = {
  buyingPower: "$24,500",
  holdings: "$182,300",
  invested: "$157,800",
  cash: "$24,500",
  dayPnl: "+$1,240 ( +0.68% )",
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [chatDraft, setChatDraft] = useState("")

  const navigateToChat = () => {
    const query = chatDraft.trim()
    const url = query ? `/chat?prompt=${encodeURIComponent(query)}` : "/chat"
    navigate(url)
  }

  const stockRows = useMemo(
    () =>
      mockStocks.map((stock) => {
        const positive = stock.change >= 0
        return (
          <div
            key={stock.symbol}
            className="flex items-center justify-between rounded-lg border border-border/60 bg-card/50 px-4 py-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{stock.symbol}</span>
                <Badge variant="outline" className="text-[11px]">
                  {stock.name}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">Mock signal</div>
            </div>
            <div className="text-right">
              <div className="text-base font-semibold">${stock.price.toFixed(2)}</div>
              <div className={positive ? "text-emerald-500 text-xs" : "text-rose-500 text-xs"}>
                {positive ? "+" : ""}
                {stock.change.toFixed(2)}%
              </div>
            </div>
          </div>
        )
      }),
    []
  )

  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Stay on top of signals, news, and your brokerage status.</p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/portfolio")}>
          Open Portfolio
          <ArrowUpRight className="size-4" />
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Trending Stocks</CardTitle>
              <CardDescription>Top movers Barry is watching (mock data)</CardDescription>
            </div>
            <Badge variant="outline" className="gap-1">
              <TrendingUp className="size-4" />
              Momentum
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">{stockRows}</CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Brokerage Account</CardTitle>
            <CardDescription>Snapshot of balances (placeholder)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border/60 bg-muted/40 p-3">
                <div className="text-xs text-muted-foreground">Buying power</div>
                <div className="text-lg font-semibold">{brokerage.buyingPower}</div>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/40 p-3">
                <div className="text-xs text-muted-foreground">Holdings balance</div>
                <div className="text-lg font-semibold">{brokerage.holdings}</div>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/40 p-3">
                <div className="text-xs text-muted-foreground">Invested</div>
                <div className="text-lg font-semibold">{brokerage.invested}</div>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/40 p-3">
                <div className="text-xs text-muted-foreground">Cash</div>
                <div className="text-lg font-semibold">{brokerage.cash}</div>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between rounded-lg border border-border/60 bg-emerald-50/70 px-4 py-3 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              <span className="text-sm font-semibold">Day P&amp;L</span>
              <span className="text-sm font-semibold">{brokerage.dayPnl}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Trending News</CardTitle>
            <CardDescription>Recent headlines (mock feed)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockNews.map((item) => (
              <div
                key={item.title}
                className="flex items-start justify-between rounded-lg border border-border/60 bg-muted/40 p-3"
              >
                <div className="space-y-1">
                  <div className="text-sm font-semibold">{item.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.source} • {item.time}
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
                  <ArrowUpRight className="size-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="border-border/70 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Lesson of the day</CardTitle>
              <CardDescription>From Education (placeholder)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <BookOpen className="size-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-semibold">{lesson.title}</div>
                  <div className="text-xs text-muted-foreground">{lesson.summary}</div>
                </div>
              </div>
              <Button variant="outline" className="w-fit gap-2" onClick={() => navigate("/learn")}>
                {lesson.cta}
                <ArrowUpRight className="size-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Chat with Barry</CardTitle>
              <CardDescription>Send your prompt to the chatbot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Ask Barry anything about the markets..."
                value={chatDraft}
                onChange={(e) => setChatDraft(e.target.value)}
              />
              <Button className="w-full gap-2" onClick={navigateToChat}>
                Open Chat
                <MessageSquare className="size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
