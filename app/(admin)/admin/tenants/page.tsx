import { AdminCard } from "@/components/admin/shared/AdminCard";
import { TenantTable } from "@/components/admin/tenants/TenantTable";
import { AddTenantModal } from "@/components/admin/tenants/AddTenantModal"; // <--- Import
import prisma from "@/lib/prisma";
import { getTenantStats } from "./actions";

export default async function TenantsPage() {
  const stats = await getTenantStats();

  const tenants = await prisma.business.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      users: {
        where: { role: "OWNER" },
        take: 1,
        select: { email: true },
      },
      _count: {
        select: { orders: true },
      },
    },
  });

  const formattedTenants = tenants.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    industry: t.industryType,
    plan: t.subscriptionPlan,
    status: t.subscriptionStatus,
    mrr:
      t.subscriptionPlan === "PRO"
        ? 49
        : t.subscriptionPlan === "BASIC"
          ? 19
          : 0,
    totalOrders: t._count.orders,
    createdAt: t.createdAt.toISOString().split("T")[0],
    ownerEmail: t.users[0]?.email || "N/A",
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tenant Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage all businesses on the platform
          </p>
        </div>

        {/* REPLACED BUTTON WITH COMPONENT */}
        <AddTenantModal />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Tenants"
          value={stats.total}
          color="text-gray-900"
        />
        <StatCard label="Active" value={stats.active} color="text-green-700" />
        {/* <StatCard label="In Trial" value={stats.trial} color="text-blue-700" /> */}
        <StatCard
          label="Suspended"
          value={stats.suspended}
          color="text-red-700"
        />
      </div>

      {/* Tenants Table */}
      <TenantTable initialTenants={formattedTenants} />
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <AdminCard className="p-4">
      <p className="text-gray-500 text-xs uppercase tracking-wider font-medium">
        {label}
      </p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </AdminCard>
  );
}
