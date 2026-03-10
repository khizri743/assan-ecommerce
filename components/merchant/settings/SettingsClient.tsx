"use client";

import { useState } from "react";
import {
  Store,
  CreditCard,
  Bell,
  Users,
  Save,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavButton } from "@/components/merchant/settings/NavButton";
import { ProfileTab } from "@/components/merchant/settings/tabs/ProfileTabs";
import { BillingTab } from "@/components/merchant/settings/tabs/BillingTab";
// import { NotificationsTab } from "@/components/merchant/settings/tabs/NotificationsTab";
import { TeamTab } from "@/components/merchant/settings/tabs/TeamTab";
// Fix the path to match where you moved the WhatsApp component
import { WhatsAppDashboardClient } from "@/components/merchant/settings/whatsapp/WhatsAppDashboardClient";

type TabType = "profile" | "billing" | "team" | "whatsapp";

interface SettingsClientProps {
  initialBusiness: any;
  planDetails: any;
  teamMembers: any[];
}

export function SettingsClient({
  initialBusiness,
  planDetails,
  teamMembers,
}: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveHeader = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const isWaConnected = !!(
    initialBusiness?.wabaId && initialBusiness?.whatsappPhoneId
  );

  const tabs = [
    { id: "profile" as TabType, label: "Business Profile", icon: Store },
    {
      id: "whatsapp" as TabType,
      label: "WhatsApp Config",
      icon: MessageCircle,
      badge: isWaConnected ? "Active" : undefined,
    },
    {
      id: "billing" as TabType,
      label: "Subscription",
      icon: CreditCard,
    },
    // { id: "notifications" as TabType, label: "Notifications", icon: Bell },
    { id: "team" as TabType, label: "Team Members", icon: Users, badge: "Pro" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm">
            Manage your business preferences and account
          </p>
        </div>

        {(activeTab === "profile" || activeTab === "notifications") && (
          <SaveButton
            onClick={handleSaveHeader}
            isSaving={isSaving}
            saveSuccess={saveSuccess}
          />
        )}
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
              badge={tab.badge}
            />
          ))}
        </nav>

        <main className="flex-1 min-w-0">
          {activeTab === "profile" && <ProfileTab business={initialBusiness} />}

          {activeTab === "whatsapp" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <WhatsAppDashboardClient
                initialConnectionStatus={
                  isWaConnected ? "connected" : "disconnected"
                }
                connectedPhoneId={initialBusiness.whatsappPhoneId}
              />
            </div>
          )}

          {activeTab === "billing" && (
            <BillingTab
              business={initialBusiness}
              planDetails={planDetails} // Pass the plan details
            />
          )}

          {/* {activeTab === "notifications" && <NotificationsTab />} */}
          {activeTab === "team" && (
            <TeamTab business={initialBusiness} teamMembers={teamMembers} />
          )}
        </main>
      </div>
    </div>
  );
}

function SaveButton({
  onClick,
  isSaving,
  saveSuccess,
}: {
  onClick: () => void;
  isSaving: boolean;
  saveSuccess: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isSaving}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all min-w-[120px] justify-center",
        saveSuccess
          ? "bg-green-600 text-white"
          : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50",
      )}
    >
      {saveSuccess ? (
        <>
          <CheckCircle2 className="h-4 w-4" /> Saved
        </>
      ) : (
        <>
          <Save className="h-4 w-4" /> {isSaving ? "Saving..." : "Save Changes"}
        </>
      )}
    </button>
  );
}
