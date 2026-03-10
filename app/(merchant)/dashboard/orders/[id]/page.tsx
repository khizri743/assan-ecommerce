import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { updateOrderStatus } from "../actions";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  if (!session?.businessId) redirect("/login");

  const order = await prisma.order.findFirst({
    where: {
      id: id,
      businessId: session.businessId as string,
    },
    include: {
      customer: true,
      items: true,
    },
  });

  if (!order) notFound();

  // Define the new status workflow
  const STATUSES = [
    "CONFIRMED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "RETURNED",
    "CANCELLED",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/orders"
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order.orderNumber}
          </h1>
          <p className="text-gray-500 text-sm">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="ml-auto px-3 py-1 bg-gray-100 rounded-lg font-mono text-sm font-bold">
          {order.status.replace(/_/g, " ")}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content: Items */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Order Items</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="p-6 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.productName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-gray-900">
                    ${(Number(item.unitPrice) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
              <span className="font-semibold text-gray-700">Total Amount</span>
              <span className="text-xl font-bold text-gray-900">
                ${order.totalAmount.toString()}
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar: Customer & Actions */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Customer Details
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500 block">Name</span>
                <span className="font-medium">{order.customer.name}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Phone</span>
                <span className="font-medium">{order.customer.phone}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Address</span>
                <span className="font-medium">
                  {order.customer.address || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Status Actions */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Update Status</h3>
            <div className="grid grid-cols-1 gap-2">
              {STATUSES.map((status) => (
                <form
                  key={status}
                  action={updateOrderStatus.bind(null, order.id, status)}
                >
                  <button
                    disabled={order.status === status}
                    className={`w-full py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
                      order.status === status
                        ? "bg-gray-100 text-gray-400 border-transparent cursor-default"
                        : "bg-white border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    Mark as {status.replace(/_/g, " ")}
                  </button>
                </form>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
