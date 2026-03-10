import { Wrench, Database, Cloud, AlertCircle } from "lucide-react";
import { AdminCard } from "../shared/AdminCard";
import { ToggleRow } from "@/components/merchant/settings/shared/ToggleRow";

export function MaintenanceSettings() {
  return (
    <div className="space-y-6">
      <AdminCard title="System Maintenance" icon={Wrench} variant="warning">
        <div className="space-y-4">
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-orange-800">
                Maintenance Mode
              </p>
              <p className="text-xs text-orange-700 mt-1">
                When enabled, all non-admin users will see a maintenance page
              </p>
            </div>
          </div>

          <ToggleRow
            label="Enable Maintenance Mode"
            description="Take platform offline for maintenance"
            defaultChecked={false}
          />

          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Maintenance Message
            </label>
            <textarea
              defaultValue="We're performing scheduled maintenance. Please check back soon."
              rows={3}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Scheduled Start
              </label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Expected End
              </label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Database" icon={Database}>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <Database className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Last Backup</p>
                <p className="text-xs text-gray-500">Today at 03:00 AM</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              Successful
            </span>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
              Backup Now
            </button>
            <button className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
              Restore
            </button>
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Cache & CDN" icon={Cloud}>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-sm text-gray-700">CDN Cache</span>
            <span className="text-sm font-medium text-gray-900">12.5 MB</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-sm text-gray-700">Application Cache</span>
            <span className="text-sm font-medium text-gray-900">856 KB</span>
          </div>
          <button className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
            Clear All Caches
          </button>
        </div>
      </AdminCard>
    </div>
  );
}
