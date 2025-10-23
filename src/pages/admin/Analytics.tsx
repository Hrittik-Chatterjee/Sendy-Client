import { useMemo } from "react";
import { useGetAllParcelsQuery } from "@/redux/features/parcel/parcel.api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Package,
  CheckCircle,
  TruckIcon,
  Clock,
  TrendingUp,
} from "lucide-react";

type ParcelStatus =
  | "Requested"
  | "Approved"
  | "Dispatched"
  | "In Transit"
  | "Delivered"
  | "Cancelled";

interface Parcel {
  _id: string;
  trackingId: string;
  currentStatus: ParcelStatus;
  createdAt: string;
  weight: number;
  fee: number;
}

const Analytics = () => {
  const {
    data: parcels,
    isLoading,
    isError,
  } = useGetAllParcelsQuery(undefined);

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    const allParcels = (parcels || []) as Parcel[];
    const totalParcels = allParcels.length;
    const delivered = allParcels.filter(
      (p) => p.currentStatus === "Delivered"
    ).length;
    const inTransit = allParcels.filter(
      (p) =>
        p.currentStatus === "In Transit" || p.currentStatus === "Dispatched"
    ).length;
    const pending = allParcels.filter(
      (p) => p.currentStatus === "Requested" || p.currentStatus === "Approved"
    ).length;
    const cancelled = allParcels.filter(
      (p) => p.currentStatus === "Cancelled"
    ).length;

    // Status distribution for pie chart
    const statusDistribution = [
      { name: "Delivered", value: delivered, color: "#22c55e" },
      { name: "In Transit", value: inTransit, color: "#f97316" },
      { name: "Pending", value: pending, color: "#8b5cf6" },
      { name: "Cancelled", value: cancelled, color: "#ef4444" },
    ].filter((item) => item.value > 0);

    // Monthly shipments for bar chart
    const monthlyData: Record<string, number> = {};
    allParcels.forEach((parcel) => {
      const date = new Date(parcel.createdAt);
      const monthYear = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
    });

    const monthlyShipments = Object.entries(monthlyData)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-6); // Last 6 months

    // Calculate delivery rate
    const deliveryRate =
      totalParcels > 0 ? ((delivered / totalParcels) * 100).toFixed(1) : "0";

    // Calculate total revenue
    const totalRevenue = allParcels.reduce((sum, p) => sum + (p.fee || 0), 0);

    return {
      totalParcels,
      delivered,
      inTransit,
      pending,
      cancelled,
      statusDistribution,
      monthlyShipments,
      deliveryRate,
      totalRevenue,
    };
  }, [parcels]);

  const chartConfig = {
    delivered: {
      label: "Delivered",
      color: "#22c55e",
    },
    inTransit: {
      label: "In Transit",
      color: "#f97316",
    },
    pending: {
      label: "Pending",
      color: "#8b5cf6",
    },
    cancelled: {
      label: "Cancelled",
      color: "#ef4444",
    },
  } satisfies ChartConfig;

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-destructive">
              Failed to load analytics data. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Overview of parcel delivery statistics and trends
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Parcels Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parcels</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {analyticsData.totalParcels}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time shipments
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Delivered Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {analyticsData.delivered}
                </div>
                <p className="text-xs text-muted-foreground">
                  {analyticsData.deliveryRate}% delivery rate
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* In Transit Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <TruckIcon className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-orange-600">
                  {analyticsData.inTransit}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently shipping
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Pending/Cancelled Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending & Cancelled
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold text-purple-600">
                    {analyticsData.pending}
                  </div>
                  <span className="text-muted-foreground">/</span>
                  <div className="text-2xl font-bold text-red-600">
                    {analyticsData.cancelled}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Pending / Cancelled
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Status Distribution</CardTitle>
            <CardDescription>
              Breakdown of parcels by current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : analyticsData.statusDistribution.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={analyticsData.statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Monthly Shipments Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Shipments</CardTitle>
            <CardDescription>
              Number of parcels created per month (last 6 months)
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : analyticsData.monthlyShipments.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.monthlyShipments}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--primary))"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  ${analyticsData.totalRevenue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  From {analyticsData.totalParcels} parcels
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average Per Parcel
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  $
                  {analyticsData.totalParcels > 0
                    ? (
                        analyticsData.totalRevenue / analyticsData.totalParcels
                      ).toFixed(2)
                    : "0.00"}
                </div>
                <p className="text-xs text-muted-foreground">Per shipment</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {analyticsData.deliveryRate}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Successful deliveries
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
