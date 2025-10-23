import { lazy } from "react";
import type { ISidebarItem } from "@/types";

const IncomingParcels = lazy(() => import("@/pages/receiver/IncomingParcels"));
const ConfirmDelivery = lazy(() => import("@/pages/receiver/ConfirmDelivery"));
const History = lazy(() => import("@/pages/sender/history"));

export const receiverSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Incoming Parcels",
        url: "/receiver/incoming-parcels",
        component: IncomingParcels,
      },
      {
        title: "Confirm Delivery",
        url: "/receiver/confirm-delivery",
        component: ConfirmDelivery,
      },
      {
        title: "History",
        url: "/receiver/history",
        component: History,
      },
    ],
  },
];
