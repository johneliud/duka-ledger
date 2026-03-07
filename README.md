# Duka Ledger

> **Offline-first shop bookkeeper for market vendors and kiosk owners**

A local-first Progressive Web App (PWA) that enables small business owners in Kenya to track sales, inventory, expenses, and debts without requiring constant internet connectivity. Record transactions all day offline, then sync to a shared ledger when WiFi is available.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)

![Duka Ledger Screenshot](public/imgs/Screenshot.jpg)

---

## Problem Statement

Market vendors and kiosk owners in Kenya face unique challenges:
- **Unreliable connectivity**: Mobile data is expensive and often unavailable
- **Quick transactions**: Need to record sales in under 5 seconds
- **Shared operations**: Multiple family members run the same shop
- **Limited tech literacy**: Simple, intuitive interfaces required
- **Data costs**: Can't afford apps that require constant internet

Traditional cloud-based accounting tools fail in these environments. Duka Ledger solves this with a **local-first architecture** that works completely offline.

---

## Key Features

### Core Functionality
- **Sales Recording**: Quick sale entry with product selection, quantity, and payment method
- **Inventory Management**: Track stock levels with automatic deduction on sales
- **Expense Tracking**: Record business expenses by category (rent, utilities, supplies, etc.)
- **Debt Book**: Manage customer credit with payment tracking
- **Analytics Dashboard**: Visual insights into sales trends, top products, and profit margins
- **Multi-user Support**: Shop owners can invite family members via invite codes

### Offline-First Capabilities
- **Full offline CRUD**: Create, read, update, delete operations work without internet
- **Automatic sync**: Changes sync automatically when connection is restored
- **Conflict resolution**: Delta updates ensure no data loss from concurrent edits
- **Persistent storage**: Data survives browser restarts and crashes
- **Sync status indicator**: Real-time badge shows pending changes and sync state

### Localization & Accessibility
- **Multi-language**: English and Swahili (Kiswahili) support
- **Dark/Light themes**: Comfortable viewing in any lighting condition
- **Responsive design**: Works on phones, tablets, and desktops
- **PWA installable**: Add to home screen for app-like experience
- **Guided onboarding**: Interactive tour for first-time users

### Business Intelligence
- **Sales analytics**: Daily, weekly, monthly revenue trends
- **Product performance**: Best-selling items and stock alerts
- **Expense breakdown**: Category-wise spending analysis
- **Profit calculations**: Automatic margin calculations
- **Export capabilities**: Download reports as CSV or PDF

---

## Architecture

### Technology Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- React Router (routing)
- Recharts (charts)
- Lucide React (icons)

**Local Database:**
- PowerSync Web SDK
- SQLite (via IndexedDB)

**Backend:**
- Express.js (Node.js)
- PostgreSQL (Supabase)
- JWT authentication
- bcrypt (PIN hashing)

**Sync Engine:**
- PowerSync Service
- WebSocket (real-time sync)

### Data Flow

```
┌─────────────────┐
│   React UI      │ ← User records sale
└────────┬────────┘
         ↓
┌─────────────────┐
│ Local SQLite    │ ← Instant write (offline-capable)
│  (PowerSync)    │
└────────┬────────┘
         ↓
┌─────────────────┐
│  CRUD Queue     │ ← Changes queued for sync
└────────┬────────┘
         ↓ (when online)
┌─────────────────┐
│  Express API    │ ← Batch upload
└────────┬────────┘
         ↓
┌─────────────────┐
│  PostgreSQL     │ ← Persistent storage
└────────┬────────┘
         ↓
┌─────────────────┐
│  PowerSync CDC  │ ← Change notification
└────────┬────────┘
         ↓
┌─────────────────┐
│ Other Devices   │ ← Sync to family members
└─────────────────┘
```

---

## Database Schema

### Auth Layer (PostgreSQL only)
- **users**: Individual credentials (name, PIN hash)
- **shops**: Business entities (name, invite code)
- **shop_members**: User-shop relationships (role: owner/member)

### Data Layer (Synced to devices)
- **products**: Product catalog (name, price, stock, category)
- **sales**: Transaction records (product, quantity, total, payment method)
- **expenses**: Business expenses (amount, category, description)
- **debts**: Customer credit tracking (customer, amount, payments)

### Key Design Decisions

**1. Shop-scoped data (not user-scoped)**
- Data belongs to the shop, not individuals
- Family members can leave without taking data
- Simplifies sync rules and permissions

**2. Delta updates for numeric fields**
```sql
-- Conflict-safe across devices
UPDATE products SET stock_count = stock_count - 2
UPDATE debts SET amount_paid = amount_paid + 100
```
- Two devices can modify the same record offline
- Changes merge correctly when synced
- No "last write wins" data loss

**3. Append-only sales ledger**
- Sales records are never modified or deleted
- Corrections done via reversal entries
- Preserves audit trail and financial integrity

**4. Denormalized totals**
- Sale total stored on record (not calculated)
- Price changes don't rewrite history
- Historical accuracy preserved

---

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier works)
- PowerSync account (free tier works)

### 1. Clone Repository
```bash
git clone https://github.com/johneliud/duka-ledger
cd duka-ledger
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create `.env` file in the root directory:

```env
# Supabase Configuration
SUPABASE_PROJECT_URL=https://your-project.supabase.co
SUPABASE_ANON_PUBLIC=your-anon-key

# PowerSync Configuration
POWERSYNC_URL=https://your-instance.powersync.com

