import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function TopBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = useState("")

  // Keep the search box in sync with the active /search route, if present.
  useEffect(() => {
    const parts = location.pathname.split("/").filter(Boolean)
    if (parts[0] === "search" && parts[1]) {
      setQuery(decodeURIComponent(parts[1]))
    }
  }, [location.pathname])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const next = query.trim()
    if (!next) return
    navigate(`/search/${encodeURIComponent(next.toUpperCase())}`)
  }

  return (
    <header className="h-16 w-full bg-background border-b border-border flex items-center px-6 gap-6">
      {/* Search Bar */}
      <form className="flex-1 flex justify-center py-2" onSubmit={handleSubmit}>
        <Input
          className="w-1/2 rounded-xl"
          placeholder="Search ticker (e.g., AAPL)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="hidden" aria-hidden="true" />
      </form>

      {/* User */}
      <div className="flex items-center gap-3">
        <span className="font-medium text-foreground">Jack Sparrow</span>

        <Avatar className="bg-primary text-primary-foreground">
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
