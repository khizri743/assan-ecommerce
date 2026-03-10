"use client";

import { useState } from "react";
import {
  Facebook,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Copy,
  ExternalLink,
} from "lucide-react";
import { AdminCard } from "@/components/admin/shared/AdminCard";
import { cn } from "@/lib/utils";

type FlowStep =
  | "connect"
  | "select-business"
  | "verify"
  | "phone-select"
  | "complete";

interface MetaDeveloperFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const MOCK_BUSINESSES = [
  { id: "1", name: "Pizza Hut Downtown", verified: true },
  { id: "2", name: "Goftech Test Business", verified: false },
];

const MOCK_PHONES = [
  { id: "1", number: "+1 (234) 567-8900", status: "verified", quality: "high" },
  {
    id: "2",
    number: "+1 (234) 567-8901",
    status: "pending",
    quality: "medium",
  },
];

export function MetaDeveloperFlow({
  isOpen,
  onClose,
  onComplete,
}: MetaDeveloperFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>("connect");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState("");

  const handleFacebookConnect = () => {
    setIsLoading(true);
    // Simulate Facebook OAuth popup
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep("select-business");
    }, 1500);
  };

  const handleBusinessSelect = (businessId: string) => {
    setSelectedBusiness(businessId);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep("verify");
    }, 800);
  };

  const handleVerificationComplete = () => {
    setCurrentStep("phone-select");
  };

  const handlePhoneSelect = (phoneId: string) => {
    setSelectedPhone(phoneId);
    setWebhookUrl(`https://api.assan.com/webhooks/whatsapp/${phoneId}`);
    setCurrentStep("complete");
  };

  const handleFinish = () => {
    onComplete();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Facebook className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white">
                Connect WhatsApp Business
              </h2>
              <p className="text-blue-100 text-xs">
                Powered by Meta for Developers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg text-white transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {[
              { id: "connect", label: "Connect" },
              { id: "select-business", label: "Business" },
              { id: "verify", label: "Verify" },
              { id: "phone-select", label: "Phone" },
              { id: "complete", label: "Complete" },
            ].map((step, idx) => {
              const stepOrder = [
                "connect",
                "select-business",
                "verify",
                "phone-select",
                "complete",
              ];
              const currentIdx = stepOrder.indexOf(currentStep);
              const stepIdx = stepOrder.indexOf(step.id as FlowStep);
              const isActive = step.id === currentStep;
              const isCompleted = stepIdx < currentIdx;

              return (
                <div
                  key={step.id}
                  className="flex items-center flex-1 last:flex-none"
                >
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                      isActive
                        ? "bg-blue-600 text-white"
                        : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500",
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      "ml-2 text-sm font-medium hidden sm:block",
                      isActive
                        ? "text-blue-600"
                        : isCompleted
                          ? "text-green-600"
                          : "text-gray-400",
                    )}
                  >
                    {step.label}
                  </span>
                  {idx < 4 && (
                    <div
                      className={cn(
                        "flex-1 h-0.5 mx-3",
                        isCompleted ? "bg-green-500" : "bg-gray-200",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === "connect" && (
            <ConnectStep
              onConnect={handleFacebookConnect}
              isLoading={isLoading}
            />
          )}

          {currentStep === "select-business" && (
            <SelectBusinessStep
              businesses={MOCK_BUSINESSES}
              selectedId={selectedBusiness}
              onSelect={handleBusinessSelect}
              isLoading={isLoading}
            />
          )}

          {currentStep === "verify" && (
            <VerificationStep onComplete={handleVerificationComplete} />
          )}

          {currentStep === "phone-select" && (
            <PhoneSelectStep
              phones={MOCK_PHONES}
              selectedId={selectedPhone}
              onSelect={handlePhoneSelect}
            />
          )}

          {currentStep === "complete" && (
            <CompleteStep webhookUrl={webhookUrl} onFinish={handleFinish} />
          )}
        </div>
      </div>
    </div>
  );
}

// --- Sub Components ---

function ConnectStep({
  onConnect,
  isLoading,
}: {
  onConnect: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="text-center py-8">
      <div className="h-20 w-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Facebook className="h-10 w-10" />
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Connect with Meta
      </h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Link your Facebook Business account to enable WhatsApp Business API.
        This allows customers to order directly through WhatsApp.
      </p>

      <div className="space-y-4 max-w-sm mx-auto">
        <button
          onClick={onConnect}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Facebook className="h-5 w-5" />
              Continue with Facebook
            </>
          )}
        </button>

        <p className="text-xs text-gray-400">
          By continuing, you agree to Meta's Terms of Service and WhatsApp
          Business Terms
        </p>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100 text-left">
        <h4 className="font-semibold text-gray-900 text-sm mb-2">
          You'll need:
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Facebook Business account
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            WhatsApp Business account
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Business verification documents (if required)
          </li>
        </ul>
      </div>
    </div>
  );
}

function SelectBusinessStep({
  businesses,
  selectedId,
  onSelect,
  isLoading,
}: {
  businesses: typeof MOCK_BUSINESSES;
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Select Business</h3>
        <p className="text-sm text-gray-500">
          Choose the Facebook Business to connect
        </p>
      </div>

      <div className="space-y-3">
        {businesses.map((business) => (
          <button
            key={business.id}
            onClick={() => onSelect(business.id)}
            disabled={isLoading}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
              selectedId === business.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50",
            )}
          >
            <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{business.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                {business.verified ? (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                    <AlertCircle className="h-3 w-3" /> Verification Required
                  </span>
                )}
              </div>
            </div>
            <ArrowRight
              className={cn(
                "h-5 w-5 transition-colors",
                selectedId === business.id ? "text-blue-600" : "text-gray-300",
              )}
            />
          </button>
        ))}
      </div>

      <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
        <Building2 className="h-5 w-5" />
        Create New Business
      </button>
    </div>
  );
}

function VerificationStep({ onComplete }: { onComplete: () => void }) {
  const [documents, setDocuments] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900">
          Business Verification
        </h3>
        <p className="text-sm text-gray-500">
          Meta requires verification to use WhatsApp Business API
        </p>
      </div>

      <div className="space-y-4">
        <VerificationItem
          title="Business Email Verification"
          description="Verify ownership of business email domain"
          status="completed"
        />
        <VerificationItem
          title="Phone Number Verification"
          description="Verify business phone number via SMS"
          status="completed"
        />
        <VerificationItem
          title="Business Documents"
          description="Upload business registration or tax documents"
          status="pending"
          onAction={() => setDocuments(["doc1.pdf"])}
        />
        <VerificationItem
          title="Website Verification"
          description="Add meta tag to your website or upload HTML file"
          status="optional"
        />
      </div>

      <div className="pt-4 border-t border-gray-100">
        <button
          onClick={onComplete}
          className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Continue to Phone Setup
        </button>
        <p className="text-xs text-gray-400 text-center mt-2">
          You can complete verification later in Meta Business Manager
        </p>
      </div>
    </div>
  );
}

