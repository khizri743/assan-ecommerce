import { cn } from "@/lib/utils";

type StatusVariant =
  | "active"
  | "inactive"
  | "pending"
  | "pro"
  | "basic"
  | "owner"
  | "manager"
  | "staff";

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  active: "bg-green-50 text-green-700 border-green-100",
  inactive: "bg-red-50 text-red-700 border-red-100",
  pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
  pro: "bg-purple-50 text-purple-700 border-purple-100",
  basic: "bg-blue-50 text-blue-700 border-blue-100",
  owner: "bg-purple-50 text-purple-700 border-purple-100",
  manager: "bg-blue-50 text-blue-700 border-blue-100",
  staff: "bg-gray-50 text-gray-700 border-gray-200",
};

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const style = variant ? variantStyles[variant] : variantStyles.active;

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-medium border",
        style,
        className,
      )}
    >
      {status}
    </span>
  );
}
