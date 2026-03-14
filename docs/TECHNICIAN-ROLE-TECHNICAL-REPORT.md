# PropTech Management System — Technician Role Technical Report

This document describes how the **TECHNICIAN** role is implemented across the PropTech Maintenance Management System: UI, backend, APIs, permissions, and data flow.

---

## 1. TECHNICIAN ROLE OVERVIEW

### Purpose

The **Technician** role represents maintenance staff who execute work orders. They:

- See only **tickets assigned to them**.
- Update ticket status along a fixed path: **ASSIGNED → IN_PROGRESS → DONE**.
- Do **not** create users, manage properties, assign other technicians, or access admin/manager features.

### Role Hierarchy

- **ADMIN** — Full system control; can create any user role and manage everything.
- **MANAGER** — Manages properties, users (TECHNICIAN/TENANT), and tickets; assigns technicians.
- **TECHNICIAN** — Works only on assigned tickets; limited to status updates.
- **TENANT** — Creates maintenance requests and views own tickets.

Technicians sit between Manager (who assigns work) and Tenant (who requests it). They receive assignments from Managers and move tickets through completion.

---

## 2. TECHNICIAN SIDEBAR

### Visible Items

| Label        | Route           | Description                    |
|-------------|------------------|--------------------------------|
| Dashboard   | `/dashboard`     | Overview and assigned-ticket stats |
| My Tasks    | `/my-tasks`      | List of assigned tickets and status actions |
| Notifications | `/notifications` | User notifications            |

Implementation: `src/components/layout/Sidebar.tsx` — `getMenuItems(role)` returns the above three items when `role === 'TECHNICIAN'`.

### Why Technicians Do Not See Other Items

- **Users** (`/users`) — User management is for MANAGER/ADMIN only; technicians do not create or edit users.
- **Properties** (`/properties`) — Property management is MANAGER/ADMIN only.
- **Activity Logs** (`/activity`) — Global activity is for managers/admins; technicians have their own “Recent Activity” on the dashboard (technician-scoped).
- **All Tickets** (`/tickets`) — Technicians use **My Tasks** (`/my-tasks`) for a dedicated view of assigned tickets; they do not need the full ticket list.

Sidebar is driven purely by `getMenuItems(role)`; no separate permission API is used for menu visibility.

---

## 3. TECHNICIAN DASHBOARD

### Layout (Same as Other Roles, Different Data and Labels)

1. **Total Assigned Tickets** — Count of all tickets assigned to the technician.  
   - **Data:** From `useTickets()` → **GET /tickets/my** → `tickets.length`.  
   - **Label (technician):** “Total Assigned Tickets”; description: “Tickets assigned to you”.

2. **Open Tasks** — Count of tickets in status **ASSIGNED** (not yet started).  
   - **Data:** Same ticket list; `tickets.filter(t => t.status === 'ASSIGNED').length`.  
   - **Label (technician):** “Open Tasks”; description: “Awaiting start”.

3. **In Progress** — Count of tickets in **IN_PROGRESS**.  
   - **Data:** `tickets.filter(t => t.status === 'IN_PROGRESS').length`.  
   - Same label for all roles.

4. **Completed** — Count of tickets in **DONE**.  
   - **Data:** `tickets.filter(t => t.status === 'DONE').length`.  
   - Same label for all roles.

5. **Recent Activity** — Only activity for **tickets assigned to the technician**.  
   - **Data:** **GET /activity/my** (limit 5) when `user.role === 'TECHNICIAN'`; otherwise GET /activity.  
   - **Label (technician):** Description “Updates on your assigned tickets”.

6. **My Latest Tasks** — First 5 assigned tickets (same source as stats).  
   - **Data:** `tickets.slice(0, 5)` from **GET /tickets/my**.  
   - **Label (technician):** “My Latest Tasks”; description: “Your most recent assigned tickets”.

### API Usage on Dashboard (Technician)

- **GET /tickets/my** — Used by `useTickets()` when `user?.role === 'TECHNICIAN'`; feeds all four stat cards and “My Latest Tasks”.
- **GET /activity/my** — Used by `DashboardPage` when `isTechnician` is true (limit 5); feeds “Recent Activity”.

