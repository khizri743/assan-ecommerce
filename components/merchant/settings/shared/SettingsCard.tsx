import { cn } from "@/lib/utils";

interface SettingsCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
}

export function SettingsCard({
  children,
  className,
  title,
  description,
  icon: Icon,
  action,
}: SettingsCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-gray-200 rounded-xl shadow-sm",
        className,
      )}
    >
      {(title || Icon) && (
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start">
          <div className="flex items-start gap-3">
            {Icon && (
              <div className="p-2 bg-gray-50 rounded-lg">
                <Icon className="h-5 w-5 text-gray-600" />
              </div>
            )}
            <div>
              {title && (
                <h3 className="font-semibold text-gray-900">{title}</h3>
              )}
              {description && (
                <p className="text-sm text-gray-500">{description}</p>
              )}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={cn("p-6", !title && !Icon && "pt-6")}>{children}</div>
    </div>
  );
}
