import { Store, Globe, Mail } from "lucide-react";
import { AdminCard } from "../shared/AdminCard";
import { FormInput } from "@/components/merchant/settings/shared/FormInput";
import { ToggleRow } from "@/components/merchant/settings/shared/ToggleRow";

export function GeneralSettings() {
  return (
    <div className="space-y-6">
      <AdminCard title="Platform Identity" icon={Store}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Platform Name" defaultValue="Assan Ecommerce" />
          <FormInput
            label="Support Email"
            defaultValue="support@assan.com"
            type="email"
          />
          <div className="md:col-span-2">
            <FormInput
              label="Platform URL"
              defaultValue="https://app.assan.com"
            />
          </div>
        </div>
      </AdminCard>

      {/* <AdminCard title="Global Configuration" icon={Globe}>
        <div className="space-y-4">
          <ToggleRow
            label="Allow New Registrations"
            description="Enable or disable new tenant signups"
            defaultChecked={true}
          />
          <ToggleRow
            label="Maintenance Mode"
            description="Show maintenance page to all visitors"
            defaultChecked={false}
          />
          <ToggleRow
            label="Email Verification Required"
            description="Require email verification before account activation"
            defaultChecked={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Default Trial Days
              </label>
              <input
                type="number"
                defaultValue={14}
                className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Default Currency
              </label>
              <select className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-red-500 outline-none">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Email Configuration" icon={Mail}>
        <div className="space-y-4">
          <FormInput label="SMTP Host" defaultValue="smtp.sendgrid.net" />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="SMTP Port" defaultValue="587" />
            <FormInput label="SMTP Username" defaultValue="apikey" />
          </div>
          <FormInput label="From Name" defaultValue="Assan Platform" />
          <FormInput
            label="From Email"
            defaultValue="noreply@assan.com"
            type="email"
          />
        </div>
      </AdminCard> */}
    </div>
  );
}
