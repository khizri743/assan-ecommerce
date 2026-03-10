import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { requirePermission } from "@/lib/auth"; // Import auth helper
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ProductTableClient } from "@/components/merchant/products/ProductTableClient";

export default async function ProductsPage() {
  // 1. Check Permission
  const user = await requirePermission("PRODUCTS", "READ");

  const session = await getSession();
  if (!session?.businessId) redirect("/login");

  const productsRaw = await prisma.product.findMany({
    where: { businessId: session.businessId as string },
    orderBy: { createdAt: "desc" },
  });

  const products = productsRaw.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  // Determine if user can write (to show/hide Add button)
  const canWrite =
    user.role === "OWNER" || (user.permissions as any)?.PRODUCTS === "WRITE";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm">Manage your product catalog</p>
        </div>

        {/* Only show Add button if user has WRITE access */}
        {canWrite && (
          <Link
            href="/dashboard/products/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        )}
      </div>

      <ProductTableClient products={products} readOnly={!canWrite} />
    </div>
  );
}
