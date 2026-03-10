"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Package,
  Pencil,
  Trash2,
  Edit3,
  Image as ImageIcon,
} from "lucide-react";
import { QuickEditModal } from "./QuickEditModal";
import { deleteProduct } from "@/app/(merchant)/dashboard/products/actions";

interface Product {
  id: string;
  name: string;
  category: string | "Uncategorized";
  description: string | null;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  imageUrl: string | null;
}

interface ProductTableProps {
  products: Product[];
  readOnly?: boolean; // We use this prop to control UI interactivity
}

export function ProductTableClient({ products, readOnly }: ProductTableProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Generate categories dynamically
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category || "Uncategorized"));
    return ["ALL", ...Array.from(cats)];
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "ALL" ||
        (p.category || "Uncategorized") === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Helper to open modal ONLY if write access exists
  const handleQuickEdit = (product: Product) => {
    if (readOnly) return;
    setEditingProduct(product);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 p-2">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-72 px-4 py-2 border border-gray-400 rounded-lg text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-52 px-4 py-2 border border-gray-400 rounded-lg text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-500">Product</th>
              <th className="px-6 py-4 font-medium text-gray-500">Price</th>
              <th className="px-6 py-4 font-medium text-gray-500">Stock</th>
              <th className="px-6 py-4 font-medium text-gray-500">Status</th>
              <th className="px-6 py-4 font-medium text-gray-500 text-right">
                {/* Hide 'Actions' header if readonly to save space, or keep empty */}
                {!readOnly && "Actions"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 group">
                  {/* PRODUCT INFO */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden border border-gray-200">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-5 w-5 opacity-50" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* PRICE */}
                  <td className="px-6 py-4 font-medium text-gray-900">
                    Rs. {product.price.toFixed(2)}
                  </td>

                  {/* STOCK (Conditional Rendering based on ReadOnly) */}
                  <td className="px-6 py-4">
                    {readOnly ? (
                      // READ-ONLY: Just text, no button, no hover edit icon
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.stockQuantity < 10
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {product.stockQuantity} units
                      </span>
                    ) : (
                      // WRITE ACCESS: Button with click handler
                      <button
                        onClick={() => handleQuickEdit(product)}
                        className="group/stock flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                        title="Quick Edit Stock"
                      >
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            product.stockQuantity < 10
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {product.stockQuantity} units
                        </span>
                        <Edit3 className="h-3 w-3 text-gray-400 opacity-0 group-hover/stock:opacity-100" />
                      </button>
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        product.isActive
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* ACTIONS (Hidden if ReadOnly) */}
                  <td className="px-6 py-4 text-right">
                    {!readOnly ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleQuickEdit(product)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Quick Edit Price/Stock"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        <Link
                          href={`/dashboard/products/${product.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Full Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>

                        <form action={deleteProduct}>
                          <input type="hidden" name="id" value={product.id} />
                          <button
                            type="submit"
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        View Only
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Only render modal if not readOnly (extra safety) */}
      {!readOnly && (
        <QuickEditModal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          product={editingProduct}
        />
      )}
    </>
  );
}
