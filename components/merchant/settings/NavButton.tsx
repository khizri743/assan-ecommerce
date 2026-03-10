"use client";

import { cn } from "@/lib/utils";

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  badge?: string;
}

export function NavButton({
  active,
  onClick,
  icon: Icon,
  label,
  badge,
}: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left",
        active
          ? "bg-blue-50 text-blue-700 border border-blue-100"
          : "text-gray-600 hover:bg-gray-50",
      )}
    >
      <Icon
        className={cn("h-4 w-4", active ? "text-blue-600" : "text-gray-400")}
      />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}
