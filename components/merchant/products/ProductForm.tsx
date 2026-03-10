"use client";

import {
  createProduct,
  updateProduct,
} from "@/app/(merchant)/dashboard/products/actions";
import { Save, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

type ProductData = {
  id?: string;
  name: string;
  category?: string | null;
  description: string | null;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  imageUrl?: string | null; // Added
};

export default function ProductForm({
  initialData,
  readOnly = false,
}: {
  initialData?: ProductData;
  readOnly?: boolean;
}) {
  const isEditing = !!initialData?.id;
  const action = isEditing
    ? updateProduct.bind(null, initialData.id!)
    : createProduct;

  return (
    <form
      action={action}
      className="space-y-6 bg-white p-6 rounded-xl border border-gray-200"
    >
      <div className="grid gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            defaultValue={initialData?.name}
            required
            className="w-full px-3 py-2 border border-gray-400 rounded-lg text-black focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            name="category" // Name matches formData.get('category')
            defaultValue={initialData?.category || ""}
            disabled={readOnly}
            placeholder="e.g. Burgers, Drinks, Electronics"
            className="w-full px-3 py-2 border border-gray-400 rounded-lg text-black focus:ring-2 focus:ring-blue-600 outline-none disabled:bg-gray-50"
          />

          {/* Image URL (Simple text input for now) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="url"
                  name="imageUrl"
                  defaultValue={initialData?.imageUrl || ""}
                  placeholder="https://example.com/image.png"
                  className="w-full pl-9 pr-3 py-2 border border-gray-400 rounded-lg text-black focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Paste a link to your product image.
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            defaultValue={initialData?.description || ""}
            className="w-full px-3 py-2 border border-gray-400 rounded-lg text-black focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              step="0.01"
              min="0"
              defaultValue={initialData?.price}
              required
              className="w-full px-3 py-2 border border-gray-400 rounded-lg text-black focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stockQuantity"
              min="0"
              defaultValue={initialData?.stockQuantity}
              required
              className="w-full px-3 py-2 border border-gray-400 rounded-lg text-black focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            defaultChecked={initialData?.isActive ?? true}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded text-black focus:ring-blue-500"
          />
          <label
            htmlFor="isActive"
            className="text-sm font-medium text-gray-700"
          >
            Product is Active (Visible in store)
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <Link
          href="/dashboard/products"
          className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium text-center hover:bg-gray-200"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          <Save className="h-4 w-4" />
          {isEditing ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
