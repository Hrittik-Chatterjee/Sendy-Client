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
import { Package, MapPin, Weight, Calendar, Search, Truck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Parcel {
  _id: string;
  trackingId: string;
  currentStatus: string;
  pickupAddress: string;
  deliveryAddress: string;
  weight: number;
  fee: number;
  createdAt: string;
  receiverId?: {
    _id: string;
    name: string;
    email: string;
  };
  senderId?: {
    _id: string;
    name: string;
    email: string;
  };
}

interface MyParcelsData {
  sent: Parcel[];
  received: Parcel[];
}

const History = () => {
  const { data, isLoading, isError } = useGetMyParcelsQuery(undefined);
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");
  const [searchQuery, setSearchQuery] = useState("");

  const myParcels = data as MyParcelsData | undefined;

  console.log(myParcels);

  // Filter parcels based on search query
  const filterParcels = (parcels: Parcel[]) => {
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

  const sentParcels = filterParcels(myParcels?.sent || []);
  const receivedParcels = filterParcels(myParcels?.received || []);
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
                            {activeTab === "sent" && parcel.receiverId && (
                              <span>
                                To: {parcel.receiverId.name} (
                                {parcel.receiverId.email})
                              </span>
                            )}
                            {activeTab === "received" && parcel.senderId && (
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
