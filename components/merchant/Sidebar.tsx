"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareText,
  ShoppingBag,
  Package,
  Users,
  Settings,
  LogOut,
  Store,
  LifeBuoy,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/(auth)/actions";

export function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();

  // Helper to check permission
  const canAccess = (module: string) => {
    if (user.role === "OWNER") return true; // Owner sees everything
    const perms = user.permissions as any;
    return perms && perms[module] && perms[module] !== "NONE";
  };

  // Define menu items with their corresponding permission module
  const allMenuItems = [
    {
      name: "Overview",
      icon: LayoutDashboard,
      href: "/dashboard",
      module: null, // Always visible
    },
    {
      name: "Live Chat",
      icon: MessageSquareText,
      href: "/dashboard/chat",
      module: "CHAT",
    },
    {
      name: "Orders",
      icon: ShoppingBag,
      href: "/dashboard/orders",
      module: "ORDERS",
    },
    {
      name: "Products",
      icon: Package,
      href: "/dashboard/products",
      module: "PRODUCTS",
    },
    {
      name: "Customers",
      icon: Users,
      href: "/dashboard/customers",
      module: "CUSTOMERS",
    },
    {
      name: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      module: "SETTINGS",
    },
    {
      name: "Analytics",
      icon: BarChart3,
      href: "/dashboard/analytics",
      module: null, // Or "ANALYTICS" if you want granular permissions
    },
    {
      name: "Support",
      icon: LifeBuoy,
      href: "/dashboard/support",
      module: null, // Always visible
    },
  ];

  // Filter items based on permissions
  const visibleItems = allMenuItems.filter(
    (item) => item.module === null || canAccess(item.module),
  );

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
          <Store className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-gray-900 text-lg">Assan</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-blue-600" : "text-gray-400",
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="mb-4 px-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Signed in as
          </p>
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.email}
          </p>
          <p className="text-xs text-gray-500 capitalize">
            {user.role.toLowerCase()}
          </p>
        </div>
        <form action={logout}>
          <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
