import { Upload, Smartphone, CheckCircle2 } from "lucide-react";
import { SettingsCard } from "../shared/SettingsCard";
import { FormInput } from "../shared/FormInput";
import { StatusBadge } from "../shared/StatusBadge";

interface Business {
  name: string;
  slug: string;
  email: string;
  phone: string;
  address: string;
  logo: string | null;
  whatsappPhoneId: string;
}

interface ProfileTabProps {
  business: Business;
}

export function ProfileTab({ business }: ProfileTabProps) {
  return (
    <div className="space-y-6">
      <SettingsCard>
        <div className="flex items-center gap-4 mb-6">
          {/* <div className="h-20 w-20 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
            {business.logo ? (
              <img
                src={business.logo}
                alt="Logo"
                className="h-full w-full object-cover rounded-xl"
              />
            ) : (
              <Upload className="h-6 w-6" />
            )}
          </div> */}
          <div>
            <h3 className="font-semibold text-gray-900">
              Business Information
            </h3>
            {/* <p className="text-sm text-gray-500 mb-2">
              Recommended: 400x400px, PNG or JPG
            </p>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Upload New Logo
            </button> */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Business Name" defaultValue={business.name} />
          <FormInput
            label="Store URL"
            defaultValue={business.slug}
            postfix=".goftechsolutions.com/"
          />
          <FormInput
            label="Contact Email"
            defaultValue={business.email}
            type="email"
          />
          <FormInput label="Phone Number" defaultValue={business.phone} />
          <div className="md:col-span-2">
            <FormInput
              label="Business Address"
              defaultValue={business.address}
            />
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="WhatsApp Business API"
        description="Connected to your customers via WhatsApp"
        icon={Smartphone}
        action={<StatusBadge status="Connected" variant="active" />}
      >
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Phone Number ID</span>
            <span className="text-sm font-mono text-gray-900 font-medium">
              {business.whatsappPhoneId}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Webhook Status</span>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-green-600 font-medium">Active</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Message Quality</span>
            <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
              <CheckCircle2 className="h-4 w-4" />
              High
            </div>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}
