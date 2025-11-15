# Bar Inventory Management System

## Overview

A modern, productivity-focused inventory management application designed for bars and restaurants. The system enables staff to track spirits, beer, wine, mixers, and garnishes with real-time stock monitoring, low stock alerts, and quick adjustment capabilities. Built with a design philosophy inspired by Linear, Vercel Dashboard, and Stripe Dashboard, prioritizing information density, scan-optimized layouts, and rapid data updates.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, using Vite as the build tool and development server

**Routing**: Wouter for lightweight client-side routing (single-page application)

**State Management**: 
- TanStack Query (React Query) for server state management with automatic caching and invalidation
- React Hook Form for form state with Zod validation via `@hookform/resolvers`

**UI Component System**:
- shadcn/ui component library (New York variant) with Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Class Variance Authority (CVA) for component variant management
- Dark mode optimized with theme provider

**Design Tokens**:
- Typography: Inter font family from Google Fonts
- Color system: CSS custom properties with HSL values for both light/dark themes
- Spacing: Tailwind's scale-based system (units of 2, 4, 6, 8, 12)
- Border radius: Custom values (lg: 9px, md: 6px, sm: 3px)

**Key Design Patterns**:
- Component composition using Radix UI slots
- Controlled form inputs with validation feedback
- Optimistic UI updates with query invalidation
- Toast notifications for user feedback
- Responsive grid layouts (mobile-first approach)

### Backend Architecture

**Runtime**: Node.js with Express.js web framework

**API Design**: RESTful endpoints under `/api` prefix
- GET `/api/inventory` - List all inventory items
- GET `/api/inventory/:id` - Get single item
- POST `/api/inventory` - Create new item
- PUT `/api/inventory/:id` - Update existing item
- DELETE `/api/inventory/:id` - Delete item
- POST `/api/inventory/:id/adjust` - Adjust stock levels

**Data Validation**: Zod schemas shared between frontend and backend via `shared/schema.ts`

**Development Features**:
- Request/response logging middleware
- JSON body parsing with raw body preservation
- Vite integration for HMR in development

### Data Storage

**Database**: PostgreSQL via Neon serverless driver (`@neondatabase/serverless`)

**ORM**: Drizzle ORM with TypeScript schema definitions
- Schema location: `shared/schema.ts`
- Migration output: `./migrations`
- Schema push via `drizzle-kit push`

**Data Model**:
```typescript
inventoryItems table:
- id: UUID (primary key, auto-generated)
- name: text (required)
- category: text (enum: Spirits, Beer, Wine, Mixers, Garnishes)
- quantity: integer (default: 0)
- unit: text (enum: ml, L, bottles, cases, units)
- lowStockThreshold: integer (default: 10)
```

**Storage Implementation**: Dual storage approach
- Production: PostgreSQL database
- Development fallback: In-memory storage (`MemStorage` class) with seed data

### External Dependencies

**Core Runtime Dependencies**:
- `@neondatabase/serverless` - Neon PostgreSQL client
- `drizzle-orm` - TypeScript ORM for database operations
- `drizzle-kit` - Database migration and schema management tools
- `express` - Web server framework
- `vite` - Build tool and dev server
- `react` & `react-dom` - UI framework

**UI & Styling**:
- `@radix-ui/*` packages - Accessible component primitives (20+ components)
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Component variant styling
- `lucide-react` - Icon library

**Form & Validation**:
- `react-hook-form` - Form state management
- `zod` - Schema validation
- `@hookform/resolvers` - Integration between react-hook-form and zod
- `drizzle-zod` - Generate Zod schemas from Drizzle tables

**Developer Experience**:
- `tsx` - TypeScript execution for development
- `esbuild` - Production bundler for server code
- `@replit/vite-plugin-*` - Replit-specific development tools (error overlay, cartographer, dev banner)

**Date Handling**:
- `date-fns` - Date utility library

**Session Storage**:
- `connect-pg-simple` - PostgreSQL session store for Express

**Build & Deployment**:
- Scripts: `dev` (development), `build` (production), `start` (production server), `db:push` (schema migration)
- Build outputs: Client to `dist/public`, Server to `dist/index.js`
- Module format: ESM throughout