import App from "@/App";

import DashboardLayout from "@/components/layout/DashboardLayout";
import About from "@/pages/About";

import Login from "@/pages/Login";
import Register from "@/pages/Register";

import Verify from "@/pages/Verify";
import { createBrowserRouter, Navigate } from "react-router";

import { generateRoutes } from "@/utils/generateRoutes";
import { adminSidebarItems } from "./adminsidebaritems";
import { senderSideBarItems } from "./senderSideBarItems";
import { receiverSidebarItems } from "./receiverSidebarItems";
import Unauthorized from "@/pages/Unauthorized";
import { withAuth } from "@/utils/withAuth";
import { role } from "@/constants/role";

// Create protected dashboard layouts
const AdminDashboard = withAuth(DashboardLayout, role.admin as "ADMIN");
const SenderDashboard = withAuth(DashboardLayout, role.sender as "SENDER");
const ReceiverDashboard = withAuth(DashboardLayout, role.receiver as "RECEIVER");

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
    Component: AdminDashboard,
    path: "/admin",
    children: [
      { index: true, element: <Navigate to="/admin/analytics" /> },
      ...generateRoutes(adminSidebarItems),
    ],
  },
  {
    Component: SenderDashboard,
    path: "/sender",
    children: [
      { index: true, element: <Navigate to="/sender/send-parcel" /> },
      ...generateRoutes(senderSideBarItems),
    ],
  },
  {
    Component: ReceiverDashboard,
    path: "/receiver",
    children: [
      { index: true, element: <Navigate to="/receiver/incoming-parcels" /> },
      ...generateRoutes(receiverSidebarItems),
    ],
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
    Component: Unauthorized,
    path: "/unauthorized",
  },
]);
