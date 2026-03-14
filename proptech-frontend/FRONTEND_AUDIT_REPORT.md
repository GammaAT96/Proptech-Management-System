# PropTech Frontend — Code Audit Report

**Project:** PropTech Management System (React + Vite + TypeScript + Tailwind)  
**Audit date:** 2026-03-14  
**Scope:** Full frontend codebase under `proptech-frontend/src/`

---

## 1. PROJECT STRUCTURE ANALYSIS

### 1.1 Folders present

| Folder        | Purpose                          | Status   |
|---------------|----------------------------------|----------|
| `src/api`     | HTTP client + API service layer  | Present  |
| `src/app`     | Router (route definitions)       | Present  |
| `src/components/common` | Loader, ErrorMessage       | Present  |
| `src/components/layout` | Sidebar, Header, DashboardLayout | Present  |
| `src/components/tickets` | TicketCard, TicketTimeline, CreateTicketDialog, AssignTechnicianDialog | Present  |
| `src/components/properties` | PropertyCard                 | Present  |
| `src/components/ui` | Stub UI primitives (card, button, input, etc.) | Present  |
| `src/context` | AuthContext                     | Present  |
| `src/hooks`   | useAuth, useTickets, useProperties, useNotifications | Present  |
| `src/lib`     | utils (cn)                       | Present  |
| `src/modules/auth` | LoginPage                    | Present  |
| `src/modules/dashboard` | DashboardPage             | Present  |
| `src/modules/tickets` | TicketsPage, TicketDetailsPage, mockActivityLogs | Present  |
| `src/modules/tasks` | MyTasksPage                  | Present  |
| `src/modules/properties` | PropertiesPage            | Present  |
| `src/modules/users` | UsersPage                    | Present  |
| `src/modules/notifications` | NotificationsPage       | Present  |
| `src/modules/activity` | ActivityLogsPage           | Present  |
| `src/types`   | user, ticket, property, notification | Present  |
| `src/utils`   | formatDate                      | Present  |

### 1.2 Architecture assessment

- **Modular design:** Feature-based split (`modules/`, `components/` by domain) is good. API, hooks, types, and context are separated.
- **Missing:** No `src/pages` alias (optional); all pages live under `modules/`. No dedicated `services/` if you want to separate from `api/`.
- **Unnecessary:** None; structure is lean.

### 1.3 Root-level files

- `src/main.tsx` — Entry; wraps app in `AuthProvider` and renders `App`.
- `src/App.tsx` — Auth gate; renders `LoginPage` or `BrowserRouter` + `DashboardLayout` + `AppRouter`.
- `src/index.css` — Tailwind v4 entry (`@import 'tailwindcss'`); correct for current setup.

---

## 2. PAGE / MODULE ANALYSIS

### 2.1 auth

| Item | Status |
|------|--------|
| **Files** | `LoginPage.tsx` |
| **Missing** | No dedicated “forgot password” or post-login redirect logic beyond `onLogin()` callback. |
| **Imports** | All resolved (Button, Input, Label, useAuth). Lucide icons were removed to avoid runtime crash; no icons currently. |
| **Unused** | `onLogin` is called but could be redundant if `AuthContext` already drives `isAuthenticated`. |
| **Incomplete** | Backend returns `{ user, token }` and `user.name`; frontend expects `accessToken` and `user.username` — see §3. |

### 2.2 dashboard

| Item | Status |
|------|--------|
| **Files** | `DashboardPage.tsx` |
| **Missing** | None for current scope. |
| **Imports** | Uses lucide-react (Ticket, AlertCircle, Clock, CheckCircle2, Building2) — same risk as LoginPage if icon usage is invalid. |
| **Unused** | — |
| **Incomplete** | “Recent Activity” uses **mock data** (`mockActivityLogs`) instead of API (e.g. aggregated ticket activity or dedicated endpoint). |

### 2.3 tickets

| Item | Status |
|------|--------|
| **Files** | `TicketsPage.tsx`, `TicketDetailsPage.tsx`, `mockActivityLogs.ts` |
| **Missing** | No dedicated route for `/tickets/:id` (details live in a dialog). Optional: `TicketEditPage` if needed. |
| **Imports** | All present; TicketDetailsPage uses TicketTimeline, which calls `getTicketActivity`. |
| **Unused** | — |
| **Incomplete** | `mockActivityLogs` is still used in DashboardPage; TicketsPage and TicketDetailsPage use real API. |

### 2.4 tasks

| Item | Status |
|------|--------|
| **Files** | `MyTasksPage.tsx` |
| **Missing** | None. |
| **Imports** | Correct (useTickets, useAuth, updateTicketStatus, TicketCard, etc.). |
| **Unused** | — |
| **Incomplete** | Technician-only guard and status update (ASSIGNED / IN_PROGRESS / DONE) implemented. |

