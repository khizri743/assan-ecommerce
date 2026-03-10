import { Activity, Server, Database, Shield } from "lucide-react";
import { AdminCard } from "../shared/AdminCard";

const services = [
  {
    name: "API Response Time",
    status: "operational",
    value: "45ms",
    icon: Activity,
  },
  { name: "Database", status: "operational", value: "99.9%", icon: Database },
  {
    name: "WhatsApp Webhook",
    status: "warning",
    value: "2s delay",
    icon: Server,
  },
  { name: "Security", status: "operational", value: "Secure", icon: Shield },
];

export function PlatformHealth() {
  return (
    <AdminCard title="Platform Health" subtitle="Real-time system status">
      <div className="space-y-4">
        {services.map((service) => (
          <div
            key={service.name}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-2 rounded-lg",
                  service.status === "operational"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700",
                )}
              >
                <service.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {service.name}
                </p>
                <p className="text-xs text-gray-500">
                  {service.status === "operational"
                    ? "All systems normal"
                    : "Experiencing delays"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  "text-sm font-bold",
                  service.status === "operational"
                    ? "text-green-700"
                    : "text-amber-700",
                )}
              >
                {service.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </AdminCard>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
