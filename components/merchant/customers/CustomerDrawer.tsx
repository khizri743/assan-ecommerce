"use client";

import { X, Phone, Mail, Calendar, ShoppingBag, Ban } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomerDrawerProps {
  customer: any | null; // Using any to match the wrapper's data
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerDrawer({
  customer,
  isOpen,
  onClose,
}: CustomerDrawerProps) {
  if (!customer) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-bold text-gray-900">Customer Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-4rem)]">
          {/* Profile Card */}
          <div className="text-center mb-8">
            <div className="h-24 w-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
              {customer.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{customer.name}</h3>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Phone className="h-3 w-3" /> {customer.phone}
              </span>
            </div>
            <div className="mt-4 flex justify-center gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                Start Chat
              </button>
              <button className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Ban className="h-4 w-4" /> Block
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
              <p className="text-xs text-gray-500 mb-1">Lifetime Value</p>
              <p className="text-xl font-bold text-gray-900">
                ${customer.totalSpent.toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
              <p className="text-xs text-gray-500 mb-1">Total Orders</p>
              <p className="text-xl font-bold text-gray-900">
                {customer.totalOrders}
              </p>
            </div>
          </div>

          {/* Details List */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">
                Details
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </span>
                  <span className="font-medium text-gray-900">
                    {customer.email || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Joined
                  </span>
                  <span className="font-medium text-gray-900">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity Mockup - (Ideally this fetches real recent orders) */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">
                Recent History
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg text-green-600">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Latest activity
                    </p>
                    <p className="text-xs text-gray-500">
                      Check Orders tab for full history
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
