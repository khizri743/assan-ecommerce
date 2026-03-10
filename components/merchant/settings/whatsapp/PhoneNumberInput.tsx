import { Smartphone, Info } from "lucide-react";

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function PhoneNumberInput({ value, onChange }: PhoneNumberInputProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          WhatsApp Business Number
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-500 font-medium">
            +
          </span>
          <input
            type="tel"
            value={value}
            onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
            placeholder="1234567890"
            className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1.5">
          Enter your number with country code (e.g., 1 for US)
        </p>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3">
        <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-900">Requirements</p>
          <ul className="text-xs text-blue-700 mt-1 space-y-1">
            <li>• You must have WhatsApp Business app installed</li>
            <li>• This number cannot be used with WhatsApp personal app</li>
            <li>• You will receive a verification code via SMS</li>
          </ul>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
        <Smartphone className="h-5 w-5 text-gray-400" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            Don't have WhatsApp Business?
          </p>
          <a
            href="#"
            className="text-xs text-green-600 hover:text-green-700 font-medium"
          >
            Download from App Store or Play Store →
          </a>
        </div>
      </div>
    </div>
  );
}
