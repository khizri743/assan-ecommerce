"use client";

import { useState } from "react";
import { MoreHorizontal, Eye, Ban, CheckCircle, LogIn } from "lucide-react";
import { AdminCard } from "../shared/AdminCard";
import { DataTable } from "../shared/DataTable";
import { StatusBadge } from "../shared/StatusBadge";
import { SearchInput } from "../shared/SearchInput";
import { TenantFilters } from "./TenantFilters";
import { ImpersonateModal } from "./ImpersonateModal";
import { toggleTenantStatus } from "@/app/(admin)/admin/tenants/actions";
import { cn } from "@/lib/utils";

// Define the type matching what we pass from page.tsx
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  industry: string;
  plan: string;
  status: string;
  mrr: number;
  totalOrders: number;
  createdAt: string;
  ownerEmail: string;
}

export function TenantTable({ initialTenants }: { initialTenants: Tenant[] }) {
  const [tenants, setTenants] = useState(initialTenants);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [impersonateTenant, setImpersonateTenant] = useState<Tenant | null>(
    null,
  );

  // Client-side filtering
  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || tenant.status === statusFilter.toUpperCase();
    const matchesPlan =
      planFilter === "all" || tenant.plan === planFilter.toUpperCase();

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    // Optimistic Update
    setTenants((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: currentStatus === "SUSPENDED" ? "ACTIVE" : "SUSPENDED",
            }
          : t,
      ),
    );

    // Call Server Action
    await toggleTenantStatus(id, currentStatus);
  };

  // Define Columns using your shared DataTable structure
  const columns = [
    {
      key: "name",
      header: "Business",
      render: (tenant: Tenant) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            {tenant.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{tenant.name}</h3>
            <p className="text-xs text-gray-500">{tenant.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      render: (tenant: Tenant) => (
        <StatusBadge
          status={tenant.plan}
          variant={tenant.plan.toLowerCase() as any}
        />
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (tenant: Tenant) => (
        <StatusBadge
          status={tenant.status}
          variant={tenant.status.toLowerCase() as any}
        />
      ),
    },
    {
      key: "mrr",
      header: "MRR",
      render: (tenant: Tenant) => (
        <span className="text-gray-900 font-medium">${tenant.mrr}/mo</span>
      ),
    },
    {
      key: "totalOrders",
      header: "Orders",
      render: (tenant: Tenant) => (
        <span className="text-gray-600">
          {tenant.totalOrders.toLocaleString()}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (tenant: Tenant) => (
        <span className="text-gray-500 text-xs">{tenant.createdAt}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (tenant: Tenant) => (
        <div
          className="flex items-center justify-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setImpersonateTenant(tenant)}
            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Impersonate Owner"
          >
            <LogIn className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleToggleStatus(tenant.id, tenant.status)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              tenant.status === "SUSPENDED"
                ? "text-green-600 hover:bg-green-50"
                : "text-red-600 hover:bg-red-50",
            )}
            title={tenant.status === "SUSPENDED" ? "Activate" : "Suspend"}
          >
            {tenant.status === "SUSPENDED" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Ban className="h-4 w-4" />
            )}
          </button>

          <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminCard className="overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search tenants..."
            />
          </div>
          <TenantFilters
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            planFilter={planFilter}
            onPlanChange={setPlanFilter}
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredTenants}
          keyExtractor={(t) => t.id}
          onRowClick={(tenant) => console.log("View details:", tenant.id)}
          emptyState={
            <div className="text-center text-gray-500">
              <p>No tenants found matching your criteria.</p>
            </div>
          }
        />
      </AdminCard>

      <ImpersonateModal
        tenant={impersonateTenant}
        isOpen={!!impersonateTenant}
        onClose={() => setImpersonateTenant(null)}
      />
    </>
  );
}
