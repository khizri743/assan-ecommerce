"use client";

import { useState } from "react";
import { Store, Shield, Bell, Wrench } from "lucide-react";
import { NavButton } from "@/components/merchant/settings/NavButton";
import { GeneralSettings } from "@/components/admin/settings/GeneralSettings";
import { SecuritySettings } from "@/components/admin/settings/SecuritySettings";
import { NotificationSettings } from "@/components/admin/settings/NotificationSettings";
import { MaintenanceSettings } from "@/components/admin/settings/MaintenanceSettings";

type TabType = "general" | "security" | "notifications" | "maintenance";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("general");

  const tabs = [
    { id: "general" as TabType, label: "General", icon: Store },
    // { id: "security" as TabType, label: "Security", icon: Shield },
    // { id: "notifications" as TabType, label: "Notifications", icon: Bell },
    // { id: "maintenance" as TabType, label: "Maintenance", icon: Wrench },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-500 text-sm">
          Configure global platform behavior
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <nav className="lg:w-64 space-y-1">
          {tabs.map((tab) => (
            <NavButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              icon={tab.icon}
              label={tab.label}
            />
          ))}
        </nav>

        <main className="flex-1 min-w-0">
          {activeTab === "general" && <GeneralSettings />}
          {/* {activeTab === "security" && <SecuritySettings />} */}
          {activeTab === "notifications" && <NotificationSettings />}
          {/* {activeTab === "maintenance" && <MaintenanceSettings />} */}
        </main>
      </div>
    </div>
  );
}
