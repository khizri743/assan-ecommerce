import { ShieldAlert } from "lucide-react";
import { AuditLogTable } from "@/components/admin/audit/AuditLogTable";
import { getAuditLogs } from "./actions";

export default async function AuditPage() {
  const logs = await getAuditLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-500 text-sm">
          Track all administrative actions and system events
        </p>
      </div>

      {/* Pass real data to the client component */}
      <AuditLogTable initialLogs={logs} />
    </div>
  );
}
