import { useState } from "react";
import {
  useGetMyParcelsQuery,
  useConfirmDeliveryMutation,
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
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { IMyParcelsData } from "@/types";

const ConfirmDelivery = () => {
  const { data, isLoading, isError } = useGetMyParcelsQuery(undefined);
  const [confirmDelivery, { isLoading: isConfirming }] =
    useConfirmDeliveryMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const myParcels = data as IMyParcelsData | undefined;

  // Filter only "In Transit" status parcels from received parcels
  const inTransitParcels = (myParcels?.received || []).filter(
    (parcel) => parcel.currentStatus.toLowerCase() === "in transit"
  );

  // Filter parcels based on search query
  const filteredParcels = inTransitParcels.filter(
    (parcel) =>
      parcel.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.pickupAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirmDelivery = async (parcelId: string) => {
    if (
      !confirm(
        "Are you sure you want to confirm delivery of this parcel? This action cannot be undone."
      )
    ) {
      return;
    }

    setConfirmingId(parcelId);
    try {
      await confirmDelivery(parcelId).unwrap();
      toast.success("Delivery confirmed successfully", {
        description: "The parcel has been marked as delivered.",
      });
    } catch (error) {
      console.error("Error confirming delivery:", error);
      const errorMessage = (error as { data?: { message?: string } })?.data
        ?.message;
      toast.error("Failed to confirm delivery", {
        description: errorMessage || "Something went wrong. Please try again.",
      });
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Confirm Delivery</h1>
          <p className="text-muted-foreground">
            Confirm receipt of parcels that are currently in transit
          </p>
        </div>

        {/* Info Banner */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-900">
                  Important: Only confirm delivery after receiving the parcel
                </p>
                <p className="text-sm text-orange-700">
                  These parcels have "In Transit" status. Please only confirm
                  delivery once you have physically received the parcel. This
                  action cannot be undone.
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
                        ? "No in-transit parcels found matching your search"
                        : "No parcels in transit. All parcels have been delivered or are waiting to be dispatched."}
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
                            {parcel.senderId &&
                              typeof parcel.senderId === "object" && (
                                <span>
                                  From: {parcel.senderId.name} (
                                  {parcel.senderId.email})
                                </span>
                              )}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1 rounded-full text-sm font-medium border bg-orange-50 border-orange-200 text-orange-600">
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
                          variant="default"
                          size="sm"
                          onClick={() => handleConfirmDelivery(parcel._id)}
                          disabled={isConfirming && confirmingId === parcel._id}
                          className="ml-4 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {isConfirming && confirmingId === parcel._id
                            ? "Confirming..."
                            : "Confirm Delivery"}
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

export default ConfirmDelivery;
