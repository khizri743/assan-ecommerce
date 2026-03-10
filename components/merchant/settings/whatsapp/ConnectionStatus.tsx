"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { AdminCard } from "@/components/admin/shared/AdminCard";
import { cn } from "@/lib/utils";
import { disconnectWhatsApp } from "@/app/(merchant)/dashboard/settings/whatsapp/actions";

type ConnectionState = "disconnected" | "connecting" | "connected" | "error";

interface ConnectionStatusProps {
  status: ConnectionState;
  phoneNumber?: string;
  onConnect: () => void;
}

export function ConnectionStatus({
  status,
  phoneNumber,
  onConnect,
}: ConnectionStatusProps) {
  const router = useRouter();
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const statusConfig = {
    disconnected: {
      icon: Smartphone,
      color: "text-gray-400",
      bg: "bg-gray-100",
      title: "WhatsApp Not Connected",
      description:
        "Connect your WhatsApp Business account to start receiving orders",
      buttonText: "Connect WhatsApp",
      buttonClass: "bg-green-600 hover:bg-green-700",
    },
    connecting: {
      icon: Loader2,
      color: "text-amber-500",
      bg: "bg-amber-100",
      title: "Connecting...",
      description: "Please complete the setup process",
      buttonText: "Continue Setup",
      buttonClass: "bg-amber-600 hover:bg-amber-700",
    },
    connected: {
      icon: CheckCircle2,
      color: "text-blue-600", // Changed from green
      bg: "bg-blue-100", // Changed from green
      title: "Meta Connected",
      description: "WhatsApp Business API is active",
      buttonText: "Manage in Meta",
      buttonClass: "bg-blue-600 hover:bg-blue-700", // Meta blue
    },
    error: {
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-100",
      title: "Connection Error",
      description: "There was a problem with your connection",
      buttonText: "Retry Connection",
      buttonClass: "bg-red-600 hover:bg-red-700",
    },
  };
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <AdminCard className="relative overflow-hidden">
      <div className="flex items-start gap-4">
        <div className={cn("p-3 rounded-xl", config.bg)}>
          <Icon
            className={cn(
              "h-6 w-6",
              config.color,
              status === "connecting" && "animate-spin",
            )}
          />
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-gray-900">{config.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{config.description}</p>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={onConnect}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                config.buttonClass,
              )}
            >
              {config.buttonText}
            </button>

            {status === "connected" && (
              <button
                onClick={async () => {
                  if (!confirm("Disconnect WhatsApp?")) return;
                  try {
                    setIsDisconnecting(true);
                    await disconnectWhatsApp();
                    router.refresh();
                  } catch (err) {
                    console.error("Disconnect failed", err);
                  } finally {
                    setIsDisconnecting(false);
                  }
                }}
                disabled={isDisconnecting}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
              >
                {isDisconnecting ? "Disconnecting..." : "Disconnect"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Decorative background */}
      <div
        className={cn(
          "absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-10",
          status === "connected" ? "bg-green-500" : "bg-gray-400",
        )}
      />
    </AdminCard>
  );
}
