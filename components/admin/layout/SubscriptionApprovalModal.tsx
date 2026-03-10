"use client";

import { useState } from "react";
import { X, Check, Loader2, ArrowRight, ExternalLink } from "lucide-react";
import {
  approveSubscription,
  rejectSubscription,
} from "@/app/(admin)/admin/actions";

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: any; // Type matches the fetch result
}

export function SubscriptionApprovalModal({
  isOpen,
  onClose,
  request,
}: ApprovalModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !request) return null;

  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve this plan change?")) return;
    setIsProcessing(true);
    await approveSubscription(request.id, request.pendingPlan);
    setIsProcessing(false);
    onClose();
  };

  const handleReject = async () => {
    if (!confirm("Reject this request?")) return;
    setIsProcessing(true);
    await rejectSubscription(request.id);
    setIsProcessing(false);
    onClose();
  };

  const owner = request.users[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
          <h2 className="text-lg font-bold text-gray-900">
            Review Upgrade Request
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col md:flex-row gap-6">
          {/* Left: Proof Image */}
          <div className="w-full md:w-1/2">
            <p className="text-xs font-bold text-gray-500 uppercase mb-2">
              Payment Proof
            </p>
            <div className="bg-gray-100 rounded-lg border border-gray-200 overflow-hidden relative group aspect-[3/4]">
              {/* In real app, use next/image */}
              <img
                src={request.paymentProofUrl}
                alt="Payment Proof"
                className="w-full h-full object-cover object-top"
              />
              <a
                href={request.paymentProofUrl}
                target="_blank"
                className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-700"
                title="Open Original"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Right: Details */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="space-y-4 flex-1">
              <div>
                <p className="text-xs text-gray-500 mb-1">Business</p>
                <h3 className="font-bold text-gray-900 text-lg">
                  {request.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {owner?.name} ({owner?.email})
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 uppercase">
                    Current
                  </span>
                  <span className="text-xs text-gray-500 uppercase">
                    Requested
                  </span>
                </div>
                <div className="flex items-center justify-between font-mono font-bold text-sm">
                  <span className="text-gray-600">
                    {request.subscriptionPlan}
                  </span>
                  <ArrowRight className="h-4 w-4 text-blue-500" />
                  <span className="text-blue-600">{request.pendingPlan}</span>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800 border border-blue-100">
                ⚠️ Verify the payment amount matches the plan price in the image
                before approving.
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleReject}
                disabled={isProcessing}
                className="flex-1 py-2.5 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {" "}
                    <Check className="h-4 w-4" /> Approve{" "}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
