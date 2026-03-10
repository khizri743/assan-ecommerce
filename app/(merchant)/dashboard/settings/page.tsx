import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { requirePermission } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsClient } from "@/components/merchant/settings/SettingsClient";

export default async function SettingsPage() {
  // 1. Check Permission
  await requirePermission("SETTINGS", "READ");

  const session = await getSession();
  if (!session?.businessId) redirect("/login");

  const business = await prisma.business.findUnique({
    where: { id: session.businessId as string },
    include: {
      users: {
        select: { email: true, name: true, role: true },
      },
    },
  });

  if (!business) redirect("/login");

  const teamMembers = await prisma.user.findMany({
    where: { businessId: session.businessId as string },
    orderBy: { createdAt: "desc" },
  });

  const currentPlanRaw = await prisma.subscriptionPlan.findUnique({
    where: { slug: business?.subscriptionPlan || "FREE" },
  });

  const currentPlan = currentPlanRaw
    ? {
        ...currentPlanRaw,
        price: Number(currentPlanRaw.price),
      }
    : null;

  const owner = business.users.find((u) => u.role === "OWNER");

  const businessData = {
    ...business,
    planDetails: currentPlan,
    email: owner?.email || "",
    address: "Islamabad, Pakistan",
    phone: "+92 300 1234567",
  };

  return (
    <SettingsClient
      initialBusiness={businessData}
      planDetails={currentPlan}
      teamMembers={teamMembers}
    />
  );
}
