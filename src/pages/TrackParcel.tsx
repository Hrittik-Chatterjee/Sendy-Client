import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useLazyTrackParcelQuery } from "@/redux/features/parcel/parcel.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin, Weight, Truck } from "lucide-react";
import type { IStatusLog } from "@/types";

const TrackParcel = () => {
  const { trackingId: urlTrackingId } = useParams<{ trackingId: string }>();
  const [trackingId, setTrackingId] = useState(urlTrackingId || "");
  const navigate = useNavigate();

  const [trackParcel, { data: parcelData, isLoading, isError }] =
    useLazyTrackParcelQuery();

  console.log(parcelData);

  // Auto-track if tracking ID is in URL
  useEffect(() => {
    if (urlTrackingId) {
      trackParcel(urlTrackingId);
    }
  }, [urlTrackingId, trackParcel]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      return;
    }
    await trackParcel(trackingId);
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Track Your Parcel</h1>
          <p className="text-muted-foreground">
            Enter your tracking ID to see real-time updates
          </p>
        </div>

        {/* Tracking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Enter Tracking ID</CardTitle>
            <CardDescription>
              Your tracking ID was provided when you sent the parcel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrack} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trackingId">Tracking ID</Label>
                <Input
                  id="trackingId"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter your tracking ID"
                  className="font-mono"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Tracking..." : "Track Parcel"}
              </Button>
            </form>

            {isError && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-destructive text-sm font-medium">
                  Parcel not found. Please check your tracking ID and try again.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Parcel Information */}
        {parcelData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Parcel Details
              </CardTitle>
              <CardDescription>
                Tracking ID:{" "}
                <span className="font-mono font-medium">{trackingId}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status */}
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Current Status
                    </p>
                    <p className="text-xl font-semibold">
                      {parcelData.currentStatus || "In Transit"}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center">
                    <Truck className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Pickup & Delivery Addresses */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Pickup Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {parcelData.pickupAddress || "N/A"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {parcelData.deliveryAddress || "N/A"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Additional Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Weight className="h-4 w-4" />
                    Weight
                  </span>
                  <span className="font-medium">
                    {parcelData.weight || "N/A"} kg
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Delivery Fee
                  </span>
                  <span className="font-medium">
                    ${parcelData.fee || "N/A"}
                  </span>
                </div>
                {parcelData.createdAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Created At
                    </span>
                    <span className="font-medium">
                      {new Date(parcelData.createdAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Status Logs */}
              {parcelData.statusLogs && parcelData.statusLogs.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Status History
                    </h3>
                    <div className="space-y-3">
                      {parcelData.statusLogs.map(
                        (log: IStatusLog, index: number) => (
                          <div
                            key={index}
                            className="border rounded-lg p-3 space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{log.status}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                            </div>
                            {log.location && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {log.location}
                              </p>
                            )}
                            {log.note && (
                              <p className="text-sm text-muted-foreground">
                                {log.note}
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Back to Home Link */}
        <div className="text-center">
          <Button variant="ghost" onClick={() => navigate("/")}>
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrackParcel;
