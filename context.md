# Assan E-Commerce Project Context

**Project Name:** assan_ecommerce  
**Version:** 0.1.0  
**Type:** Next.js 16 Full-Stack E-Commerce Management Platform  
**Language:** TypeScript  
**Status:** Active Development

---

## 📋 Project Overview

Assan E-Commerce is a comprehensive multi-tenant e-commerce management platform built with Next.js 16 and PostgreSQL. The platform supports:

- **Multi-Tenant Architecture**: Support for multiple businesses with isolated data
- **Admin Dashboard**: System-wide management and tenant oversight
- **Merchant Dashboard**: Per-business order, product, and customer management
- **WhatsApp Integration**: Direct WhatsApp Business API integration via Meta Embedded Signup
- **Role-Based Access Control**: Permission-based access for administrative functions
- **Subscription Plans**: Tiered pricing model with plan management
- **Audit Logging**: Complete audit trail for administrative actions
- **Chat System**: Customer communication via WhatsApp
- **Product Management**: Inventory and product catalog management
- **Order Management**: Kanban-style order workflow management

---

## 🛠 Technology Stack

### Frontend

- **Framework**: Next.js 16.1.6
- **React**: 19.2.3 (with React DOM)
- **Styling**: Tailwind CSS 4 + PostCSS 4
- **UI Components**: Lucide React (icons)
- **State Management**: React hooks + Server Actions
- **Drag & Drop**: @dnd-kit/core (6.3.1) for Kanban boards
- **Charts**: Recharts 3.7.0 for analytics

### Backend

- **Database**: PostgreSQL
- **ORM**: Prisma 7.3.0
- **Database Adapter**: @prisma/adapter-pg
- **Authentication**: JWT via jose (6.1.3)
- **Encryption**: bcryptjs (3.0.3)
- **Email**: Nodemailer 8.0.1
- **Environment**: dotenv 17.2.4

### Developer Tools

- **TypeScript**: 5
- **Linter**: ESLint 9 with Next.js config
- **Build Tool**: tsx 4.21.0
- **Package Manager**: npm

---

## 🏗 Architecture & Design

### Route Organization (File-Based Routing)

The app uses Next.js App Router with route groups for logical separation:

```
/app
├── (admin)              # Admin-only routes
├── (auth)               # Public auth routes
├── (merchant)           # Merchant dashboard routes
├── api                  # API endpoints & webhooks
└── layout.tsx           # Root layout
```

### Key Architectural Patterns

1. **Server Components by Default**: Components are server-rendered unless marked `"use client"`
2. **Server Actions**: Direct database mutations via `"use server"` functions
3. **Route Handlers**: API endpoints for webhooks and external integrations
4. **Multi-Tenant Isolation**: Business context with cascading deletes
5. **Component Composition**: Shared components across admin and merchant sections

### Authentication Flow

- JWT-based authentication
- Session management via cookies
- Role-based access control (RBAC) with permissions JSON field
- OTP support for enhanced security

---

## 📁 Complete Directory Structure

