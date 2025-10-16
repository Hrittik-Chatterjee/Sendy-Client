import { lazy } from "react";
import type { ISidebarItem } from "@/types";

const Analytics = lazy(() => import("@/pages/admin/Analytics"));
const Parcels = lazy(() => import("@/pages/admin/Parcels"));
const Users = lazy(() => import("@/pages/admin/Users"));

export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",

    items: [
      {
        title: "Analytics",
        url: "/admin/analytics",
        component: Analytics,
      },
    ],
  },
  {
    title: "Management",

    items: [
      {
        title: "Parcels",
        url: "/admin/parcels",
        component: Parcels,
      },
      {
        title: "Users",
        url: "/admin/users",
        component: Users,
      },
      {
        title: "jabi",
        url: "/admin/jabi",
        component: Users,
      },
    ],
  },
];
