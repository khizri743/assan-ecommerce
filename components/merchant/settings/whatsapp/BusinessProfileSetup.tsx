import { Building2, Upload, Info } from "lucide-react";

interface BusinessProfileSetupProps {
  businessName: string;
  onChange: (value: string) => void;
}

export function BusinessProfileSetup({
  businessName,
  onChange,
}: BusinessProfileSetupProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Business Display Name
        </label>
        <input
          type="text"
          value={businessName}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your Business Name"
          className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          This name will be shown to customers on WhatsApp
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Business Logo
        </label>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Upload Logo
            </button>
            <p className="text-xs text-gray-500 mt-1">
              Optional. Recommended: 400x400px
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Business Category
        </label>
        <select className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none">
          <option>Food & Beverage</option>
          <option>Retail</option>
          <option>Services</option>
          <option>Other</option>
        </select>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex gap-3">
        <Info className="h-5 w-5 text-amber-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-900">
            WhatsApp Commerce Policy
          </p>
          <p className="text-xs text-amber-700 mt-1">
            By continuing, you agree to comply with WhatsApp's Commerce Policy.
            Certain products and services are prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
