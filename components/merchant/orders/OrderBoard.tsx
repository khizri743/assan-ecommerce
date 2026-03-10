"use client";

import { useState, useEffect, useId } from "react"; // Added useId
import { CheckCircle2, Truck, PackageCheck, RotateCcw } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { KanbanColumn } from "./KanbanColumn";
import { OrderCard } from "./OrderCard";
import { updateOrderStatus } from "@/app/(merchant)/dashboard/orders/actions";

interface OrderBoardProps {
  orders: any[];
  readOnly?: boolean;
}

export function OrderBoard({
  orders: initialOrders,
  readOnly,
}: OrderBoardProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [activeOrder, setActiveOrder] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false); // Track hydration
  const id = useId(); // Provide a stable ID for DndContext

  // 1. Prevent hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync state if server data changes
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
  );

  // Return a shell/skeleton during SSR to match the initial server HTML
  if (!mounted) {
    return (
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex h-full gap-6 min-w-[1200px] opacity-0">
          {/* Invisible columns to maintain layout shift while loading */}
          <div className="w-80 h-full bg-gray-50 rounded-xl" />
          <div className="w-80 h-full bg-gray-50 rounded-xl" />
        </div>
      </div>
    );
  }

  const getOrdersByStatus = (status: string) =>
    orders.filter((o) => o.status === status);

  const handleDragStart = (event: DragStartEvent) => {
    if (readOnly) return;
    const { active } = event;
    const order = orders.find((o) => o.id === active.id);
    setActiveOrder(order);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    if (readOnly) return;

    const { active, over } = event;
    setActiveOrder(null);

    if (!over) return;

    const orderId = active.id as string;
    const newStatus = over.id as string;
    const currentOrder = orders.find((o) => o.id === orderId);

    if (!currentOrder || currentOrder.status === newStatus) return;

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );

    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error("Failed to update status", error);
      setOrders(initialOrders);
      alert("Failed to move order. Permission denied.");
    }
  };

  return (
    <DndContext
      id={id} // Stable ID stops aria-describedby mismatch
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex h-full gap-6 min-w-[1200px]">
          <KanbanColumn
            id="CONFIRMED"
            title="Confirmed"
            count={getOrdersByStatus("CONFIRMED").length}
            color="border-blue-500"
            icon={<CheckCircle2 className="w-4 h-4 text-blue-500" />}
          >
            {getOrdersByStatus("CONFIRMED").map((order) => (
              <OrderCard key={order.id} order={order} readOnly={readOnly} />
            ))}
          </KanbanColumn>

          <KanbanColumn
            id="OUT_FOR_DELIVERY"
            title="Out for Delivery"
            count={getOrdersByStatus("OUT_FOR_DELIVERY").length}
            color="border-orange-500"
            icon={<Truck className="w-4 h-4 text-orange-500" />}
          >
            {getOrdersByStatus("OUT_FOR_DELIVERY").map((order) => (
              <OrderCard key={order.id} order={order} readOnly={readOnly} />
            ))}
          </KanbanColumn>

          <KanbanColumn
            id="DELIVERED"
            title="Delivered"
            count={getOrdersByStatus("DELIVERED").length}
            color="border-green-500"
            icon={<PackageCheck className="w-4 h-4 text-green-500" />}
          >
            {getOrdersByStatus("DELIVERED").map((order) => (
              <OrderCard key={order.id} order={order} readOnly={readOnly} />
            ))}
          </KanbanColumn>

          <KanbanColumn
            id="RETURNED"
            title="Returned"
            count={getOrdersByStatus("RETURNED").length}
            color="border-red-500"
            icon={<RotateCcw className="w-4 h-4 text-red-500" />}
          >
            {getOrdersByStatus("RETURNED").map((order) => (
              <OrderCard key={order.id} order={order} readOnly={readOnly} />
            ))}
          </KanbanColumn>
        </div>
      </div>

      <DragOverlay>
        {activeOrder ? <OrderCard order={activeOrder} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
