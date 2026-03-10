"use client";

import { useState } from "react";
import {
  Phone,
  MoreVertical,
  AlertCircle,
  CheckCheck,
  Paperclip,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types handled by parent wrapper mainly, but defined here for prop safety
interface ChatWindowProps {
  conversation: any;
  messages: any[];
  readOnly?: boolean; // Changed from 'readonly' to 'readOnly'
}

export function ChatWindow({
  conversation,
  messages,
  readOnly, // Changed from 'readonly' to 'readOnly'
}: ChatWindowProps) {
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (!inputText.trim()) return;
    // In real app, this should call a prop function passed from parent
    console.log("Sending message:", inputText);
    setInputText("");
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white z-10">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm",
              conversation.avatarColor,
            )}
          >
            {conversation.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              {conversation.name}
            </h3>
            <p className="text-xs text-gray-500">{conversation.phone}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <Phone className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
        {messages.map((msg) => {
          if (msg.type === "alert") {
            return (
              <div key={msg.id} className="flex justify-center my-4">
                <div className="bg-yellow-50 text-yellow-800 text-xs px-3 py-1 rounded-full flex items-center gap-2 border border-yellow-100">
                  <AlertCircle className="h-3 w-3" />
                  {msg.text}
                </div>
              </div>
            );
          }

          const isCustomer = msg.sender === "customer";
          return (
            <div
              key={msg.id}
              className={cn(
                "flex",
                isCustomer ? "justify-start" : "justify-end",
              )}
            >
              <div
                className={cn(
                  "max-w-[70%] rounded-xl p-3 text-sm shadow-sm",
                  isCustomer
                    ? "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                    : "bg-blue-600 text-white rounded-tr-none",
                )}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <div
                  className={cn(
                    "text-[10px] mt-1 text-right flex items-center justify-end gap-1",
                    isCustomer ? "text-gray-400" : "text-blue-100",
                  )}
                >
                  {msg.time}
                  {!isCustomer && <CheckCheck className="h-3 w-3" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      {!readOnly ? (
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
              <Paperclip className="h-5 w-5" />
            </button>
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-gray-100 border-0 rounded-full px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-sm"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-500">
          Read Only Access. You cannot send messages.
        </div>
      )}
    </div>
  );
}
