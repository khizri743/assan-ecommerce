"use server";

import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { revalidatePath } from "next/cache";

// 1. Fetch all businesses with a pending plan
export async function getPendingUpgradeRequests() {
  const requests = await prisma.business.findMany({
    where: {
      pendingPlan: { not: null },
    },
    select: {
      id: true,
      name: true,
      subscriptionPlan: true,
      pendingPlan: true,
      paymentProofUrl: true,
      users: {
        where: { role: "OWNER" },
        select: { email: true, name: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return requests;
}

// 2. Approve Request
export async function approveSubscription(businessId: string, newPlan: string) {
  // A. Update Business (Reset dates for new cycle)
  await prisma.business.update({
    where: { id: businessId },
    data: {
      subscriptionPlan: newPlan,
      pendingPlan: null,
      paymentProofUrl: null,
      subscriptionStart: new Date(), // Cycle starts now
      subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Set to 30 days from now
      subscriptionStatus: "ACTIVE", // Ensure status is active
    },
  });

  // B. Fetch Owner for Email
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    include: { users: { where: { role: "OWNER" } } },
  });

  const ownerEmail = business?.users[0]?.email;

  // C. Send Notification Email
  if (ownerEmail) {
    try {
      await sendEmail({
        to: ownerEmail,
        subject: "Subscription Approved! - Assan Ecommerce",
        html: `
          <h3>Congratulations!</h3>
          <p>Your subscription upgrade to <strong>${newPlan}</strong> has been approved.</p>
          <p>You now have access to all the features of your new plan. Your new billing cycle starts today.</p>
          <br/>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block; background:#2563eb; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Go to Dashboard</a>
        `,
      });
    } catch (error) {
      console.error("Failed to send approval email:", error);
      // Continue execution even if email fails
    }
  }

  // D. Audit Log
  await prisma.auditLog.create({
    data: {
      action: "SUBSCRIPTION_APPROVED",
      entityType: "BUSINESS",
      entityId: businessId,
      entityName: business?.name || "Unknown",
      actorEmail: "admin@system.com",
      details: `Approved upgrade to ${newPlan}`,
      severity: "SUCCESS",
    },
  });

  revalidatePath("/admin");
  return { success: true };
}

// 3. Reject Request
export async function rejectSubscription(businessId: string) {
  // A. Clear pending fields
  await prisma.business.update({
    where: { id: businessId },
    data: {
      pendingPlan: null,
      paymentProofUrl: null,
    },
  });

  // B. Audit Log
  await prisma.auditLog.create({
    data: {
      action: "SUBSCRIPTION_REJECTED",
      entityType: "BUSINESS",
      entityId: businessId,
      entityName: "System",
      actorEmail: "admin@system.com",
      details: "Rejected upgrade request",
      severity: "WARNING",
    },
  });

  revalidatePath("/admin");
  return { success: true };
}
