import Analytics from "@/pages/admin/Analytics";
import Parcels from "@/pages/admin/Parcels";
import Users from "@/pages/admin/Users";
import type { ISidebarItem } from "@/types";

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