### 2.5 properties

| Item | Status |
|------|--------|
| **Files** | `PropertiesPage.tsx` |
| **Missing** | No create/edit property API usage; “Add Property” button has no handler. |
| **Imports** | Resolved (useProperties, PropertyCard, etc.). |
| **Unused** | — |
| **Incomplete** | `POST /properties` exists in backend but is not called from frontend. |

### 2.6 users

| Item | Status |
|------|--------|
| **Files** | `UsersPage.tsx` |
| **Missing** | No create/edit user flows; “Add User” and “Edit”/“Delete” are UI-only. |
| **Imports** | getUsers, useProperties, useAuth — all correct. |
| **Unused** | — |
| **Incomplete** | User CRUD beyond GET not wired to backend. |

### 2.7 notifications

| Item | Status |
|------|--------|
| **Files** | `NotificationsPage.tsx` |
| **Missing** | No “mark all as read” backend endpoint used (frontend calls `markNotificationRead` per id). |
| **Imports** | useNotifications, markNotificationRead, formatDateTime — correct. |
| **Unused** | — |
| **Incomplete** | Header dropdown only does local state update for “mark read”; API call exists in NotificationsPage. |

### 2.8 activity

| Item | Status |
|------|--------|
| **Files** | `ActivityLogsPage.tsx` |
| **Missing** | None. |
| **Imports** | useTickets, getTicketActivity — correct. |
| **Unused** | — |
| **Incomplete** | Fetches activity per ticket and merges; no dedicated “global activity” API. |

---

## 3. API INTEGRATION CHECK

### 3.1 Backend vs frontend API coverage

| Backend endpoint | Frontend API | Hook / usage | Notes |
|------------------|-------------|-------------|--------|
| POST /auth/register | ❌ None | — | Not used in UI (users created via Swagger/backend). |
| POST /auth/login | ✅ auth.api.ts `loginRequest` | AuthContext | **Mismatch:** backend returns `token` and `user.name`; frontend expects `accessToken` and `user.username`. |
| GET /auth/me | ❌ None | — | Not used; session restore is from localStorage only. |
| POST /properties | ❌ None | — | “Add Property” not wired. |
| GET /properties | ✅ properties.api.ts | useProperties | OK. |
| GET /properties/{id} | ✅ getPropertyById | Not used in current pages | OK. |
| POST /tickets | ✅ createTicket | CreateTicketDialog | OK. |
| GET /tickets | ✅ getTickets | useTickets | OK. |
| GET /tickets/{id} | ❌ No getTicketById | — | Ticket details use list data + activity; optional. |
| PATCH /tickets/{id}/status | ✅ updateTicketStatus | TicketDetailsPage, MyTasksPage | OK. |
| POST /tickets/{id}/assign | ✅ assignTechnician | AssignTechnicianDialog | OK. |
| POST /tickets/{id}/images | ✅ uploadTicketImage | Not used in UI | CreateTicketDialog could use for existing ticket. |
| GET /tickets/{id}/activity | ✅ getTicketActivity | TicketTimeline, ActivityLogsPage | OK. |
| GET /users | ✅ getUsers | UsersPage | OK. |
| GET /users/{id} | ✅ getUserById | Not used | OK. |
| GET /users/technicians | ✅ getTechnicians | AssignTechnicianDialog | OK. |
| GET /notifications | ✅ getNotifications(userId) | useNotifications | OK. |
| PATCH /notifications/{id}/read | ✅ markNotificationRead | NotificationsPage, Header (only local state) | OK. |

### 3.2 Mock data

- **mockActivityLogs** (`src/modules/tickets/mockActivityLogs.ts`): Used in **DashboardPage** for “Recent Activity”. Rest of app uses API.
- **Recommendation:** Replace with real data (e.g. aggregate from ticket activity or a dedicated activity endpoint).

### 3.3 Axios usage

- **Instance:** `src/api/axios.ts` — `baseURL: 'http://localhost:5000'`, request interceptor adds `Authorization: Bearer <accessToken>` from localStorage. Correct.
- **Auth response mapping:** Backend returns `{ user, token }` and `user.name`. Frontend must map to `{ user: { ...user, username: user.name }, accessToken: token }` in `auth.api.ts` and persist that shape so Sidebar/Header can use `user.username`.

---

## 4. COMPONENT HEALTH CHECK

### 4.1 components/common

| Component | Status | Notes |
|-----------|--------|--------|
| Loader | OK | Uses `cn`, optional className and message. |
| ErrorMessage | OK | Shows message with icon; null-safe. |

