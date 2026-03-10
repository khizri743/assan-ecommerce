import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Lock, Crown, TrendingUp, BarChart3, PieChart } from "lucide-react";
import { AnalyticsCharts } from "@/components/merchant/analytics/AnalyticsChart";

export default async function AnalyticsPage() {
  const session = await getSession();
  if (!session?.businessId) redirect("/login");

  const business = await prisma.business.findUnique({
    where: { id: session.businessId as string },
  });

  // Check Plan (Free Plan = Blocked)
  const isFreePlan = business?.subscriptionPlan === "FREE";

  if (isFreePlan) {
    return <LockedAnalyticsView />;
  }

  // --- FETCH ADVANCED DATA ---
  const businessId = session.businessId as string;

  // 1. Top Selling Products
  const topProductsRaw = await prisma.orderItem.groupBy({
    by: ["productName"],
    where: { order: { businessId, status: { not: "CANCELLED" } } },
    _sum: { quantity: true, unitPrice: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  // SERIALIZE HERE: Convert Decimal objects to standard numbers
  const topProducts = topProductsRaw.map((item) => ({
    productName: item.productName,
    totalQuantity: item._sum.quantity || 0,
    // Convert Decimal to Number
    totalRevenueApproximation: Number(item._sum.unitPrice || 0),
  }));

  // 2. Sales by Category (requires joining, prisma groupby limitation means we might need raw query or JS processing)
  // For simplicity, let's fetch products and their sales
  const categoryStats = await prisma.product.findMany({
    where: { businessId },
    select: {
      category: true,
      orderItems: { select: { quantity: true, unitPrice: true } },
    },
  });

  // Process Category Data in JS
  const categoryMap: Record<string, number> = {};
  categoryStats.forEach((p) => {
    const cat = p.category || "Uncategorized";
    const total = p.orderItems.reduce(
      (sum, item) => sum + item.quantity * Number(item.unitPrice),
      0,
    );
    categoryMap[cat] = (categoryMap[cat] || 0) + total;
  });

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
        <p className="text-gray-500 text-sm">
          Deep dive into your store's performance.
        </p>
      </div>

      {/* Client Component for Charts */}
      <AnalyticsCharts
        topProducts={topProducts} // Pass the serialized version
        categoryData={categoryData}
      />
    </div>
  );
}

function LockedAnalyticsView() {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
      <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-6 rounded-full mb-6 shadow-sm">
        <Lock className="h-10 w-10 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
        Unlock Advanced Analytics{" "}
        <Crown className="h-5 w-5 text-yellow-500 fill-yellow-500" />
      </h2>
      <p className="text-gray-600 max-w-md mb-8">
        Get deep insights into your <strong>Top Products</strong>,{" "}
        <strong>Sales by Category</strong>, and{" "}
        <strong>Customer Retention</strong>. Available on Growth and Scale
        plans.
      </p>
      <a
        href="/dashboard/settings"
        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-200"
      >
        Upgrade to Growth
      </a>
    </div>
  );
}
