"use client";

import { useState, useMemo } from "react";
import { X, Plus, Minus, ShoppingCart, Loader2, Search } from "lucide-react";
import { createManualOrder } from "@/app/(merchant)/dashboard/chat/actions";

interface Product {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  category: string | null; // <--- Added category
}

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  sessionId: string;
  onSuccess?: (message?: any) => void;
}

export function CreateOrderModal({
  isOpen,
  onClose,
  products,
  sessionId,
  onSuccess,
}: CreateOrderModalProps) {
  const [cart, setCart] = useState<{ productId: string; qty: number }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Group products by category
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category || "Uncategorized"));
    return ["ALL", ...Array.from(cats)];
  }, [products]);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" ||
      (p.category || "Uncategorized") === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prev, { productId, qty: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing && existing.qty > 1) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, qty: item.qty - 1 } : item,
        );
      }
      return prev.filter((item) => item.productId !== productId);
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId);
      return total + (product ? product.price * item.qty : 0);
    }, 0);
  };

  const handleSubmit = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    try {
      const formattedCart = cart.map((item) => ({
        productId: item.productId,
        quantity: item.qty,
      }));

      const response = await createManualOrder(sessionId, formattedCart);

      if (response.message && onSuccess) {
        onSuccess(response.message);
      } else {
        onClose();
      }
      setCart([]);
    } catch (error: any) {
      console.error(error);
      alert(`Failed to create order: ${error.message || "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            Create Manual Order
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content - Three Columns (Category | Products | Cart) */}
        <div className="flex-1 flex overflow-hidden">
          {/* 1. Category Sidebar */}
          <div className="w-1/4 bg-gray-50 border-r border-gray-200 overflow-y-auto p-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-3 mt-4">
              Categories
            </h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Product List */}
          <div className="w-2/4 p-4 border-r border-gray-200 flex flex-col bg-white">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {filteredProducts.map((product) => {
                const inCart = cart.find((c) => c.productId === product.id);
                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-blue-200 transition-colors group"
                  >
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    {inCart ? (
                      <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-1">
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="p-1 hover:bg-white rounded text-blue-600"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">
                          {inCart.qty}
                        </span>
                        <button
                          onClick={() => addToCart(product.id)}
                          className="p-1 hover:bg-white rounded text-blue-600"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product.id)}
                        className="p-2 bg-gray-50 text-gray-400 group-hover:bg-blue-600 group-hover:text-white rounded-lg transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Cart Summary */}
          <div className="w-1/4 p-4 bg-gray-50 flex flex-col">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              Cart
            </h3>

            <div className="flex-1 overflow-y-auto space-y-3">
              {cart.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  <p className="text-xs">Empty</p>
                </div>
              ) : (
                cart.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  if (!product) return null;
                  return (
                    <div
                      key={item.productId}
                      className="flex justify-between text-sm py-1 border-b border-gray-200 last:border-0"
                    >
                      <span className="text-gray-700 truncate max-w-[60%]">
                        {item.qty}x {product.name}
                      </span>
                      <span className="font-medium text-gray-900">
                        ${(product.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-gray-700 text-sm">Total</span>
                <span className="text-lg font-extrabold text-blue-600">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleSubmit}
                disabled={cart.length === 0 || isSubmitting}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  "Confirm Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
