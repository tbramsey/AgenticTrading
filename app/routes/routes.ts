// routes.ts

// 1. IMPORT React: Necessary for the JSX syntax used below.
import React from 'react'; 
import { type RouteConfig, index } from "@react-router/dev/routes";

// The default export structure required by your tooling:
export default [index("routes/home.tsx")] satisfies RouteConfig;

// 2. IMPORT COMPONENTS: Corrected paths assume dashboard.tsx and welcome.tsx 
//    are siblings to routes.ts (e.g., all in the 'app/' directory).
import { DashboardPage } from 'frontend/src/dashboard'; 
import { Welcome } from 'frontend/src/welcome'; 

// 3. DEFINE ROUTES: The main configuration array exported for the router.
export const routes = [
  {
    path: "/",
    // CRITICAL FIX: The element must be rendered as JSX (<Component />)
    element: Welcome 
  },
  {
    path: "/dashboard",
    // CRITICAL FIX: The element must be rendered as JSX
    element: DashboardPage
  }
];