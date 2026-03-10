"use client";

import { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

type KanbanColumnProps = {
  id: string; // This will correspond to the STATUS (e.g., 'CONFIRMED')
  title: string;
  count: number;
  children: ReactNode;
  color: string;
  icon: ReactNode;
};

export function KanbanColumn({
  id,
  title,
  count,
  children,
  color,
  icon,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-1 flex flex-col rounded-xl border min-w-[280px] h-full transition-colors",
        isOver
          ? "bg-blue-50 border-blue-300 ring-2 ring-blue-200"
          : "bg-gray-50 border-gray-200",
      )}
    >
      {/* Column Header */}
      <div
        className={`p-4 border-b border-gray-100 flex items-center justify-between border-t-4 ${color} rounded-t-xl bg-white`}
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-semibold text-gray-700 text-sm">{title}</h3>
        </div>
        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">
          {count}
        </span>
      </div>

      {/* Scrollable Area */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
        {children}
      </div>
    </div>
  );
}
