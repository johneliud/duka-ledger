# Duka Ledger

This is an offline-first shop bookkeeper that serves as a simple sales & expense tracker for market vendors and kiosk owners who can't rely on cloud accounting tools. They record sales, stock, and debts locally all day, then it syncs to a shared ledger when they hit WiFi at home.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/johneliud/duka-ledger
   cd duka-ledger
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create `.env` with your Supabase credentials and JWT secret

4. Start the backend server:
   ```bash
   npm run server
   ```

5. Start the development server (in another terminal):
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── db/           # PowerSync schema, instance, and connector
├── pages/        # Dashboard, RecordSale, Expenses, DebtBook
├── components/   # SyncBadge, BottomNav, AmountInput, etc.
├── hooks/        # useSync, useNetworkStatus, useDB
├── lib/          # utils, formatters, constants
└── types/        # TypeScript interfaces
```

## Path Aliases

The project uses `@/` as an alias for the `src/` directory. Import modules like:

```typescript
import { MyComponent } from '@/components/MyComponent'
import { useSync } from '@/hooks/useSync'
```