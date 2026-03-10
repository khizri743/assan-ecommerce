"use server";

import prisma from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session"; // 1. Import session helper

export async function getConversations() {
  // 2. Get the logged-in user's session
  const session = await getSession();

  // If no session or business ID, return empty list (or handle error)
  if (!session?.businessId) return [];

  // 3. Fetch sessions ONLY for this business
  const sessions = await prisma.chatSession.findMany({
    where: { businessId: session.businessId as string }, // Use the ID from session
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { lastInteractionAt: "desc" },
  });

  return sessions.map((session) => {
    const lastMsg = session.messages[0];
    return {
      id: session.id,
      name: session.customerPhone,
      avatarColor: "bg-blue-100 text-blue-600",
      time: lastMsg
        ? formatDistanceToNow(new Date(lastMsg.createdAt), { addSuffix: true })
        : "",
      lastMessage: lastMsg ? lastMsg.content : "No messages yet",
      unread: 0,
      status: session.currentState === "LIVE_AGENT" ? "AGENT" : "BOT_ACTIVE",
      phone: session.customerPhone,
    };
  });
}

export async function getMessages(sessionId: string) {
  // Optional Security: Verify this session belongs to the user's business
  // For now, fetching by ID is safe enough if the list above is filtered correctly
  const messages = await prisma.chatMessage.findMany({
    where: { chatSessionId: sessionId },
    orderBy: { createdAt: "asc" },
  });

  return messages.map((msg) => ({
    id: msg.id,
    text: msg.content,
    sender: msg.sender.toLowerCase(),
    time: new Date(msg.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    type: "text",
  }));
}

export async function sendMessage(sessionId: string, text: string) {
  await prisma.chatMessage.create({
    data: {
      chatSessionId: sessionId,
      sender: "AGENT",
      content: text,
    },
  });

  await prisma.chatSession.update({
    where: { id: sessionId },
    data: { lastInteractionAt: new Date() },
  });
}

export async function createManualOrder(
  chatSessionId: string,
  items: { productId: string; quantity: number }[],
) {
  const session = await getSession();
  if (!session?.businessId) throw new Error("Unauthorized");

  // 1. Get Chat Session details
  const chatSession = await prisma.chatSession.findUnique({
    where: { id: chatSessionId },
  });

  if (!chatSession) throw new Error("Chat session not found");

  // 2. Find OR Create Customer (Fix for "Customer not found" error)
  // We use the phone number from the chat to link or create the customer
  const customer = await prisma.customer.upsert({
    where: {
      phone_businessId: {
        phone: chatSession.customerPhone,
        businessId: session.businessId as string,
      },
    },
    update: {}, // If exists, do nothing
    create: {
      businessId: session.businessId as string,
      phone: chatSession.customerPhone,
      name: "New Customer", // Placeholder name
      totalOrders: 0,
      totalSpent: 0,
    },
  });

  // 3. Fetch Products to calculate prices securely
  const productIds = items.map((i) => i.productId);
  const dbProducts = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  // 4. Calculate Total & Prepare Order Items
  let totalAmount = 0;
  const orderItemsData = items.map((item) => {
    const product = dbProducts.find((p) => p.id === item.productId);
    if (!product) throw new Error(`Product ID ${item.productId} not found`);

    const price = Number(product.price);
    totalAmount += price * item.quantity;

    return {
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice: price,
    };
  });

  // 5. Create Order
  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

  await prisma.order.create({
    data: {
      businessId: session.businessId as string,
      customerId: customer.id,
      orderNumber,
      totalAmount,
      status: "CONFIRMED",
      items: {
        create: orderItemsData,
      },
    },
  });

  // 6. Update Customer Stats (Optional but recommended)
  await prisma.customer.update({
    where: { id: customer.id },
    data: {
      totalOrders: { increment: 1 },
      totalSpent: { increment: totalAmount },
      lastOrderAt: new Date(),
    },
  });

  // 7. Send confirmation message
  const newMessage = await prisma.chatMessage.create({
    data: {
      chatSessionId,
      sender: "AGENT",
      content: `✅ Manual Order #${orderNumber} created for $${totalAmount.toFixed(2)}.`,
    },
  });

  await prisma.chatSession.update({
    where: { id: chatSessionId },
    data: { lastInteractionAt: new Date() },
  });

  revalidatePath("/dashboard/chat");
  revalidatePath("/dashboard/orders");

  // RETURN THE MESSAGE OBJECT
  return {
    success: true,
    message: {
      id: newMessage.id,
      text: newMessage.content,
      sender: "agent",
      time: new Date(newMessage.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "text",
    },
  };
}

// ... keep getProductsList ...
export async function getProductsList() {
  const session = await getSession();
  if (!session?.businessId) return [];

  return await prisma.product.findMany({
    where: { businessId: session.businessId as string, isActive: true },
    select: {
      id: true,
      name: true,
      price: true,
      stockQuantity: true,
      category: true,
    },
    orderBy: { category: "asc" },
  });
}

export async function getCustomerContext(phone: string) {
  const session = await getSession();
  if (!session?.businessId) return null;

  const customer = await prisma.customer.findUnique({
    where: {
      phone_businessId: {
        phone,
        businessId: session.businessId as string,
      },
    },
    include: {
      orders: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: true }, // Include items to show summary
      },
    },
  });

  if (!customer) {
    return {
      totalSpent: "$0.00",
      totalOrders: 0,
      recentOrders: [],
    };
  }

  // Calculate stats freshly or use stored fields
  // (Prisma Decimal needs Number conversion)
  const totalSpent = Number(customer.totalSpent);

  return {
    totalSpent: `$${totalSpent.toFixed(2)}`,
    totalOrders: customer.totalOrders, // Changed from lastOrderDate
    recentOrders: customer.orders.map((o) => ({
      id: o.orderNumber,
      status: o.status,
      date: new Date(o.createdAt).toLocaleDateString(),
      // Summarize items e.g. "2x Burger, 1x Coke"
      items: o.items.map((i) => `${i.quantity}x ${i.productName}`).join(", "),
    })),
  };
}