Implementation: `src/modules/dashboard/DashboardPage.tsx` uses `useAuth()`, `useTickets()`, and a `useEffect` that calls `getMyActivity(5)` or `getActivity(5)` based on `isTechnician`.

---

## 4. MY TASKS PAGE

### Purpose

Single place for technicians to see all assigned tickets and advance their status (Start → Complete).

### Ticket List

- **Source:** `useTickets()` → **GET /tickets/my**; for technicians this is already filtered by backend, so `technicianTickets = tickets`.
- **Table columns:** Ticket (title + description snippet), Property, Priority, Status, Action.

### Ticket Properties Shown

- **Title** and short **description** (line-clamped).
- **Property** — Resolved via `useProperties()` and `ticket.propertyId` (or `ticket.propertyName` if present).
- **Priority** — Badge (e.g. URGENT/HIGH/MEDIUM/LOW).
- **Status** — ASSIGNED | IN_PROGRESS | DONE.

### Allowed Actions

- **Start** — Shown when status is **ASSIGNED**; sends status update to **IN_PROGRESS**.
- **Complete** — Shown when status is **IN_PROGRESS**; sends status update to **DONE**.
- No action button when status is **DONE** (workflow complete).

Row click navigates to `/tickets/:id` (detail view). Action button uses `stopPropagation` so click does not trigger navigation.

### Technician Status Workflow

Only these transitions are allowed (enforced in backend and reflected in UI):

- **ASSIGNED → IN_PROGRESS** (Start)
- **IN_PROGRESS → DONE** (Complete)

Technicians cannot set OPEN, cannot move DONE back, and cannot skip steps. Backend: `ticket.controller.ts` uses `TECHNICIAN_ALLOWED_STATUS_TRANSITIONS` and returns 403 for any other transition when the caller is a technician.

### Endpoint That Loads Tasks

- **GET /tickets/my** — Returns all tickets where `technicianId = currentUser.id`.  
- Called by `useTickets()` when `user?.role === 'TECHNICIAN'`; same hook is used by both Dashboard and My Tasks.

Implementation: `src/modules/tasks/MyTasksPage.tsx` — uses `useTickets()`, `useProperties()`, `useAuth()`, and `updateTicketStatus()` from `tickets.api.ts`.

---

## 5. TECHNICIAN ACTIVITY LOGS

### Endpoint: GET /activity/my

Used so technicians see only activity for **tickets assigned to them**.

### Backend Filtering

- **Route:** `GET /activity/my` (registered before `GET /activity` in `activity.global.routes.ts`).
- **Controller:** `getMyActivityHandler` in `activity.controller.ts`:
  - Reads `Authorization` header and validates JWT.
  - Returns **401** if no or invalid token.
  - Returns **403** if `claims.role !== 'TECHNICIAN'`.
  - Parses optional `limit` query (default 50, max 100).
  - Calls `getRecentActivityForTechnician(claims.userId, limit)`.

### Service Logic

- **Function:** `getRecentActivityForTechnician(technicianId, limit)` in `activity.service.ts`.
- **Filter:** `where: { ticket: { technicianId } }` — only activity for tickets whose `technicianId` matches the logged-in technician.
- **Shape:** Same as global activity (id, action, createdAt, ticketId, userId, user, ticket with property).
- **Order:** `createdAt` descending; `take` limited by `limit`.

### Security Rules

- **Authentication:** Required (JWT).
- **Authorization:** Only role **TECHNICIAN**; MANAGER/ADMIN get 403 on `/activity/my` (they use GET /activity for global feed).

### Frontend: getMyActivity() vs getActivity()

- **DashboardPage** uses `useEffect` with dependency `[isTechnician]`:
  - If `isTechnician === true`: calls **getMyActivity(5)** → GET /activity/my?limit=5.
  - Otherwise: calls **getActivity(5)** → GET /activity?limit=5.
- So technician dashboard “Recent Activity” is always technician-scoped; other roles get the global activity feed.

---

