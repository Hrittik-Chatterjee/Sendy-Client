import type { ComponentType } from "react";

export type { ISendOtp, IVerifyOtp, ILogin } from "./auth.type";
export type { IUser, IUpdateUser, IGetAllUsersResponse } from "./user.type";
export type {
  IStatusLog,
  IParcel,
  TParcelStatus,
  IMyParcelsData,
  IParcelResponse,
} from "./parcel.type";

export interface IPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IPaginatedResponse<T> {
  data: T;
  meta: IPaginationMeta;
}

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: IPaginationMeta;
}

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
  }[];
}

export type TRole = "SUPER_ADMIN" | "ADMIN" | "SENDER" | "RECEIVER";
