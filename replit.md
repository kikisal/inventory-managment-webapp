# Bar Inventory Management System

A modern, responsive web application for managing bar and restaurant inventory with real-time stock tracking and alerts.

## Overview

This application provides a comprehensive inventory management solution designed specifically for bars and restaurants. It features a dark-mode optimized interface with intuitive controls for tracking spirits, beer, wine, mixers, and garnishes.

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/       # Shadcn UI components
│   │   │   ├── theme-provider.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   ├── summary-cards.tsx
│   │   │   ├── low-stock-alert.tsx
│   │   │   ├── add-item-dialog.tsx
│   │   │   ├── edit-item-dialog.tsx
│   │   │   ├── stock-adjust-dialog.tsx
│   │   │   ├── quick-adjust-dialog.tsx
│   │   │   └── inventory-table.tsx
│   │   ├── pages/
│   │   │   └── dashboard.tsx
│   │   ├── App.tsx
│   │   └── index.css
│   └── index.html
├── server/                # Backend Express server
│   ├── index.ts
│   ├── routes.ts         # API endpoints
│   ├── storage.ts        # In-memory data storage
│   └── vite.ts
├── shared/
│   └── schema.ts         # Shared TypeScript types and Zod schemas
└── design_guidelines.md  # Design system documentation
```

## Features

### Dashboard
- **Summary Cards**: Real-time metrics showing total items, low stock warnings, active categories, and recent updates
- **Low Stock Alerts**: Dismissible banner highlighting items that need restocking
- **Quick Actions Panel**: One-click access to add items, adjust stock, and export reports

### Inventory Management
- **CRUD Operations**: Add, edit, and delete inventory items
- **Stock Adjustments**: Quick adjust stock levels with visual feedback
- **Search & Filter**: Real-time search and category-based filtering
- **Responsive Table**: Desktop table view with mobile-optimized card layout

### Categories Supported
- Spirits
- Beer
- Wine
- Mixers
- Garnishes

### Units Available
- ml (milliliters)
- L (liters)
- bottles
- cases
- units

## Architecture

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state
- **UI Components**: Shadcn UI built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Forms**: React Hook Form with Zod validation
- **Theme**: Dark/Light mode with system preference detection

### Backend
- **Server**: Express.js
- **Storage**: In-memory storage (MemStorage)
- **Validation**: Zod schemas for request validation
- **API**: RESTful endpoints with proper error handling

### Data Flow
1. Frontend components use TanStack Query to fetch data
2. Mutations trigger API requests to Express backend
3. Backend validates requests with Zod schemas
4. Storage layer handles CRUD operations
5. Responses return updated data
6. TanStack Query invalidates cache and refetches
7. UI updates automatically with new data

## API Endpoints

### Inventory Items
- `GET /api/inventory` - Fetch all inventory items
- `GET /api/inventory/:id` - Fetch single item by ID
- `POST /api/inventory` - Create new inventory item
- `PUT /api/inventory/:id` - Update existing item
- `DELETE /api/inventory/:id` - Delete item
- `PATCH /api/inventory/:id/adjust` - Adjust stock quantity

### Request/Response Examples

**Create Item:**
```json
POST /api/inventory
{
  "name": "Jack Daniel's Tennessee Whiskey",
  "category": "Spirits",
  "quantity": 24,
  "unit": "bottles",
  "lowStockThreshold": 12
}
```

**Adjust Stock:**
```json
PATCH /api/inventory/:id/adjust
{
  "adjustment": -5  // Decrease by 5
}
```

## Design System

The application follows a comprehensive design system documented in `design_guidelines.md`:

- **Typography**: Inter font family with clear hierarchy
- **Colors**: Dark mode optimized with high contrast
- **Spacing**: Consistent using Tailwind units (4, 6, 8, 12)
- **Components**: Shadcn UI for consistent, accessible components
- **Interactions**: Subtle hover/active states using elevation system
- **Responsive**: Mobile-first approach with breakpoints at 768px and 1024px

## Recent Changes

**November 15, 2024** - Initial Release
- Implemented complete inventory management system
- Added Quick Actions Panel with Add Item, Quick Adjust, and Export Report
- Built responsive dashboard with summary cards and low stock alerts
- Created comprehensive inventory table with search and filtering
- Added dark/light theme support
- Implemented all CRUD operations with validation
- Completed end-to-end testing of all features

## Development

### Running the Application
The application runs on port 5000 with both frontend and backend served together:
```bash
npm run dev
```

### Tech Stack
- **Node.js**: Runtime environment
- **TypeScript**: Type safety throughout
- **React**: UI framework
- **Express**: Backend server
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Zod**: Schema validation
- **TanStack Query**: Data fetching and caching

### Key Dependencies
- `@tanstack/react-query` - Server state management
- `wouter` - Client-side routing
- `react-hook-form` - Form handling
- `@hookform/resolvers` - Zod integration for forms
- `lucide-react` - Icon library
- `drizzle-orm` - Type-safe ORM (for future database integration)
- `drizzle-zod` - Schema to Zod conversion

## Testing

The application has been thoroughly tested with end-to-end playwright tests covering:
- Dashboard loading and display
- Summary cards and metrics
- Quick Actions Panel functionality
- Add, edit, and delete operations
- Stock adjustment workflows
- Search and filter functionality
- Theme switching
- Mobile responsive behavior

## Future Enhancements

Potential features for future iterations:
- Persistent database storage (PostgreSQL integration ready)
- User authentication and authorization
- Multi-location inventory tracking
- Barcode/QR code scanning
- Advanced analytics and reporting
- Supplier management
- Automatic reorder suggestions
- Historical usage tracking
- Print-friendly reports

## Notes

- The application starts with 12 pre-seeded sample items for demonstration
- Some items are intentionally set below low stock thresholds to demonstrate alerts
- Default theme is dark mode, optimized for bar/restaurant environments
- Export functionality generates CSV files with current inventory snapshot
- All forms include comprehensive validation with helpful error messages
