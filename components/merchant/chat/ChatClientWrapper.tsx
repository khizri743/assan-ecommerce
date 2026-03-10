"use client";

import { useState, useEffect } from "react";
import { CreateOrderModal } from "./CreateOrderModal";
import { Bot } from "lucide-react";
import { ChatSidebar, LabelId } from "./ChatSidebar"; // Import LabelId
import { ChatWindow } from "./ChatWindow";
import { CustomerPanel } from "./CustomerPanel";
import {
  getMessages,
  sendMessage,
  getCustomerContext,
} from "@/app/(merchant)/dashboard/chat/actions";

// Types
type Conversation = {
  id: string;
  name: string;
  avatarColor: string;
  time: string;
  lastMessage: string;
  unread: number;
  status: string;
  phone: string;
  label?: LabelId; // Added label type
};

export function ChatClientWrapper({
  initialConversations,
  availableProducts,
  readOnly,
}: {
  initialConversations: Conversation[];
  availableProducts: any[];
  readOnly?: boolean;
}) {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [conversations, setConversations] = useState(initialConversations);
  const [messages, setMessages] = useState<any[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [customerContext, setCustomerContext] = useState<any>({
    totalSpent: "$0.00",
    totalOrders: 0,
    recentOrders: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const selectedConversation = conversations.find((c) => c.id === activeChatId);

  // Fetch messages
  useEffect(() => {
    async function fetchData() {
      if (!activeChatId || !selectedConversation) return;
      setIsLoading(true);
      try {
        // Parallel fetch
        const [history, context] = await Promise.all([
          getMessages(activeChatId),
          getCustomerContext(selectedConversation.phone),
        ]);

        // @ts-ignore
        setMessages(history);
        if (context) setCustomerContext(context);
      } catch (error) {
        console.error("Failed to load chat data", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [activeChatId, selectedConversation]);

  // Handle Label Assignment Logic
  const handleAssignLabel = (chatId: string, labelId: LabelId | undefined) => {
    // 1. If clicking "Booked", we trigger the Order Flow
    if (labelId === "BOOKED") {
      setActiveChatId(chatId); // Switch to this chat
      setIsOrderModalOpen(true); // Open Modal
      return;
    }

    // 2. Normal Label Update
    setConversations((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, label: labelId } : c)),
    );

    // In a real app: await updateChatLabel(chatId, labelId);
  };

  const handleOrderSuccess = (newMessage?: any) => {
    // After creating an order, apply the 'BOOKED' label automatically
    if (activeChatId) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeChatId ? { ...c, label: "BOOKED" } : c,
        ),
      );
    }
    if (newMessage) {
      setMessages((prev) => [...prev, newMessage]);
    }

    setIsOrderModalOpen(false);
  };

  const handleSendMessage = async (text: string) => {
    if (readOnly || !activeChatId) return;
    if (!activeChatId) return;
    const tempMsg = {
      id: Date.now().toString(),
      text,
      sender: "agent",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "text",
    };
    setMessages((prev) => [...prev, tempMsg]);
    await sendMessage(activeChatId, text);
  };

  return (
    <div className="flex h-full bg-white">
      <ChatSidebar
        conversations={conversations}
        activeId={activeChatId}
        onSelect={setActiveChatId}
        onAssignLabel={handleAssignLabel} // Pass handler
      />

      {selectedConversation ? (
        <>
          <ChatWindow
            // @ts-ignore
            conversation={selectedConversation}
            messages={messages}
            readOnly={readOnly} // Pass readOnly to disable input
          />
          <CustomerPanel
            conversation={selectedConversation}
            context={customerContext}
            onOpenOrderModal={() => setIsOrderModalOpen(true)} // Allow Panel to open modal too
            readOnly={readOnly} // Pass readOnly to disable order button
          />
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white">
          <Bot className="h-16 w-16 mb-4 opacity-20" />
          <p>Select a conversation to start chatting</p>
        </div>
      )}

      {/* Modal Lives Here Now */}
      {!readOnly && selectedConversation && (
        <CreateOrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          products={availableProducts}
          sessionId={selectedConversation.id}
          onSuccess={handleOrderSuccess} // Callback on success
        />
      )}
    </div>
  );
}
