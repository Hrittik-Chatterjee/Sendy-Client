import App from "@/App";
import AdminLayout from "@/components/layout/AdminLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import About from "@/pages/About";
import Analytics from "@/pages/admin/Analytics";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

import Verify from "@/pages/Verify";
import { createBrowserRouter } from "react-router";

import { generateRoutes } from "@/utils/generateRoutes";
import { adminSidebarItems } from "./adminsidebaritems";
import { senderSideBarItems } from "./senderSideBarItems";
import { receiverSidebarItems } from "./receiverSidebarItems";

export const router = createBrowserRouter([
  {
    Component: App,
    path: "/",
    children: [
      {
        Component: About,
        path: "about",
      },
    ],
  },
  {
    Component: DashboardLayout,
    path: "/admin",
    children: [...generateRoutes(adminSidebarItems)],
  },
  {
    Component: DashboardLayout,
    path: "/sender",

    children: [...generateRoutes(senderSideBarItems)],
  },
  {
    Component: DashboardLayout,
    path: "/receiver",

    children: [...generateRoutes(receiverSidebarItems)],
  },

  {
    Component: Login,
    path: "login",
  },
  {
    Component: Register,
    path: "register",
  },
  {
    Component: Verify,
    path: "verify",
  },

  {
    Component: AdminLayout,
    path: "/admin",
    children: [
      {
        Component: Analytics,
        path: "analytics",
      },
    ],
  },
]);
