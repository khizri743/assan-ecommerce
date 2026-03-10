import prisma from "@/lib/prisma";
import { WhatsAppDashboardClient } from "@/components/merchant/settings/whatsapp/WhatsAppDashboardClient";

export default async function WhatsAppPage() {
  // Fetch business data directly on the server
  const business = await prisma.business.findFirst();

  // Determine connection status based on DB fields
  const isConnected = !!(business?.wabaId && business?.whatsappPhoneId);

  return (
    <WhatsAppDashboardClient
      initialConnectionStatus={isConnected ? "connected" : "disconnected"}
      connectedPhoneId={business?.whatsappPhoneId || null}
    />
  );
}
