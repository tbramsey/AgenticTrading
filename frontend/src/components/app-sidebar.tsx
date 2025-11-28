import { Book, Home, Inbox, Moon, Search, Settings, Sun, MessageSquareText, ChartCandlestick } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { type Theme, initTheme, toggleThemePreference } from "@/lib/theme"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Portfolio",
    url: "/portfolio",
    icon: ChartCandlestick,
  },
  {
    title: "Analyze",
    url: "/chat",
    icon: MessageSquareText,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Learn",
    url: "learn",
    icon: Book,
  },
]

export function AppSidebar() {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    const current = initTheme()
    setTheme(current)
  }, [])

  const handleToggleTheme = () => {
    setTheme((prev) => toggleThemePreference(prev))
  }

  const SidebarSection = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>{children}</SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarHeader>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key="logo">
                <SidebarMenuButton asChild>
                  <Link to="/dashboard">
                    <img src="/vite.svg" className="w-7 h-7" />
                    <span>Barry</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarHeader>

        <SidebarSection label="Application">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarSection>

        <SidebarSection label="Appearance">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={handleToggleTheme}
              >
                {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
                <span>{theme === "dark" ? "Dark mode" : "Light mode"}</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarSection>

        <SidebarSection label="Miscellaneous">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="#">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarSection>
      </SidebarContent>
    </Sidebar>
  )
}