```
assan_ecommerce/
├── app/                              # Next.js App Router directory
│   ├── (admin)/                      # Admin portal routes
│   │   ├── admin/                    # Admin dashboard routes
│   │   │   ├── audit/
│   │   │   │   ├── actions.ts        # Audit log server actions
│   │   │   │   └── page.tsx          # Audit page
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx          # Admin dashboard
│   │   │   ├── login/
│   │   │   │   └── page.tsx          # Admin login
│   │   │   ├── plans/
│   │   │   │   ├── actions.ts        # Plan CRUD actions
│   │   │   │   └── page.tsx          # Plans page
│   │   │   ├── settings/
│   │   │   │   └── page.tsx          # Admin settings
│   │   │   ├── tenants/
│   │   │   │   ├── actions.ts        # Tenant management actions
│   │   │   │   └── page.tsx          # Tenants page
│   │   │   ├── actions.ts            # Shared admin actions
│   │   │   └── layout.tsx            # Admin layout wrapper
│   │   └── layout.tsx                # Admin route group layout
│   │
│   ├── (auth)/                       # Public authentication routes
│   │   ├── actions.ts                # Auth server actions
│   │   ├── login/
│   │   │   └── page.tsx              # Login page
│   │   ├── register/
│   │   │   └── page.tsx              # Registration page
│   │   └── verify/
│   │       └── page.tsx              # Email verification page
│   │
│   ├── (merchant)/                   # Merchant dashboard routes
│   │   ├── dashboard/
│   │   │   ├── analytics/            # Analytics subdirectory
│   │   │   ├── chat/
│   │   │   │   ├── actions.ts        # Chat server actions
│   │   │   │   └── page.tsx          # Chat interface
│   │   │   ├── customers/
│   │   │   │   └── page.tsx          # Customer management
│   │   │   ├── orders/
│   │   │   │   ├── [id]/             # Dynamic order detail
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── actions.ts        # Order CRUD actions
│   │   │   │   └── page.tsx          # Orders Kanban board
│   │   │   ├── products/
│   │   │   │   ├── [id]/             # Dynamic product edit
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx      # New product form
│   │   │   │   ├── actions.ts        # Product CRUD actions
│   │   │   │   └── page.tsx          # Products list
│   │   │   ├── settings/
│   │   │   │   ├── tabs/             # Settings section tabs
│   │   │   │   │   ├── AddStaffModal.tsx
│   │   │   │   │   ├── BillingTab.tsx
│   │   │   │   │   ├── NotificationsTab.tsx
│   │   │   │   │   ├── PlanSelectionCard.tsx
│   │   │   │   │   ├── ProfileTabs.tsx
│   │   │   │   │   ├── StaffModal.tsx
│   │   │   │   │   ├── TeamTab.tsx
│   │   │   │   │   └── UpgradeModal.tsx
│   │   │   │   ├── whatsapp/         # WhatsApp settings
│   │   │   │   │   ├── actions.ts    # WhatsApp connection actions
│   │   │   │   │   └── page.tsx      # WhatsApp dashboard
│   │   │   │   ├── actions.ts        # Settings server actions
│   │   │   │   ├── page.tsx          # Settings page
│   │   │   │   └── billing-actions.ts
│   │   │   │   └── team-actions.ts
│   │   │   ├── staff/
│   │   │   │   └── page.tsx          # Staff management
│   │   │   ├── support/
│   │   │   │   └── page.tsx          # Support page
│   │   │   ├── not-found.tsx         # Custom 404
│   │   │   └── page.tsx              # Merchant dashboard home
│   │   └── layout.tsx                # Merchant layout wrapper
│   │
│   ├── api/                          # API routes
│   │   ├── cron/
│   │   │   └── check-subscriptions/
│   │   │       └── route.ts          # Subscription check cron
│   │   └── webhook/
│   │       └── whatsapp/
│   │           └── route.ts          # WhatsApp webhook receiver
│   │
│   ├── generated/                    # Generated code (by Prisma)
│   │   └── prisma/
│   │       ├── browser.ts
│   │       ├── client.ts
│   │       ├── commonInputTypes.ts
│   │       ├── enums.ts
│   │       ├── models.ts
│   │       ├── internal/
│   │       │   ├── class.ts
│   │       │   ├── prismaNamespace.ts
│   │       │   └── prismaNamespaceBrowser.ts
│   │       └── models/               # Prisma generated models
│   │           ├── AuditLog.ts
│   │           ├── Business.ts
│   │           ├── ChatMessage.ts
│   │           ├── ChatSession.ts
│   │           ├── Customer.ts
│   │           ├── Order.ts
│   │           ├── OrderItem.ts
│   │           ├── Product.ts
│   │           ├── SubscriptionPlan.ts
│   │           └── User.ts
│   │
│   ├── globals.css                   # Global Tailwind styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Home page
│
├── components/                       # React components
│   ├── admin/                        # Admin-specific components
│   │   ├── analytics/                # Empty; for future analytics
│   │   ├── audit/
│   │   │   ├── AuditLogDetailModal.tsx
│   │   │   ├── AuditLogFilters.tsx
│   │   │   └── AuditLogTable.tsx
│   │   ├── dashboard/
│   │   │   ├── MRRChart.tsx         # Monthly Recurring Revenue
│   │   │   ├── PlatformHealth.tsx
│   │   │   ├── RecentActivity.tsx
│   │   │   └── StatCard.tsx
│   │   ├── layout/
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── AdminNotifications.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AdminTopNav.tsx
│   │   │   └── SubscriptionApprovalModal.tsx
│   │   ├── plans/
│   │   │   └── PlanEditor.tsx
│   │   ├── settings/
│   │   │   ├── GeneralSettings.tsx
│   │   │   ├── MaintenanceSettings.tsx
│   │   │   ├── NotificationSettings.tsx
│   │   │   └── SecuritySettings.tsx
│   │   ├── shared/                   # Admin shared components
│   │   │   ├── AdminCard.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── DateRangePicker.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   └── StatusBadge.tsx
│   │   └── tenants/
│   │       ├── AddTenantModal.tsx
│   │       ├── ImpersonateModal.tsx
│   │       ├── TenantFilters.tsx
│   │       ├── TenantStatusToggle.tsx
│   │       └── TenantTable.tsx
│   │
│   ├── merchant/                     # Merchant-specific components
│   │   ├── analytics/
│   │   │   └── AnalyticsChart.tsx
│   │   ├── chat/
│   │   │   ├── ChatClientWrapper.tsx
│   │   │   ├── ChatSidebar.tsx
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── CreateOrderModal.tsx
│   │   │   └── CustomerPanel.tsx
│   │   ├── customers/
│   │   │   ├── CustomerClientWrapper.tsx
│   │   │   ├── CustomerDrawer.tsx
│   │   │   └── CustomerTable.tsx
│   │   ├── orders/
│   │   │   ├── KanbanColumn.tsx
│   │   │   ├── OrderBoard.tsx
│   │   │   └── OrderCard.tsx
│   │   ├── products/
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ProductModal.tsx
│   │   │   ├── ProductTable.tsx
│   │   │   ├── ProductTableClient.tsx
│   │   │   └── QuickEditModal.tsx
│   │   ├── settings/
│   │   │   ├── GeneralSettings.tsx
│   │   │   ├── InvoiceTable.tsx
│   │   │   ├── NavButton.tsx
│   │   │   ├── NotificationSettings.tsx
│   │   │   ├── ProfileSettings.tsx
│   │   │   ├── SettingsClient.tsx
│   │   │   ├── TeamMemberTable.tsx
│   │   │   ├── shared/               # Settings-specific shared
│   │   │   │   ├── FormInput.tsx
│   │   │   │   ├── SettingsCard.tsx
│   │   │   │   ├── StatusBadge.tsx
│   │   │   │   └── ToggleRow.tsx
│   │   │   ├── tabs/
│   │   │   │   ├── BillingTab.tsx
│   │   │   │   ├── NotificationsTab.tsx
│   │   │   │   ├── ProfileTabs.tsx
│   │   │   │   ├── TeamTab.tsx
│   │   │   │   └── UpgradeModal.tsx
│   │   │   └── whatsapp/
│   │   │       ├── BusinessProfileSetup.tsx
│   │   │       ├── ConnectionStatus.tsx
│   │   │       ├── EmbeddedSignup.tsx
│   │   │       ├── MetaDeveloperFlow.tsx
│   │   │       ├── PhoneNumberInput.tsx
│   │   │       ├── VerificationCode.tsx
│   │   │       ├── WDC_backup.tsx
│   │   │       ├── WhatsAppConnectModal.tsx
│   │   │       └── WhatsAppDashboardClient.tsx
│   │   ├── OrderStatusBadge.tsx
│   │   ├── RevenueChart.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Topnav.tsx
│   │   └── whatsapp/ (note: may be duplicate with settings/whatsapp)
│   │
│   ├── shared/                       # Globally shared components
│   │   └── crud/
│   │       ├── DataTable.tsx
│   │       ├── DeleteModal.tsx
│   │       ├── FormModal.tsx
│   │       ├── Pagination.tsx
│   │       └── SearchFilter.tsx
│   │
│   ├── store/                        # Public store components
│   │   ├── ProductCard.tsx
│   │   └── StickyCart.tsx
│   │
│   └── ui/                           # Base UI components (empty)
│
├── lib/                              # Utility & helper functions
│   ├── auth.ts                       # Authentication utilities
│   ├── mail.ts                       # Email/Nodemailer setup
│   ├── mock-data.ts                  # Mock data for development
│   ├── permissions.ts                # Permission checking logic
│   ├── prisma.ts                     # Prisma client singleton
│   ├── session.ts                    # Session management
│   ├── types.ts                      # TypeScript type definitions
│   ├── utils.ts                      # General utilities (cn, etc.)
│   └── types/
│       └── index.ts                  # More type definitions
│
├── prisma/                           # Prisma ORM setup
│   ├── schema.prisma                 # Database schema definition
│   ├── seed.ts                       # Database seeding script
│   ├── sync-customers.ts             # Customer sync script
│   └── migrations/                   # Database migration history
│       ├── migration_lock.toml
│       ├── 20260211052733_init/
│       ├── 20260211094920_add_whatsapp_columns/
│       ├── 20260218055456_add_audit_logs/
│       ├── 20260219070514_add_subscription_plans/
│       ├── 20260219071108_add_subscription_plans/
│       ├── 20260220053647_add_user_permissions/
│       ├── 20260223033943_add_subscription_dates/
│       ├── 20260223041137_add_product_category/
│       ├── 20260223050019_add_account_manager/
│       ├── 20260223055333_add_pending_subscription/
│       ├── 20260223055941_updated_pending_subscription/
│       ├── 20260224030717_add_otp_and_warnings/
│       └── 20260224043159_add_chat_session_label/
│
├── public/                           # Static assets
│   ├── uploads/                      # User-uploaded files
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── node_modules/                     # Dependencies (not tracked in git)
├── .next/                            # Next.js build output
├── .git/                             # Git repository
├── .gitignore                        # Git ignore rules
├── .env                              # Environment variables (local)
├── eslint.config.mjs                 # ESLint configuration
├── next-env.d.ts                     # Next.js type declarations
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies & scripts
├── package-lock.json                 # Locked dependency versions
├── postcss.config.mjs                # PostCSS configuration
├── prisma.config.ts                  # Prisma configuration
├── proxy.ts                          # Proxy configuration
├── README.md                         # Project documentation
├── tsconfig.json                     # TypeScript configuration
└── context.md                        # This file
```

