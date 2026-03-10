"use client";

import { useState } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PhoneNumberInput } from "./PhoneNumberInput";
import { VerificationCode } from "./VerificationCode";
import { BusinessProfileSetup } from "./BusinessProfileSetup";

type Step = "phone" | "verify" | "profile" | "success";

interface WhatsAppConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WhatsAppConnectModal({
  isOpen,
  onClose,
}: WhatsAppConnectModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessName, setBusinessName] = useState("");

  const steps = [
    { id: "phone", label: "Phone Number", number: 1 },
    { id: "verify", label: "Verification", number: 2 },
    { id: "profile", label: "Business Profile", number: 3 },
  ];

  const handleNext = () => {
    if (currentStep === "phone") setCurrentStep("verify");
    else if (currentStep === "verify") setCurrentStep("profile");
    else if (currentStep === "profile") setCurrentStep("success");
  };

  const handleBack = () => {
    if (currentStep === "verify") setCurrentStep("phone");
    else if (currentStep === "profile") setCurrentStep("verify");
  };

  const handleClose = () => {
    setCurrentStep("phone");
    setPhoneNumber("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-green-600">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white">Connect WhatsApp</h2>
              <p className="text-green-100 text-xs">
                Step {steps.find((s) => s.id === currentStep)?.number} of 3
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/20 rounded-lg text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress */}
        {currentStep !== "success" && (
          <div className="px-6 py-4 bg-gray-50 flex gap-2">
            {steps.map((step, idx) => {
              const isActive = step.id === currentStep;
              const isCompleted =
                steps.findIndex((s) => s.id === currentStep) > idx;

              return (
                <div key={step.id} className="flex-1 flex items-center gap-2">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                      isActive
                        ? "bg-green-600 text-white"
                        : isCompleted
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-500"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium hidden sm:block",
                      isActive ? "text-green-600" : "text-gray-400"
                    )}
                  >
                    {step.label}
                  </span>
                  {idx < steps.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-0.5 mx-2",
                        isCompleted ? "bg-green-200" : "bg-gray-200"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Content */}
        <div className="p-6 min-h-[300px]">
          {currentStep === "phone" && (
            <PhoneNumberInput value={phoneNumber} onChange={setPhoneNumber} />
          )}

          {currentStep === "verify" && (
            <VerificationCode
              phoneNumber={phoneNumber}
              onResend={() => console.log("Resend code")}
            />
          )}

          {currentStep === "profile" && (
            <BusinessProfileSetup
              businessName={businessName}
              onChange={setBusinessName}
            />
          )}

          {currentStep === "success" && (
            <div className="text-center py-8">
              <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">All Set!</h3>
              <p className="text-gray-500 mb-6">
                Your WhatsApp Business account is now connected. Customers can
                start placing orders.
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Start Receiving Orders
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {currentStep !== "success" && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === "phone"}
              className={cn(
                "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                currentStep === "phone"
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              {currentStep === "profile" ? "Complete Setup" : "Next"}{" "}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
