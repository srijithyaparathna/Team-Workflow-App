# Team Workflow App — Backend

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql&logoColor=white)
![License](https://img.shields.io/badge/license-ISC-blue)

A REST API for the **Team Workflow App** — a task management system with JWT
authentication, email OTP verification, and role-based access control (Admin / User).

Pairs with the React + Vite frontend in [`../frontend`](../frontend).

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database setup](#database-setup)
  - [Environment variables](#environment-variables)
  - [Running the server](#running-the-server)
- [Creating an admin user](#creating-an-admin-user)
- [Testing with Postman](#testing-with-postman)
- [API reference](#api-reference)
- [Security notes](#security-notes)

## Features

- **Authentication** — register with email OTP verification, login, logout, forgot/reset password, JWT access token + httpOnly refresh token cookie with silent renewal.
- **Tasks** — full CRUD, priority (`low`/`medium`/`high`), status (`open`/`in_progress`/`testing`/`done`), due date **and time**, search/filter by title, priority, and status.
- **Role-based access** — `admin` sees and manages every task; a `user` only sees tasks they created or are assigned to. Deleting/updating a task is restricted to its creator or an admin.
- **Assignment** — tasks are linked to both a creator (`created_by`) and an assignee (`assigned_to`); creating without an assignee self-assigns it to the creator.
- Request logging via `morgan`, security headers via `helmet`, centralized error handling.

## Tech stack

| Layer | Choice |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express 4 |
| Database | MySQL (via `mysql2/promise`) |
| Auth | `jsonwebtoken`, `bcryptjs` |
| Validation | `express-validator` |
| Email | `nodemailer` |
| Dev tooling | `nodemon`, `morgan`, `helmet`, `cors`, `cookie-parser` |

## Project structure

```
backend/
├── migrations/            # SQL migrations, run in numeric order
├── src/
│   ├── config/             # DB pool, mailer transport, env loader
│   ├── controllers/        # Request handlers (auth, task, user)
│   ├── middleware/         # auth guard, role guard, validation, error handler
│   ├── models/              # SQL queries (tasks, users, refresh tokens)
│   ├── routes/              # Express routers
│   ├── services/            # Business logic (auth, email, task permissions)
│   ├── templates/           # HTML email templates
│   ├── utils/                # JWT signing/verifying, OTP generation
│   └── app.js               # Express app setup
├── server.js                # Entry point
└── postman_collection.json  # Importable Postman collection
```

## Getting started

### Prerequisites

- Node.js 18+
- A running MySQL server (tested on 8.0.x)
- An SMTP account for sending OTP/reset emails (e.g. [Brevo](https://www.brevo.com/), Gmail App Passwords, etc.)

### Installation

```bash
cd backend
npm install
```

### Database setup

Run the migrations against your MySQL server, in order:

```bash
mysql -u root -p < migrations/001_init.sql
mysql -u root -p < migrations/002_due_date_datetime.sql
```

`001_init.sql` creates the `taskapp` database with `users`, `tasks`, and `refresh_tokens` tables. `002_due_date_datetime.sql` widens `tasks.due_date` from `DATE` to `DATETIME` (safe to run on a fresh install too — it's a no-op if already `DATETIME`).

### Environment variables

Copy the example file and fill in real values — **never commit your real `.env`** (it's already gitignored):

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` | MySQL connection details |
| `JWT_SECRET` | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens — **must differ** from `JWT_SECRET` |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM` | SMTP credentials for OTP/reset emails |
| `FRONTEND_URL` | Used for CORS and for building the password-reset link |

### Running the server

```bash
npm run dev      # nodemon — auto-restarts on file changes
# or
npm start
```

You should see `MySQL connected` and `Server running on port 5000`.

## Creating an admin user

There's no public "register as admin" endpoint — exposing one would let anyone self-promote. Instead:

1. Register normally (`POST /api/auth/register`) and verify with the OTP emailed to you (`POST /api/auth/verify-otp`).
2. Promote that user directly in MySQL:
   ```sql
   USE taskapp;
   UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
   ```
3. Log in again (`POST /api/auth/login`) so the new access token carries `role: "admin"` (the role is baked into the JWT at login time, so the old token won't reflect the change).

## Testing with Postman

Import [`postman_collection.json`](postman_collection.json). It includes:

- `baseUrl` collection variable (default `http://localhost:5000/api`)
- `accessToken`, auto-populated by the **Login** request's test script and reused via `Authorization: Bearer {{accessToken}}` on every protected request
- `taskId`, auto-populated by **Create Task**, so Get/Update/Delete Task work without manual edits

Suggested run order: Register → Verify OTP → Login → Create Task → Get Tasks → Get Task By Id → Update Task → Delete Task.

## API reference

Base URL: `http://localhost:5000/api`

### Auth (`/api/auth`)

| Method | Path | Auth | Body |
|---|---|---|---|
| POST | `/register` | — | `{ name, email, password }` |
| POST | `/verify-otp` | — | `{ email, otp }` |
| POST | `/resend-otp` | — | `{ email }` |
| POST | `/login` | — | `{ email, password }` |
| POST | `/logout` | Bearer | — |
| POST | `/refresh-token` | refresh cookie | — |
| POST | `/forgot-password` | — | `{ email }` |
| POST | `/reset-password` | — | `{ token, password }` |

### Tasks (`/api/tasks`) — all require `Authorization: Bearer <accessToken>`

| Method | Path | Notes |
|---|---|---|
| GET | `/` | List tasks. Admin sees all; users see only created/assigned to them. Supports `?title=&priority=&status=` |
| POST | `/` | Create. Only `title` required. `due_date` (ISO datetime) must not be in the past. Omitted `assigned_to` self-assigns to the creator |
| GET | `/:id` | View one (creator, assignee, or admin only) |
| PUT | `/:id` | Update (creator or admin only) |
| DELETE | `/:id` | Delete (creator or admin only) |

### Users (`/api/users`) — all require `Authorization: Bearer <accessToken>`

| Method | Path | Notes |
|---|---|---|
| GET | `/me` | Current user's profile |
| GET | `/` | All users — admin only |

For full request/response examples (including JSON payloads and status codes), see [`postman_collection.json`](postman_collection.json) or read the controllers directly under `src/controllers/`.

## Security notes

- Access tokens are short-lived (15 min) JWTs returned in the response body; refresh tokens are long-lived (7 days), stored httpOnly/secure/sameSite, and tracked server-side in the `refresh_tokens` table so they can be revoked on logout.
- Passwords are hashed with `bcryptjs`; password reset uses a single-use, time-limited token, not the user's password.
- `assigned_to` is validated against real users before insert/update to avoid leaking raw foreign-key errors.
- Never commit `.env` — only commit `.env.example` with placeholder values.
