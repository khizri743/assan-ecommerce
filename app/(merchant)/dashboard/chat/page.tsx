import prisma from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { getConversations, getProductsList } from "./actions";
import { ChatClientWrapper } from "@/components/merchant/chat/ChatClientWrapper";

export default async function ChatPage() {
  // 1. Check Permission & Get User
  const user = await requirePermission("CHAT", "READ");

  const conversations = await getConversations();
  const productsRaw = await getProductsList();

  const products = productsRaw.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  // 2. Determine Write Access
  const canWrite =
    user.role === "OWNER" || (user.permissions as any)?.CHAT === "WRITE";

  return (
    <div className="h-[calc(100vh-8rem)] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <ChatClientWrapper
        initialConversations={conversations}
        availableProducts={products}
        readOnly={!canWrite} // <--- Pass this prop
      />
    </div>
  );
}
