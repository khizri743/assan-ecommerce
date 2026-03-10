"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function calculateUpgradeCost(targetPlanSlug: string) {
  const session = await getSession();
  if (!session?.businessId) throw new Error("Unauthorized");

  const business = await prisma.business.findUnique({
    where: { id: session.businessId as string },
  });

  if (!business) throw new Error("Business not found");

  // 1. Get Current and Target Plans
  const currentPlan = await prisma.subscriptionPlan.findUnique({
    where: { slug: business.subscriptionPlan },
  });
  const targetPlan = await prisma.subscriptionPlan.findUnique({
    where: { slug: targetPlanSlug },
  });

  if (!currentPlan || !targetPlan) throw new Error("Invalid plan");

  // If downgrading or same plan, cost is 0 (handled differently in real SaaS)
  if (Number(targetPlan.price) <= Number(currentPlan.price)) {
    return { amount: 0, message: "Plan change will apply at next cycle." };
  }

  // 2. Calculate Proration
  const now = new Date();
  const cycleStart = business.subscriptionStart || new Date();
  // Assume 30-day cycle for simplicity, or use real subscriptionEnd if available
  const cycleEnd =
    business.subscriptionEnd ||
    new Date(cycleStart.getTime() + 30 * 24 * 60 * 60 * 1000);

  const totalDaysInCycle = 30;
  const daysRemaining = Math.ceil(
    (cycleEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  // If cycle ended or negative, treat as full month (new cycle)
  const safeDaysRemaining = Math.max(0, Math.min(daysRemaining, 30));

  // Logic: (Diff in Price) * (Remaining Fraction of Month)
  const priceDiff = Number(targetPlan.price) - Number(currentPlan.price);
  const proratedAmount = (priceDiff / totalDaysInCycle) * safeDaysRemaining;

  return {
    amount: Math.round(proratedAmount), // Round to nearest integer for clean UI
    daysRemaining: safeDaysRemaining,
    currentPlanName: currentPlan.name,
    targetPlanName: targetPlan.name,
  };
}

export async function getAvailablePlans() {
  const plans = await prisma.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      features: true,
    },
  });

  // Convert Decimal to Number
  return plans.map((p) => ({
    ...p,
    price: Number(p.price),
  }));
}

export async function requestUpgrade(
  targetPlanSlug: string,
  formData: FormData,
) {
  const session = await getSession();
  if (!session?.businessId) throw new Error("Unauthorized");

  const file = formData.get("proofUrl") as File; // Now we get the File object directly

  if (!file || file.size === 0) {
    throw new Error("Payment proof is required");
  }

  // 1. Validate File Type
  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only JPG, PNG, and WEBP allowed.");
  }

  // 2. Prepare Upload Path
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${session.businessId}-${Date.now()}-${file.name.replaceAll(" ", "_")}`;
  const uploadDir = path.join(process.cwd(), "public/uploads/proofs");

  // Ensure directory exists
  await mkdir(uploadDir, { recursive: true });

  // 3. Write File
  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);

  // 4. Generate Public URL
  const proofUrl = `/uploads/proofs/${filename}`;

  // 5. Store Request
  await prisma.business.update({
    where: { id: session.businessId as string },
    data: {
      pendingPlan: targetPlanSlug,
      paymentProofUrl: proofUrl,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "SUBSCRIPTION_REQUEST",
      entityType: "BUSINESS",
      entityId: session.businessId as string,
      entityName: "Upgrade Request",
      actorEmail: (session.userId as string) || "system",
      details: `Requested upgrade to ${targetPlanSlug}`,
      severity: "INFO",
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

// ADMIN ACTION (To be used later in Admin Panel)
export async function approveUpgrade(businessId: string) {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
  });
  if (!business?.pendingPlan) return;

  await prisma.business.update({
    where: { id: businessId },
    data: {
      subscriptionPlan: business.pendingPlan,
      pendingPlan: null,
      paymentProofUrl: null,
      subscriptionStart: new Date(), // Reset cycle or logic as needed
    },
  });
}

export async function confirmUpgrade(targetPlanSlug: string) {
  const session = await getSession();
  if (!session?.businessId) throw new Error("Unauthorized");

  // In a real app, you would charge the card here using Stripe/LemonSqueezy
  // const cost = await calculateUpgradeCost(targetPlanSlug);
  // await chargeCard(cost.amount);

  await prisma.business.update({
    where: { id: session.businessId as string },
    data: {
      subscriptionPlan: targetPlanSlug,
      // In real app, you might reset cycle or keep it same depending on billing logic
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}
