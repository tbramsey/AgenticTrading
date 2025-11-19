import { Outlet } from "react-router-dom"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import TopBar from "@/components/topbar.tsx"

export default function RootLayout() {
  // const cookieStore = await cookies()
  // const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />

      <SidebarProvider variant="inset">
        <div className="flex min-h-[calc(100vh-64px)] w-full">
          
          <div className="pt-16">
            <AppSidebar />
          </div>
          
          <SidebarInset>
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
