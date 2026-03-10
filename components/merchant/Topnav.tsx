"use client";

import { Bell, Search, Menu, User } from "lucide-react";
// Import types if you have them, or define locally
type UserWithBusiness = {
  name: string;
  email: string;
  role: string;
  business: {
    name: string;
    subscriptionPlan: string;
  };
};

export function TopNav({ user }: { user: UserWithBusiness }) {
  // Get initials
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0">
      {/* Left: Mobile Menu Trigger & Search */}
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600">
          <Menu className="h-5 w-5" />
        </button>

        {/* <div className="hidden md:flex items-center relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders, customers..."
            className="pl-9 pr-4 py-2 w-64 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
          />
        </div> */}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="p-2 relative hover:bg-gray-50 rounded-full text-gray-500 hover:text-blue-600 transition-colors">
          <Bell className="h-5 w-5" />
          {/* Only show dot if there are notifications (logic needed later) */}
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">
              {user.business.name} • {user.business.subscriptionPlan}
            </p>
          </div>
          <div className="h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border border-blue-200">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
