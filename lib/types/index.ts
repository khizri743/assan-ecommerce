// Base types matching Laravel models
export interface Business {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  industry_type: "RETAIL" | "FOOD" | "SERVICE" | "OTHER";
  subscription_plan: "FREE" | "BASIC" | "PRO";
  subscription_status: "ACTIVE" | "CANCELLED" | "PAST_DUE";
  whatsapp_phone_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  business_id: string;
  name: string;
  email: string;
  role: "OWNER" | "MANAGER" | "STAFF";
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  image_url: string | null;
  attributes: Record<string, any>;
  created_at: string;
}

export interface Customer {
  id: string;
  business_id: string;
  phone: string;
  name: string;
  email: string | null;
  address: string | null;
  total_orders: number;
  total_spent: number;
  last_order_at: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  business_id: string;
  customer_id: string;
  order_number: string;
  total_amount: number;
  status: "NEW" | "CONFIRMED" | "IN_PROGRESS" | "DELIVERED" | "CANCELLED";
  payment_status: "PENDING" | "PAID";
  assigned_to: string | null;
  notes: string | null;
  items: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
