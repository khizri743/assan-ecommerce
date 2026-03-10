"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { PermissionSet } from "@/lib/permissions";

// ... keep createStaffMember as is ...

export async function createStaffMember(
  formData: FormData,
  permissions: PermissionSet,
) {
  const session = await getSession();
  if (!session?.businessId) throw new Error("Unauthorized");

  // ... (Keep existing plan limit checks) ...

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!name || !email || !password) return { error: "Fill all fields" };

  // Check duplicate
  const existing = await prisma.user.findFirst({
    where: { email, businessId: session.businessId as string },
  });
  if (existing) return { error: "Email already exists" };

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      businessId: session.businessId as string,
      name,
      email,
      password: hashedPassword,
      role,
      permissions: permissions as any,
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

// --- NEW UPDATE ACTION ---
export async function updateStaffMember(
  userId: string,
  formData: FormData,
  permissions: PermissionSet,
) {
  const session = await getSession();
  if (!session?.businessId) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;
  const password = formData.get("password") as string;

  // Security: Ensure the user being edited belongs to this business
  const userToEdit = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userToEdit || userToEdit.businessId !== session.businessId) {
    return { error: "User not found or unauthorized" };
  }

  // Prevent editing the Owner's Role/Permissions via this form (Safety)
  if (userToEdit.role === "OWNER") {
    // Owners can only update their name/email here, not role/perms
    await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });
    revalidatePath("/dashboard/settings");
    return { success: true };
  }

  const updateData: any = {
    name,
    email,
    role,
    permissions: permissions as any,
  };

  // Only update password if a new one is provided
  if (password && password.trim() !== "") {
    updateData.password = await bcrypt.hash(password, 10);
  }

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

// ... keep deleteStaffMember ...
export async function deleteStaffMember(userId: string) {
  const session = await getSession();
  if (!session?.businessId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.businessId !== session.businessId)
    return { error: "Unauthorized" };
  if (user.role === "OWNER") return { error: "Cannot delete owner" };

  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/dashboard/settings");
  return { success: true };
}
