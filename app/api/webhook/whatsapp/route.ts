import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 1. VERIFICATION (GET)
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log("✅ Webhook verified successfully!");
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

// 2. EVENT HANDLING (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if it's a valid WhatsApp message object
    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      // We only care about "messages" value
      if (value?.messages) {
        const message = value.messages[0];
        const businessPhoneNumberId = value.metadata.phone_number_id;

        // 1. Find the Business associated with this Phone ID
        const business = await prisma.business.findFirst({
          where: { whatsappPhoneId: businessPhoneNumberId },
        });

        if (business) {
          const customerPhone = message.from; // e.g., "923001234567"
          const messageBody = message.text?.body || ""; // Only handling text for now

          // 2. Find or Create Chat Session
          // Using upsert to handle race conditions simply
          const chatSession = await prisma.chatSession.upsert({
            where: {
              businessId_customerPhone: {
                businessId: business.id,
                customerPhone: customerPhone,
              },
            },
            update: {
              lastInteractionAt: new Date(),
              // If you had a 'unreadCount', you would increment it here
            },
            create: {
              businessId: business.id,
              customerPhone: customerPhone,
              currentState: "MAIN_MENU", // Default bot state
            },
          });

          // 3. Save the Message to DB
          await prisma.chatMessage.create({
            data: {
              chatSessionId: chatSession.id,
              sender: "CUSTOMER",
              content: messageBody,
            },
          });

          console.log(
            `📩 Saved message from ${customerPhone} for business ${business.name}`,
          );
        } else {
          console.warn(
            `⚠️ Received message for unknown Business Phone ID: ${businessPhoneNumberId}`,
          );
        }
      }
    }

    // Always return 200 OK to Meta, otherwise they will retry sending the webhook
    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
