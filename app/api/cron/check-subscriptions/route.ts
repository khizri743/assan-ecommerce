import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const fiveDaysFromNow = new Date();
  fiveDaysFromNow.setDate(now.getDate() + 5);

  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(now.getDate() - 5);

  try {
    // --- JOB 1: WARN USERS ---
    const expiringBusinesses = await prisma.business.findMany({
      where: {
        subscriptionEnd: { gte: now, lte: fiveDaysFromNow },
      },
      include: { users: true },
    });

    console.log(
      `--- CRON JOB 1: Found ${expiringBusinesses.length} potential candidates ---`,
    );

    for (const biz of expiringBusinesses) {
      // 1. Check Status
      if (
        biz.subscriptionStatus !== "ACTIVE" &&
        biz.subscriptionStatus !== "TRIAL"
      ) {
        console.log(
          `[SKIP] "${biz.name}": Status is ${biz.subscriptionStatus}, need ACTIVE or TRIAL`,
        );
        continue;
      }

      // 2. Check for OWNER
      const owner = biz.users.find((u) => u.role === "OWNER");
      if (!owner) {
        console.log(`[SKIP] "${biz.name}": No user with role "OWNER" found.`);
        continue;
      }

      // 3. Check for Email
      if (!owner.email) {
        console.log(`[SKIP] "${biz.name}": Owner has no email address.`);
        continue;
      }

      // If all checks pass, send the email
      await sendEmail({
        to: owner.email,
        subject: "Action Required: Subscription Expiring Soon",
        html: `<p>Your subscription for <strong>${biz.name}</strong> expires on ${biz.subscriptionEnd?.toLocaleDateString()}.</p>`,
      });

      console.log(`[SUCCESS] Warning sent to ${owner.email} for ${biz.name}`);
    }

    // --- JOB 2: OVERDUE WARNING (Expired 1-5 days ago) ---
    const overdueBusinesses = await prisma.business.findMany({
      where: {
        subscriptionEnd: {
          lt: now, // Expired in the past
          gt: fiveDaysAgo, // But less than 5 days ago
        },
      },
      include: { users: true }, // Get all users so we can debug roles
    });

    console.log(
      `--- CRON JOB 2: Found ${overdueBusinesses.length} potential overdue candidates ---`,
    );

    for (const biz of overdueBusinesses) {
      // 1. Check Status (Include TRIAL!)
      if (
        biz.subscriptionStatus !== "ACTIVE" &&
        biz.subscriptionStatus !== "TRIAL"
      ) {
        console.log(
          `[SKIP OVERDUE] "${biz.name}": Status is ${biz.subscriptionStatus}. We only nudge ACTIVE or TRIAL.`,
        );
        continue;
      }

      // 2. Find Owner safely
      const owner = biz.users.find((u) => u.role === "OWNER");

      if (!owner) {
        console.log(
          `[SKIP OVERDUE] "${biz.name}": No user with role "OWNER" found. Available roles: ${biz.users.map((u) => u.role)}`,
        );
        continue;
      }

      if (!owner.email) {
        console.log(
          `[SKIP OVERDUE] "${biz.name}": Owner ${owner.name} has no email.`,
        );
        continue;
      }

      // 3. Send Email
      await sendEmail({
        to: owner.email,
        subject: "Subscription Expired",
        html: `<p>Your subscription for ${biz.name} expired on ${biz.subscriptionEnd?.toLocaleDateString()}.</p>`,
      });

      console.log(
        `[SUCCESS] Overdue notice sent to ${owner.email} for ${biz.name}`,
      );
    }

    // --- JOB 3: LOCK ACCOUNT (Expired > 5 days ago) ---
    const businessesToLock = await prisma.business.findMany({
      where: {
        subscriptionEnd: { lt: fiveDaysAgo },
      },
      include: { users: true },
    });

    console.log(
      `--- CRON JOB 3: Found ${businessesToLock.length} candidates for LOCKDOWN ---`,
    );

    for (const biz of businessesToLock) {
      // 1. Only lock if not already EXPIRED
      if (biz.subscriptionStatus === "EXPIRED") {
        console.log(`[SKIP LOCK] "${biz.name}": Already marked as EXPIRED.`);
        continue;
      }

      // 2. Perform the Update FIRST
      await prisma.business.update({
        where: { id: biz.id },
        data: { subscriptionStatus: "EXPIRED" },
      });

      // 3. Notify Owner
      const owner = biz.users.find((u) => u.role === "OWNER");
      if (owner?.email) {
        await sendEmail({
          to: owner.email,
          subject: "ACCOUNT SUSPENDED",
          html: `<h2 style="color: red;">Service Suspended</h2>
             <p>Access to <strong>${biz.name}</strong> has been limited due to non-payment after the grace period.</p>`,
        });
        console.log(
          `[SUCCESS] LOCK notification sent to ${owner.email} for ${biz.name}`,
        );
      } else {
        console.log(
          `[LOCKED NO EMAIL] "${biz.name}" status updated to EXPIRED, but no owner found to notify.`,
        );
      }
    }

    return NextResponse.json({
      success: true,
      processed: {
        warned: expiringBusinesses.length,
        overdue: overdueBusinesses.length,
        locked: businessesToLock.length,
      },
    });
  } catch (error) {
    console.error("CRON_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
