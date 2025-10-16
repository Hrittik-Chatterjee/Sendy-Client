import { lazy } from "react";
import type { ISidebarItem } from "@/types";

const SendParcel = lazy(() => import("@/pages/sender/sendParcel"));
const ParcelDetails = lazy(() => import("@/pages/sender/parcelDetails"));
const History = lazy(() => import("@/pages/sender/history"));

export const senderSideBarItems: ISidebarItem[] = [
  {
    title: "Parcel Informations",
    items: [
      {
        title: "Send Parcel",
        url: "/sender/send-parcel",
        component: SendParcel,
      },
      {
        title: "Parcel Details",
        url: "/sender/parcel-details",
        component: ParcelDetails,
      },
      {
        title: "History",
        url: "/sender/history",
        component: History,
      },
    ],
  },
];
