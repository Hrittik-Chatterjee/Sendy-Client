import history from "@/pages/sender/history";
import parcelDetails from "@/pages/sender/parcelDetails";
import sendParcel from "@/pages/sender/sendParcel";
import type { ISidebarItem } from "@/types";

export const senderSideBarItems: ISidebarItem[] = [
  {
    title: "Parcel Informations",
    items: [
      {
        title: "Send Parcel",
        url: "/sender/send-parcel",
        component: sendParcel,
      },
      {
        title: "Parcel Details",
        url: "/sender/parcel-details",
        component: parcelDetails,
      },
      {
        title: "History",
        url: "/sender/history",
        component: history,
      },
    ],
  },
];
