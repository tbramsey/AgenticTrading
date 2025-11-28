import { Routes, Route } from "react-router-dom"
import RootLayout from "@/layout/layout"
import Dashboard from "@/pages/dashboard"
import AuthPage from "@/pages/authPage"
import ChatBot from "@/pages/chatBot"
import Education from "@/pages/educationPage"
import Portfolio from "@/pages/portfolioPage"
import IntroPage from "@/pages/introduction"
import ArticlePage from "@/pages/article"

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public route (no sidebar) */}
      <Route path="/auth" element={<AuthPage />} />

      <Route path="/" element={<IntroPage />} />

      {/* Routes wrapped in the sidebar layout */}
      <Route element={<RootLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route element={<RootLayout />}>
        <Route path="/chat" element={<ChatBot />} />
      </Route>

      <Route element={<RootLayout />}>
        <Route path="/learn" element={<Education />} />
        <Route path="/learn/:id" element={<ArticlePage />} />
      </Route>

      <Route element={<RootLayout />}>
        <Route path="/portfolio" element={<Portfolio />} />
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<div className="text-black p-8">404 Not Found</div>} />
    </Routes>
  )
}
