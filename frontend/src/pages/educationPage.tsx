import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Article = {
  id: string
  title: string
  summary: string
  imageLabel: string
  href?: string
  tags?: string[]
}

const ARTICLES: Article[] = [
  {
    id: "risk-basics",
    title: "Risk management fundamentals",
    summary: "Position sizing, stop-loss placement, and why risk per trade matters more than win rate.",
    imageLabel: "Risk controls",
    tags: ["risk", "discipline"],
    href: "/learn/risk-basics",
  },
  {
    id: "earnings-season",
    title: "Earnings season playbook",
    summary: "How to prep for earnings: consensus, implied moves, scenarios, and post-print follow-through.",
    imageLabel: "Earnings prep",
    tags: ["events", "equities"],
    href: "/learn/earnings-season",
  },
  {
    id: "macro-signals",
    title: "Reading macro signals",
    summary: "Rates, curves, inflation, and liquidity—what they hint about equity and FX regimes.",
    imageLabel: "Macro trends",
    tags: ["macro", "strategy"],
    href: "/learn/macro-signals",
  },
  {
    id: "options-starters",
    title: "Options starters",
    summary: "A gentle ramp into calls, puts, breakevens, and the Greeks you actually watch.",
    imageLabel: "Options 101",
    tags: ["options", "basics"],
    href: "/learn/options-starters",
  },
]

export default function Education() {
  return (
    <div className="px-6 py-8 lg:px-10">
      <header className="mb-8 flex flex-col gap-2">
        <p className="text-sm font-semibold text-primary">Learn</p>
        <h1 className="text-2xl font-bold tracking-tight">Education library</h1>
        <p className="text-muted-foreground max-w-3xl">
          Browse quick primers and save templates for later. Each card is a stub you can replace with real content or link to full articles.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {ARTICLES.map((article) => (
          <Card key={article.id} className="h-full">
            <CardHeader className="gap-4">
              <div className="relative h-32 overflow-hidden rounded-lg border bg-muted/40">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
                <div className="absolute inset-0 grid place-items-center text-sm font-semibold text-primary">
                  {article.imageLabel}
                </div>
              </div>
              <div>
                <CardTitle>{article.title}</CardTitle>
                <CardDescription className="mt-1">{article.summary}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {article.tags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/70 bg-muted/40 px-3 py-1 font-medium text-foreground"
                >
                  {tag}
                </span>
              ))}
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={article.href ?? "#"}>Read more</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
