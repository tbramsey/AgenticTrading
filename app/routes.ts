import { type RouteConfig, index } from "@react-router/dev/routes";

export default [index("routes/home.tsx")] satisfies RouteConfig;

import { DashboardPage } from "./welcome/dashboard"; 
import { Welcome } from "./welcome/welcome";

import type { ReactNode } from 'react';
import React from "react";

export const routes: Array<{
  path: string;
  element: ReactNode;
}> = [
  {
    path: "/",
    element: React.createElement(Welcome)
  },
  {
    path: "/dashboard",
    element: React.createElement(DashboardPage)
  }
];