// frontend/lib/types.ts

export type Role = "OWNER" | "MANAGER" | "STAFF";
export type Plan = "FREE" | "BASIC" | "PRO";
export type OrderStatus =
  | "NEW"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "CANCELLED";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  business_id: string;
}

export interface Business {
  id: string; // UUID
  name: string;
  slug: string;
  logo_url?: string;
  subscription_plan: Plan;
}

export interface Order {
  id: number;
  order_number: string; // ORD-1001
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  items_count: number;
}

export type ChatStatus = "BOT_ACTIVE" | "AGENT_ACTIVE";

export interface ChatConversation {
  id: number;
  name: string;
  phone: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: ChatStatus;
  avatarColor: string;
}

export interface ChatMessage {
  id: string;
  sender: "customer" | "bot" | "system" | "agent";
  text: string;
  time: string;
  type?: "text" | "alert" | "image";
}

export interface CustomerContext {
  id: string;
  totalSpent: string;
  lastOrderDate: string;
  recentOrders: {
    id: string;
    items: string;
    status: string;
    date: string;
  }[];
}

export type ProductStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  status: ProductStatus;
  sales: number; // For analytics column
}

export interface Customer {
  id: number;
  name: string;
  phone: string; // WhatsApp ID
  email?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: "ACTIVE" | "BLOCKED";
  tags: string[]; // e.g. "VIP", "New"
  joinedDate: string;
}
