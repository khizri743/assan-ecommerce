"use client";

import { Edit2, Trash2, AlertCircle } from "lucide-react";
import { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
          <tr>
            <th className="px-6 py-4">Product Details</th>
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4">Stock Status</th>
            <th className="px-6 py-4">Total Sales</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => {
            const isOutOfStock = product.stock === 0;
            const isLowStock = product.stock > 0 && product.stock < 30;

            return (
              <tr
                key={product.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                {/* Product Name & Image */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {product.category}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="px-6 py-4 font-medium text-gray-900">
                  ${product.price.toFixed(2)}
                </td>

                {/* Stock Logic */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        isOutOfStock
                          ? "bg-red-500"
                          : isLowStock
                            ? "bg-orange-500"
                            : "bg-green-500",
                      )}
                    />
                    <span
                      className={cn(
                        "font-medium",
                        isOutOfStock
                          ? "text-red-700"
                          : isLowStock
                            ? "text-orange-700"
                            : "text-gray-700",
                      )}
                    >
                      {isOutOfStock ? "Out of Stock" : `${product.stock} units`}
                    </span>
                  </div>
                  {isLowStock && (
                    <span className="text-[10px] text-orange-600 flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" /> Low inventory
                    </span>
                  )}
                </td>

                {/* Sales */}
                <td className="px-6 py-4 text-gray-600">
                  {product.sales.toLocaleString()} sold
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
