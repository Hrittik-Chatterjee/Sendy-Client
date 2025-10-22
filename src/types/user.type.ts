import type { TRole } from "./index";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  roles: TRole[];
  isActive: "ACTIVE" | "INACTIVE";
  isDeleted: boolean;
  isVerified: boolean;
  auths: {
    provider: string;
    providerId: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateUser {
  name?: string;
  email?: string;
  roles?: TRole[];
  isActive?: "ACTIVE" | "INACTIVE";
  isDeleted?: boolean;
  isVerified?: boolean;
  password?: string;
}

export interface IGetAllUsersResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    total: number;
  };
  data: IUser[];
}
