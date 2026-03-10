"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, Check, X, User } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Configuration ---
export const LABELS = [
  {
    id: "NEW",
    label: "New",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    id: "IN_PROGRESS",
    label: "In Progress",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    id: "BOOKED",
    label: "Booked",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    id: "CANCELLED",
    label: "Cancelled",
    color: "bg-red-100 text-red-700 border-red-200",
  },
  {
    id: "DELIVERED",
    label: "Delivered",
    color: "bg-green-100 text-green-700 border-green-200",
  },
] as const;

export type LabelId = (typeof LABELS)[number]["id"];

// Removed 'BOT' from filters
type FilterType = "ALL" | LabelId;

interface ChatSidebarProps {
  conversations: any[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAssignLabel: (chatId: string, labelId: LabelId | undefined) => void;
}

export function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onAssignLabel,
}: ChatSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Filter Logic
  const filteredConversations = conversations.filter((chat) => {
    const matchesSearch =
      chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.phone.includes(searchTerm);

    let matchesStatus = true;

    if (activeFilter !== "ALL") {
      // Check if chat has the specific label
      matchesStatus = chat.label === activeFilter;
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-80 flex flex-col border-r border-gray-200 bg-gray-50/50 h-full">
      {/* HEADER */}
      <div className="p-4 border-b border-gray-200 bg-white space-y-4 shrink-0">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-gray-800 text-lg">Inbox</h2>
          <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {conversations.length} total
          </span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        {/* Scrollable Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          <FilterPill
            label="All"
            isActive={activeFilter === "ALL"}
            onClick={() => setActiveFilter("ALL")}
          />
          {LABELS.map((tag) => (
            <FilterPill
              key={tag.id}
              label={tag.label}
              isActive={activeFilter === tag.id}
              onClick={() => setActiveFilter(tag.id)}
              className={tag.color}
              isColored={true}
            />
          ))}
        </div>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <Filter className="h-8 w-8 mb-2 opacity-20" />
            <p className="text-sm">No chats found</p>
          </div>
        ) : (
          filteredConversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelect(chat.id)}
              className={cn(
                "relative w-full p-4 flex items-start gap-3 border-b border-gray-100 hover:bg-white transition-colors cursor-pointer group",
                activeId === chat.id
                  ? "bg-white border-l-4 border-l-blue-600 shadow-sm z-10"
                  : "border-l-4 border-l-transparent",
              )}
            >
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
                  chat.avatarColor,
                )}
              >
                {chat.name.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-gray-900 truncate text-sm">
                    {chat.name}
                  </h3>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                    {chat.time}
                  </span>
                </div>

                <p
                  className={cn(
                    "text-xs truncate pr-6",
                    chat.unread > 0
                      ? "font-semibold text-gray-800"
                      : "text-gray-500",
                  )}
                >
                  {chat.lastMessage}
                </p>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {/* Removed Bot Badge */}

                  {/* The Assigned Label Pill */}
                  {chat.label && (
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded border font-medium",
                        LABELS.find((l) => l.id === chat.label)?.color,
                      )}
                    >
                      {LABELS.find((l) => l.id === chat.label)?.label}
                    </span>
                  )}

                  {chat.unread > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>

              {/* 3-Dots Menu Trigger */}
              <div className="absolute right-2 top-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                    setOpenMenuId(openMenuId === chat.id ? null : chat.id);
                  }}
                  className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 bg-white/80 shadow-sm border border-gray-100"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>

                {openMenuId === chat.id && (
                  <div
                    className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden py-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Move to
                    </p>
                    {LABELS.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => {
                          onAssignLabel(chat.id, tag.id);
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span
                          className={cn("px-1.5 py-0.5 rounded", tag.color)}
                        >
                          {tag.label}
                        </span>
                        {chat.label === tag.id && (
                          <Check className="h-3 w-3 text-blue-600" />
                        )}
                      </button>
                    ))}
                    <div className="border-t border-gray-100 mt-1"></div>
                    <button
                      onClick={() => {
                        onAssignLabel(chat.id, undefined);
                        setOpenMenuId(null);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <X className="h-3 w-3" /> Clear Label
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function FilterPill({
  label,
  isActive,
  onClick,
  icon: Icon,
  className,
  isColored = false,
}: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
        isActive && !isColored
          ? "bg-gray-900 text-white border-gray-900"
          : isActive && isColored
            ? cn(className, "ring-2 ring-offset-1 ring-blue-100")
            : "",
        !isActive && !isColored
          ? "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          : !isActive && isColored
            ? cn("bg-white border-gray-200 text-gray-600 hover:bg-gray-50")
            : "",
      )}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {label}
    </button>
  );
}
