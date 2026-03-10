import ProductForm from "@/components/merchant/products/ProductForm";

export default function NewProductPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-500">
          Create a new item for your store catalog
        </p>
      </div>
      <ProductForm />
    </div>
  );
}
