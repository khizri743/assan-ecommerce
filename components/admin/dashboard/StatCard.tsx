import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "danger" | "warning";
}

const variantStyles = {
  default: "bg-white border-gray-200",
  success: "bg-green-50 border-green-100",
  danger: "bg-red-50 border-red-100",
  warning: "bg-amber-50 border-amber-100",
};

const iconStyles = {
  default: "bg-blue-50 text-blue-600",
  success: "bg-green-100 text-green-700",
  danger: "bg-red-100 text-red-700",
  warning: "bg-amber-100 text-amber-700",
};

export function StatCard({
  title,
  value,
  change,
  changeLabel = "vs last month",
  icon: Icon,
  variant = "default",
}: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className={cn("p-6 rounded-xl border", variantStyles[variant])}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2 rounded-lg", iconStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
        {change !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              isPositive && "text-green-700",
              isNegative && "text-red-700",
              !isPositive && !isNegative && "text-gray-500",
            )}
          >
            {isPositive && <ArrowUpRight className="h-3 w-3" />}
            {isNegative && <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {changeLabel && (
        <p className="text-xs text-gray-500 mt-1">{changeLabel}</p>
      )}
    </div>
  );
}
