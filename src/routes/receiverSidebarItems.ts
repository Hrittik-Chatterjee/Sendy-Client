import { lazy } from "react";
import type { ISidebarItem } from "@/types";

const IncomingParcels = lazy(() => import("@/pages/receiver/IncomingParcels"));
const ConfirmDelivery = lazy(() => import("@/pages/receiver/ConfirmDelivery"));
const DeliveryHistory = lazy(() => import("@/pages/receiver/DeliveryHistory"));

export const receiverSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",

    items: [
      {
        title: "Incoming Parcels",
        url: "/receiver/incoming-parcels",
        component: IncomingParcels,
      },
    ],
  },
  {
    title: "Delivery",

    items: [
      {
        title: "Confirm Delivery",
        url: "/receiver/confirm-delivery",
        component: ConfirmDelivery,
      },
      {
        title: "Delivery History",
        url: "/receiver/delivery-history",
        component: DeliveryHistory,
      },
    ],
  },
];
