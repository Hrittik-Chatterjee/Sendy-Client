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

  // Flatten and merge items with same section title
  const mergedSections = new Map<string, ISidebarItem>();

  allItems.flat().forEach((section) => {
    if (mergedSections.has(section.title)) {
      // Merge sections with same title
      const existing = mergedSections.get(section.title)!;

      // Deduplicate items by title within the section
      // Keep only the first occurrence of items with the same title
      const existingTitles = new Set(existing.items.map((i) => i.title));
      const newItems = section.items.filter((i) => !existingTitles.has(i.title));

      existing.items = [...existing.items, ...newItems];
    } else {
      mergedSections.set(section.title, { ...section });
    }
  });

  return Array.from(mergedSections.values());
};
