import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./routes";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((r) => {
          const Component = r.element;
          return <Route key={r.path} path={r.path} element={<Component />} />;
        })}
      </Routes>
    </BrowserRouter>
  );
}
