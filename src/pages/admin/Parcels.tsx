import { useState } from "react";
import {
  useGetAllParcelsQuery,
  useUpdateParcelMutation,
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
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Package as PackageIcon,
  Search,
  Edit,
  Lock,
  Unlock,
  Eye,
  MapPin,
  User,
  Calendar,
  Weight,
  DollarSign,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type ParcelStatus =
  | "Requested"
  | "Approved"
  | "Dispatched"
  | "In Transit"
  | "Delivered"
  | "Cancelled";

interface StatusLog {
  status: ParcelStatus;
  timestamp: string;
  updatedBy?: string;
  location?: string;
  note?: string;
}

interface Parcel {
  _id: string;
  trackingId: string;
  currentStatus: ParcelStatus;
  pickupAddress: string;
  deliveryAddress: string;
  weight: number;
  fee: number;
  createdAt: string;
  updatedAt: string;
  isBlocked?: boolean;
  statusLogs?: StatusLog[];
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

const PARCEL_STATUSES: ParcelStatus[] = [
  "Requested",
  "Approved",
  "Dispatched",
  "In Transit",
  "Delivered",
  "Cancelled",
];

const Parcels = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(10);

  const {
    data: response,
    isLoading,
    isError,
  } = useGetAllParcelsQuery({ page: currentPage, limit: pageLimit });
  const [updateParcel, { isLoading: isUpdating }] = useUpdateParcelMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [statusForm, setStatusForm] = useState({
    status: "",
    location: "",
    note: "",
  });

  const allParcels = (response?.data || []) as Parcel[];
  const meta = response?.meta;

  // Helper functions to get sender/receiver info
  const getSenderName = (parcel: Parcel) => {
    if (!parcel.senderId) return "N/A";
    if (typeof parcel.senderId === "string") return parcel.senderId.substring(0, 8) + "...";
    return parcel.senderId.name;
  };

  const getSenderEmail = (parcel: Parcel) => {
    if (!parcel.senderId || typeof parcel.senderId === "string") return "N/A";
    return parcel.senderId.email;
  };

  const getReceiverName = (parcel: Parcel) => {
    if (!parcel.receiverId) return "N/A";
    if (typeof parcel.receiverId === "string") return parcel.receiverId.substring(0, 8) + "...";
    return parcel.receiverId.name;
  };

  const getReceiverEmail = (parcel: Parcel) => {
    if (!parcel.receiverId || typeof parcel.receiverId === "string") return "N/A";
    return parcel.receiverId.email;
  };

  // Filter parcels based on search query
  const filteredParcels = allParcels.filter((parcel) => {
    const senderName = getSenderName(parcel);
    const receiverName = getReceiverName(parcel);
    return (
      parcel.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.currentStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receiverName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleUpdateStatusClick = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setStatusForm({
      status: parcel.currentStatus,
      location: "",
      note: "",
    });
    setStatusDialogOpen(true);
  };

  const handleViewClick = (parcel: Parcel) => {
    setSelectedParcel(parcel);
    setViewDialogOpen(true);
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParcel) return;

    try {
      const payload: Record<string, unknown> = {
        currentStatus: statusForm.status,
      };

      // Add status logs with location and note if provided
      const newStatusLog: Partial<StatusLog> = {
        status: statusForm.status as ParcelStatus,
        timestamp: new Date().toISOString(),
      };

      if (statusForm.location) {
        newStatusLog.location = statusForm.location;
      }

      if (statusForm.note) {
        newStatusLog.note = statusForm.note;
      }

      // Only add to statusLogs if location or note is provided
      if (statusForm.location || statusForm.note) {
        payload.statusLogs = [
          ...(selectedParcel.statusLogs || []),
          newStatusLog,
        ];
      }

      await updateParcel({
        parcelId: selectedParcel._id,
        payload,
      }).unwrap();

      toast.success("Parcel status updated successfully!");
      setStatusDialogOpen(false);
      setSelectedParcel(null);
      setStatusForm({ status: "", location: "", note: "" });
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error.data as { message?: string })?.message
          : "Failed to update parcel status";
      toast.error(errorMessage);
    }
  };

  const handleBlockToggle = async (parcel: Parcel) => {
    try {
      const payload: Record<string, unknown> = {
        isBlocked: !parcel.isBlocked,
      };

      await updateParcel({
        parcelId: parcel._id,
        payload,
      }).unwrap();

      toast.success(
        parcel.isBlocked
          ? "Parcel unblocked successfully!"
          : "Parcel blocked successfully!"
      );
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error.data as { message?: string })?.message
          : "Failed to update parcel";
      toast.error(errorMessage);
    }
  };

  const getStatusColor = (status: ParcelStatus) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Requested":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "Approved":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Dispatched":
      case "In Transit":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <PackageIcon className="h-8 w-8 text-primary" />
              Parcels Management
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage all parcels in the system
            </p>
          </div>
          <Card className="w-fit">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <PackageIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{allParcels.length}</p>
                  <p className="text-xs text-muted-foreground">Total Parcels</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by tracking ID, status, sender, or receiver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Parcels Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Parcels</CardTitle>
            <CardDescription>
              Manage parcel statuses and block/unblock parcels
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Loading State */}
            {isLoading && (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="py-12 text-center">
                <p className="text-destructive">
                  Failed to load parcels. Please try again later.
                </p>
              </div>
            )}

            {/* Table */}
            {!isLoading && !isError && (
              <>
                {filteredParcels.length === 0 ? (
                  <div className="py-12 text-center">
                    <PackageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? "No parcels found matching your search"
                        : "No parcels available"}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tracking ID</TableHead>
                          <TableHead>Sender</TableHead>
                          <TableHead>Receiver</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Weight</TableHead>
                          <TableHead>Fee</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredParcels.map((parcel) => (
                          <TableRow
                            key={parcel._id}
                            className={parcel.isBlocked ? "opacity-60" : ""}
                          >
                            <TableCell className="font-mono font-medium">
                              {parcel.trackingId}
                              {parcel.isBlocked && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 bg-red-50 text-red-700"
                                >
                                  Blocked
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-sm">
                              {getSenderName(parcel)}
                            </TableCell>
                            <TableCell className="text-sm">
                              {getReceiverName(parcel)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={getStatusColor(parcel.currentStatus)}
                              >
                                {parcel.currentStatus}
                              </Badge>
                            </TableCell>
                            <TableCell>{parcel.weight} kg</TableCell>
                            <TableCell>${parcel.fee}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(parcel.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewClick(parcel)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateStatusClick(parcel)
                                  }
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleBlockToggle(parcel)}
                                  disabled={isUpdating}
                                >
                                  {parcel.isBlocked ? (
                                    <Unlock className="h-4 w-4" />
                                  ) : (
                                    <Lock className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {!isLoading && !isError && meta && meta.totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {/* Page Numbers */}
                    {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        // Show first page, last page, current page, and adjacent pages
                        return (
                          page === 1 ||
                          page === meta.totalPages ||
                          Math.abs(page - currentPage) <= 1
                        );
                      })
                      .map((page, index, array) => {
                        // Add ellipsis if there's a gap
                        const prevPage = array[index - 1];
                        const showEllipsis = prevPage && page - prevPage > 1;

                        return (
                          <div key={page} className="flex items-center">
                            {showEllipsis && (
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )}
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          </div>
                        );
                      })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(meta.totalPages, prev + 1))
                        }
                        className={
                          currentPage === meta.totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                {/* Pagination Info */}
                <div className="mt-2 text-center text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * pageLimit) + 1} to{" "}
                  {Math.min(currentPage * pageLimit, meta.total)} of {meta.total} parcels
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Parcel Status</DialogTitle>
            <DialogDescription>
              Update the delivery status for tracking ID:{" "}
              <span className="font-mono font-semibold">
                {selectedParcel?.trackingId}
              </span>
            </DialogDescription>
          </DialogHeader>

          {selectedParcel && (
            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={statusForm.status}
                  onValueChange={(value) =>
                    setStatusForm({ ...statusForm, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {PARCEL_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={statusForm.location}
                  onChange={(e) =>
                    setStatusForm({ ...statusForm, location: e.target.value })
                  }
                  placeholder="Current location (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Textarea
                  id="note"
                  value={statusForm.note}
                  onChange={(e) =>
                    setStatusForm({ ...statusForm, note: e.target.value })
                  }
                  placeholder="Additional notes (optional)"
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStatusDialogOpen(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating || !statusForm.status}
                >
                  {isUpdating ? "Updating..." : "Update Status"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View Parcel Details Sheet */}
      <Sheet open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Parcel Details</SheetTitle>
            <SheetDescription>
              Complete information for this parcel
            </SheetDescription>
          </SheetHeader>

          {selectedParcel && (
            <div className="mt-6 space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tracking ID:</span>
                    <span className="font-mono font-medium">
                      {selectedParcel.trackingId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge
                      variant="outline"
                      className={getStatusColor(selectedParcel.currentStatus)}
                    >
                      {selectedParcel.currentStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Weight className="h-3 w-3" />
                      Weight:
                    </span>
                    <span className="font-medium">
                      {selectedParcel.weight} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Fee:
                    </span>
                    <span className="font-medium">${selectedParcel.fee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created:
                    </span>
                    <span className="font-medium">
                      {new Date(selectedParcel.createdAt).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Sender & Receiver Info */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Sender
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p className="font-medium">
                      {getSenderName(selectedParcel)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getSenderEmail(selectedParcel)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Receiver
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <p className="font-medium">
                      {getReceiverName(selectedParcel)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getReceiverEmail(selectedParcel)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Addresses */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Addresses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Pickup:</p>
                    <p className="font-medium">
                      {selectedParcel.pickupAddress}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Delivery:</p>
                    <p className="font-medium">
                      {selectedParcel.deliveryAddress}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Status Logs */}
              {selectedParcel.statusLogs &&
                selectedParcel.statusLogs.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Status History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                        {selectedParcel.statusLogs.map((log, index) => (
                          <div key={index} className="relative pl-8">
                            <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                            <div className="space-y-1">
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-medium text-sm">
                                  {log.status}
                                </span>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {new Date(log.timestamp).toLocaleString()}
                                </span>
                              </div>
                              {log.location && (
                                <p className="text-sm text-muted-foreground flex items-start gap-1">
                                  <MapPin className="h-3 w-3 mt-0.5" />
                                  <span>{log.location}</span>
                                </p>
                              )}
                              {log.note && (
                                <p className="text-sm text-muted-foreground">
                                  {log.note}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Parcels;
