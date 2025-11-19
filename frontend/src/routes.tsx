import { Routes, Route } from "react-router-dom"
import RootLayout from "@/layout/layout"
import Dashboard from "@/pages/dashboard"
import AuthPage from "@/pages/authPage"

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public route (no sidebar) */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Routes wrapped in the sidebar layout */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<Dashboard />} />
      </Route>
      {/* Catch-all 404 */}
      <Route path="*" element={<div className="text-black p-8">404 Not Found</div>} />
    </Routes>
  )
}
