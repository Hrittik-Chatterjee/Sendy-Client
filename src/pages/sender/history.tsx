import { useState } from "react";
import { useGetMyParcelsQuery } from "@/redux/features/parcel/parcel.api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin, Weight, Calendar, Search, Truck, Clock, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { IMyParcelsData, IParcel } from "@/types";

const History = () => {
  const { data, isLoading, isError } = useGetMyParcelsQuery(undefined);
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");
  const [searchQuery, setSearchQuery] = useState("");

  const myParcels = data as IMyParcelsData | undefined;

  console.log(myParcels);

  // Filter parcels to show only cancelled or delivered ones
  // For sent parcels: show both cancelled and delivered
  // For received parcels: show only delivered (receivers cannot see cancelled parcels)
  const filterHistoryParcels = (parcels: IParcel[], isSent: boolean) => {
    return parcels.filter((parcel) => {
      const status = parcel.currentStatus.toLowerCase();
      if (status === "delivered") return true;
      if (status === "cancelled" && isSent) return true;
      return false;
    });
  };

  // Filter parcels based on search query
  const filterParcels = (parcels: IParcel[]) => {
    if (!searchQuery) return parcels;

    return parcels.filter(
      (parcel) =>
        parcel.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parcel.currentStatus
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        parcel.pickupAddress
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        parcel.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // First filter for history status, then apply search filter
  const sentParcels = filterParcels(filterHistoryParcels(myParcels?.sent || [], true));
  const receivedParcels = filterParcels(filterHistoryParcels(myParcels?.received || [], false));
  const activeParcels = activeTab === "sent" ? sentParcels : receivedParcels;

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-600 bg-green-50 border-green-200";
      case "requested":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "in transit":
      case "picked up":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Parcel History</h1>
          <p className="text-muted-foreground">
            View all your sent and received parcels
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <Button
            variant={activeTab === "sent" ? "default" : "ghost"}
            onClick={() => setActiveTab("sent")}
            className="rounded-b-none"
          >
            Sent ({myParcels?.sent.length || 0})
          </Button>
          <Button
            variant={activeTab === "received" ? "default" : "ghost"}
            onClick={() => setActiveTab("received")}
            className="rounded-b-none"
          >
            Received ({myParcels?.received.length || 0})
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by tracking ID, status, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-destructive">
                Failed to load parcels. Please try again later.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Parcels List */}
        {!isLoading && !isError && (
          <>
            {activeParcels.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center space-y-2">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? "No parcels found matching your search"
                        : `No ${activeTab} parcels yet`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeParcels.map((parcel) => (
                  <Card
                    key={parcel._id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Tracking ID: {parcel.trackingId}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {activeTab === "sent" && parcel.receiverId && typeof parcel.receiverId === "object" && (
                              <span>
                                To: {parcel.receiverId.name} (
                                {parcel.receiverId.email})
                              </span>
                            )}
                            {activeTab === "received" && parcel.senderId && typeof parcel.senderId === "object" && (
                              <span>
                                From: {parcel.senderId.name} (
                                {parcel.senderId.email})
                              </span>
                            )}
                          </CardDescription>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                            parcel.currentStatus
                          )}`}
                        >
                          {parcel.currentStatus}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Addresses */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            Pickup Address
                          </p>
                          <p className="text-sm text-muted-foreground pl-6">
                            {parcel.pickupAddress}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            Delivery Address
                          </p>
                          <p className="text-sm text-muted-foreground pl-6">
                            {parcel.deliveryAddress}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Details */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Weight className="h-3 w-3" />
                            Weight
                          </p>
                          <p className="font-medium">{parcel.weight} kg</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            Fee
                          </p>
                          <p className="font-medium">${parcel.fee}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Created
                          </p>
                          <p className="font-medium text-sm">
                            {new Date(parcel.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Status Log Button */}
                      <div className="flex justify-end">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-2" />
                              View Status Log
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                            <SheetHeader>
                              <SheetTitle>Status Log</SheetTitle>
                              <SheetDescription>
                                Track the complete history of this parcel
                              </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6 space-y-4">
                              {/* Parcel Info */}
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-sm">Parcel Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tracking ID:</span>
                                    <span className="font-mono font-medium">{parcel.trackingId}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Current Status:</span>
                                    <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${getStatusColor(parcel.currentStatus)}`}>
                                      {parcel.currentStatus}
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Status History */}
                              <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  Status History
                                </h3>

                                {parcel.statusLogs && parcel.statusLogs.length > 0 ? (
                                  <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                                    {parcel.statusLogs.map((log, index) => (
                                      <div key={index} className="relative pl-8">
                                        <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                                        <Card>
                                          <CardContent className="pt-4 space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                              <span className="font-medium text-sm">{log.status}</span>
                                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                {new Date(log.timestamp).toLocaleString()}
                                              </span>
                                            </div>
                                            {log.location && (
                                              <p className="text-sm text-muted-foreground flex items-start gap-1">
                                                <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                                <span>{log.location}</span>
                                              </p>
                                            )}
                                            {log.note && (
                                              <p className="text-sm text-muted-foreground">
                                                {log.note}
                                              </p>
                                            )}
                                          </CardContent>
                                        </Card>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <Card>
                                    <CardContent className="py-8">
                                      <p className="text-center text-sm text-muted-foreground">
                                        No status history available
                                      </p>
                                    </CardContent>
                                  </Card>
                                )}
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default History;
