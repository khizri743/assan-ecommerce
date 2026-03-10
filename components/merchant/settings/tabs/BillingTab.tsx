"use client";

import { useState } from "react";
import { CreditCard, Check, Crown } from "lucide-react";
import { SettingsCard } from "../shared/SettingsCard";
import { StatusBadge } from "../shared/StatusBadge";
import { InvoiceTable } from "../InvoiceTable";
import { UpgradeModal } from "./UpgradeModal";

interface BillingTabProps {
  business: {
    subscriptionPlan: string;
    subscriptionStatus: string;
    pendingPlan?: string | null;
  };
  planDetails: {
    name: string;
    features: string[];
  } | null;
}

export function BillingTab({ business, planDetails }: BillingTabProps) {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const planName = planDetails?.name || business.subscriptionPlan;
  const features = planDetails?.features || ["Basic Access"];
  const isPending = !!business.pendingPlan;

  return (
    <div className="space-y-6">
      {/* Plan Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        {/* Pending Approval Banner */}
        {isPending && (
          <div className="absolute top-0 left-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold text-center py-1 z-10">
            Upgrade to {business.pendingPlan} Pending Approval
          </div>
        )}

        <div className="flex justify-between items-start mb-6 mt-2">
          <div>
            <p className="text-blue-100 text-xs uppercase tracking-wider font-bold mb-1">
              Current Plan
            </p>
            <h3 className="text-3xl font-extrabold flex items-center gap-2">
              {planName}
              {planName === "Scale" && (
                <Crown className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              )}
            </h3>
          </div>
          <StatusBadge
            status={business.subscriptionStatus}
            variant="active"
            className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-sm text-blue-50"
            >
              <div className="bg-blue-500/30 p-0.5 rounded-full shrink-0">
                <Check className="h-3 w-3" />
              </div>
              {feature}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            disabled={isPending}
            className="flex-1 bg-white text-blue-600 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? "Verification in Progress..." : "Change Plan"}
          </button>
          <span className="px-5 py-2.5 bg-blue-800/50 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
            Manage Subscription
          </span>
        </div>
      </div>

      {/* Payment Method */}
      {/* <SettingsCard title="Payment Method" icon={CreditCard}>
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="h-10 w-16 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs shadow-sm">
            VISA
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              •••• •••• •••• 4242
            </p>
            <p className="text-xs text-gray-500">Expires 12/25</p>
          </div>
          <button className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Edit
          </button>
        </div>
      </SettingsCard> */}

      {/* <InvoiceTable /> */}

      {/* Upgrade Modal */}
      {!isPending && (
        <UpgradeModal
          isOpen={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
          currentPlanSlug={business.subscriptionPlan}
        />
      )}
    </div>
  );
}
