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
## Why risk > win rate
Even profitable strategies can fail when risk per trade is uncontrolled. Risk defines your **survival**, win rate defines your **pace**.

## Quick checklist
- Fixed % risk per trade (e.g., 0.5–1.0%)
- Position size from stop distance, not conviction
- Respect daily loss limits and cool-off periods
- Pre-plan exits: stop, target, and time-based

## Playbook
1) Decide max % capital at risk per trade.
2) Use recent volatility to set stops; size from that distance.
3) If three losses hit in a session, stand down and review.
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
