import { AlertTriangle, LogIn, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  ownerEmail: string;
}

interface ImpersonateModalProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ImpersonateModal({
  tenant,
  isOpen,
  onClose,
}: ImpersonateModalProps) {
  if (!tenant) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md transition-all",
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none",
        )}
      >
        <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-start gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900">
                Impersonate Tenant
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                You are about to access this business account as the owner. This
                action will be logged.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  {tenant.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{tenant.name}</h3>
                  <p className="text-xs text-gray-500">{tenant.slug}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Owner Email</span>
                  <span className="text-gray-800">{tenant.ownerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tenant ID</span>
                  <span className="text-gray-800 font-mono text-xs">
                    {tenant.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                All actions performed while impersonating will appear in the
                audit log. The real owner will not be notified.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-gray-100 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                console.log("Impersonating:", tenant.id);
                onClose();
              }}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Impersonate
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
