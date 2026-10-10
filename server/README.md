# JanMati Backend — Express API Server

A scalable Node.js/Express backend that wraps the Supabase database with
proper REST API endpoints, input validation, rate limiting, and security headers.

## Structure

```
server/
├── src/
│   ├── app.js               # Express app entry point
│   ├── config/
│   │   ├── env.js           # Environment variable management
│   │   └── supabase.js      # Supabase admin client (service role)
│   ├── middleware/
│   │   ├── rateLimiter.js   # Rate limiting (general, OTP, vote)
│   │   ├── validate.js      # Zod schema validation middleware
│   │   └── error.js         # 404 + error handler
│   ├── controllers/
│   │   ├── healthController.js
│   │   ├── topicController.js
│   │   ├── otpController.js
│   │   ├── voteController.js
│   │   └── resultController.js
│   ├── routes/
│   │   ├── index.js         # Route aggregator
│   │   ├── health.js
│   │   ├── topics.js
│   │   ├── results.js
│   │   ├── otp.js
│   │   └── votes.js
│   ├── validators/
│   │   └── schemas.js       # Zod validation schemas
│   └── utils/
│       ├── crypto.js        # SHA-256 hashing + OTP generation
│       └── safeQuery.js     # Supabase error wrapper
├── .env.example
└── package.json
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/topics` | All active survey topics with options |
| GET | `/api/topics/:id` | Single topic with its options |
| GET | `/api/results` | Full live results (all topics + vote counts) |
| GET | `/api/results/total` | Total vote count across all topics |
| GET | `/api/results/topic/:id` | Results for a single topic |
| POST | `/api/otp/send` | Send OTP to phone/email |
| POST | `/api/otp/verify` | Verify OTP, returns voter hash |
| POST | `/api/votes` | Submit a vote (requires voter hash) |

## Setup

```bash
cd server
cp .env.example .env
# Fill in your Supabase URL and service role key
npm install
npm start
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 8080) |
| `NODE_ENV` | `development` or `production` |
| `CORS_ORIGIN` | Allowed origin for CORS (e.g. your frontend URL) |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only, never expose to frontend) |

## Deploy to Vercel / Render / Railway

1. Push the `server/` folder to a git repository.
2. Create a new project pointing to the `server/` directory.
3. Set the environment variables in the hosting dashboard.
4. The start command is `node src/app.js`.

## Security Features

- **Helmet**: Sets HTTP security headers (CSP, HSTS, XSS protection, etc.)
- **Rate limiting**: Separate limits for general requests, OTP requests, and vote submissions
- **Input validation**: All POST bodies validated with Zod schemas
- **CORS**: Configurable origin whitelist
- **Service role key**: Used server-side only, never exposed to the frontend
- **Duplicate vote prevention**: Database unique constraint + pre-check in controller
- **OTP expiry**: 10-minute TTL stored in database
