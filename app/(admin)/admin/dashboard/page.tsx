import prisma from "@/lib/prisma";
import { DollarSign, Users, Store, Activity } from "lucide-react";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { MRRChart } from "@/components/admin/dashboard/MRRChart";
import { PlatformHealth } from "@/components/admin/dashboard/PlatformHealth";
import { RecentActivity } from "@/components/admin/dashboard/RecentActivity";

export default async function AdminDashboardPage() {
  // 1. Fetch Real Metrics
  const [totalBusinesses, activeBusinesses, totalUsers, recentBusinesses] =
    await Promise.all([
      // Total Tenants
      prisma.business.count(),
      // Active Tenants (assuming subscriptionStatus = 'ACTIVE')
      prisma.business.count({ where: { subscriptionStatus: "ACTIVE" } }),
      // Total Users across all tenants
      prisma.user.count(),
      // Recent Signups (for Activity Feed)
      prisma.business.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, createdAt: true },
      }),
    ]);

  // Mock MRR Calculation (e.g. $29/mo per active tenant)
  const estimatedMRR = activeBusinesses * 29;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
        <p className="text-gray-500 text-sm">
          Monitor system health and business metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Est. Monthly Revenue"
          value={`$${estimatedMRR.toLocaleString()}`}
          change={12.5} // You'd calculate this vs last month in a real app
          icon={DollarSign}
          variant="success"
        />
        <StatCard
          title="Active Tenants"
          value={activeBusinesses.toString()}
          change={8.2}
          icon={Store}
        />
        <StatCard
          title="Total Users"
          value={totalUsers.toLocaleString()}
          change={15.3}
          icon={Users}
        />
        <StatCard
          title="System Uptime"
          value="99.9%"
          change={0.1}
          changeLabel="Last 30 days"
          icon={Activity}
          variant="success"
        />
      </div>

      {/* Charts & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          <MRRChart />
        </div>
        {/* <div className="lg:col-span-1">
          <PlatformHealth />
        </div> */}
        <div className="lg:col-span-1">
          {/* Pass real recent businesses to the activity component */}
          <RecentActivity initialActivities={recentBusinesses} />
        </div>
      </div>
    </div>
  );
}
