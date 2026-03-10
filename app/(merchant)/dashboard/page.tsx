import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { RevenueChart } from "@/components/merchant/RevenueChart";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.businessId) redirect("/login");

  const businessId = session.businessId as string;

  // --- CHART DATA PREPARATION ---
  // 1. Get date 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  // 2. Fetch raw orders for graph
  const ordersForGraph = await prisma.order.findMany({
    where: {
      businessId: businessId,
      status: { not: "CANCELLED" },
      createdAt: { gte: sevenDaysAgo },
    },
    select: {
      createdAt: true,
      totalAmount: true,
    },
  });

  // 3. Process data: Group by Day (Last 7 Days)
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toDateString(); // e.g. "Mon Feb 19 2024"
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" }); // "Mon"

    // Sum orders for this specific day
    const dayTotal = ordersForGraph
      .filter((o) => new Date(o.createdAt).toDateString() === dateStr)
      .reduce((sum, o) => sum + Number(o.totalAmount), 0);

    chartData.push({
      name: dayName,
      revenue: dayTotal,
    });
  }
  // -----------------------------

  // Fetch Summary Metrics (Existing Code)
  const [
    totalRevenue,
    activeOrdersCount,
    newCustomersCount,
    totalOrdersCount,
    recentOrders,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { businessId: businessId, status: { not: "CANCELLED" } },
      _sum: { totalAmount: true },
    }),
    prisma.order.count({
      where: {
        businessId: businessId,
        status: { in: ["NEW", "CONFIRMED", "IN_PROGRESS"] },
      },
    }),
    prisma.customer.count({
      where: {
        businessId: businessId,
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.order.count({
      where: { businessId: businessId, status: { not: "CANCELLED" } },
    }),
    prisma.order.findMany({
      where: { businessId: businessId },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        customer: true,
        items: true,
      },
    }),
  ]);

  const revenueValue = Number(totalRevenue._sum.totalAmount || 0);
  const avgOrderValue =
    totalOrdersCount > 0 ? revenueValue / totalOrdersCount : 0;

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Welcome back, here's what's happening today.
        </p>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${revenueValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          trend="+12.5%"
          isPositive={true}
          icon={DollarSign}
          color="blue"
        />
        <StatCard
          title="Active Orders"
          value={activeOrdersCount.toString()}
          trend="Live"
          isPositive={true}
          icon={ShoppingBag}
          color="orange"
        />
        <StatCard
          title="New Customers (30d)"
          value={newCustomersCount.toString()}
          trend="+2.1%"
          isPositive={true}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Avg. Order Value"
          value={`$${avgOrderValue.toFixed(2)}`}
          trend="-1.2%"
          isPositive={false}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* 3. Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Revenue Overview</h3>
            <select className="text-sm border-gray-300 rounded-md text-gray-600 bg-gray-50 px-2 py-1">
              <option>Last 7 Days</option>
            </select>
          </div>

          {/* Real Data Chart */}
          <RevenueChart data={chartData} />
        </div>

        {/* Right: Recent Orders List */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Orders</h3>

          <div className="space-y-4 flex-1">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No orders yet.
              </p>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">
                      {order.customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                        {order.customer.name}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        {order.items.length} items •{" "}
                        {formatDistanceToNow(new Date(order.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-semibold text-gray-900">
                      ${Number(order.totalAmount).toFixed(2)}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        order.status === "NEW"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <Link
            href="/dashboard/orders"
            className="w-full mt-4 text-center block text-sm text-blue-600 font-medium hover:underline p-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

// Helper Component for Stats
function StatCard({ title, value, trend, isPositive, icon: Icon, color }: any) {
  const colorStyles =
    {
      blue: "bg-blue-50 text-blue-600",
      orange: "bg-orange-50 text-orange-600",
      green: "bg-green-50 text-green-600",
      purple: "bg-purple-50 text-purple-600",
    }[color as string] || "bg-gray-50 text-gray-600";

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${colorStyles}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div
          className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
            isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDownRight className="h-3 w-3 mr-1" />
          )}
          {trend}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}
