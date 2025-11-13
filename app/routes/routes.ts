// routes.ts

// 1. IMPORT React: Necessary for the JSX syntax used below.
import React from 'react'; 
import { type RouteConfig, index } from "@react-router/dev/routes";

// The default export structure required by your tooling:
export default [index("routes/home.tsx")] satisfies RouteConfig;

// 2. IMPORT COMPONENTS: FIX - Import the default export from the new file (Main.tsx) 
//     and alias it to Main to match the router usage.
import Main from 'frontend/src/Main'; 

// 3. DEFINE ROUTES: The main configuration array exported for the router.
export const routes = [
  {
    path: "/",
    // The element is now rendered as JSX (<Component />)
    element: <Main />
  }
];