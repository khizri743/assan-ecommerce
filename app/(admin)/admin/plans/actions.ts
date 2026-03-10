"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updatePlan(id: string, formData: FormData) {
  const price = parseFloat(formData.get("price") as string);
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  // Features are passed as a newline-separated string from the textarea
  const featuresRaw = formData.get("features") as string;
  const features = featuresRaw.split("\n").filter((f) => f.trim() !== "");
  const isPopular = formData.get("isPopular") === "on";

  await prisma.subscriptionPlan.update({
    where: { id },
    data: {
      name,
      price,
      description,
      features,
      isPopular,
    },
  });

  revalidatePath("/"); // Update Landing Page
  revalidatePath("/admin/plans"); // Update Admin Page
  revalidatePath("/dashboard/settings"); // Update Merchant Settings
}
