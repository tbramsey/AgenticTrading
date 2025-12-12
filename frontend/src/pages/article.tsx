import { useMemo } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Bookmark, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type Article = {
  id: string
  title: string
  summary: string
  body: string
  tags?: string[]
  updated?: string
}

const ARTICLES: Article[] = [
  {
    id: "risk-basics",
    title: "Risk management fundamentals",
    summary: "Position sizing, stop-loss placement, and why risk per trade matters more than win rate.",
    body: `
## Why it matters?
Risk management is the cornerstone of successful trading and investing. It focuses on protecting your capital by controlling potential losses.
## The key fundamentals covered are:
- Position Sizing: This is determining how many shares or contracts to trade. It should be calculated based on your total account size and the maximum amount you are willing to lose on that specific trade (your risk per trade). Proper position sizing prevents a single losing trade from significantly damaging your portfolio.
- Stop-Loss Placement: A stop-loss order is a critical tool that automatically closes a trade when the price hits a pre-determined level. Effective placement is based on market analysis (e.g., technical support/resistance levels) and determines the maximum dollar loss for that trade, not just a random percentage.
- Risk Per Trade Matters More Than Win Rate:** This is the most crucial concept.
Risk Per Trade (RPT) is the small, fixed percentage of your total capital you are willing to lose on any single trade (often 1% to 2%).

Win Rate is the percentage of your trades that are profitable.

A trader can have a low win rate (e.g., 40%) but be highly profitable if their average winning trade is significantly larger than their average losing trade (a concept called Risk/Reward Ratio). By controlling your RPT, you ensure that losing trades are small and manageable, making long-term profitability achievable even without a high win rate.

In short, risk management is about controlling the size of your losses so that your wins, even if fewer in number, can generate positive returns over time.
`,
    tags: ["risk", "discipline"],
    updated: "Updated today",
  },
  {
    id: "earnings-season",
    title: "Earnings season playbook",
    summary: "Prep for consensus, implied move, scenarios, and post-print follow-through.",
    body: `
## Before the print
- Track implied move vs. realized history.
- Map bull/bear scenarios (guide up, inline, guide down).
- Define trade type: straddle, directional, or skip.

## After the print
- Let first 15-30m settle unless pre-planned.
- Watch reactions in sympathy names and ETFs.
- Avoid revenge trades if thesis invalidates.
`,
    tags: ["events", "equities"],
    updated: "Updated 1d ago",
  },
  {
    id: "macro-signals",
    title: "Reading macro signals",
    summary: "Rates, curves, inflation, and liquidity—what they hint about equity regimes.",
    body: `
## Core signals
- Yield curve slope: steepening/flattening regimes.
- Real rates: pressure/growth headwinds.
- Liquidity: central bank balance sheets and funding stress.

## How to use
- Align risk with macro wind: add risk with tailwinds, trim with headwinds.
- Combine macro with price confirmation; avoid macro-only trades.
`,
    tags: ["macro", "strategy"],
    updated: "Updated 2d ago",
  },
  {
    id: "options-starters",
    title: "Options starters",
    summary: "A gentle ramp into calls, puts, breakevens, and the Greeks you actually watch.",
    body: `
## Focused basics
- Breakeven: strike ± premium.
- Delta: directional sensitivity; use for sizing.
- Theta: time decay—own less of it when decay hurts.
- IV: compare to realized vol; avoid overpaying.

## Simple approach
- Start with defined-risk spreads.
- Size by max loss, not premium paid.
- Track greeks but keep the plan simple.
`,
    tags: ["options", "basics"],
    updated: "Updated 3d ago",
  },
]

function useArticle() {
  const { id } = useParams<{ id: string }>()
  return useMemo(() => ARTICLES.find((a) => a.id === id) ?? ARTICLES[0], [id])
}

export default function ArticlePage() {
  const article = useArticle()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <Share2 className="size-4" />
          Share
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <Bookmark className="size-4" />
          Save
        </Button>
      </div>

      <Card className="border-border/70 bg-card/80 backdrop-blur">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {article.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-semibold uppercase text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-semibold leading-tight">{article.title}</CardTitle>
            <CardDescription className="text-base">{article.summary}</CardDescription>
          </div>
          {article.updated ? (
            <div className="text-xs text-muted-foreground">{article.updated}</div>
          ) : null}
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          {article.body.split("\n").map((line, idx) =>
            line.startsWith("##") ? (
              <h3 key={idx} className="text-lg font-semibold">
                {line.replace(/^##\s*/, "")}
              </h3>
            ) : line.trim() === "" ? null : (
              <p key={idx} className="leading-relaxed">
                {line}
              </p>
            )
          )}
        </CardContent>
      </Card>
    </div>
  )
}
