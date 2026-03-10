"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { verifyOtp, resendOtp } from "../actions"; // Import resendOtp
import { Loader2, Store } from "lucide-react";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await verifyOtp(email, otp);
    if (res?.error) setError(res.error);
    setLoading(false);
  };

  const handleResend = async () => {
    setMessage("Sending...");
    const res = await resendOtp(email);
    setMessage(res.error || res.success || "Sent!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
          <Store className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
        <p className="text-sm text-gray-500 mt-2">
          We sent a 6-digit code to <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify} className="mt-8 space-y-6">
          <input
            type="text"
            maxLength={6}
            placeholder="123456"
            className="block w-full text-center text-3xl tracking-widest border-gray-400 rounded-lg text-black focus:ring-blue-500 focus:border-blue-500 p-4 border"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Verify Code"}
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={handleResend}
            className="text-sm text-blue-600 hover:underline"
          >
            Didn't receive code? Resend
          </button>
          {message && <p className="text-xs text-green-600 mt-1">{message}</p>}
        </div>
      </div>
    </div>
  );
}