---

## 🗄 Database Schema Overview

### Core Models

**Business**

- Multi-tenant root entity
- Subscription management (plan, status, dates)
- WhatsApp integration fields (wabaId, whatsappPhoneId, accessToken)
- Account manager details

**User**

- Business staff users
- Authentication (email, password, OTP)
- Role-based access control (permissions JSON)
- Assigned orders relationship

**Product**

- Business inventory management
- Pricing (Decimal 10,2)
- Categories and attributes
- Stock tracking

**Customer**

- Business customer contacts
- Contact methods (WhatsApp phone, email)

**Order**

- Order management
- Multi-item support (OrderItem relation)
- Status tracking
- Staff assignment

**ChatSession & ChatMessage**

- WhatsApp conversation tracking
- Message history
- Customer-business communication

**SubscriptionPlan**

- Billing tier definitions
- Feature limits/pricing

**AuditLog**

- Administrative action tracking
- Compliance & security logging

---

## 🚀 Setup & Development

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Meta/Facebook App (for WhatsApp integration)

### Installation

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Fill in required env vars: DATABASE_URL, FB_APP_ID, NEXT_PUBLIC_FB_CONFIG_ID, etc.

# Setup database
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
```

### Running the Project

```bash
# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint

# Open Prisma Studio (visual database browser)
npx prisma studio
```

---

## 📦 Key Dependencies

| Package       | Version | Purpose           |
| ------------- | ------- | ----------------- |
| next          | 16.1.6  | React framework   |
| react         | 19.2.3  | UI library        |
| prisma        | 7.3.0   | ORM & migrations  |
| tailwindcss   | 4       | CSS framework     |
| lucide-react  | 0.563.0 | Icon library      |
| bcryptjs      | 3.0.3   | Password hashing  |
| jose          | 6.1.3   | JWT signing       |
| nodemailer    | 8.0.1   | Email sending     |
| recharts      | 3.7.0   | Charts/analytics  |
| @dnd-kit/core | 6.3.1   | Drag & drop       |
| pg            | 8.18.0  | PostgreSQL driver |

---

## 🔑 Key Features

### ✅ Implemented

1. **Multi-Tenant Admin Dashboard**
   - Business/tenant management
   - Subscription approval workflows
   - Audit logging
   - System settings

2. **Merchant Dashboard**
   - Order Kanban board management
   - Product and inventory management
   - Customer relationship tracking
   - Chat/messaging interface
   - Settings (billing, team, notifications)

3. **WhatsApp Integration**
   - Meta Embedded Signup flow
   - Connection management
   - Message receiving via webhooks
   - Business profile setup

4. **Security & Permissions**
   - JWT-based authentication
   - Role-based access control
   - Permission matrix system
   - OTP support

5. **Subscription & Billing**
   - Plan management
   - Payment proof tracking
   - Subscription state tracking
   - Pending/active/expired states

6. **Audit Trail**
   - Complete action logging
   - ISO timestamps
   - Admin user tracking

---

## ⚙️ Environment Variables

Required for local development:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/assan_ecommerce

# Meta/Facebook (WhatsApp)
NEXT_PUBLIC_FB_APP_ID=your_fb_app_id
NEXT_PUBLIC_FB_CONFIG_ID=your_fb_config_id

# Email (Nodemailer)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

# JWT
JWT_SECRET=your_jwt_secret_key

# Optional
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

---

## 🔄 Recent Migrations

- `20260224043159_add_chat_session_label` - Chat session labels
- `20260224030717_add_otp_and_warnings` - OTP and warning system
- `20260223055941_updated_pending_subscription` - Subscription updates
- `20260223055333_add_pending_subscription` - Pending state support
- `20260223050019_add_account_manager` - Account manager fields
- `20260223041137_add_product_category` - Product categorization
- `20260220053647_add_user_permissions` - RBAC matrix
- `20260211094920_add_whatsapp_columns` - WhatsApp integration

---

## 📝 Notes for External Agents

### Important Context

1. **Multi-Tenant**: All queries should filter by `businessId` or current business context
2. **Server Actions**: Mutations use `"use server"` functions in Next.js App Router
3. **Component Scope**: Mark interactive components with `"use client"`
4. **Path Alias**: `@/*` resolves to project root (configured in `tsconfig.json`)
5. **WhatsApp Integration**: Uses Meta's Embedded Signup, webhook at `/api/webhook/whatsapp`
6. **Type Generation**: Prisma generates types to `app/generated/prisma/` - do NOT edit manually

### Common File Locations

- **Auth logic**: `lib/auth.ts`, `app/(auth)/actions.ts`
- **Database queries**: `lib/prisma.ts` (singleton client)
- **Server actions**: Files with `"use server"` directive
- **UI Components**: Mostly in `components/` organized by role (admin/merchant)
- **API Routes**: Files named `route.ts` in `app/api/`

### Testing WhatsApp Locally

1. Use Meta's Webhook Simulator or tunneling (ngrok) to test webhooks
2. Webhook validation requires correct token in `app/api/webhook/whatsapp/route.ts`
3. Connection details stored in `Business.wabaId`, `whatsappPhoneId`, `accessToken`

---

## 📞 Support & Development

- **Framework Docs**: https://nextjs.org/docs
- **Database**: https://www.prisma.io/docs
- **Styling**: https://tailwindcss.com/docs
- **Meta API**: https://developers.facebook.com/docs/whatsapp
- **Icons**: https://lucide.dev

---

**Last Updated**: February 24, 2026  
**Created for**: External AI Agents & Development Reference
