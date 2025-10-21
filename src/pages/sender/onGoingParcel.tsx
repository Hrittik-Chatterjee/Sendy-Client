import { useState } from "react";
import {
  useGetMyParcelsQuery,
  useCancelDeliveryMutation,
} from "@/redux/features/parcel/parcel.api";
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
import {
  Package,
  MapPin,
  Weight,
  Calendar,
  Search,
  Truck,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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
}

interface MyParcelsData {
  sent: Parcel[];
  received: Parcel[];
}

const OnGoingParcel = () => {
  const { data, isLoading, isError } = useGetMyParcelsQuery(undefined);
  const [cancelDelivery, { isLoading: isCancelling }] =
    useCancelDeliveryMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const myParcels = data as MyParcelsData | undefined;

  // Filter only "Requested" status parcels from sent parcels
  const ongoingParcels = (myParcels?.sent || []).filter(
    (parcel) => parcel.currentStatus.toLowerCase() === "requested"
  );

  // Filter parcels based on search query
  const filteredParcels = ongoingParcels.filter(
    (parcel) =>
      parcel.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.pickupAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCancelDelivery = async (parcelId: string) => {
    if (!confirm("Are you sure you want to cancel this delivery?")) {
      return;
    }

    setCancellingId(parcelId);
    try {
      await cancelDelivery(parcelId).unwrap();
      toast.success("Delivery cancelled successfully", {
        description: "The parcel delivery has been cancelled.",
      });
    } catch (error) {
      console.error("Error cancelling delivery:", error);
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message;
      toast.error("Failed to cancel delivery", {
        description: errorMessage || "Something went wrong. Please try again.",
      });
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Ongoing Parcels</h1>
          <p className="text-muted-foreground">
            View and manage parcels that are requested but not yet dispatched
          </p>
        </div>

        {/* Info Banner */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  These parcels have "Requested" status
                </p>
                <p className="text-sm text-blue-700">
                  You can cancel deliveries before they are dispatched. Once
                  dispatched, cancellation is no longer available.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by tracking ID or address..."
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
            {filteredParcels.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center space-y-2">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? "No ongoing parcels found matching your search"
                        : "No ongoing parcels. All your parcels have been dispatched or delivered."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredParcels.map((parcel) => (
                  <Card
                    key={parcel._id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Tracking ID: {parcel.trackingId}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {parcel.receiverId && (
                              <span>
                                To: {parcel.receiverId.name} (
                                {parcel.receiverId.email})
                              </span>
                            )}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1 rounded-full text-sm font-medium border bg-blue-50 border-blue-200 text-blue-600">
                            {parcel.currentStatus}
                          </div>
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

                      {/* Details & Actions */}
                      <div className="flex items-center justify-between">
                        <div className="grid grid-cols-3 gap-4 flex-1">
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

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelDelivery(parcel._id)}
                          disabled={
                            isCancelling && cancellingId === parcel._id
                          }
                          className="ml-4"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          {isCancelling && cancellingId === parcel._id
                            ? "Cancelling..."
                            : "Cancel Delivery"}
                        </Button>
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

export default OnGoingParcel;
