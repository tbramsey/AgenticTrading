import { Book, Home, Inbox, Moon, Search, Settings, Sun, MessageSquareText, ChartCandlestick } from "lucide-react"
import { useEffect, useState } from "react"

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
    url: "/",
    icon: Home,
  },
  {
    title: "Portfolio",
    url: "portfolio",
    icon: ChartCandlestick,
  },
  {
    title: "Analyze",
    url: "chat",
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
  {
    title: "Settings",
    url: "#",
    icon: Settings,
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

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarHeader>
          <SidebarGroupContent>
            <SidebarMenu>
              {
                <SidebarMenuItem key={"Logo"}>
                  <SidebarMenuButton asChild>
                    <a href={"/"}>
                      <img src="/vite.svg" className="w-7 h-7" />
                      <span>{"Barry"}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              }
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Appearance</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

          // <div className="flex items-center gap-2 p-2">
          //   <img src="/vite.svg" className="w-7 h-7" />
          //   <span className="font-semibold text-lg">Barry</span>
          // </div>
