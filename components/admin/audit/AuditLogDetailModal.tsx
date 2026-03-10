import {
  X,
  Clock,
  User,
  Globe,
  FileText,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditLog {
  id: string;
  timestamp: string;
  admin: {
    name: string;
    email: string;
  };
  action: string;
  targetType: string;
  targetName: string;
  targetId: string;
  ipAddress: string;
  details: string;
  severity: "info" | "warning" | "critical";
}

interface AuditLogDetailModalProps {
  log: AuditLog | null;
  isOpen: boolean;
  onClose: () => void;
}

const severityConfig = {
  info: {
    icon: Info,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  critical: {
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
};

export function AuditLogDetailModal({
  log,
  isOpen,
  onClose,
}: AuditLogDetailModalProps) {
  if (!log) return null;

  const severity = severityConfig[log.severity];
  const Icon = severity.icon;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Audit Log Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-4rem)]">
          {/* Severity Banner */}
          <div
            className={cn(
              "p-4 rounded-xl border mb-6",
              severity.bg,
              severity.border,
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className={cn("h-5 w-5", severity.color)} />
              <div>
                <p className={cn("font-semibold text-sm", severity.color)}>
                  {log.severity.toUpperCase()} SEVERITY
                </p>
                <p className="text-xs text-gray-600">
                  Action requires{" "}
                  {log.severity === "critical"
                    ? "immediate review"
                    : "attention"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Summary */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">
              Action Summary
            </h3>
            <div className="space-y-3">
              <DetailRow
                icon={Clock}
                label="Timestamp"
                value={new Date(log.timestamp).toLocaleString()}
              />
              <DetailRow
                icon={CheckCircle}
                label="Action"
                value={log.action.replace(/_/g, " ").toUpperCase()}
              />
              <DetailRow
                icon={FileText}
                label="Target Type"
                value={log.targetType.toUpperCase()}
              />
              <DetailRow
                icon={FileText}
                label="Target Name"
                value={log.targetName}
              />
              <DetailRow
                icon={FileText}
                label="Target ID"
                value={log.targetId}
                isMono
              />
            </div>
          </div>

          {/* Admin Details */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">
              Performed By
            </h3>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-lg font-bold">
                {log.admin.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{log.admin.name}</p>
                <p className="text-sm text-gray-500">{log.admin.email}</p>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">
              Technical Details
            </h3>
            <div className="space-y-3">
              <DetailRow
                icon={Globe}
                label="IP Address"
                value={log.ipAddress}
                isMono
              />
            </div>
          </div>

          {/* Details */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">
              Description
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-700 leading-relaxed">
                {log.details}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <button className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Download JSON
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  isMono = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  isMono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-gray-400 mt-0.5" />
      <div className="flex-1">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p
          className={cn(
            "text-sm font-medium text-gray-900",
            isMono && "font-mono text-xs",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
