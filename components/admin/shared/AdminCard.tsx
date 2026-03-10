import { cn } from "@/lib/utils";

interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ElementType;
  variant?: "default" | "danger" | "warning" | "success";
}

const variantStyles = {
  default: "bg-white border-gray-200",
  danger: "bg-red-50 border-red-100",
  warning: "bg-orange-50 border-orange-100",
  success: "bg-green-50 border-green-100",
};

export function AdminCard({
  children,
  className,
  title,
  subtitle,
  action,
  icon: Icon,
  variant = "default",
}: AdminCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border shadow-sm",
        variantStyles[variant],
        className,
      )}
    >
      {(title || Icon) && (
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start">
          <div className="flex items-start gap-3">
            {Icon && (
              <div
                className={cn(
                  "p-2 rounded-lg",
                  variant === "danger" && "bg-red-100 text-red-600",
                  variant === "warning" && "bg-orange-100 text-orange-700",
                  variant === "success" && "bg-green-100 text-green-700",
                  variant === "default" && "bg-blue-50 text-blue-600",
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div>
              {title && (
                <h3 className="font-semibold text-gray-900">{title}</h3>
              )}
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