# Backend Configuration
PORT=3001
JWT_SECRET=your-secret-key-min-32-chars
SUPABASE_DB_URI=postgresql://user:pass@host:5432/dbname
```

### 4. Database Setup

Run PostgreSQL migrations:
```bash
npm run db:migrate
```

Or manually execute SQL from `guide/SCHEMA.md`

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

App will be available at `http://localhost:5173`

### 6. Build for Production
```bash
npm run build
npm run preview  # Test production build
```

---

## Project Structure

```
duka-ledger/
├── src/
│   ├── components/       # React components
│   │   ├── Header.tsx
│   │   ├── SyncBadge.tsx
│   │   ├── LoginModal.tsx
│   │   └── ...
│   ├── pages/           # Route pages
│   │   ├── Dashboard.tsx
│   │   ├── RecordSale.tsx
│   │   ├── Products.tsx
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useTheme.ts
│   │   ├── useNetworkStatus.ts
│   │   └── ...
│   ├── db/              # PowerSync configuration
│   │   ├── powersync.ts
│   │   ├── schema.ts
│   │   └── connector.ts
│   ├── lib/             # Utilities and contexts
│   │   ├── AuthProvider.tsx
│   │   ├── NotificationProvider.tsx
│   │   └── formatters.ts
│   ├── types/           # TypeScript interfaces
│   ├── index.css        # Global styles + theme
│   └── main.tsx         # App entry point
├── server/              # Express backend
│   ├── index.ts
│   ├── routes/
│   └── db.ts
├── docs/                # Documentation
│   ├── ARCHITECTURE.md
│   ├── CONFLICT_RESOLUTION.md
│   └── DEMO_SCRIPT.md
├── guide/               # Development guides
│   ├── SCHEMA.md
│   ├── API_ENDPOINTS.md
│   └── DESIGN_DECISIONS.md
└── public/              # Static assets
```

### Path Aliases

The project uses `@/` as an alias for `src/`:

```typescript
import { Header } from '@/components/Header'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/db/powersync'
```

---

## Usage Guide

### First-Time Setup

1. **Create Shop** (requires internet):
   - Enter your name and ID number
   - Create a 4-digit PIN
   - Name your shop
   - Save the invite code to share with family

2. **Invite Family Members**:
   - Share the invite code (e.g., `DUKA-4821`)
   - They register with their own credentials
   - They enter the invite code to join your shop

### Daily Operations (Offline-Capable)

**Record a Sale:**
1. Navigate to "Record Sale"
2. Select product from dropdown
3. Enter quantity sold
4. Choose payment method (Cash/M-Pesa)
5. Click "Record Sale"
6. Stock automatically deducted

**Add Product:**
1. Go to "Products"
2. Click "Add Product"
3. Enter name, price, stock, category
4. Save

**Track Expenses:**
1. Navigate to "Expenses"
2. Click "Add Expense"
3. Enter amount, category, description
4. Save

**Manage Debts:**
1. Go to "Debt Book"
2. Click "Add Debt"
3. Enter customer name and amount owed
4. Record payments as they come in

**View Analytics:**
1. Navigate to "Analytics"
2. View sales trends, top products, expenses
3. Export reports as CSV or PDF

---

## Security

- **PIN Authentication**: 4-digit PINs hashed with bcrypt (10 rounds)
- **JWT Tokens**: Secure session management with expiry
- **Row Level Security**: PostgreSQL RLS policies enforce data isolation
- **HTTPS Only**: Production deployment requires SSL
- **No Plain Text Storage**: Sensitive data encrypted at rest

---

## Offline Behavior

### What Works Offline
Record sales, expenses, debts  
Add/edit products  
View all data and analytics  
Export reports  
Change settings and theme  

### What Requires Internet
❌ Initial registration/login  
❌ Joining a shop via invite code  
❌ Syncing data to other devices  

### Sync Process
1. App detects network connection
2. Queued changes uploaded in batches
3. Server validates and writes to PostgreSQL
4. Changes propagate to other devices
5. Sync badge updates to "Synced"

---

## Testing

### Manual Testing
```bash
# Start dev environment
npm run dev

# Test offline mode
1. Open DevTools → Network tab
2. Set throttling to "Offline"
3. Record sales, add products
4. Go back online
5. Verify sync badge shows "Synced"
```

### Storage Testing
```bash
# Check IndexedDB
1. Open DevTools → Application → IndexedDB
2. Inspect powersync database
3. View tables: products, sales, expenses, debts
```

---

## Documentation

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)**: System design and data flow
- **[SCHEMA.md](guide/SCHEMA.md)**: Database schema and API reference
- **[DESIGN_DECISIONS.md](guide/DESIGN_DECISIONS.md)**: Key architectural choices
- **[CONFLICT_RESOLUTION.md](docs/CONFLICT_RESOLUTION.md)**: Sync conflict handling
- **[API_ENDPOINTS.md](guide/API_ENDPOINTS.md)**: Backend API documentation

---

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/name-of-feature`)
3. Commit changes (`git commit -m 'Description of the feature'`)
4. Push to branch (`git push origin feature/name-of-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **PowerSync**: For the excellent local-first sync engine
- **Supabase**: For PostgreSQL hosting and real-time capabilities
- **Tailwind CSS**: For the utility-first styling framework
- **Lucide**: For the beautiful icon set

---

## Support

For questions or issues:
- Open an issue on GitHub

---

**Built for Kenyan entrepreneurs**