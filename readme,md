# 💼 NextJob — Curated Job Board

> **Find your next defining role.** A clean, minimal job board for curated opportunities — no noise, just the roles that matter.

![NextJob Homepage](./frontend/public/homepage.jpg)

---

## 🚀 Features

- 🔍 **Search jobs** by role or company name in real time
- 📄 **Paginated listings** — 6 jobs per page with a "Load More" button
- 📬 **Email subscription** to collect visitor emails for future alerts (in development)
- 🔐 **Admin panel** — protected with JWT authentication
- ➕ **Add / Edit / Delete jobs** from the admin interface
- 👥 **Subscriber management** — view and export subscribers as CSV
- 📊 **Visitor stats** — total visits and unique visitors(IP-hashed for privacy)
- 🗃️ **PostgreSQL database** for all persistent data
- 🌐 **Environment-based API URL** via `VITE_API_URL`

---

## 🛠️ Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| ⚛️ React 18 | UI framework |
| ⚡ Vite | Build tool & dev server |
| 🎨 Tailwind CSS v4 | Styling |
| 🔄 REST Query| Data fetching & caching |
| 🧭 Wouter | Client-side routing |
| 🧩 Radix UI | Accessible UI primitives |

### Backend
| Tool | Purpose |
|------|---------|
| 🟢 Node.js | Runtime |
| 🚂 Express v5 | HTTP framework |
| 🐘 PostgreSQL | Database |
| 🔑 JSON Web Tokens | Admin authentication |

---

## 📁 Project Structure

```
NextJob/
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/     # AdminLayout, PublicLayout
│   │   │   └── ui/         # shadcn/ui base components
│   │   ├── lib/
│   │   │   ├── api.js      # All API hooks (TanStack Query)
│   │   │   └── auth.jsx    # JWT auth context
│   │   ├── pages/
│   │   │   ├── public/     # Home, JobDetails
│   │   │   └── admin/      # Login, Jobs, Subscribers, Stats
│   │   └── hooks/
│   ├── .env                # VITE_API_URL, PORT
│   └── vite.config.js
│
├── backend/                # Express API
│   ├── src/
│   │   ├── routes/         # admin, jobs, subscribers, stats, health
│   │   ├── middleware/     # JWT auth guard
│   │   ├── db.js           # PostgreSQL pool
│   │   └── index.js        # Server entry point
│   └── .env                # DATABASE_URL, JWT_SECRET, etc. (Create your own)
│
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database
- npm or pnpm

### 1. Clone & install

```bash
git clone https://github.com/PiyushRanakoti/NextJob.git
cd NextJob

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Set up the database

Run this SQL on your PostgreSQL database:

```sql
CREATE TABLE IF NOT EXISTS jobs (
  id               SERIAL PRIMARY KEY,
  company_name     VARCHAR(255) NOT NULL,
  role_name        VARCHAR(255) NOT NULL,
  description      TEXT NOT NULL,
  requirements     TEXT NOT NULL,
  eligibility_link TEXT NOT NULL,
  location         TEXT NOT NULL,
  experience       TEXT NOT NULL,
  created_at       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscribers (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS page_views (
  id         SERIAL PRIMARY KEY,
  ip_hash    VARCHAR(64),
  path       TEXT,
  visited_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Configure environment variables

**`backend/.env`**
```env
PORT=8080
DATABASE_URL=postgresql://user:password@localhost:5432/nextjob
JWT_SECRET=your-secret-key
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_password
CLIENT_URL=http://localhost:5000
```

**`frontend/.env`**
```env
PORT=5000
VITE_API_URL=http://localhost:8080
```

### 4. Run the app

```bash
# Terminal 1 — Backend
cd backend && node src/index.js

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open [http://localhost:5000](http://localhost:5000) 🎉

---

## 🔐 Admin Panel
- `/admin/jobs` — Add, edit, delete job listings
- `/admin/subscribers` — View & export subscriber emails as CSV
- `/admin/stats` — View total visits, unique visitors, and today's count

---

## 🌍 API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List all jobs (newest first) |
| GET | `/api/jobs/:id` | Get a single job |
| POST | `/api/subscribe` | Subscribe an email |
| POST | `/api/track` | Record a page visit |
| GET | `/api/healthz` | Health check |

### Admin (JWT required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Get JWT token |
| POST | `/api/jobs` | Create a job |
| PUT | `/api/jobs/:id` | Update a job |
| DELETE | `/api/jobs/:id` | Delete a job |
| GET | `/api/subscribers` | List all subscribers |
| DELETE | `/api/subscribers/:id` | Remove a subscriber |
| GET | `/api/admin/stats` | Visitor statistics |

---

## 📊 Database Schema

### `jobs`
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL | Primary key |
| company_name | VARCHAR(255) | Required |
| role_name | VARCHAR(255) | Required |
| description | TEXT | Required |
| requirements | TEXT | Required |
| eligibility_link | TEXT | Apply URL |
| created_at | TIMESTAMP | Auto-set |

### `subscribers`
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL | Primary key |
| email | VARCHAR(255) | Unique |
| subscribed_at | TIMESTAMP | Auto-set |

### `page_views`
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL | Primary key |
| ip_hash | VARCHAR(64) | SHA-256 hashed IP |
| path | TEXT | Page path visited |
| visited_at | TIMESTAMP | Auto-set |

---

## 📝 License

MIT — free to use, modify, and distribute.
