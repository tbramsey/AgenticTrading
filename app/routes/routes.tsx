import { type RouteConfig, index } from "@react-router/dev/routes";
import React from 'react';

import { DashboardPage } from "../../frontend/src/dashboard"; 
import { Welcome } from "../../frontend/src/welcome";


export default [index("routes/home.tsx")] satisfies RouteConfig;

export const routes = [
    {
        path: "/",
        element: <Welcome />
    },
    {
        path: "/dashboard",
        element: <DashboardPage />
    }
];