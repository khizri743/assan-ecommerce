import { Filter, Download } from "lucide-react";

interface TenantFiltersProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  planFilter: string;
  onPlanChange: (plan: string) => void;
}

export function TenantFilters({
  statusFilter,
  onStatusChange,
  planFilter,
  onPlanChange,
}: TenantFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
        <option value="past_due">Past Due</option>
        <option value="trial">Trial</option>
      </select>

      <select
        value={planFilter}
        onChange={(e) => onPlanChange(e.target.value)}
        className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Plans</option>
        <option value="free">Free</option>
        <option value="basic">Basic</option>
        <option value="pro">Pro</option>
      </select>

      <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors ml-auto">
        <Download className="h-4 w-4" />
        Export CSV
      </button>
    </div>
  );
}
