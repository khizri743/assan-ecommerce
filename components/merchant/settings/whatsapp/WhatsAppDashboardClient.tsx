"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  BookOpen,
  HelpCircle,
  ArrowRight,
  Facebook,
  CheckCircle2,
} from "lucide-react";
import { ConnectionStatus } from "@/components/merchant/settings/whatsapp/ConnectionStatus";
import { EmbeddedSignup } from "@/components/merchant/settings/whatsapp/EmbeddedSignup"; // Ensure this path is correct
import { AdminCard } from "@/components/admin/shared/AdminCard"; // Ensure this path is correct

interface Props {
  initialConnectionStatus: "connected" | "disconnected";
  connectedPhoneId: string | null;
}

export function WhatsAppDashboardClient({
  initialConnectionStatus,
  connectedPhoneId,
}: Props) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected" | "error"
  >(initialConnectionStatus);

  const handleConnect = () => {
    if (connectionStatus === "connected") {
      // If already connected, open Meta Manager
      window.open(
        "https://business.facebook.com/whatsapp-business/home",
        "_blank",
      );
    } else {
      setIsModalOpen(true);
    }
  };

  const handleSignupComplete = () => {
    console.log("WhatsApp signup completed.");
    setConnectionStatus("connected");
    setIsModalOpen(false);

    // Refresh the page so the Server Component can re-fetch the new data
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">WhatsApp Business</h1>
        <p className="text-gray-500 text-sm">
          Connect via Meta Embedded Signup to receive orders
        </p>
      </div>

      {/* Status Card */}
      <ConnectionStatus
        status={connectionStatus}
        phoneNumber={connectedPhoneId || undefined}
        onConnect={handleConnect}
      />

      <EmbeddedSignup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleSignupComplete}
      />
    </div>
  );
}

// Helper Components
function StepCard({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: number;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <span className="h-6 w-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
          {number}
        </span>
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

function RequirementItem({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link: string;
}) {
  return (
    <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <h4 className="font-medium text-gray-900 text-sm">{title}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-600 hover:underline font-medium"
      >
        Setup →
      </a>
    </div>
  );
}
