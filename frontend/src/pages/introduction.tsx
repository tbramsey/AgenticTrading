import { Cpu, Shield, TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    title: "AI-Driven Logic",
    description:
      "Neural agents adapt to volatility in milliseconds, executing strategies before humans react.",
    icon: Cpu,
  },
  {
    title: "Predictive Modeling",
    description:
      "Signals anticipate reversals with historical sentiment and multi-horizon forecasting.",
    icon: TrendingUp,
  },
  {
    title: "Risk Guardrails",
    description:
      "Hard-coded exposure limits, stop-loss enforcement, and capital constraints keep autonomy safe.",
    icon: Shield,
  },
];

const team = ["Artin", "Tagan", "Navya", "Lahari"];

export default function IntroPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-background to-muted/40 text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
        {/* Hero */}
        <header className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <Badge className="w-fit border-border/70 bg-card/70 text-xs font-semibold uppercase tracking-wide text-foreground">
              Agentic Trading v1.0
            </Badge>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                The future of{" "}
                <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  autonomous wealth
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Deploy intelligent agents to analyze, predict, and execute with near-zero latency.
                Smarter markets start here.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
                <Button size="lg" className="gap-2" asChild>
                <a href="/auth">
                  Launch Terminal <ChevronRight className="size-4" />
                </a>
                </Button>
              <Button size="lg" variant="outline">
                View Documentation
              </Button>
            </div>
          </div>

          <Card className="border-border/70 bg-card/80 backdrop-blur">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="flex items-center justify-between text-base font-semibold">
                <span>Berry Agent #04</span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Active
                </span>
              </CardTitle>
              <CardDescription>Live execution telemetry.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">P&amp;L (24h)</span>
                <span className="text-base font-semibold text-emerald-500">+14.2%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Volume</span>
                <span className="text-base font-semibold">$4.2M</span>
              </div>
              <div className="relative h-24 w-full overflow-hidden rounded-xl bg-muted/50">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex items-end gap-2">
                  {[40, 60, 35, 70, 55, 90, 65].map((height, idx) => (
                    <div
                      key={idx}
                      className="w-6 rounded-full bg-primary/70"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </header>

        {/* Features */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Why Berry?</h2>
              <p className="text-muted-foreground">
                Autonomy, foresight, and strong risk posture built into every agent.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map(({ title, description, icon: Icon }) => (
              <Card
                key={title}
                className="border-border/60 bg-card/70 backdrop-blur transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
              >
                <CardContent className="space-y-3 p-6">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {description}
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Architects of Berry</h2>
            <p className="text-muted-foreground">The minds behind the machine.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((name) => (
              <Card
                key={name}
                className="border-border/60 bg-card/70 backdrop-blur transition hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                    {name.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-base">{name}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      Co-Founder
                    </CardDescription>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t border-border/60 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="font-semibold text-foreground">Berry.</div>
          <div>© 2025 Berry Trading Systems. All rights reserved.</div>
        </footer>
      </div>
    </div>
  );
}
