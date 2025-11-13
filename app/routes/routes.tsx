import { type RouteConfig, index } from "@react-router/dev/routes";
import React from 'react';
// FIX: Import the renamed component (Main) from the local file (welcome.tsx)


export default [index("routes/home.tsx")] satisfies RouteConfig;

export const routes = [
    {
        path: "/",
        // FIX: The element is now imported as Main and correctly rendered as JSX
        element: <Main />
    }
];