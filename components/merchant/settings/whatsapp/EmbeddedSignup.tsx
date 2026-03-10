"use client";

import { useEffect, useState } from "react";
import { Facebook, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
// Import the Server Action
import { saveWhatsAppConnection } from "@/app/(merchant)/dashboard/settings/whatsapp/actions";

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: {
      init: (config: any) => void;
      login: (callback: (response: any) => void, config: any) => void;
    };
  }
}

interface EmbeddedSignupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void; // Changed signature to simple void, logic moves inside
}

export function EmbeddedSignup({
  isOpen,
  onClose,
  onComplete,
}: EmbeddedSignupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupData, setSignupData] = useState<any>(null);
  const [statusStep, setStatusStep] = useState<
    "IDLE" | "PROCESSING" | "SAVING" | "SUCCESS"
  >("IDLE");

  useEffect(() => {
    if (!isOpen) return;

    // Load Facebook SDK
    const existingScript = document.getElementById("facebook-jssdk");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      document.body.appendChild(script);
    }

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FB_APP_ID || "YOUR_APP_ID",
        autoLogAppEvents: true,
        xfbml: true,
        version: "v18.0",
      });
      setIsSDKLoaded(true);
    };

    const handleMessage = async (event: MessageEvent) => {
      if (!event.origin.endsWith("facebook.com")) return;

      try {
        const data = JSON.parse(event.data);
        if (data.type === "WA_EMBEDDED_SIGNUP") {
          console.log("📢 WhatsApp Signup Event:", data);

          if (data.event === "FINISH") {
            const { waba_id, phone_number_id, code } = data.data || {};

            if (!waba_id || !phone_number_id) {
              setError("Could not retrieve WhatsApp IDs. Please try again.");
              setStatusStep("IDLE");
              setIsLoading(false);
              return;
            }

            setStatusStep("SAVING");
            setSignupData(data.data);

            try {
              // 🚀 CALL SERVER ACTION
              await saveWhatsAppConnection({
                code: code,
                wabaId: waba_id,
                phoneNumberId: phone_number_id,
              });

              setStatusStep("SUCCESS");

              // Close modal after delay
              setTimeout(() => {
                onComplete();
                onClose();
              }, 2000);
            } catch (err) {
              console.error("Save failed:", err);
              setError("Failed to save connection details.");
              setStatusStep("IDLE");
            }
          }
        }
      } catch (e) {
        // Ignore parsing errors from other sources
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isOpen, onComplete, onClose]);

  const launchSignup = () => {
    setIsLoading(true);
    setError(null);

    window.FB.login(
      (response) => {
        if (response.authResponse) {
          console.log("FB Login Success, waiting for WhatsApp selection...");
          // We wait for the "message" event listener to handle the actual data
        } else {
          setIsLoading(false);
          setError("Facebook login cancelled.");
        }
      },
      {
        config_id: process.env.NEXT_PUBLIC_FB_CONFIG_ID || "YOUR_CONFIG_ID",
        response_type: "code",
        override_default_response_type: true,
        extras: {
          setup: {}, // This triggers the Embedded Signup flow
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#1877f2]">
          <div className="flex items-center gap-3">
            <Facebook className="h-6 w-6 text-white" />
            <h2 className="font-bold text-white">Connect WhatsApp</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* STATE: IDLE or LOADING */}
          {statusStep === "IDLE" && !signupData && (
            <div className="text-center space-y-6">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-blue-600">
                <Facebook className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  Link WhatsApp Business
                </h3>
                <p className="text-gray-500 text-sm mt-2">
                  Log in with Facebook to select or create your WhatsApp
                  Business Account.
                </p>
              </div>

              <button
                onClick={launchSignup}
                disabled={!isSDKLoaded || isLoading}
                className={cn(
                  "w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2",
                  isLoading ? "bg-blue-400" : "bg-[#1877f2] hover:bg-[#166fe5]",
                )}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <Facebook className="h-5 w-5" />
                )}
                {isLoading ? "Connecting..." : "Continue with Facebook"}
              </button>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> {error}
                </div>
              )}
            </div>
          )}

          {/* STATE: SAVING */}
          {statusStep === "SAVING" && (
            <div className="text-center py-8 space-y-4">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
              <h3 className="font-bold text-gray-900">Saving Connection...</h3>
              <p className="text-gray-500 text-sm">
                Linking your WhatsApp account to the dashboard.
              </p>
            </div>
          )}

          {/* STATE: SUCCESS */}
          {statusStep === "SUCCESS" && (
            <div className="text-center py-8 space-y-4">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-green-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900">Connected!</h3>
              <p className="text-gray-500 text-sm">
                Your WhatsApp Business account is now active.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
