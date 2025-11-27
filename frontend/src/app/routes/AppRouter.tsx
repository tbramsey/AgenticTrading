import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 1. Import PageLayout (Note the curly braces {}) 
// because it was a named export in the previous file
import { PageLayout } from "../../components/NavBar";

// 2. Import your pages
import DashboardPage from "./Dashboard";
import PortfolioPage from "./PortfolioPage";
import ChatPage from "./trading";

export default function AppRouter() {
  return (
    <Router>
      {/* 3. Use PageLayout instead of <NavBar /> + <div>.
        This automatically renders the sidebar and pushes the content 
        260px to the right to prevent overlap.
      */}
      <PageLayout>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Note: Make sure the 'to' links in NavBar.js match these paths */}
          <Route path="/stock-analysis" element={<ChatPage />} /> 
          <Route path="/market" element={<ChatPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          
          {/* Default redirect */}
          <Route path="/" element={<DashboardPage />} />
        </Routes>
      </PageLayout>
    </Router>
  );
}