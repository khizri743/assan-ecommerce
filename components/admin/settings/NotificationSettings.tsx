import { Bell, Mail, MessageSquare, AlertTriangle } from "lucide-react";
import { AdminCard } from "../shared/AdminCard";
import { ToggleRow } from "@/components/merchant/settings/shared/ToggleRow";

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      <AdminCard title="Admin Alerts" icon={Bell}>
        <div className="space-y-3">
          <ToggleRow
            label="New Tenant Registration"
            description="Notify when a new business signs up"
            defaultChecked={true}
          />
          <ToggleRow
            label="Payment Failures"
            description="Alert when tenant payment fails"
            defaultChecked={true}
          />
          <ToggleRow
            label="Security Incidents"
            description="Immediate alert for suspicious activity"
            defaultChecked={true}
          />
          <ToggleRow
            label="System Errors"
            description="Critical system error notifications"
            defaultChecked={true}
          />
        </div>
      </AdminCard>

      <AdminCard title="Tenant Communications" icon={Mail}>
        <div className="space-y-3">
          <ToggleRow
            label="Welcome Emails"
            description="Send onboarding email to new tenants"
            defaultChecked={true}
          />
          <ToggleRow
            label="Payment Reminders"
            description="Remind tenants of upcoming charges"
            defaultChecked={true}
          />
          <ToggleRow
            label="Trial Expiration"
            description="Notify before trial period ends"
            defaultChecked={true}
          />
          <ToggleRow
            label="Feature Updates"
            description="Announce new platform features"
            defaultChecked={false}
          />
        </div>
      </AdminCard>

      <AdminCard title="WhatsApp Alerts" icon={MessageSquare}>
        <div className="space-y-3">
          <ToggleRow
            label="Critical System Status"
            description="Send WhatsApp for downtime alerts"
            defaultChecked={false}
          />
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              WhatsApp alerts require Business API configuration
            </p>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
