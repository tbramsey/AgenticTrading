import type { Route } from "./+types/home";
// FIX: Import Main directly from the local file where it is defined (welcome.tsx, now exported as Main)
import Main from "frontend/src/Main";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Berry Financial Dashboard" },
    { name: "description", content: "A modern fintech dashboard using React and Tailwind CSS." },
  ];
}

export default function Home() {
  // FIX: Render the component imported from welcome.tsx
  return <Main />;
}