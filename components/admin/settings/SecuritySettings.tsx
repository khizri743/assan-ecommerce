import { Shield, Lock, Key, Users } from "lucide-react";
import { AdminCard } from "../shared/AdminCard";
import { ToggleRow } from "@/components/merchant/settings/shared/ToggleRow";

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <AdminCard title="Authentication" icon={Lock}>
        <div className="space-y-4">
          <ToggleRow
            label="Two-Factor Authentication (2FA)"
            description="Require 2FA for all admin accounts"
            defaultChecked={true}
          />
          <ToggleRow
            label="Single Sign-On (SSO)"
            description="Enable SAML/OAuth integration"
            defaultChecked={false}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                defaultValue={60}
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Max Login Attempts
              </label>
              <input
                type="number"
                defaultValue={5}
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>
        </div>
      </AdminCard>

      <AdminCard title="API Security" icon={Key}>
        <div className="space-y-4">
          <ToggleRow
            label="API Rate Limiting"
            description="Limit requests per IP address"
            defaultChecked={true}
          />

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Rate Limit
              </span>
              <span className="text-sm text-gray-900 font-mono">
                1000 requests/minute
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{ width: "65%" }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Current peak: 650 requests/minute
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Webhook Secret
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                defaultValue="whsec_xxxxxxxxxxxxxxxx"
                readOnly
                className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-500"
              />
              <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                Regenerate
              </button>
            </div>
          </div>
        </div>
      </AdminCard>

      <AdminCard title="IP Allowlist" icon={Users} variant="warning">
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Restrict admin access to specific IP addresses
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter IP address (e.g., 192.168.1.1)"
              className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 outline-none"
            />
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
              Add
            </button>
          </div>

          <div className="space-y-2 mt-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-gray-700">
                  203.0.113.0/24
                </span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                  Active
                </span>
              </div>
              <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                Remove
              </button>
            </div>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
