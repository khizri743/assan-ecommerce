import { useState, useRef } from "react";
import { Shield, RotateCcw } from "lucide-react";

interface VerificationCodeProps {
  phoneNumber: string;
  onResend: () => void;
}

export function VerificationCode({
  phoneNumber,
  onResend,
}: VerificationCodeProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 bg-green-100 text-green-600 rounded-full mb-3">
          <Shield className="h-6 w-6" />
        </div>
        <h3 className="font-bold text-gray-900">Enter Verification Code</h3>
        <p className="text-sm text-gray-500 mt-1">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-gray-900">+{phoneNumber}</span>
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-14 text-center text-2xl font-bold bg-white border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
          />
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onResend}
          className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium"
        >
          <RotateCcw className="h-4 w-4" />
          Resend Code
        </button>
        <p className="text-xs text-gray-400 mt-2">Code expires in 10:00</p>
      </div>
    </div>
  );
}
