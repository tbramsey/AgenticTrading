import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import TopBar from "@/components/topbar.tsx"

export default function RootLayout() {
  // const cookieStore = await cookies()
  // const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <SidebarProvider>
        <div className="flex flex-1 w-full min-h-0">
          
          <div>
            <AppSidebar />
          </div>
          
          <SidebarInset className="min-h-0">
            <main className="flex-1">
              <SidebarTrigger />
              <Outlet />
            </main>        
          </SidebarInset>

        </div>
      </SidebarProvider>
      </div>
    

  )
}