## 6. API ENDPOINTS USED BY TECHNICIANS

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/tickets/my` | List tickets where `technicianId = currentUser.id`. Used for dashboard stats, Latest Tasks, and My Tasks page. Requires TECHNICIAN; 401/403 otherwise. |
| **GET** | `/tickets/:id` | Ticket detail (e.g. for “View” from My Tasks). For TECHNICIAN, backend returns 403 if `ticket.technicianId !== claims.userId`. |
| **PATCH** | `/tickets/:id/status` | Update ticket status. For TECHNICIAN: only ASSIGNED→IN_PROGRESS and IN_PROGRESS→DONE; ticket must be assigned to them; 403 otherwise. `actorId` can be omitted (set from JWT). |
| **GET** | `/activity/my` | Recent activity for tickets assigned to the technician. Used on dashboard “Recent Activity”. TECHNICIAN only; 401/403 otherwise. |
| **GET** | `/notifications` | List notifications for the current user (technicians see their own). |
| **PATCH** | `/notifications/:id/read` | Mark a notification as read. |
| **GET** | `/auth/me` | Resolve current user and role after login (e.g. session restore). |

Technicians do **not** call:

- **POST /tickets/:id/assign** — Backend returns 403 for TECHNICIAN.
- **GET /users**, **POST /users**, etc. — Not used; routes are protected and sidebar hidden.
- **GET /activity** (global) — Dashboard uses GET /activity/my for technicians instead.

---

## 7. PERMISSION & SECURITY RULES

### Restricted Pages (Route Protection)

These routes are wrapped in **ProtectedRoute** with **allowedRoles={['MANAGER', 'ADMIN']}** in `src/app/router.tsx`:

- **/users** — User management.
- **/properties** — Property management.
- **/activity** — Global activity log (Activity Logs page).

Behavior of **ProtectedRoute** (`src/components/auth/ProtectedRoute.tsx`):

- No user (not logged in): redirect to **/** (login).
- User role **not** in `allowedRoles`: redirect to **/dashboard** (technicians hitting /users, /properties, or /activity are sent to dashboard).

So technicians never see Users, Properties, or Activity Logs pages; they get a redirect, not a 403 page (403 is used on the API).

### Admin Endpoints (Backend)

- **POST /users** — Technicians get 403 (user.controller: TECHNICIAN cannot create users).
- **DELETE /users/:id** — Technicians get 403 (user.controller: TECHNICIAN cannot delete users).
- **POST /tickets/:id/assign** — Technicians get 403 (ticket.controller: only MANAGER/ADMIN can assign).
- **GET /tickets/my** — Only TECHNICIAN allowed; others get 403.
- **GET /activity/my** — Only TECHNICIAN allowed; others get 403.

### Role Validation Logic

- **JWT** carries `userId` and `role` (set at login).
- Backend uses **parseAuthHeader** and **getClaimsFromToken** (auth.service) on protected routes.
- Controllers check `claims.role` and, where needed, `claims.userId` (e.g. technician may only act on tickets where `ticket.technicianId === claims.userId`).
- Status updates for technicians are validated against `TECHNICIAN_ALLOWED_STATUS_TRANSITIONS`; invalid transitions return 403 with a message.

---

## 8. FRONTEND COMPONENTS USED

| Component | Path / usage | Role |
|-----------|------------------|------|
| **DashboardPage** | `src/modules/dashboard/DashboardPage.tsx` | Renders dashboard for all roles; uses `isTechnician` to choose labels and **getMyActivity** vs **getActivity**, and gets ticket data from **useTickets()** (which calls GET /tickets/my for technicians). |
| **MyTasksPage** | `src/modules/tasks/MyTasksPage.tsx` | Technician-only task list and status actions; uses **useTickets()**, **useProperties()**, **updateTicketStatus**; enforces ASSIGNED→IN_PROGRESS→DONE in the UI. |
| **Sidebar** | `src/components/layout/Sidebar.tsx` | Renders nav from `getMenuItems(role)`; technicians get Dashboard, My Tasks, Notifications only. |
| **ProtectedRoute** | `src/components/auth/ProtectedRoute.tsx` | Redirects unauthenticated users and users whose role is not in `allowedRoles` (used for /users, /properties, /activity). |
| **useTickets** | `src/hooks/useTickets.ts` | Fetches GET /tickets or GET /tickets/my based on `user?.role === 'TECHNICIAN'`; used by Dashboard and My Tasks. |
| **useAuth** | `src/hooks/useAuth.ts` | Exposes current `user` (id, role, etc.); used for role checks and to drive useTickets and activity fetch. |
| **useProperties** | `src/hooks/useProperties.ts` | Property list for resolving property names on My Tasks (and elsewhere). |
| **tickets.api** | `src/api/tickets.api.ts` | **getMyTickets()** (GET /tickets/my), **getTicket()**, **updateTicketStatus()** (PATCH /tickets/:id/status); normalizes `technicianId` to `assignedTechnicianId` for the app. |
| **activity.api** | `src/api/activity.api.ts` | **getMyActivity()** (GET /activity/my), **getActivity()** (GET /activity); maps backend shape to **ActivityLog**. |
| **TicketDetailsPage** | `src/modules/tickets/TicketDetailsPage.tsx` | Detail view for a ticket; for TECHNICIAN, status dropdown is restricted to current and next allowed status only. |
| **ErrorMessage / Loader / Card, Table, Badge, Button** | `src/components/...` | Shared UI for errors, loading, and layout on Dashboard and My Tasks. |

---

## 9. BACKEND MODULES USED

| Module | Responsibility |
|--------|----------------|
| **ticket.service.ts** | **listTicketsForTechnician(technicianId)** — `prisma.ticket.findMany({ where: { technicianId } })`. **updateTicketStatus** — updates status and writes activity + notification. No role check here; controller enforces technician rules. |
| **ticket.controller.ts** | **listMyTicketsHandler** — JWT + TECHNICIAN check; returns **listTicketsForTechnician(claims.userId)**. **getTicketHandler** — 403 for TECHNICIAN if ticket not assigned to them. **updateTicketStatusHandler** — for TECHNICIAN: verifies ticket assignment and allowed status transition; sets actorId from JWT if missing. **assignTechnicianHandler** — 403 for TECHNICIAN. |
| **ticket.routes.ts** | Registers GET /tickets/my (before GET /:id) and PATCH /tickets/:id/status, GET /tickets/:id, etc. |
| **activity.service.ts** | **getRecentActivityForTechnician(technicianId, limit)** — activity where `ticket.technicianId = technicianId`. **getRecentActivity** — global activity (no filter). |
| **activity.controller.ts** | **getMyActivityHandler** — JWT + TECHNICIAN check; calls **getRecentActivityForTechnician(claims.userId, limit)**. |
| **activity.global.routes.ts** | Registers GET /activity/my before GET /activity. |
| **auth.service.ts** | **parseAuthHeader**, **getClaimsFromToken** — used by ticket and activity controllers for role and userId. |

There is no dedicated “auth middleware” that runs on every request; each controller that needs protection parses the JWT and checks role/userId itself.

---

## 10. DATA FLOW (TECHNICIAN LOGIN TO UI)

1. **Login**  
   User submits credentials → **POST /auth/login** → backend returns `user` + `token` → frontend stores token (e.g. in localStorage) and sets auth state (e.g. AuthContext) with user (id, role: TECHNICIAN, etc.).

2. **App entry / session restore**  
   If token exists, app may call **GET /auth/me** to restore user and role.

3. **Navigation to dashboard**  
   Router renders **DashboardPage**. **Sidebar** gets `user.role === 'TECHNICIAN'` and shows only Dashboard, My Tasks, Notifications.

4. **Dashboard data — tickets**  
   **DashboardPage** uses **useTickets()**. **useTickets** reads **useAuth().user**; if `user?.role === 'TECHNICIAN'` it calls **getMyTickets()** → **GET /tickets/my** (Bearer token sent by axios interceptor). Backend validates JWT, checks TECHNICIAN, returns tickets where `technicianId = claims.userId`. Response is normalized to `MaintenanceTicket[]` (e.g. `assignedTechnicianId`). State is set; loading clears.

5. **Dashboard data — activity**  
   **DashboardPage** runs a **useEffect** with `[isTechnician]`. Because `isTechnician === true`, it calls **getMyActivity(5)** → **GET /activity/my?limit=5** (with Bearer token). Backend returns only activity for tickets assigned to that technician. Result is set to `recentActivity` and shown in “Recent Activity”.

6. **Rendering dashboard**  
   - Stats use `tickets.length` and filters (ASSIGNED for “Open Tasks”, IN_PROGRESS, DONE).  
   - Recent Activity uses `recentActivity`.  
   - My Latest Tasks uses `tickets.slice(0, 5)`.

7. **My Tasks page**  
   When the technician opens **My Tasks**, the same **useTickets()** hook is used (already populated from GET /tickets/my). **MyTasksPage** treats `tickets` as `technicianTickets` and renders the table with Start/Complete actions.

8. **Status update**  
   Technician clicks “Start” or “Complete” → **updateTicketStatus(id, { status })** → **PATCH /tickets/:id/status** (Bearer token; backend may set actorId from JWT). Backend checks TECHNICIAN, assignment, and allowed transition; updates ticket and writes activity. Frontend calls **refetch()** (useTickets) so the list and dashboard stats stay in sync.

9. **Ticket detail**  
   Clicking a row goes to **/tickets/:id**. **getTicket(id)** → **GET /tickets/:id**. Backend allows only if ticket is assigned to the technician (or role is not TECHNICIAN). Detail page shows status dropdown limited to allowed next status for technicians.

End-to-end: login → token and user in frontend → dashboard and My Tasks use GET /tickets/my and GET /activity/my → all technician-facing data is scoped to `technicianId = currentUser.id`. Updates go through PATCH /tickets/:id/status with backend enforcement of role and status flow.

---

## SUMMARY AND RECOMMENDATIONS

### What Works Well

- **Strict data scope** — Technicians only receive tickets and activity for their `technicianId` via dedicated endpoints (**GET /tickets/my**, **GET /activity/my**).
- **Status workflow** — ASSIGNED → IN_PROGRESS → DONE is enforced on the backend and reflected in the UI (My Tasks and TicketDetailsPage).
- **Route protection** — /users, /properties, and /activity are restricted by **ProtectedRoute** so technicians are redirected to dashboard.
- **Backend authorization** — Critical actions (assign, status change, ticket/activity access) validate JWT and role; technicians get 403 when attempting disallowed operations.
- **Single source of truth** — Dashboard and My Tasks share **useTickets()** and thus the same GET /tickets/my data; no duplicate filtering logic on the frontend.
- **Clear separation** — Technician-specific endpoints and handlers keep technician logic explicit and easier to maintain.

### Possible Improvements

- **Centralized auth middleware** — Controllers currently parse JWT and check role in each handler. A shared middleware (e.g. `requireRole(['TECHNICIAN'])` or `requireTechnician`) could reduce duplication and standardize 401/403 responses.
- **403 on forbidden routes** — Today, technicians hitting /users, /properties, or /activity are redirected to /dashboard. Optionally show a “Forbidden” (403) page or message instead of a silent redirect.
- **Consistent route naming** — App uses `/activity`; report and docs sometimes say “activity-logs”. Aligning naming (e.g. in docs and sidebar) can avoid confusion.
- **Notifications scope** — If notifications are not already filtered by user on the backend, ensure GET /notifications returns only the current user’s notifications for all roles, including technicians.
- **E2E tests** — Add tests that log in as a technician and assert: only assigned tickets and technician activity are shown, only allowed status transitions succeed, and restricted routes redirect or return 403.

Overall, the technician role is implemented in a way that fits the intended hierarchy (Admin → Manager → Technician → Tenant), with clear data boundaries, consistent use of GET /tickets/my and GET /activity/my, and backend enforcement of permissions and status flow. The suggestions above are incremental improvements rather than required changes for a correct and secure technician experience.
