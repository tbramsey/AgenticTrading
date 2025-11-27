import { Welcome } from "./welcome";
import { DashboardPage } from "./dashboard";
import { StocksPage } from "./stocks";
import type { ComponentType } from "react";
import ChatPage from "./trading";

export interface AppRoute {
  path: string;
  element: ComponentType;
}

const routes: AppRoute[] = [
  { path: "/", element: Welcome },
  { path: "/dashboard", element: DashboardPage },
  { path: "/stocks", element: StocksPage },
  { path: "/trading", element: ChatPage },
];

export default routes;
