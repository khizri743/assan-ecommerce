import prisma from "@/lib/prisma";
import { AdminCard } from "@/components/admin/shared/AdminCard";
import { PlanEditor } from "@/components/admin/plans/PlanEditor";

export default async function AdminPlansPage() {
  const plansRaw = await prisma.subscriptionPlan.findMany({
    orderBy: { price: "asc" },
  });

  // Convert Decimals to Numbers so they can be passed to Client Component
  const plans = plansRaw.map((plan) => ({
    ...plan,
    price: Number(plan.price), // Convert Decimal to Number
    createdAt: plan.createdAt.toISOString(), // Convert Date to String
    updatedAt: plan.updatedAt.toISOString(), // Convert Date to String
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
        <p className="text-gray-500 text-sm">
          Manage pricing and features visible on the landing page.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanEditor key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}
