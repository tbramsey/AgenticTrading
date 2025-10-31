import { Welcome } from "./welcome";
import { DashboardPage } from "./dashboard";
import { StocksPage } from "./stocks";
import type { ComponentType } from "react";

export interface AppRoute {
  path: string;
  element: ComponentType;
}

const routes: AppRoute[] = [
  { path: "/", element: Welcome },
  { path: "/dashboard", element: DashboardPage },
  { path: "/stocks", element: StocksPage },
];

export default routes;
