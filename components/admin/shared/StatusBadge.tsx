import { cn } from "@/lib/utils";

type AdminStatusVariant =
  | "active"
  | "inactive"
  | "suspended"
  | "past_due"
  | "trial"
  | "free"
  | "basic"
  | "pro"
  | "success"
  | "warning"
  | "danger"
  | "info";

interface StatusBadgeProps {
  status: string;
  variant?: AdminStatusVariant;
  className?: string;
}

const variantStyles: Record<AdminStatusVariant, string> = {
  active: "bg-green-50 text-green-700 border-green-100",
  inactive: "bg-gray-50 text-gray-600 border-gray-200",
  suspended: "bg-red-50 text-red-700 border-red-100",
  past_due: "bg-amber-50 text-amber-700 border-amber-100",
  trial: "bg-blue-50 text-blue-700 border-blue-100",
  free: "bg-gray-50 text-gray-600 border-gray-200",
  basic: "bg-blue-50 text-blue-700 border-blue-100",
  pro: "bg-purple-50 text-purple-700 border-purple-100",
  success: "bg-green-50 text-green-700 border-green-100",
  warning: "bg-amber-50 text-amber-700 border-amber-100",
  danger: "bg-red-50 text-red-700 border-red-100",
  info: "bg-blue-50 text-blue-700 border-blue-100",
};

export function StatusBadge({
  status,
  variant = "active",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wider",
        variantStyles[variant],
        className,
      )}
    >
      {status}
    </span>
  );
}
