"use client";

import { MoreHorizontal, MessageSquareText } from "lucide-react";

interface CustomerTableProps {
  customers: any[]; // Using any to match the converted data
  onView: (customer: any) => void;
}

export function CustomerTable({ customers, onView }: CustomerTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
          <tr>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Total Orders</th>
            <th className="px-6 py-4">Total Spent</th>
            <th className="px-6 py-4">Joined</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {customers.map((customer) => (
            <tr
              key={customer.id}
              onClick={() => onView(customer)}
              className="hover:bg-gray-50/50 transition-colors cursor-pointer"
            >
              {/* Name & Phone */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {customer.name}
                    </h3>
                    <p className="text-xs text-gray-500">{customer.phone}</p>
                  </div>
                </div>
              </td>

              {/* Orders */}
              <td className="px-6 py-4 text-gray-700 font-medium">
                {customer.totalOrders}
              </td>

              {/* Spent (Now guaranteed number by page.tsx) */}
              <td className="px-6 py-4 text-gray-900 font-bold">
                ${customer.totalSpent.toFixed(2)}
              </td>

              {/* Date */}
              <td className="px-6 py-4 text-gray-500">
                {new Date(customer.createdAt).toLocaleDateString()}
              </td>

              {/* Actions */}
              <td
                className="px-6 py-4 text-right"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-end gap-2">
                  <button
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Open Chat"
                  >
                    <MessageSquareText className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
