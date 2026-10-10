# JanMati — Democratic Transparency Platform

A citizen engagement platform where people vote anonymously on national issues
via email OTP verification, with real-time results displayed on a live dashboard.

## Project Structure

```
janmati/
├── src/                         # React + Vite + TypeScript frontend
│   ├── components/
│   │   ├── layout/              # Navbar, Footer
│   │   └── sections/            # Hero, Mission, Survey, Dashboard, Roadmap
│   ├── lib/                     # Supabase client & API functions
│   ├── types/                   # Shared TypeScript type definitions
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles + Tailwind
│
├── server/                      # Express + Node.js API server
│   ├── src/
│   │   ├── config/              # Environment config & Supabase admin client
│   │   ├── controllers/         # Route handlers (topics, votes, OTP, results, health)
│   │   ├── middleware/          # Rate limiting, validation, error handling
│   │   ├── routes/              # Express route definitions
│   │   ├── utils/               # Crypto helpers, Supabase query wrapper
│   │   ├── validators/          # Zod validation schemas
│   │   └── app.js               # Express app entry point
│   └── package.json
│
├── supabase/                    # Supabase schema & migrations
│   └── migrations/
│       └── 20261004101402_create_civic_engagement_schema.sql
│
├── index.html                   # Vite HTML entry point
├── package.json                 # Root workspace config
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig*.json               # TypeScript configuration
├── .env.example                 # Example environment variables
└── .gitignore
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, TypeScript, Tailwind CSS, Lucide icons |
| Server | Express 4, Node.js 18+, Zod validation, Helmet, rate limiting |
| Database | Supabase (PostgreSQL), Row Level Security |
| Auth | Supabase built-in email OTP (no external email service required) |

## Quick Start

### Install all dependencies
```bash
npm install
```

### Run the frontend (development)
```bash
npm run dev
```

### Run the server (development)
```bash
npm run dev:server
```

### Build the frontend for production
```bash
npm run build
```

### Start the server in production mode
```bash
npm run start:server
```

## Environment Variables

Copy `.env.example` to `.env` at the root and fill in your Supabase credentials.

| Variable | Used By | Description |
|----------|---------|-------------|
| `VITE_SUPABASE_URL` | Frontend | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Frontend | Supabase anon (public) key |
| `SUPABASE_URL` | Server | Same Supabase URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Supabase service role key (server-only) |
| `PORT` | Server | API server port (default 8080) |
| `NODE_ENV` | Server | `development` or `production` |
| `CORS_ORIGIN` | Server | Allowed frontend origin for CORS |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/topics` | All active survey topics with options |
| GET | `/api/topics/:id` | Single topic with options |
| GET | `/api/results` | Full live results (all topics) |
| GET | `/api/results/total` | Total vote count |
| GET | `/api/results/topic/:id` | Results for a single topic |
| POST | `/api/otp/send` | Send OTP to phone/email |
| POST | `/api/otp/verify` | Verify OTP, returns voter hash |
| POST | `/api/votes` | Submit a vote |

## Deployment

### Frontend → Vercel / Netlify / Bolt
1. Build command: `npm run build` / Output: `dist/`.
2. Set environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

### Server → Render / Railway / Vercel Functions
1. Point the hosting project to the `server/` directory.
2. Set environment variables (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, etc.).
3. Start command: `node src/app.js`.

### Database → Supabase
1. Create a Supabase project.
2. Run the migration in `supabase/migrations/` via the Supabase SQL editor.
3. RLS policies are included in the migration.
