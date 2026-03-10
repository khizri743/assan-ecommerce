import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { requirePermission } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OrderBoard } from "@/components/merchant/orders/OrderBoard";

export default async function OrdersPage() {
  // 1. Check Permission & Get User Info
  const user = await requirePermission("ORDERS", "READ");

  const session = await getSession();
  if (!session?.businessId) redirect("/login");

  // 2. Fetch Data
  const ordersRaw = await prisma.order.findMany({
    where: {
      businessId: session.businessId as string,
      status: { not: "CANCELLED" },
    },
    include: {
      customer: true,
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const orders = ordersRaw.map((order) => ({
    ...order,
    totalAmount: Number(order.totalAmount),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
    })),
    customer: {
      ...order.customer,
      totalSpent: Number(order.customer.totalSpent),
    },
  }));

  // 3. Determine Write Access
  const canWrite =
    user.role === "OWNER" || (user.permissions as any)?.ORDERS === "WRITE";

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Board</h1>
          <p className="text-sm text-gray-500">Real-time order management</p>
        </div>

        <div className="flex gap-2">
          {!canWrite && (
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-200">
              View Only
            </span>
          )}
          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Live Updates
          </span>
        </div>
      </div>

      {/* 4. Pass readOnly prop */}
      <OrderBoard orders={orders} readOnly={!canWrite} />
    </div>
  );
}
