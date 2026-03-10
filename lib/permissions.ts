export const MODULES = {
  ORDERS: "Orders",
  PRODUCTS: "Products",
  CUSTOMERS: "Customers",
  CHAT: "Live Chat",
  SETTINGS: "Settings",
} as const;

export type ModuleKey = keyof typeof MODULES;

export type AccessLevel = "NONE" | "READ" | "WRITE";

export type PermissionSet = Record<ModuleKey, AccessLevel>;

// Default permissions for a new staff member
export const DEFAULT_PERMISSIONS: PermissionSet = {
  ORDERS: "READ",
  PRODUCTS: "READ",
  CUSTOMERS: "READ",
  CHAT: "NONE",
  SETTINGS: "NONE",
};
