# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Key commands

This is a Vite + React + TypeScript single-page app.

- Install dependencies (first time or after `package.json` changes):
  ```bash
  npm install
  ```
- Start the dev server (hot reload on port 3000):
  ```bash
  npm run dev
  ```
- Create a production build:
  ```bash
  npm run build
  ```
- Preview the production build locally (after `npm run build`):
  ```bash
  npm run preview
  ```

Notes:
- There are currently **no lint or test scripts** defined in `package.json`. If you add them, document the commands here.

## Environment configuration & Gemini API

- The app relies on a Gemini API key exposed at build time via Vite.
- `vite.config.ts` reads `GEMINI_API_KEY` from the environment and injects it as:
  - `process.env.API_KEY`
  - `process.env.GEMINI_API_KEY`
- `services/geminiService.ts` uses `process.env.API_KEY` to construct a `GoogleGenAI` client and generate stock insights.
- To run the app with Gemini enabled:
  - Ensure `GEMINI_API_KEY` is set in your environment (or in an `.env` file that Vite loads in your workflow).
  - If `GEMINI_API_KEY` is missing, `getStockInsights` will early-return a "API Key not configured" message.

## High-level architecture

### Entry points & build system

- `index.html` is the HTML shell and includes:
  - Tailwind CSS via CDN with an inline `tailwind.config` customizing colors (`ocean`, `teal`, `deep`, etc.).
  - Global styles for the body, scrollbar, and the `glass-panel` / glassmorphism effect.
  - An import map pointing to CDN-hosted versions of React, `lucide-react`, `recharts`, `@google/genai`, and `react-router-dom`.
  - A link to `/index.css` for additional styling and a `<script type="module" src="/index.tsx">` as the JS entry.
- `index.tsx` bootstraps the React app by rendering `<App />` into the `#root` element.
- `App.tsx` wires up routing and the main layout, using `HashRouter` so routes are hash-based (important if you add new routes).
- `vite.config.ts`:
  - Configures the dev server (port 3000, `host: '0.0.0.0'`).
  - Adds the React plugin.
  - Defines env mappings for the Gemini key.
  - Adds an alias `@` pointing to the project root (used for absolute-style imports if you introduce them).
- `tsconfig.json` is minimal and configured for modern ES modules, React JSX, and bundler-style module resolution.

### Routing, layout, and auth flow

Implemented in `App.tsx` + `components/Navbar.tsx` + pages under `pages/`.

- Routing is driven by `HashRouter` + `Routes`/`Route` from `react-router-dom`:
  - `/` → `LandingPage` (marketing-style landing screen).
  - `/auth` → `Auth` (login/signup/OTP flow).
  - `/dashboard`, `/products`, `/operations`, `/move-history`, `/settings`, `/profile` → main application pages.
- `App.tsx` keeps an `isAuthenticated` boolean in local state and exposes a `ProtectedRoute` wrapper. All main app routes are wrapped in `ProtectedRoute` and will redirect to `/auth` if the user is not authenticated.
- `Auth.tsx` accepts `setIsAuthenticated` and is responsible for simulating login/signup/OTP verification. On successful "auth", it sets `isAuthenticated` to `true` and navigates to `/dashboard`.
- `Navbar` behavior:
  - Hidden on the `/auth` route.
  - Receives `isLanding` to hide itself on the pure landing page layout.
  - Displays nav links for the main application routes, a notifications dropdown (`NotificationDropdown`), and an avatar menu for profile/settings/logout.
  - Uses `useLocation` to highlight the active route.
- Global layout:
  - `App.tsx` defines the deep background gradients and glassmorphism ambiance.
  - Non-landing, non-auth routes render inside a centered container with top padding to account for the floating navbar.

### Domain model & shared types

Centralized in `types.ts`:

- `Product` describes inventory items: id, name, `sku`, `category`, `stock`, `minStock`, `price`, `status` (`In Stock` | `Low Stock` | `Out of Stock`), `image`, `location`, optional `barcode`, `supplier`, `description`, `unit`, `warehouses`, and `cost`.
- `OperationType` and `OperationStatus` model stock operations (receipt, delivery, transfer, adjustment) and their lifecycle (Draft → Waiting → Ready → Done/Cancelled).
- `OperationItem` and `Operation` capture movements at the document level: reference, type, status, `scheduleDate`, unified `contact` field, source/destination locations, items, and metadata like `responsible`.
- `StockMovement` captures historical moves for the move history views (date/time/product/quantity, from/to, status).

These types are consumed across `Dashboard`, `Products`, `Operations`, `MoveHistory`, and various modals. When you introduce new inventory concepts or extend existing entities, update `types.ts` first and then propagate changes to the relevant pages/components.

### Feature pages

All feature screens live under `pages/` and generally follow a pattern of:
- Local mock data at the top of the file.
- UI composed from shared UI primitives (e.g., `GlassCard`, `Button`, `Badge`) and icons from `lucide-react`.
- Tailwind-based layout and styling.

Key pages:

- `LandingPage.tsx`:
  - Public marketing/hero page for "StockMaster" with 3D placeholder visuals (`SplinePlaceholder`) and feature cards.
  - Primary call-to-action routes to `/auth`.

