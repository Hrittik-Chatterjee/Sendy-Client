export type TParcelStatus =
  | "Requested"
  | "Approved"
  | "Dispatched"
  | "In Transit"
  | "Delivered"
  | "Cancelled";

export interface IStatusLog {
  status: TParcelStatus;
  timestamp: string;
  updatedBy?: string;
  location?: string;
  note?: string;
}

export interface IParcel {
  _id: string;
  trackingId: string;
  currentStatus: TParcelStatus;
  createdAt: string;
  updatedAt: string;
  weight: number;
  fee: number;
  pickupAddress: string;
  deliveryAddress: string;
  isBlocked?: boolean;
  statusLogs?: IStatusLog[];
  receiverId?: string | {
    _id: string;
    name: string;
    email: string;
  };
  senderId?: string | {
    _id: string;
    name: string;
    email: string;
  };
}

export interface IMyParcelsData {
  sent: IParcel[];
  received: IParcel[];
}

export interface IParcelResponse {
  message: string;
  data?: unknown;
}
