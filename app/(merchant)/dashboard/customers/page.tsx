import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { requirePermission } from "@/lib/auth"; // Import auth helper
import { redirect } from "next/navigation";
import { Search, Filter, Download } from "lucide-react";
import { CustomerClientWrapper } from "@/components/merchant/customers/CustomerClientWrapper";

export default async function CustomersPage() {
  // 1. Check Permission
  await requirePermission("CUSTOMERS", "READ");

  const session = await getSession();
  if (!session?.businessId) redirect("/login");

  const rawCustomers = await prisma.customer.findMany({
    where: { businessId: session.businessId as string },
    orderBy: { createdAt: "desc" },
  });

  const customers = rawCustomers.map((customer) => ({
    ...customer,
    totalSpent: Number(customer.totalSpent),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 text-sm">
            View and manage your CRM database
          </p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <CustomerClientWrapper initialCustomers={customers} />
    </div>
  );
}
