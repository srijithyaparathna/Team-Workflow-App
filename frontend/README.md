# Team Workflow App — Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-v9-007FFF?logo=mui&logoColor=white)

React + Vite + TypeScript dashboard for the **Team Workflow App** — task management
with role-based access, a calendar view, and live status/priority editing.
Talks to the Express/MySQL backend in [`../backend`](../backend).

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Notes on styling](#notes-on-styling)

## Features

- **Auth** — register → OTP email verification → login, plus forgot/reset password. The access token is kept in memory/localStorage; an Axios interceptor (`src/api/client.ts`) silently renews it via the backend's httpOnly refresh cookie on a `401`, with no user-visible re-login.
- **Dashboard** — stat cards per status, a bar chart of tasks by status, and a recent-tasks list.
- **Tasks** — card and table views (table is the default), search by title, filter by priority/status, paginated, inline status/priority editing via clickable chips (no dialog needed for a quick update), full create/edit dialog, and delete with confirmation.
- **Task details** page with full metadata (creator, assignee, created/updated timestamps) and inline edit/delete.
- **Calendar** — month/week/day views (FullCalendar) with tasks plotted by due date *and time* in 30-minute slots. Click an empty slot to create a task pre-filled with that date/time; click an existing task to open its details. Past dates are visually disabled for creating new tasks, but existing tasks on past dates remain viewable.
- **Role-based UI** — admins see every task, a Users page, and an "Assign to" field when creating/editing; regular users only see tasks they created or are assigned to, and self-assign by default when they don't pick an assignee.

## Tech stack

| Concern | Choice |
|---|---|
| Framework | React 19 + TypeScript + Vite |
| UI library | MUI (Material UI) v9 |
| Utility CSS | Tailwind CSS v4 (preflight disabled so it doesn't fight MUI's `CssBaseline`) |
| Routing | React Router v7 |
| HTTP | Axios, with a token-refresh interceptor |
| Calendar | FullCalendar (`@fullcalendar/react` + daygrid/timegrid/interaction plugins) |
| Charts | Recharts |
| Dates | date-fns |

## Project structure

```
src/
├── api/          Axios client + endpoint wrappers (auth, task, user)
├── components/
│   ├── auth/       AuthShell — split-screen layout for login/register/etc.
│   ├── common/     Chips (status/priority, including inline-editable variants), ConfirmDialog
│   ├── dashboard/  StatCard, TaskStatusChart
│   ├── layout/     Sidebar, Topbar, DashboardLayout
│   └── tasks/      TaskCard, TaskFormDialog
├── context/      AuthProvider (current user, login/logout, isAdmin)
├── hooks/        useAuth
├── pages/
│   ├── auth/       Login, Register, VerifyOtp, ForgotPassword, ResetPassword
│   ├── Dashboard.tsx
│   ├── Tasks.tsx
│   ├── TaskDetails.tsx
│   ├── Calendar.tsx (+ Calendar.css)
│   └── Users.tsx
├── theme/        MUI theme
├── types/        Shared TypeScript types
└── utils/        Date formatting/parsing helpers
```

## Getting started

### Prerequisites

- Node.js 18+
- The backend running first — see [`../backend/README.md`](../backend/README.md)

### Install & run

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL if the backend isn't on http://localhost:5000/api
npm run dev
```

The app runs at `http://localhost:5173` (Vite will pick another port if that one's busy).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) and build for production into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Notes on styling

This project mixes **MUI v9** and **Tailwind v4**, which both ship a base style
reset. To avoid them fighting:

- `index.css` imports only `tailwindcss/theme.css` and `tailwindcss/utilities.css` — **not** `tailwindcss/preflight.css` — so Tailwind never resets default element styles.
- `main.tsx` wraps the app in MUI's `<ThemeProvider>` + `<CssBaseline />`, which is the only base reset in effect.
- Use Tailwind utility classes (`flex`, `gap-4`, etc.) for layout/spacing; let MUI components own their own look via `sx`/theme — don't use Tailwind to restyle MUI internals.

Also note: MUI v9 removed several "shorthand" props that older MUI versions
supported directly on components (e.g. `fontWeight`, `alignItems`, `justifyContent`
on `Typography`/`Stack`, and `InputProps`/`primaryTypographyProps`). Everywhere in
this codebase, those go through `sx` or `slotProps` instead — keep that pattern
when adding new components.
