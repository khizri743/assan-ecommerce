"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { AdminCard } from "../shared/AdminCard";
import { DataTable } from "../shared/DataTable";
import { StatusBadge } from "../shared/StatusBadge";
import { AuditLogFilters } from "./AuditLogFilters";
import { AuditLogDetailModal } from "./AuditLogDetailModal";

// Match the type returned by our server action
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

export function AuditLogTable({ initialLogs }: { initialLogs: AuditLog[] }) {
  const [logs, setLogs] = useState(initialLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  // Default to showing current month
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = logs.filter((log) => {
    // 1. Search Filter
    const matchesSearch =
      log.admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Action Filter
    const matchesAction =
      actionFilter === "all" || log.action === actionFilter.toUpperCase();

    // 3. Date Filter
    const logDate = new Date(log.timestamp);
    const start = new Date(startDate);
    const end = new Date(endDate);
    // Set end date to end of day
    end.setHours(23, 59, 59, 999);

    const matchesDate = logDate >= start && logDate <= end;

    return matchesSearch && matchesAction && matchesDate;
  });

  const columns = [
    {
      key: "timestamp",
      header: "Timestamp",
      render: (log: AuditLog) => (
        <div className="text-sm">
          <p className="text-gray-900 font-medium">
            {new Date(log.timestamp).toLocaleDateString()}
          </p>
          <p className="text-gray-500 text-xs">
            {new Date(log.timestamp).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
    {
      key: "admin",
      header: "Admin",
      render: (log: AuditLog) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
            {log.admin.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
              {log.admin.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (log: AuditLog) => (
        <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded">
          {log.action.replace(/_/g, " ").toUpperCase()}
        </span>
      ),
    },
    {
      key: "target",
      header: "Target",
      render: (log: AuditLog) => (
        <div>
          <p className="text-sm text-gray-900 font-medium">{log.targetName}</p>
          <p className="text-xs text-gray-500 capitalize">{log.targetType}</p>
        </div>
      ),
    },
    {
      key: "severity",
      header: "Severity",
      render: (log: AuditLog) => (
        <StatusBadge
          status={log.severity.toUpperCase()}
          variant={
            log.severity === "critical"
              ? "danger"
              : log.severity === "warning"
                ? "warning"
                : "info"
          }
        />
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (log: AuditLog) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedLog(log);
          }}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <>
      <AdminCard>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <AuditLogFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              actionFilter={actionFilter}
              onActionChange={setActionFilter}
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredLogs}
          keyExtractor={(l) => l.id}
          onRowClick={(log) => setSelectedLog(log)}
          emptyState={
            <div className="text-center text-gray-500 py-8">
              <p>No audit logs found.</p>
            </div>
          }
        />
      </AdminCard>

      <AuditLogDetailModal
        log={selectedLog}
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </>
  );
}
