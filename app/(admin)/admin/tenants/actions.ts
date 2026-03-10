"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getTenantStats() {
  const [total, active, suspended] = await Promise.all([
    prisma.business.count(),
    prisma.business.count({ where: { subscriptionStatus: "ACTIVE" } }),
    // prisma.business.count({ where: { subscriptionStatus: "TRIAL" } }),
    prisma.business.count({ where: { subscriptionStatus: "SUSPENDED" } }),
  ]);
  return { total, active, suspended };
}

export async function createTenant(prevState: any, formData: FormData) {
  try {
    const businessName = formData.get("businessName") as string;
    const slug = formData.get("slug") as string;
    const ownerName = formData.get("ownerName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const plan = formData.get("plan") as string;

    if (!businessName || !email || !password || !slug) {
      return { error: "Missing required fields" };
    }

    // 1. Check for duplicates
    const existing = await prisma.business.findFirst({
      where: { OR: [{ slug }, { users: { some: { email } } }] },
    });

    if (existing) {
      return { error: "Slug or Email already in use." };
    }

    // 2. Create Business & Owner
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.business.create({
      data: {
        name: businessName,
        slug: slug.toLowerCase(),
        subscriptionPlan: plan,
        users: {
          create: {
            name: ownerName,
            email,
            password: hashedPassword,
            role: "OWNER",
          },
        },
      },
    });

    revalidatePath("/admin/tenants");
    return { success: true };
  } catch (error) {
    console.error("Create Tenant Error:", error);
    return { error: "Failed to create tenant." };
  }
}

export async function toggleTenantStatus(
  tenantId: string,
  currentStatus: string,
) {
  const newStatus = currentStatus === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";

  await prisma.business.update({
    where: { id: tenantId },
    data: { subscriptionStatus: newStatus },
  });

  revalidatePath("/admin/tenants");
}

// Helper to get owner email for a business
export async function getTenantOwner(businessId: string) {
  const owner = await prisma.user.findFirst({
    where: { businessId, role: "OWNER" },
    select: { email: true },
  });
  return owner?.email || "No Owner";
}
