"use server";

import prisma from "@/lib/prisma";
import { verifyActionPermission } from "@/lib/auth";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// CREATE
export async function createProduct(formData: FormData) {
  const user = await verifyActionPermission("PRODUCTS");

  const session = await getSession();
  if (!session?.businessId) throw new Error("Unauthorized");

  // --- ENFORCE PRODUCT LIMITS ---
  const business = await prisma.business.findUnique({
    where: { id: session.businessId as string },
    include: {
      _count: { select: { products: true } },
    },
  });

  const plan = business?.subscriptionPlan || "FREE";
  const productCount = business?._count.products || 0;

  if (plan === "FREE" && productCount >= 3) {
    throw new Error(
      "Free plan limit reached (Max 3 products). Please upgrade to Growth.",
    );
  }
  if (plan === "PRO" && productCount >= 10) {
    throw new Error(
      "Growth plan limit reached (Max 10 products). Please upgrade to Scale.",
    );
  }
  if (plan === "ENTERPRISE" && productCount >= 20) {
    throw new Error("Scale plan limit reached (Max 20 products).");
  }
  // ------------------------------

  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stockQuantity = parseInt(formData.get("stockQuantity") as string);
  const imageUrl = formData.get("imageUrl") as string;
  const isActive = formData.get("isActive") === "on";

  await prisma.product.create({
    data: {
      businessId: session.businessId as string, // Link to Session Business
      name,
      category: category || "Uncategorized",
      description,
      price,
      stockQuantity,
      imageUrl,
      isActive,
    },
  });

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

// UPDATE
export async function updateProduct(id: string, formData: FormData) {
  const user = await verifyActionPermission("PRODUCTS");

  const session = await getSession();
  if (!session?.businessId) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stockQuantity = parseInt(formData.get("stockQuantity") as string);
  const imageUrl = formData.get("imageUrl") as string;
  const isActive = formData.get("isActive") === "on";

  // Use updateMany to ensure we only update if the product belongs to the business
  await prisma.product.updateMany({
    where: {
      id: id,
      businessId: session.businessId as string,
    },
    data: {
      name,
      category: category || "Uncategorized",
      description,
      price,
      stockQuantity,
      imageUrl,
      isActive,
    },
  });

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

// DELETE
export async function deleteProduct(formData: FormData) {
  const user = await verifyActionPermission("PRODUCTS");

  const session = await getSession();
  if (!session?.businessId) throw new Error("Unauthorized");

  const id = formData.get("id") as string;

  // Use deleteMany to ensure ownership before deletion
  await prisma.product.deleteMany({
    where: {
      id: id,
      businessId: session.businessId as string,
    },
  });

  revalidatePath("/dashboard/products");
}

export async function quickUpdateProduct(
  id: string,
  price: number,
  stock: number,
) {
  const user = await verifyActionPermission("PRODUCTS");
  const session = await getSession();
  if (!session?.businessId) throw new Error("Unauthorized");

  await prisma.product.updateMany({
    where: {
      id: id,
      businessId: session.businessId as string,
    },
    data: {
      price: price,
      stockQuantity: stock,
    },
  });

  revalidatePath("/dashboard/products");
}
