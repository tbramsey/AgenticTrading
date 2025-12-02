import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Globe2, MapPin, Phone, RefreshCw, ShieldCheck, XCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:5000"

type Branding = {
  icon_url?: string
  logo_url?: string
}

type Address = {
  address1?: string
  city?: string
  postal_code?: string
  state?: string
}

type TickerDetails = {
  active?: boolean
  address?: Address
  branding?: Branding
  cik?: string
  composite_figi?: string
  currency_name?: string
  description?: string
  homepage_url?: string
  list_date?: string
  locale?: string
  market?: string
  market_cap?: number
  name?: string
  phone_number?: string
  primary_exchange?: string
  round_lot?: number
  share_class_figi?: string
  share_class_shares_outstanding?: number
  sic_code?: string
  sic_description?: string
  ticker?: string
  ticker_root?: string
  total_employees?: number
  type?: string
  weighted_shares_outstanding?: number
}

type ApiResponse = {
  ticker: string
  data: TickerDetails
}

function formatCurrency(value?: number) {
  if (typeof value !== "number") return "—"
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  return `$${value.toLocaleString()}`
}

function formatNumber(value?: number) {
  if (typeof value !== "number") return "—"
  return value.toLocaleString()
}

function formatAddress(address?: Address) {
  if (!address) return "—"
  const parts = [address.address1, address.city, address.state, address.postal_code].filter(Boolean)
  return parts.join(", ")
}

