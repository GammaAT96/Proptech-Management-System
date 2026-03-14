# PropTech – Final Test Checklist

Use this to verify all critical flows before calling the project 95% complete.

**Prerequisites:** Backend running (`npm run dev` in `proptech-backend`), frontend running (`npm run dev` in `proptech-frontend`). Backend CORS allows `http://localhost:5173`. At least one user created (e.g. via Swagger `POST /auth/register`).

---

## Step 1 – Test all flows

### 1. Login
- [ ] Open app, redirects to login if not authenticated
- [ ] Enter valid email/password → redirects to dashboard
- [ ] Invalid credentials show error
- [ ] After login, sidebar shows username; refresh keeps session (GET /auth/me)

### 2. Create ticket
- [ ] Log in as **Tenant**
- [ ] Go to Tickets → "Create Ticket" opens dialog
- [ ] Submit with title, description, priority, property → ticket appears in list
- [ ] Optional: attach image on create (if supported in create flow)

### 3. Assign technician
- [ ] Log in as **Manager**
- [ ] Open a ticket (e.g. row action or click) → Assign option/dialog
- [ ] Select technician, confirm → ticket shows as Assigned and technician name

### 4. Update ticket status
- [ ] Log in as **Manager** or **Technician** (assigned to that ticket)
- [ ] Open ticket details → change status (e.g. In Progress, Done), save
- [ ] List and details show updated status

### 5. Notifications
- [ ] Trigger an action that creates a notification (e.g. new ticket → manager; assign → technician; status change → tenant)
- [ ] Go to Notifications → new entry appears
- [ ] Mark as read / mark all read works if implemented

### 6. Tasks (My Tasks)
- [ ] Log in as **Technician**
- [ ] Go to My Tasks → see tickets assigned to you
- [ ] Change status (e.g. In Progress, Done) and save → list updates

---

## Step 2 – Property creation UI

- [ ] Log in as **Manager**
- [ ] Go to Properties → "Add Property" button visible
- [ ] Click → dialog with Name, Address, Units, Manager
- [ ] Submit → new property appears in list (POST /properties)

*(Already implemented: CreatePropertyDialog + createProperty API.)*

---

## Step 3 – User CRUD UI

- [ ] Log in as **Manager**
- [ ] Go to Users → "Add User" visible
- [ ] **Create:** Add User → name, email, password, role → user appears in table
- [ ] **Edit:** Row menu → Edit → change name/email/role (optional password) → Save → table updates
- [ ] **Delete:** Row menu → Delete → confirm → user removed from list

*(Already implemented: CreateUserDialog, EditUserDialog, delete confirmation, create/update/delete API.)*

---

When all items are checked, the project is at **95% complete fullstack**.
