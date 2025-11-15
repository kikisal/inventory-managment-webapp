# Bar Inventory Management App - Design Guidelines

## Design Approach
**Selected Approach**: Design System (Productivity-Focused)  
**Inspiration**: Linear, Vercel Dashboard, Stripe Dashboard  
**Rationale**: Utility-driven application prioritizing data visibility, quick actions, and efficiency over visual storytelling.

## Core Design Principles
- Information density with breathing room
- Scan-optimized layouts for quick stock checks
- Action-first interface for rapid updates
- Dark-mode optimized with high contrast for bar/restaurant environments

## Typography
**Font Family**: Inter (Google Fonts)
- **Headings**: 600 weight, tracking-tight
- **Body/Data**: 400 weight, tracking-normal
- **Labels/Metadata**: 500 weight, text-sm, uppercase tracking-wide
- **Hierarchy**: text-3xl (page titles) → text-xl (section headers) → text-base (content) → text-sm (labels)

## Layout System
**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12
- Component padding: p-4 to p-6
- Section spacing: gap-6 to gap-8
- Card margins: m-4
- Container max-width: max-w-7xl with px-4 to px-8

**Grid Structure**:
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Inventory table: Full-width responsive table with horizontal scroll on mobile
- Summary metrics: 3-4 column grid on desktop, stack on mobile

## Component Library

### Navigation
Top horizontal navigation bar with:
- Logo/brand name (left)
- Main nav items: Dashboard, Inventory, Reports (center/left)
- Search bar (center-right)
- User menu/settings (right)
- Fixed position with subtle border-bottom

### Dashboard Cards
**Stock Summary Cards** (4-column grid):
- Total Items count
- Low Stock warnings (with alert badge)
- Categories count
- Recent Updates
- Each card: rounded corners, subtle border, icon + metric + label layout

**Quick Actions Panel**:
- Prominent "Add Item" button (primary CTA)
- "Quick Adjust" button (secondary)
- "Export Report" link (tertiary)
- Horizontal button group with gap-4

### Inventory Table
**Columns**: Item Name | Category | Quantity | Unit | Status | Actions
- Sticky header row
- Alternating row background (subtle)
- Status indicators: Color-coded badges (red for low stock, yellow for moderate, green for good)
- Actions: Icon buttons for edit/delete (inline, right-aligned)
- Sortable columns with sort indicators
- Mobile: Card layout stacking key info

### Category Filters
Horizontal pill-style buttons:
- All | Spirits | Beer | Wine | Mixers | Garnishes
- Active state with distinct styling
- Positioned above inventory table

### Forms (Add/Edit Item)
**Layout**: Single-column form in modal or slide-over panel
- Input fields: Full-width with clear labels above
- Category: Dropdown select
- Quantity: Number input with +/- buttons
- Unit: Dropdown (ml, L, bottles, cases)
- Buttons: Primary "Save" + Secondary "Cancel" (right-aligned)

### Search & Filter Bar
- Search input with icon (magnifying glass)
- Real-time filtering
- Clear/reset button when active
- Positioned prominently at top of inventory section

### Low Stock Alerts
Banner component at top of dashboard:
- Alert icon + message + "View Items" link
- Dismissible with × button
- Conditional visibility (only when low stock exists)

### Empty States
For empty inventory or search results:
- Icon illustration
- "No items found" heading
- Descriptive text + "Add Item" CTA

## Visual Treatment
**Dark Mode Base** (default):
- Deep background with lighter surface cards
- High contrast text for readability in dim bar environments
- Subtle borders for separation
- Emphasis through opacity variations rather than heavy colors

**Borders & Shadows**:
- Cards: border with rounded-lg
- Buttons: No heavy shadows, use border for definition
- Tables: border-b for row separation
- Modals: Elevated with backdrop blur

## Responsive Behavior
**Mobile (< 768px)**:
- Single column layouts
- Table converts to card-based list
- Navigation collapses to hamburger menu
- Floating "Add Item" button (bottom-right)

**Tablet (768px - 1024px)**:
- 2-column dashboard cards
- Full table with horizontal scroll

**Desktop (> 1024px)**:
- 4-column dashboard grid
- Full-width table with all columns visible
- Side-by-side forms where appropriate

## Images
**No hero images required** - This is a utility dashboard, not a marketing page. All visual interest comes from data visualization and UI components.

## Animations
Minimal and purposeful only:
- Smooth transitions on hover states (transition-colors duration-200)
- Modal/slide-over entry (slide-in-right for forms)
- No page transitions or scroll effects