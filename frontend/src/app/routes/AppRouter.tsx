import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 1. Import your NavBar
import NavBar from "../../components/NavBar";

// 2. Import your pages
import DashboardPage from "./dashboard";
import StocksPage from "./stocks";
import ChatPage from "./trading";

export default function AppRouter() {
  return (
    <Router>
      {/* 3. Place NavBar inside the Router, but outside Routes */}
      <NavBar />

      <div style={{ padding: "0" }}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/stocks" element={<StocksPage />} />
          <Route path="/trading" element={<ChatPage />} />
          
          {/* Default redirect */}
          <Route path="/" element={<DashboardPage />} />
        </Routes>
      </div>
    </Router>
  );
}