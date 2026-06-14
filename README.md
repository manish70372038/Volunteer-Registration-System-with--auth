# Volunteer Registration System

A complete Next.js 14 web application for registering volunteers, with a JSON-file database, authentication, admin dashboard, and report generation.

## Features

### Core (Mandatory)
- Volunteer registration form (name, email, phone, skill, availability, message)
- JSON-file database (lowdb) — data persists across restarts, no native build tools needed
- REST API: `GET/POST /api/volunteers`, `GET/PATCH/DELETE /api/volunteers/[id]`
- Public page to view all registered volunteers

### Optional (Implemented)
- **Authentication** — Admin login/logout with secure HMAC-signed session cookies
- **Admin Dashboard** — Protected `/admin` route with stats cards, status management (Pending/Approved/Rejected), and delete
- **Report Generation** — One-click CSV export of all volunteer data (admin only)

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

## Default Admin Credentials
```
Username: admin
Password: admin123
```
A default admin user is auto-created on first run. Change the password by editing `volunteers.json` (or extend the app to add a "change password" feature).

## Pages
| Route | Access | Description |
|---|---|---|
| `/` | Public | Home / landing page |
| `/register` | Public | Volunteer registration form |
| `/volunteers` | Public | Table of all registered volunteers |
| `/login` | Public | Admin login |
| `/admin` | Admin only | Dashboard: stats, status management, delete, CSV export |
| `/api/volunteers` | Public (GET/POST) | REST API |
| `/api/volunteers/[id]` | Admin (PATCH/DELETE) | Update status or delete a volunteer |
| `/api/reports/export` | Admin only | Download CSV report |

## Tech Stack
- **Next.js 14** (App Router)
- **React 18**
- **lowdb** — JSON file-based database
- **Web Crypto API** — password hashing & session token signing (no extra packages, Edge-compatible)
- Plain CSS — no UI framework

## Notes
- Volunteer data is stored in `volunteers.json` in the project root — created automatically on first run.
- Sessions expire after 24 hours.
- Middleware (`middleware.js`) protects all `/admin/*` routes — unauthenticated users are redirected to `/login`.
