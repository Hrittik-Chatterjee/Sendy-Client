import IncomingParcels from "@/pages/receiver/IncomingParcels";
import ConfirmDelivery from "@/pages/receiver/ConfirmDelivery";
import DeliveryHistory from "@/pages/receiver/DeliveryHistory";
import type { ISidebarItem } from "@/types";

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
