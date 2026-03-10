import { Download, Filter } from "lucide-react";
import { SearchInput } from "../shared/SearchInput";
import { DateRangePicker } from "../shared/DateRangePicker";

interface AuditLogFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  actionFilter: string;
  onActionChange: (value: string) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export function AuditLogFilters({
  searchQuery,
  onSearchChange,
  actionFilter,
  onActionChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: AuditLogFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      <div className="flex-1 max-w-md">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search by admin, tenant, or action..."
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={actionFilter}
          onChange={(e) => onActionChange(e.target.value)}
          className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Actions</option>
          <option value="tenant_created">Tenant Created</option>
          <option value="tenant_suspended">Tenant Suspended</option>
          <option value="tenant_activated">Tenant Activated</option>
          <option value="payment_received">Payment Received</option>
          <option value="refund_processed">Refund Processed</option>
          <option value="impersonation">Impersonation</option>
          <option value="settings_changed">Settings Changed</option>
        </select>

        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
        />

        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>
    </div>
  );
}
