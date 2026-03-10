"use client";

import { useState, useEffect } from "react";
import { Bell, CreditCard } from "lucide-react";
import { getPendingUpgradeRequests } from "@/app/(admin)/admin/actions";
import { SubscriptionApprovalModal } from "./SubscriptionApprovalModal";

export function AdminNotifications() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // Poll for notifications or fetch on mount
  // In production, use React Query or just Server Component props if layout allows
  useEffect(() => {
    const fetchRequests = async () => {
      const data = await getPendingUpgradeRequests();
      setRequests(data);
    };
    fetchRequests();
  }, [isOpen]); // Refetch when dropdown toggles to keep fresh

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 relative text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Bell className="h-5 w-5" />
          {requests.length > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          )}
        </button>

        {/* Dropdown */}
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-40 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 text-sm">
                  Notifications
                </h3>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {requests.length} Pending
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {requests.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No pending notifications.
                  </div>
                ) : (
                  requests.map((req) => (
                    <button
                      key={req.id}
                      onClick={() => {
                        setSelectedRequest(req);
                        setIsOpen(false);
                      }}
                      className="w-full text-left p-4 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors flex gap-3 items-start group"
                    >
                      <div className="bg-blue-100 p-2 rounded-lg text-blue-600 shrink-0">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                          Upgrade Request
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                          <strong>{req.name}</strong> wants to upgrade to{" "}
                          {req.pendingPlan}.
                        </p>
                        <p className="text-[10px] text-gray-400 mt-2">
                          Click to review payment
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      <SubscriptionApprovalModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
      />
    </>
  );
}
