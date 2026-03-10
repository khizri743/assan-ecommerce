"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { logout } from "@/app/(auth)/actions";
import {
  LayoutDashboard,
  Building2,
  Settings,
  ShieldAlert,
  LogOut,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tenants", label: "Tenants", icon: Building2 },
  { href: "/admin/plans", label: "Pricing Plans", icon: CreditCard },
  { href: "/admin/audit", label: "Audit Logs", icon: ShieldAlert },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      if (confirm("Are you sure you want to sign out?")) {
        await logout();
      }
      // Optionally, you can add a toast notification here for successful logout
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, you can add a toast notification here for logout failure
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <ShieldAlert className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-sm">Assan Admin</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
              Super Admin
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-100"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-blue-600" : "text-gray-400",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-100">
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
