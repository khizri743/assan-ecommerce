"use client";

import Link from "next/link";
import { Clock, Phone } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

// Types... (Keep existing types)
type OrderWithRelations = {
  id: string;
  orderNumber: string;
  totalAmount: number;
  createdAt: Date;
  customer: {
    name: string;
    phone: string;
  };
  items: {
    quantity: number;
    productName: string;
  }[];
};

interface OrderCardProps {
  order: OrderWithRelations;
  isOverlay?: boolean;
  readOnly?: boolean; // Add Prop
}

export function OrderCard({ order, isOverlay, readOnly }: OrderCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: order.id,
      data: { order },
      disabled: readOnly, // Disable Dragging Here
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1,
    cursor: isOverlay ? "grabbing" : readOnly ? "default" : "grab", // Change cursor
  };

  const itemsSummary = order.items
    .map((item) => `${item.quantity}x ${item.productName}`)
    .join(", ");

  if (isOverlay) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-xl border-2 border-blue-500 scale-105 cursor-grabbing">
        <div className="flex justify-between items-start mb-2">
          <span className="font-mono text-xs text-gray-500">
            #{order.orderNumber}
          </span>
          <span className="font-bold text-gray-900">
            ${order.totalAmount.toString()}
          </span>
        </div>
        <h4 className="font-bold text-gray-900 truncate">
          {order.customer.name}
        </h4>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="touch-none"
    >
      <Link
        href={`/dashboard/orders/${order.id}`}
        className="block"
        onClick={(e) => {
          if (Math.abs(transform?.x || 0) > 5) e.preventDefault();
        }}
      >
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group relative">
          <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-xs text-gray-500">
              #{order.orderNumber}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(order.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          <h4 className="font-bold text-gray-900 truncate">
            {order.customer.name}
          </h4>
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
            <Phone className="w-3 h-3" /> {order.customer.phone}
          </div>

          <div className="bg-gray-50 p-2 rounded text-xs text-gray-700 mb-3 line-clamp-2 min-h-[2.5rem]">
            {itemsSummary || "No items"}
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
            <span className="font-bold text-gray-900">
              ${order.totalAmount.toString()}
            </span>

            {/* Visual cue for View-Only mode */}
            {readOnly ? (
              <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded">
                View
              </span>
            ) : (
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-50 text-blue-600 text-xs font-medium px-2 py-1 rounded hover:bg-blue-100">
                View
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
