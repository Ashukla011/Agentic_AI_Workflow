import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Dashboard } from "./components/Dashboard";
import { WorkflowBuilder } from "./components/WorkflowBuilder";
import { Agents } from "./components/Agents";
import { Processes } from "./components/Processes";
import { Analytics } from "./components/Analytics";
import { Settings } from "./components/Settings";
import { Login } from "./components/Login";
import { Register } from "./components/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "workflows", Component: WorkflowBuilder },
      { path: "agents", Component: Agents },
      { path: "processes", Component: Processes },
      { path: "analytics", Component: Analytics },
      { path: "settings", Component: Settings },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
]);