### 4.2 components/layout

| Component | Status | Notes |
|-----------|--------|--------|
| Sidebar | **Broken** | Expects `currentPage` and `onNavigate` from parent. **App does not pass these** to DashboardLayout, so they are `undefined` → runtime error when clicking menu. Must use `useLocation` / `useNavigate` inside Sidebar (or layout) and derive page/title from router. |
| Header | OK | Receives `title` and `onMenuClick`; uses useNotifications. |
| DashboardLayout | **Broken** | Declares required props `currentPage` and `onNavigate` but **App renders `<DashboardLayout><AppRouter /></DashboardLayout>` with no props**. Layout and sidebar navigation are non-functional until layout uses router. |

### 4.3 components/tickets

| Component | Status | Notes |
|-----------|--------|--------|
| TicketCard | OK | Props: ticket, optional onClick. |
| TicketTimeline | OK | Fetches activity by ticketId; loading/error handled. |
| CreateTicketDialog | OK | Uses Dialog, form, createTicket API; Dialog stub does not support `open`/`onOpenChange` (see §7). |
| AssignTechnicianDialog | OK | Uses getTechnicians, assignTechnician; same Dialog stub limitation. |

### 4.4 components/properties

| Component | Status | Notes |
|-----------|--------|--------|
| PropertyCard | OK | Uses useAuth for manager actions; dropdown is UI-only. |

### 4.5 components/ui (stubs)

- **Dialog:** Renders children only; **does not accept `open` or `onOpenChange`**. Any controlled dialog (e.g. CreateTicketDialog, AssignTechnicianDialog) cannot close or open from state.
- **Sheet:** Same; no `open`/`onOpenChange` — mobile sidebar cannot be closed programmatically.
- **Select:** No `value`/`onValueChange`; all selects are presentational only (no real selection state).
- **Button:** Does not support `variant` or `size`; all buttons look the same.
- **DropdownMenu:** Stub; no controlled open state or positioning.
- **Badge:** Accepts `children` and `className`; `variant` not applied for status/priority colors in table.

**Recommendation:** Either implement minimal controlled behavior for Dialog, Sheet, Select (and optionally Button variants) or replace with a small headless library so that existing pages work as designed.

---

## 5. ROUTING CHECK

### 5.1 App.tsx

- Renders `LoginPage` when `!isAuthenticated`, else `BrowserRouter` > `DashboardLayout` > `AppRouter`. Correct.
- **Issue:** `DashboardLayout` is used with only `children`; required props `currentPage` and `onNavigate` are missing → layout/sidebar broken.

### 5.2 router.tsx

- Routes: `/` → redirect `/dashboard`, `/dashboard`, `/tickets`, `/my-tasks`, `/properties`, `/users`, `/notifications`, `/activity`, `*` → `/dashboard`. All module pages are mounted. Structure is correct.

### 5.3 Role-based access

- **Routes:** No route guards; all authenticated users can open any path.
- **Sidebar:** Menu items are role-based (TENANT / TECHNICIAN / MANAGER), but **navigation is broken** because `onNavigate` is undefined. When fixed, consider protecting routes (e.g. redirect TECHNICIAN from `/users` to `/my-tasks`) if required.

---

## 6. STATE MANAGEMENT CHECK

### 6.1 AuthContext

- **Flow:** login calls `loginRequest`, then sets user and accessToken in state and localStorage; logout clears both. Hydration from localStorage on mount. Correct except for **login response shape** (see §3).
- **Token storage:** Key `accessToken`; interceptor reads it. Backend sends `token` → must map in auth.api and store as `accessToken`.
- **Error handling:** Login errors are thrown and caught in LoginPage; no global auth error handler.
- **Loading:** Initializing state hides children until localStorage is read; no loading indicator during login (handled in LoginPage).

### 6.2 Hooks

- **useAuth:** Thin wrapper around useAuthContext. OK.
- **useTickets:** fetchTickets on mount; returns tickets, loading, error, refetch, setTickets. OK.
- **useProperties:** Same pattern. OK.
- **useNotifications:** Depends on user.id; fetches when user present. Returns setNotifications for optimistic updates. OK.

---

## 7. UI / DESIGN CHECK

- **Tailwind:** v4 with `@import 'tailwindcss'` and PostCSS `@tailwindcss/postcss`. Configured.
- **Layout:** Desktop sidebar + mobile Sheet + Header + main content. Structure is correct; **Sheet and Dialog stubs do not support open/close state** (see §4.5).
- **Missing / weak UI primitives:** Dialog (controlled), Sheet (controlled), Select (value/onChange), Button (variant/size), Badge (variant). Table, Card, Input, Label, Textarea, Tabs, Separator, Avatar, ScrollArea exist as stubs; behavior is minimal.