export default function StockSearchPage() {
  const { ticker: tickerParam } = useParams<{ ticker?: string }>()
  const navigate = useNavigate()
  const [details, setDetails] = useState<TickerDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resolvedTicker = useMemo(() => (tickerParam ?? details?.ticker ?? "").toUpperCase(), [tickerParam, details?.ticker])

  useEffect(() => {
    if (tickerParam) {
      fetchDetails(tickerParam)
    }
  }, [tickerParam])

  async function fetchDetails(symbol: string) {
    const trimmed = symbol.trim()
    if (!trimmed) return

    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/search/${encodeURIComponent(trimmed)}`)
      const data: ApiResponse | { error?: string } = await res.json()

      if (!res.ok) {
        throw new Error((data as any).error ?? "Unable to fetch ticker details")
      }

      const payload = (data as ApiResponse).data ?? data
      setDetails(payload as TickerDetails)
    } catch (err: any) {
      setError(err?.message ?? "Failed to load details")
      setDetails(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeepAnalysis = () => {
    const promptTicker = resolvedTicker || "this ticker"
    const prompt = `Lets analyze ${promptTicker}`
    navigate(`/chat?prompt=${encodeURIComponent(prompt)}`)
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">
      <Card className="overflow-hidden border-border/60 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-slate-50 shadow-xl">
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
                Deep Ticker Profile
              </div>
              {details?.active ? (
                <Badge className="bg-emerald-500/90 text-white hover:bg-emerald-500">
                  <ShieldCheck className="mr-1.5 h-4 w-4" />
                  Active
                </Badge>
              ) : details ? (
                <Badge variant="secondary" className="bg-amber-200/80 text-amber-900">
                  <XCircle className="mr-1.5 h-4 w-4" />
                  Inactive
                </Badge>
              ) : null}
            </div>
            <div className="text-sm text-slate-200">
              Use the global search (top bar) to jump between tickers.
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              {details?.branding?.logo_url ? (
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-white/10 backdrop-blur">
                  <img src={details.branding.logo_url} alt={details.name ?? resolvedTicker} className="h-12 w-12 object-contain" />
                </div>
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 text-lg font-semibold">
                  {resolvedTicker.slice(0, 3) || "??"}
                </div>
              )}
              <div className="space-y-1">
                <CardTitle className="text-3xl font-semibold leading-tight text-slate-50">
                  {details?.name ?? "Search a ticker"}
                </CardTitle>
                <CardDescription className="text-slate-200">
                  {details?.description
                    ? "Reference snapshot with fundamentals and identifiers."
                    : "Look up any U.S. ticker for a reference profile."}
                </CardDescription>
              </div>
            </div>
            {details?.ticker ? (
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-200">
                <Badge variant="secondary" className="bg-white/15 text-slate-50">
                  {details.ticker}
                </Badge>
                {details.primary_exchange ? (
                  <Badge variant="secondary" className="bg-white/15 text-slate-50">
                    Exchange: {details.primary_exchange}
                  </Badge>
                ) : null}
                {details.market ? (
                  <Badge variant="secondary" className="bg-white/15 text-slate-50">
                    Market: {details.market}
                  </Badge>
                ) : null}
              </div>
            ) : null}
          </div>
        </CardHeader>
        <CardFooter className="flex justify-end border-t border-white/10 bg-white/5 px-6 py-4">
          <Button
            variant="secondary"
            className="bg-white/10 text-slate-50 hover:bg-white/20"
            onClick={handleDeepAnalysis}
            disabled={!resolvedTicker}
          >
            Deep Analysis
          </Button>
        </CardFooter>
      </Card>

      {error ? (
        <Card className="border-destructive/40 bg-destructive/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">Unable to load ticker</CardTitle>
            <CardDescription className="text-destructive">{error}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Market Cap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{formatCurrency(details?.market_cap)}</div>
            <CardDescription>Currency: {details?.currency_name?.toUpperCase() ?? "—"}</CardDescription>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{formatNumber(details?.total_employees)}</div>
            <CardDescription>Share class shares: {formatNumber(details?.share_class_shares_outstanding)}</CardDescription>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">Listings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <div className="text-lg font-semibold">{details?.locale?.toUpperCase() ?? "—"}</div>
            <CardDescription className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 text-muted-foreground" />
              {details?.type ?? "—"} · Root: {details?.ticker_root ?? "—"}
            </CardDescription>
            <CardDescription>Since {details?.list_date ?? "—"}</CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Company Story</CardTitle>
            <CardDescription>{details?.homepage_url ?? "—"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {details?.description ?? "Enter a ticker to see its description, business overview, and listing metadata."}
            </p>
            <Separator />
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {details?.sic_description ? <Badge variant="outline">{details.sic_description}</Badge> : null}
              {details?.currency_name ? <Badge variant="outline">Currency: {details.currency_name.toUpperCase()}</Badge> : null}
              {details?.round_lot ? <Badge variant="outline">Round lot: {details.round_lot}</Badge> : null}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Contact & Location</CardTitle>
            <CardDescription>Useful for quick diligence</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4" />
              <div>
                <div className="font-semibold text-foreground">Address</div>
                <div>{formatAddress(details?.address)}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Phone className="mt-0.5 h-4 w-4" />
              <div>
                <div className="font-semibold text-foreground">Phone</div>
                <div>{details?.phone_number ?? "—"}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Globe2 className="mt-0.5 h-4 w-4" />
              <div>
                <div className="font-semibold text-foreground">Website</div>
                <a
                  className="text-primary underline-offset-2 hover:underline"
                  href={details?.homepage_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {details?.homepage_url ?? "—"}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Identifiers</CardTitle>
            <CardDescription>Keep these handy for filings and data vendors</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => fetchDetails(resolvedTicker)}
            disabled={isLoading || !resolvedTicker}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Identifier label="CIK" value={details?.cik} />
          <Identifier label="Composite FIGI" value={details?.composite_figi} />
          <Identifier label="Share Class FIGI" value={details?.share_class_figi} />
          <Identifier label="Ticker Root" value={details?.ticker_root} />
          <Identifier label="Share Class Shares" value={formatNumber(details?.share_class_shares_outstanding)} />
          <Identifier label="Weighted Shares" value={formatNumber(details?.weighted_shares_outstanding)} />
          <Identifier label="SIC Code" value={details?.sic_code} />
          <Identifier label="SIC Description" value={details?.sic_description} />
        </CardContent>
      </Card>
    </div>
  )
}

function Identifier({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/40 px-4 py-3">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold text-foreground">{value ?? "—"}</div>
    </div>
  )
}
