# Team Workflow App

A full-stack Task Management System with role-based access control. Users can
create, assign, and track tasks through different workflow states; admins can
see and manage every task, while regular users only see what they created or
were assigned.

**Live demo:** _add your deployed URL here once deployed_
**Repository:** _add your public Git repo URL here_

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite, MUI v9, Tailwind CSS v4, FullCalendar, Recharts |
| Backend | Node.js + Express.js |
| Database | MySQL |
| Auth | JWT (access + refresh tokens), email OTP verification |

## Dependencies

### Backend (`backend/package.json`)

| Package | Purpose |
|---|---|
| `express` | Web framework / routing |
| `mysql2` | MySQL driver (promise-based) |
| `jsonwebtoken` | Signing/verifying access & refresh JWTs |
| `bcryptjs` | Password hashing |
| `express-validator` | Request body/query validation |
| `cookie-parser` | Reading the httpOnly refresh-token cookie |
| `cors` | Cross-origin requests from the frontend |
| `helmet` | Security-related HTTP headers |
| `morgan` | Request logging |
| `nodemailer` | Sending OTP/password-reset emails |
| `dotenv` | Loading `.env` config |
| `nodemon` *(dev)* | Auto-restart server on file changes |

### Frontend (`frontend/package.json`)

| Package | Purpose |
|---|---|
| `react`, `react-dom` | UI library |
| `react-router-dom` | Client-side routing |
| `typescript` | Static typing |
| `vite` | Dev server & build tool |
| `@mui/material`, `@mui/icons-material` | Component library & icons |
| `@emotion/react`, `@emotion/styled` | MUI's styling engine |
| `tailwindcss`, `@tailwindcss/vite` | Utility CSS for layout/spacing |
| `axios` | HTTP client (with token-refresh interceptor) |
| `date-fns` | Date parsing/formatting |
| `@fullcalendar/react` + `daygrid`/`timegrid`/`interaction` plugins | Calendar view |
| `recharts` | Dashboard bar chart |
| `eslint` *(dev)* | Linting |

Exact pinned versions are in each package's `package.json`/`package-lock.json` — install with `npm install` in each folder, as shown below.

## Monorepo layout

```
Team-Workflow-App/
├── backend/    Express + MySQL REST API — see backend/README.md
└── frontend/   React + Vite dashboard   — see frontend/README.md
```

Each half has its own detailed README with full setup instructions:

- [backend/README.md](backend/README.md) — API setup, database migrations, environment variables, admin user creation, Postman collection, full API reference.
- [frontend/README.md](frontend/README.md) — UI setup, features, project structure, styling notes.

## Core functionality

- **Task management** — create, view (list/table or card view), view details, edit, update, and delete tasks. Each task has a title, description, priority (Low/Medium/High), due date **and time**, and status (Open / In Progress / Testing / Done).
- **User management** — register and log in; every task is linked to a creator (`createdBy`) and an assignee (`assignedTo`).
- **Role system** — `admin` and `user` roles. Admins see all tasks; users only see tasks they created or are assigned to.
- **Bonus features implemented**:
  - JWT authentication and authorization (access + refresh tokens)
  - Extra workflow status (`Testing`, beyond the base Open/In Progress/Done)
  - Search and filtering by title, priority, and status
  - A calendar view (month/week/day, 30-minute time slots) for visualizing tasks by due date/time
  - Inline quick-edit of status/priority directly from the task list (no dialog needed)
  - Pagination on the task list

## Quick start (run both apps locally)

You'll need Node.js 18+ and a running MySQL server.

```bash
# 1. Backend
cd backend
npm install
mysql -u root -p < migrations/001_init.sql
mysql -u root -p < migrations/002_due_date_datetime.sql
cp .env.example .env   # fill in real DB/JWT/SMTP values
npm run dev             # http://localhost:5000

# 2. Frontend (in a separate terminal)
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL if backend isn't on localhost:5000
npm run dev             # http://localhost:5173
```

Full details (migrations, env vars, admin setup, API reference) are in each
package's own README linked above.

## Usage

1. Open the frontend at `http://localhost:5173`.
2. Register a new account and verify it with the OTP code emailed to you.
3. Log in, then create, assign, and track tasks from the Dashboard, Tasks list, or Calendar view.
4. To test admin features, promote your user to `admin` directly in MySQL — see [backend/README.md → Creating an admin user](backend/README.md#creating-an-admin-user).

## Deployment

This app deploys as two separate pieces:

- **Backend**: any Node host with a reachable MySQL instance (e.g. an EC2 instance running Node + MySQL, or Node host + managed MySQL/RDS). Run the same migration + `.env` setup as local, then start with a process manager (e.g. `pm2`) behind a reverse proxy (e.g. Nginx) for HTTPS.
- **Frontend**: any static host (Vercel, Netlify, or an S3/CloudFront-style setup) — `npm run build` produces a static `dist/` folder. Set `VITE_API_URL` to your deployed backend's URL at build time.


