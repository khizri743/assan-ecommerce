import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import ProductForm from "@/components/merchant/products/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  if (!session?.businessId) redirect("/login");

  // Secure Fetch: Ensure product exists AND belongs to this business
  const product = await prisma.product.findFirst({
    where: {
      id: id,
      businessId: session.businessId as string,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500">Update product details and stock</p>
      </div>

      <ProductForm
        initialData={{
          ...product,
          price: Number(product.price),
        }}
      />
    </div>
  );
}
