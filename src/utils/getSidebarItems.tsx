import { role } from "@/constants/role";
import { adminSidebarItems } from "@/routes/adminSidebarItems";
import { receiverSidebarItems } from "@/routes/receiverSidebarItems";
import { senderSideBarItems } from "@/routes/senderSidebarItems";

import type { TRole, ISidebarItem } from "@/types";

export const getSidebarItems = (userRoles: TRole | TRole[] | undefined) => {
  if (!userRoles) return [];

  const rolesArray = Array.isArray(userRoles) ? userRoles : [userRoles];

  // If user has SUPER_ADMIN or ADMIN role, they ONLY see admin sidebar
  if (
    rolesArray.includes(role.superAdmin as TRole) ||
    rolesArray.includes(role.admin as TRole)
  ) {
    return adminSidebarItems;
  }

  const allItems: ISidebarItem[][] = [];

  rolesArray.forEach((userRole) => {
    switch (userRole) {
      case role.sender:
        allItems.push([...senderSideBarItems]);
        break;
      case role.receiver:
        allItems.push([...receiverSidebarItems]);
        break;
    }
  });

  // Flatten and merge items with same title
  const mergedItems = new Map<string, ISidebarItem>();

  allItems.flat().forEach((item) => {
    if (mergedItems.has(item.title)) {
      // Merge items with same title
      const existing = mergedItems.get(item.title)!;
      existing.items = [...existing.items, ...item.items];
    } else {
      mergedItems.set(item.title, { ...item });
    }
  });

  return Array.from(mergedItems.values());
};
