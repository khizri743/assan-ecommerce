"use client";

import { useState, useEffect } from "react";
import { X, Loader2, UploadCloud, FileCheck, ArrowRight } from "lucide-react";
import {
  calculateUpgradeCost,
  requestUpgrade,
} from "@/app/(merchant)/dashboard/settings/tabs/billing-actions";
import { PlanSelectionCard } from "./PlanSelectionCard";
import { getAvailablePlans } from "@/app/(merchant)/dashboard/settings/tabs/billing-actions"; // Need to create this

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlanSlug: string;
}

export function UpgradeModal({
  isOpen,
  onClose,
  currentPlanSlug,
}: UpgradeModalProps) {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlanSlug, setSelectedPlanSlug] = useState<string | null>(null);

  const [costData, setCostData] = useState<any>(null);
  const [loadingCost, setLoadingCost] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // 1. Fetch Plans on Open
  useEffect(() => {
    if (isOpen) {
      getAvailablePlans().then(setPlans);
    }
  }, [isOpen]);

  // 2. Recalculate Cost when Selection Changes
  useEffect(() => {
    if (selectedPlanSlug && selectedPlanSlug !== currentPlanSlug) {
      setLoadingCost(true);
      calculateUpgradeCost(selectedPlanSlug)
        .then(setCostData)
        .catch(() => setCostData(null))
        .finally(() => setLoadingCost(false));
    } else {
      setCostData(null);
    }
  }, [selectedPlanSlug, currentPlanSlug]);

  const handleConfirm = async () => {
    if (!file || !selectedPlanSlug) return;
    setProcessing(true);

    try {
      const formData = new FormData();
      formData.append("proofUrl", file);
      await requestUpgrade(selectedPlanSlug, formData);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to submit request.");
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Change Subscription Plan
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Select Plan
          </h3>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {plans.map((plan) => (
              <PlanSelectionCard
                key={plan.id}
                name={plan.name}
                price={Number(plan.price)}
                features={plan.features}
                current={plan.slug === currentPlanSlug}
                selected={selectedPlanSlug === plan.slug}
                onSelect={() => setSelectedPlanSlug(plan.slug)}
              />
            ))}
          </div>

          {/* Cost Calculation Area */}
          {selectedPlanSlug && selectedPlanSlug !== currentPlanSlug && (
            <div className="border-t border-gray-100 pt-6">
              {loadingCost ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              ) : costData ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Summary */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Payment Summary
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          Remaining Days
                        </span>
                        <span className="font-medium text-gray-900">
                          {costData.daysRemaining} days
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-blue-100">
                        <span className="text-base font-bold text-blue-900">
                          Prorated Due
                        </span>
                        <span className="text-2xl font-extrabold text-blue-700">
                          Rs {costData.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      You are upgrading from{" "}
                      <strong>{costData.currentPlanName}</strong> to{" "}
                      <strong>{costData.targetPlanName}</strong>.
                    </p>
                  </div>

                  {/* Upload */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Upload Proof
                    </h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative h-32 flex flex-col justify-center">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                      {file ? (
                        <div className="flex flex-col items-center text-green-600">
                          <FileCheck className="h-6 w-6 mb-1" />
                          <p className="text-xs font-medium truncate max-w-[200px]">
                            {file.name}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-gray-400">
                          <UploadCloud className="h-6 w-6 mb-1" />
                          <p className="text-xs">Upload Receipt</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleConfirm}
                      disabled={processing || !file}
                      className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2 transition-all"
                    >
                      {processing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Submit Request"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Cannot calculate upgrade cost.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
