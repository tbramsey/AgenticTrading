import { useState, useRef, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const API_BASE_URL = "http://127.0.0.1:5000"
const STORAGE_KEY = "chatbot_messages"
const STORAGE_PENDING_KEY = "chatbot_pending"

type ReportEntry = {
  id: string
  label: string
  content: string
}

type FormattedData = {
  decision?: string
  rationale?: string
  risk_assessment?: string
  investment_plan?: unknown
  [key: string]: unknown
}

type ReportPanelData = {
  formattedData: FormattedData | null
  formattedRaw: string | null
  reports: ReportEntry[]
}

export default function Chat() {
  const location = useLocation()
  const [messages, setMessages] = useState(() => {
    const cached = window.localStorage.getItem(STORAGE_KEY)
    if (cached) {
      try {
        return JSON.parse(cached)
      } catch {
        return [{ sender: "ai", text: "Hey! What stock would you like to analyze today?" }]
      }
    }
    return [{ sender: "ai", text: "Hey! What stock would you like to analyze today?" }]
  })
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(() => Boolean(window.localStorage.getItem(STORAGE_PENDING_KEY)))
  const [reportPanel, setReportPanel] = useState<ReportPanelData>({ formattedData: null, formattedRaw: null, reports: [] })
  const [isReportOpen, setIsReportOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const mountedRef = useRef(true)

  const formatValue = (value: unknown): string => {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return String(value)
    }
    if (Array.isArray(value)) {
      return value.map((v) => formatValue(v)).join(", ")
    }
    if (value && typeof value === "object") {
      try {
        return JSON.stringify(value, null, 2)
      } catch {
        return String(value)
      }
    }
    return ""
  }

  const renderInvestmentPlan = (plan: unknown) => {
    if (!plan) return null
    if (typeof plan === "string") {
      return <div className="whitespace-pre-wrap leading-relaxed">{plan}</div>
    }
    if (plan && typeof plan === "object") {
      const actionsRaw =
        (plan as any).strategic_actions ??
        (plan as any).actions ??
        (plan as any).steps ??
        []
      const actions = Array.isArray(actionsRaw) ? actionsRaw : []
      return (
        <div className="space-y-3">
          {actions.length ? (
            <div>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                {actions.map((action, idx) => (
                  <li key={idx} className="whitespace-pre-wrap leading-relaxed">
                    {formatValue(action)}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      )
    }
    return <div className="whitespace-pre-wrap leading-relaxed">{formatValue(plan)}</div>
  }

  function parseFormattedData(raw: unknown): { parsed: FormattedData | null; raw: string | null } {
    if (!raw) return { parsed: null, raw: null }

    if (typeof raw === "object") {
      return { parsed: raw as FormattedData, raw: JSON.stringify(raw, null, 2) }
    }

    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw)
        return { parsed, raw }
      } catch {
        return { parsed: null, raw }
      }
    }

    return { parsed: null, raw: String(raw) }
  }

  function buildReportPanelData(payload: any): ReportPanelData {
    if (!payload || typeof payload !== "object") {
      return { formattedData: null, formattedRaw: null, reports: [] }
    }

    const rawFormatted =
      payload.formatted_data ??
      payload.formattedData ??
      payload.extract_formatted_data ??
      payload.extractFormattedData ??
      null

    const { parsed: formattedData, raw: formattedRaw } = parseFormattedData(rawFormatted)

    const analytics = payload.analytics ?? payload.analyst_reports ?? payload.reports ?? {}

    const entries: ReportEntry[] = []
    const addReport = (id: string, label: string, content: any) => {
      if (content && typeof content === "string" && content.trim().length > 0) {
        entries.push({ id, label, content: content.trim() })
      }
    }

    addReport("tradeDecision", "Trade decision", payload.final_trade_decision ?? payload.trade_decision ?? payload.decision)
    addReport("riskReport", "Risk report", payload.risk_report ?? payload.risk)
    addReport("debateReport", "Debate report", payload.debate_report ?? payload.debate)

    addReport("newsReport", "News report", analytics.news_report ?? analytics.news)
    addReport("marketReport", "Market report", analytics.market_report ?? analytics.market)
    addReport("fundamentalsReport", "Fundamentals report", analytics.fundamentals_report ?? analytics.fundamentals)
    addReport("sentimentReport", "Sentiment report", analytics.sentiment_report ?? analytics.sentiment)

    return { formattedData, formattedRaw, reports: entries }
  }

  function pushReportToChat(entry: ReportEntry) {
    setMessages(prev => [
      ...prev,
      { sender: "ai", text: `${entry.label}:\n${entry.content}` }
    ])
  }

  async function sendMessage(promptOverride?: string) {
    const text = (promptOverride ?? input).trim()
    if (!text) return

    const msg = { sender: "user", text }
    const nextMessages = [...messages, msg]
    setMessages(nextMessages)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMessages))
    setIsLoading(true)
    setIsReportOpen(false)
    window.localStorage.setItem(STORAGE_PENDING_KEY, JSON.stringify({ prompt: text }))

    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text })
      })

      const data = await response.json()

      if (response.ok) {
        const persistedMessages = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]")
        const newMessages = [
          ...persistedMessages,
          { sender: "ai", text: data.response },
          { sender: "ai", text: data.analysis }
        ]
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages))
        if (mountedRef.current) {
          setMessages(newMessages)
        }

        const panelData = buildReportPanelData(data.report ?? data.stock_report ?? data.analysis ?? data)
        if (panelData.formattedData || panelData.reports.length) {
          setReportPanel(panelData)
          setIsReportOpen(true)
        }
      } else {
        const persistedMessages = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]")
        const errorMessages = [
          ...persistedMessages,
          { sender: "ai", text: `Error: ${data.error}` }
        ]
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(errorMessages))
        if (mountedRef.current) {
          setMessages(errorMessages)
        }
      }
    } catch (error) {
      console.error("API Error:", error)
      const persistedMessages = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]")
      const errorMessages = [
        ...persistedMessages,
        { sender: "ai", text: "Sorry, I couldn't connect to the analysis server. Make sure the backend is running on http://localhost:5000" }
      ]
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(errorMessages))
      if (mountedRef.current) {
        setMessages(errorMessages)
      }
    } finally {
      window.localStorage.removeItem(STORAGE_PENDING_KEY)
      if (mountedRef.current) {
        setIsLoading(false)
      }
    }

    setInput("")
  }

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Accept prompt from query string (e.g., /chat?prompt=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const prompt = params.get("prompt")
    if (prompt && prompt.trim()) {
      setInput(prompt)
      // slight async to allow state to set before sending
      setTimeout(() => sendMessage(prompt), 0)
    }
  }, [location.search])

  return (
    <div className="relative flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-background text-foreground">

      {/* Chat Scroll Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm break-words shadow-sm border border-border ${
              msg.sender === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "mr-auto bg-card text-foreground"
            }`}
          >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    ul: ({node, ...props}) => <ul className="list-disc ml-6 my-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal ml-6 my-2" {...props} />,
                    li: ({node, ...props}) => <li className="my-1" {...props} />,
                    p: ({node, ...props}) => <p className="my-2" {...props} />,
                }}
            >

                {msg.text || ""}
            </ReactMarkdown>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {reportPanel.reports.length > 0 || reportPanel.formattedData ? (
        <Sheet open={isReportOpen} onOpenChange={setIsReportOpen}>
          <div className="absolute right-4 top-4">
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                {isReportOpen ? "Hide analysis" : "View analysis"}
              </Button>
            </SheetTrigger>
          </div>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Stock report</SheetTitle>
              <SheetDescription>Structured details from the latest analysis.</SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4">
              {reportPanel.formattedData ? (
                <div className="bg-muted/40 border border-border rounded-lg p-4 space-y-3">
                  <div className="text-sm font-semibold">Decision summary</div>
                  <div className="grid gap-3 text-sm">
                    {reportPanel.formattedData.decision ? (
                      <div>
                        <div className="text-muted-foreground text-xs uppercase tracking-wide">Decision</div>
                        <div className="font-medium whitespace-pre-wrap">{formatValue(reportPanel.formattedData.decision)}</div>
                      </div>
                    ) : null}
                    {reportPanel.formattedData.rationale ? (
                      <div>
                        <div className="text-muted-foreground text-xs uppercase tracking-wide">Rationale</div>
                        <div className="whitespace-pre-wrap leading-relaxed">{formatValue(reportPanel.formattedData.rationale)}</div>
                      </div>
                    ) : null}
                    {reportPanel.formattedData.risk_assessment ? (
                      <div>
                        <div className="text-muted-foreground text-xs uppercase tracking-wide">Risk assessment</div>
                        <div className="whitespace-pre-wrap leading-relaxed">{formatValue(reportPanel.formattedData.risk_assessment)}</div>
                      </div>
                    ) : null}
                    {reportPanel.formattedData.investment_plan ? (
                      <div>
                        <div className="text-muted-foreground text-xs uppercase tracking-wide">Investment plan</div>
                        {renderInvestmentPlan(reportPanel.formattedData.investment_plan)}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : reportPanel.formattedRaw ? (
                <div className="bg-muted/40 border border-border rounded-lg p-3">
                  <div className="text-sm font-medium mb-2">extract_formatted_data (raw)</div>
                  <pre className="text-xs whitespace-pre-wrap break-words">
                    {reportPanel.formattedRaw}
                  </pre>
                </div>
              ) : null}

              {reportPanel.reports.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Reports</div>
                  <div className="grid gap-2">
                    {reportPanel.reports.map(entry => (
                      <Button
                        key={entry.id}
                        variant="secondary"
                        className="justify-start text-left"
                        onClick={() => pushReportToChat(entry)}
                      >
                        {entry.label}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </SheetContent>
        </Sheet>
      ) : null}

      {/* Floating Chat Input */}
      <div className="flex-shrink-0 px-4 py-6 bg-gradient-to-t from-background via-background/90 to-transparent border-t border-border">
        <div className="bg-card border border-border shadow-lg rounded-full p-2 pl-4 flex items-center gap-3 max-w-2xl mx-auto">

        <Input
          className="flex-1 border-none shadow-none focus-visible:ring-0 focus:outline-none rounded-full bg-transparent"
          placeholder="Ask about any stock…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />

        <Button
          onClick={sendMessage}
          disabled={isLoading}
          className="rounded-full px-6"
        >
        {isLoading ? "Analyzing..." : "Send"}
        </Button>

        </div>
      </div>


    </div>
  )
}