function VerificationItem({
  title,
  description,
  status,
  onAction,
}: {
  title: string;
  description: string;
  status: "completed" | "pending" | "optional";
  onAction?: () => void;
}) {
  return (
    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
          status === "completed"
            ? "bg-green-100 text-green-600"
            : status === "pending"
              ? "bg-amber-100 text-amber-600"
              : "bg-gray-200 text-gray-500",
        )}
      >
        {status === "completed" ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : status === "pending" ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          <span className="text-xs">?</span>
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      {status === "pending" && onAction && (
        <button
          onClick={onAction}
          className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50"
        >
          Upload
        </button>
      )}
      {status === "optional" && (
        <span className="text-xs text-gray-400">Optional</span>
      )}
    </div>
  );
}

function PhoneSelectStep({
  phones,
  selectedId,
  onSelect,
}: {
  phones: typeof MOCK_PHONES;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Select Phone Number</h3>
        <p className="text-sm text-gray-500">
          Choose which number to use for WhatsApp Business
        </p>
      </div>

      <div className="space-y-3">
        {phones.map((phone) => (
          <button
            key={phone.id}
            onClick={() => onSelect(phone.id)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
              selectedId === phone.id
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-green-300 hover:bg-gray-50",
            )}
          >
            <div
              className={cn(
                "h-12 w-12 rounded-lg flex items-center justify-center",
                phone.status === "verified"
                  ? "bg-green-100 text-green-600"
                  : "bg-amber-100 text-amber-600",
              )}
            >
              <span className="text-lg font-bold">
                {phone.number.slice(-2)}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{phone.number}</h4>
              <div className="flex items-center gap-3 mt-1">
                <StatusBadge
                  status={phone.status}
                  variant={phone.status === "verified" ? "success" : "warning"}
                />
                <span className="text-xs text-gray-500 capitalize">
                  Quality: {phone.quality}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-green-400 hover:text-green-600 transition-colors">
        + Add New Phone Number
      </button>
    </div>
  );
}

function CompleteStep({
  webhookUrl,
  onFinish,
}: {
  webhookUrl: string;
  onFinish: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="text-center py-6">
      <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="h-10 w-10" />
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">
        WhatsApp Connected!
      </h3>
      <p className="text-gray-500 mb-6">
        Your WhatsApp Business API is now active. Customers can start placing
        orders.
      </p>

      <AdminCard title="Webhook Configuration" className="text-left mb-6">
        <p className="text-sm text-gray-600 mb-3">
          Copy this webhook URL to your Meta Developer Dashboard:
        </p>
        <div className="flex gap-2">
          <code className="flex-1 p-3 bg-gray-100 rounded-lg text-xs font-mono text-gray-700 break-all">
            {webhookUrl}
          </code>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {copied ? "Copied!" : <Copy className="h-4 w-4" />}
          </button>
        </div>
        <a
          href="https://developers.facebook.com/apps"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-3"
        >
          Open Meta Developer Dashboard <ExternalLink className="h-3 w-3" />
        </a>
      </AdminCard>

      <div className="flex gap-3">
        <button
          onClick={onFinish}
          className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
  variant,
}: {
  status: string;
  variant: "success" | "warning";
}) {
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-xs font-medium border",
        variant === "success"
          ? "bg-green-100 text-green-700 border-green-200"
          : "bg-amber-100 text-amber-700 border-amber-200",
      )}
    >
      {status}
    </span>
  );
}
