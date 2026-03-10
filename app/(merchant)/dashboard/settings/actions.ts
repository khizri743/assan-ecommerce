"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function updateBusinessProfile(formData: FormData) {
  const session = await getSession();
  if (!session?.businessId) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const industryType = formData.get("industryType") as string;

  await prisma.business.update({
    where: { id: session.businessId as string },
    data: {
      name,
      // Note: In your schema, phone is not directly on Business,
      // but usually business phone is distinct from Owner phone.
      // Assuming you might add a 'phone' or 'address' field to Business later.
      // For now, updating what exists:
      industryType,
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}
