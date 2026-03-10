import { Bell, Search } from "lucide-react";

import { AdminNotifications } from "./AdminNotifications";

interface AdminTopNavProps {
  onSearch?: (value: string) => void;
  searchValue?: string;
}

export function AdminTopNav({ onSearch, searchValue = "" }: AdminTopNavProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        {/* {onSearch && (
          <div className="w-96">
            <SearchInput
              value={searchValue}
              onChange={onSearch}
              placeholder="Search tenants, orders, or logs..."
            />
          </div>
        )} */}
      </div>

      <div className="flex items-center gap-4">
        {/* <button className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
        </button> */}
        <AdminNotifications />

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">Goftech Admin</p>
            <p className="text-xs text-gray-500">Platform Manager</p>
          </div>
          <div className="h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
            G
          </div>
        </div>
      </div>
    </header>
  );
}
