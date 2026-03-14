# PropTech Deployment Guide

Recommended setup:

- **Frontend** → [Vercel](https://vercel.com)
- **Backend** → [Railway](https://railway.app)
- **Database** → Railway MySQL (or PlanetScale / any MySQL-compatible host)

---

## 1. Database (Railway MySQL)

1. In Railway, create a new project → **Add MySQL**.
2. After provisioning, open the MySQL service → **Variables** or **Connect** to get:
   - `MYSQL_HOST`
   - `MYSQL_PORT` (usually 3306)
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`
3. Railway also exposes **`DATABASE_URL`** in a MySQL-compatible format. Use this if your app supports it.

---

## 2. Backend (Railway)

1. Create a new service in the same (or linked) project → **Deploy from GitHub** and select the repo; set **Root Directory** to `proptech-backend` (or deploy the backend folder only).
2. **Build command:** `npm install && npx prisma generate && npm run build`
3. **Start command:** `npm run start` (runs `node dist/server.js`)
4. **Environment variables** (in Railway service → Variables):

   | Variable       | Description                    | Example                    |
   |----------------|--------------------------------|----------------------------|
   | `PORT`         | Set by Railway automatically   | (leave empty or use `PORT`) |
   | `JWT_SECRET`   | Secret for signing tokens      | long random string         |
   | `JWT_EXPIRES_IN` | Optional; token expiry       | `7d`                       |
   | `NODE_ENV`     | Environment                    | `production`               |
   | `DATABASE_URL` or MySQL vars | DB connection (see below) | From Railway MySQL service |

5. **Database connection:**  
   Your backend currently uses a custom MariaDB adapter with a local config. For production you should:
   - Either switch to Prisma’s default driver and use `DATABASE_URL` in `schema.prisma`:
     - `datasource db { provider = "mysql" url = env("DATABASE_URL") }`
   - Or keep the adapter and pass connection options from env (e.g. `process.env.MYSQL_HOST`, `MYSQL_USER`, etc.) instead of hardcoded values in `config/prisma.ts`.

6. **CORS:**  
   In production, set the allowed frontend origin (e.g. your Vercel URL). Use an env var such as `FRONTEND_ORIGIN` and in `server.ts` set `origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173"`.

7. After deploy, note the backend URL (e.g. `https://your-app.up.railway.app`).

---

## 3. Frontend (Vercel)

1. In [Vercel](https://vercel.com), **Import** your Git repository.
2. Set **Root Directory** to `proptech-frontend`.
3. **Build command:** `npm run build` (default for Vite).
4. **Output directory:** `dist` (Vite default).
5. **Environment variables:**

   | Variable        | Description              | Example                          |
   |-----------------|--------------------------|----------------------------------|
   | `VITE_API_URL`  | Backend API base URL     | `https://your-app.up.railway.app` |

6. In the frontend, ensure the API client uses this URL:
   - In `src/api/axios.ts` (or equivalent):  
     `baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'`
   - If you don’t have this yet, add it and use `VITE_API_URL` in production.

7. Deploy. Your app will be available at `https://your-project.vercel.app`.

---

## 4. Post-deploy checklist

- [ ] Backend health: open `https://your-backend.up.railway.app/` (or your root route).
- [ ] Frontend points to backend: set `VITE_API_URL` and redeploy if needed.
- [ ] CORS: backend allows your Vercel origin (e.g. `https://your-project.vercel.app`).
- [ ] Auth: register a user (e.g. via Swagger `/auth/register` or your UI) and test login.
- [ ] Database: run migrations if you use Prisma migrations (`npx prisma migrate deploy` in the backend before or during deploy).

---

## 5. Optional: uploads and file storage

The backend serves `/uploads` from disk. On Railway, the filesystem is ephemeral, so uploaded files (e.g. ticket images) will be lost on redeploy. For production, use object storage (e.g. S3, Cloudflare R2, Railway Volumes) and store URLs in the database. Configure that in the backend and set any required env vars (e.g. `S3_BUCKET`, `AWS_ACCESS_KEY_ID`) in Railway.