- `Auth.tsx`:
  - Implements a three-step auth UI (login, signup, OTP verification) entirely on the client using timeouts to simulate network calls.
  - On successful login/verification, calls `setIsAuthenticated(true)` and redirects to `/dashboard`.

- `Dashboard.tsx`:
  - Uses `Operation` mock data to compute KPI cards for receipts and deliveries (to process and late counts, based on `scheduleDate` vs today).
  - Renders a stock movement `AreaChart` and a category distribution `PieChart` via `recharts`.
  - Serves as a high-level operational overview; it does not fetch data from a backend yet.

- `Products.tsx`:
  - Defines a `mockProducts` array of `Product` objects.
  - Provides search, filters (categories, status, price range), sort options (name/stock/price), and grid vs list view modes.
  - Uses `ProductModal` for add/edit, and `ImportModal` for import workflows; selection handling supports bulk actions.
  - `TiltCard`, `GlassCard`, `Badge`, and `Button` compose the card and table layouts.

- `Operations.tsx`:
  - Maintains a list of `Operation` objects in component state.
  - Sidebar tabs switch between `Receipt`, `Delivery`, `Transfer`, and `Adjustment`, and `useLocation().state` can preselect a tab (e.g., from `Dashboard` quick links).
  - View can toggle between:
    - List/table view of operations.
    - Kanban view, grouped by `OperationStatus` with per-column counts.
  - `CreateOperationModal` drives creation/validation of new operations and pushes newly validated operations into state, also triggering `SuccessOverlay` to show a confirmation.
  - Contains logic to mark operations late when `scheduleDate` is before today and status is not Done/Cancelled.

- `MoveHistory.tsx`:
  - Uses `StockMovement` mock data to show a history of moves.
  - Supports list/table and kanban views, including derived styling for incoming vs outgoing quantities.
  - Filters by reference/contact/product via a search input.

- `Settings.tsx`, `Profile.tsx` (and any other supporting pages not described here) follow similar UI composition patterns using shared components and mock data.

### UI primitives and shared components

Key reusable UI building blocks live under `components/`:

- Layout & cards:
  - `components/ui/GlassCard.tsx` wraps content in the global `glass-panel` style, adding padding and hover effects when requested.
  - `TiltCard` (in `components/ui/TiltCard.tsx`) provides a parallax/tilt interaction wrapper for product cards.
- Navigation & chrome:
  - `components/Navbar.tsx` implements the floating navbar, including responsive layout, mobile nav, user dropdown, and notifications.
  - `components/ui/NotificationDropdown.tsx` renders a notifications panel driven by local mock notifications.
- Inputs & buttons:
  - `components/ui/Button.tsx` (not shown here but used extensively) defines variants such as `primary`, `ghost`, `glass`, `outline`, plus loading states.
  - `components/ui/Badge.tsx` provides status labels for stock and operations, mapping semantic variants (`success`, `warning`, `danger`, etc.) to consistent colors.
- Inventory-specific modals:
  - `components/ProductModal.tsx` implements a multi-tab form (basic info, inventory, details) for adding/editing products, including image upload placeholder and per-warehouse stock configuration.
  - `components/CreateOperationModal.tsx` provides a multi-step creation flow for operations, including:
    - Auto-generated references based on `OperationType`.
    - A line items table using mock product definitions and mock stock levels.
    - Status transitions (Draft → Waiting/Ready → Done) with different behavior for receipts vs deliveries.
  - `components/ImportModal.tsx` and `components/SuccessOverlay.tsx` provide supporting UX around imports and success feedback.

When adding new screens or flows, prefer to compose them from these primitives to maintain consistency in the glassmorphism design and UX patterns.

### AI integration

- Implemented in `services/geminiService.ts` using `@google/genai`.
- `getStockInsights(stockData: string)`:
  - Guards on `apiKey` and returns a user-facing error string if not configured.
  - Calls `ai.models.generateContent` with the `gemini-2.5-flash` model to analyze inventory data and suggest reorder points.
  - Returns `response.text` on success or a fallback error string if the call throws.
- Currently, there is no complex prompt engineering or multi-turn conversation—this service is a simple helper for stock analysis. If you expand AI usage, consider centralizing new helpers alongside this service and reusing the same env wiring.

## Notes for future Warp agents

- If you introduce real backend APIs (for inventory, operations, history, or auth), replace the various `mock*` arrays in `Dashboard.tsx`, `Products.tsx`, `Operations.tsx`, and `MoveHistory.tsx` with calls through a dedicated service layer (e.g., under `services/`), keeping view components mostly declarative.
- When you add new routes, update both `App.tsx` (for routing and `ProtectedRoute` behavior) and `Navbar.tsx` (for navigation links and highlighting) so the UX remains coherent.
- Extend `types.ts` first when evolving the domain model, then propagate the new fields to the relevant pages and modals so TypeScript can help surface all necessary updates.
- Keep Vite env variable names and `geminiService.ts` expectations in sync; if you change which env var holds the Gemini key, update both `vite.config.ts` and the service to avoid silent misconfiguration.
