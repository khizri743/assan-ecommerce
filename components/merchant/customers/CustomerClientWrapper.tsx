"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { CustomerTable } from "./CustomerTable";
import { CustomerDrawer } from "./CustomerDrawer";

export function CustomerClientWrapper({
  initialCustomers,
}: {
  initialCustomers: any[]; // Using any to accommodate the Decimal->Number transformation
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  // Filtering Logic
  const filteredCustomers = initialCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery),
  );

  return (
    <>
      {/* Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
          <Filter className="h-4 w-4" />
        </button>
      </div>

      {/* Table */}
      <CustomerTable
        customers={filteredCustomers}
        onView={setSelectedCustomer}
      />

      {/* Drawer */}
      <CustomerDrawer
        customer={selectedCustomer}
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </>
  );
}