---

## 8. TYPESCRIPT CHECK

- **Types:** Centralized in `src/types` (user, ticket, property, notification). Used across api, context, hooks, and modules. Good.
- **`any` usage:** Present in UI stubs (e.g. `Select`, `Dialog`, `Sheet`, `DropdownMenu`, `Badge`, `Card`). Example: `(props: any)`, `({ children }: any)`. Reduces type safety for props.
- **Backend vs frontend user:** Backend returns `user.name`; frontend `User` has `username`. Either extend backend DTO with `username` or map in auth.api and use a shared type.

---

## 9. BUILD / RUNTIME ISSUES

- **Layout/Sidebar:** Missing `currentPage` and `onNavigate` causes `onNavigate` to be undefined → **crash when clicking sidebar links** after login.
- **Lucide-react:** Icons were removed from LoginPage to avoid “Objects are not valid as React child” crash. DashboardPage and Sidebar/Header still use lucide icons; if the same error appears, replace or fix icon usage (e.g. ensure correct lucide-react version and usage).
- **Dialog/Sheet:** Stubs ignore `open`/`onOpenChange`; dialogs may not close and mobile sheet may not open/close correctly.
- **Select:** No controlled value; dropdowns do not persist or submit selection.

---

## 10. FINAL STATUS SUMMARY

### Frontend completion score: **68%**

- **Completed:** Auth flow (with response mapping fix), routing structure, API layer for listed endpoints, hooks for tickets/properties/notifications, role-based sidebar menu structure, Loader/ErrorMessage, TicketCard/TicketTimeline/CreateTicketDialog/AssignTechnicianDialog, PropertyCard, Tailwind and PostCSS setup, type definitions.
- **Partially implemented:** Layout/sidebar (router integration missing), notifications (mark-all-read only local in header), Dashboard “Recent Activity” (mock data), Dialog/Sheet/Select/Button (present but not fully functional).
- **Missing:** GET /auth/me usage, POST /properties and user CRUD wiring, route guards by role, proper controlled Dialog/Sheet/Select (or replacement components), lucide icons on LoginPage (and safe usage elsewhere).
- **Broken:** DashboardLayout and Sidebar (missing props from App); auth login response mapping (token → accessToken, user.name → user.username).
- **Architecture improvements:** Wire layout to router (useLocation/useNavigate); normalize auth API response in one place; replace or enhance UI stubs for production; consider route guards and a single “mark all notifications read” API if backend supports it.

---

## 11. ACTION PLAN

**Step 1 — Fix auth API and user shape**  
- In `auth.api.ts`, map backend response: `accessToken: res.data.token`, and map `user` so that `username: res.data.user.name` (or keep `name` and update frontend types/usages to `user.name`).  
- Ensure AuthContext and localStorage store this normalized shape.

**Step 2 — Fix layout and sidebar routing**  
- In `DashboardLayout`, remove props `currentPage` and `onNavigate`. Use `useLocation()` and `useNavigate()` from react-router-dom.  
- Derive page title from `location.pathname` (e.g. map `/my-tasks` → "My Tasks").  
- In `Sidebar`, use `useNavigate()` and `useLocation()`; menu items use `navigate(path)` and `isActive = location.pathname === path`.  
- In `App.tsx`, render `<DashboardLayout><AppRouter /></DashboardLayout>` with no extra props.

**Step 3 — Fix UI component layer**  
- **Dialog:** Support `open` and `onOpenChange`; render content only when `open`; overlay click or close button calls `onOpenChange(false)`.  
- **Sheet:** Same for mobile sidebar.  
- **Select:** Support `value` and `onValueChange`; store selected value and pass to SelectValue; keyboard/click to select and call `onValueChange`.  
- Optionally add Button `variant`/`size` and Badge `variant` for consistent styling.

**Step 4 — Replace mock data and optional APIs**  
- Dashboard “Recent Activity”: use real data (e.g. fetch activity for recent tickets or add a dedicated activity endpoint and call it from a hook).  
- Remove or reduce reliance on `mockActivityLogs` once real source is wired.

**Step 5 — Optional enhancements**  
- Add `getAuthMe` and call it on app load when token exists (to refresh user and validate token).  
- Wire “Add Property” to POST /properties and “Add User” to a backend create-user endpoint if available.  
- Add route guards (e.g. redirect by role) if product requires it.  
- Reintroduce lucide-react icons safely (correct version and usage) or replace with inline SVG/text.

---

*End of report.*
