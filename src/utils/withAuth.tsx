import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import type { TRole } from "@/types";
import type { ComponentType } from "react";

import { Navigate } from "react-router";

const hasRoleAccess = (userRoles: TRole[], requiredRole: TRole): boolean => {
  if (userRoles.includes("SUPER_ADMIN")) {
    return true;
  }

  return userRoles.includes(requiredRole);
};

export const withAuth = (Component: ComponentType, requiredRole?: TRole) => {
  return function AuthWrapper() {
    const { data, isLoading } = useUserInfoQuery(undefined);

    if (!isLoading && !data?.data?.data?.email) {
      return <Navigate to="/login" />;
    }

    if (
      requiredRole &&
      !isLoading &&
      !hasRoleAccess(data?.data?.data?.roles || [], requiredRole)
    ) {
      return <Navigate to="/unauthorized" />;
    }

    return <Component />;
  };
};
