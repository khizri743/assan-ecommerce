"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type WhatsAppConnectData = {
  code: string; // The auth code from Facebook (for token exchange if needed)
  wabaId?: string; // WhatsApp Business Account ID
  phoneNumberId?: string;
  phoneNumber?: string;
};

export async function saveWhatsAppConnection(data: WhatsAppConnectData) {
  // 1. Get current business (In real app, getting from Auth Session)
  const business = await prisma.business.findFirst();

  if (!business) {
    throw new Error("Business not found");
  }

  console.log("🔗 Connecting WhatsApp for business:", business.name);
  console.log("📦 Received Data:", data);

  // 2. (Optional) Exchange Code for Token
  // If you need a permanent token, you'd call the Graph API here using `data.code`.
  // For Embedded Signup, mostly you just need the IDs to send messages via API
  // if you are using a System User token or your own App's token.

  // 3. Update Database
  await prisma.business.update({
    where: { id: business.id },
    data: {
      wabaId: data.wabaId,
      whatsappPhoneId: data.phoneNumberId,
      // If the signup flow returned the display phone number, you might want to save it too
      // phone: data.phoneNumber
    },
  });

  revalidatePath("/dashboard/whatsapp");
  return { success: true };
}

export async function disconnectWhatsApp() {
  const business = await prisma.business.findFirst();

  if (!business) {
    throw new Error("Business not found");
  }

  console.log("❌ Disconnecting WhatsApp for business:", business.name);

  await prisma.business.update({
    where: { id: business.id },
    data: {
      wabaId: null, // Clear the ID
      whatsappPhoneId: null, // Clear the ID
    },
  });

  revalidatePath("/dashboard/whatsapp");
  return { success: true };
}
