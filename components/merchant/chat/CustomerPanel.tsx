"use client";

import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomerPanelProps {
  conversation: any;
  context: {
    totalSpent: string;
    totalOrders: number;
    recentOrders: Array<{
      id: string;
      status: string;
      items: string;
      date: string;
    }>;
  };
  onOpenOrderModal: () => void;
  readOnly?: boolean; // New prop to disable actions if needed
}

export function CustomerPanel({
  conversation,
  context,
  onOpenOrderModal,
  readOnly,
}: CustomerPanelProps) {
  return (
    <div className="w-72 bg-white border-l border-gray-200 hidden xl:flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 text-center shrink-0">
        <div
          className={cn(
            "h-16 w-16 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-3",
            conversation.avatarColor,
          )}
        >
          {conversation.name.charAt(0)}
        </div>
        <h2 className="font-bold text-gray-900">{conversation.name}</h2>
        <p className="text-sm text-gray-500 mt-1">{conversation.phone}</p>
      </div>

      {/* Stats - Fixed Height */}
      <div className="p-6 shrink-0">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="text-xs text-gray-500 mb-1">Total Spent</p>
            <p className="font-bold text-gray-900">{context.totalSpent}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="text-xs text-gray-500 mb-1">Total Orders</p>
            <p className="font-bold text-gray-900">{context.totalOrders}</p>
          </div>
        </div>
      </div>

      {/* Order History - SCROLLABLE AREA */}
      <div className="flex-1 overflow-y-auto px-6 pb-4 min-h-0">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2 sticky top-0 bg-white py-2 z-10">
          <ShoppingBag className="h-4 w-4" /> Past Orders
        </h3>

        <div className="space-y-3">
          {context.recentOrders.length > 0 ? (
            context.recentOrders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-100 rounded-lg p-3 hover:border-blue-200 transition-colors bg-white shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-gray-500">
                    {order.id}
                  </span>
                  <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-100">
                    {order.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-800 line-clamp-2">
                  {order.items}
                </p>
                <p className="text-xs text-gray-400 mt-1">{order.date}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-xs text-gray-400">No past orders found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions - Fixed Bottom */}
      <div className="p-4 border-t border-gray-100 shrink-0 bg-white">
        {!readOnly && (
          <button
            onClick={onOpenOrderModal}
            className="w-full bg-blue-50 text-blue-700 font-medium py-2 rounded-lg text-sm hover:bg-blue-100 transition-colors mt-2"
          >
            Create Manual Order
          </button>
        )}
      </div>
    </div>
  );
}
