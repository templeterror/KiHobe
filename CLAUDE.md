# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**KiHobe** is a non-monetary prediction market MVP for Bangladesh. Users spend coins to vote YES/NO on binary predictions; correct voters enter a lottery for prizes. The core differentiator is leverage: betting against the crowd yields better lottery odds.

## Monorepo Structure

```
KiHobe/
├── frontend/          # Next.js 16 app (deploy to Vercel)
├── backend/           # FastAPI app (deploy to Railway via Dockerfile)
└── supabase/          # SQL migrations and seed data
```

## Development Commands

### Frontend (`frontend/`)
```bash
npm run dev       # Start dev server (localhost:3000)
npm run build     # Production build
npm run lint      # ESLint
```

### Backend (`backend/`)
```bash
uvicorn app.main:app --reload   # Start dev server (localhost:8000)
pytest                          # Run tests
```

## Architecture

### Hybrid Backend Split

| Layer | Responsibilities |
|---|---|
| **Supabase (direct from frontend)** | Realtime vote count subscriptions, prediction list reads, `cast_vote` RPC |
| **FastAPI (via `NEXT_PUBLIC_API_URL`)** | OTP auth, voting with coin deduction, market lifecycle, lottery, leaderboard, admin, scheduled tasks |

### Data Flow
```
Frontend → Supabase Realtime: live yes_count/no_count on predictions table
Frontend → FastAPI: auth (JWT), POST /predictions/{id}/vote (coin check + cast_vote RPC)
FastAPI  → Supabase: server-side writes, complex queries, coin transactions
```

### Key Patterns
- **Atomic voting**: Supabase RPC `cast_vote(user_id, prediction_id, vote)` — inserts vote + increments yes/no count in one transaction. Called by FastAPI after coin deduction.
- **Denormalized counts**: `yes_count`/`no_count` on `predictions` table for fast reads.
- **Vote dedup**: `UNIQUE(user_id, prediction_id)` on `votes` table.
- **Realtime**: Supabase WebSocket subscription on the `predictions` row being viewed.
- **Charts**: Polling `/predictions/{id}/chart` every 30s for hourly `vote_stats` snapshots.
- **Auth**: 24h JWT access token + 30-day refresh token in httpOnly cookie. OTP via BD local SMS provider.

### Market States
`draft` → `pending_approval` → `active` → `closed` → `resolved`

## Tech Stack

**Frontend**: Next.js 16 (App Router), TypeScript 5, Tailwind v4, shadcn/ui, TradingView Lightweight Charts, Framer Motion, GSAP, Supabase JS v2, Vaul (bottom sheet), next-pwa/serwist

**Backend**: Python 3.12, FastAPI 0.110+, Pydantic v2, supabase-py v2, APScheduler, python-jose, httpx

## Environment Variables

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_API_URL
```

**Backend** (`backend/.env`):
```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
JWT_SECRET
JWT_ALGORITHM=HS256
SMS_API_KEY
SMS_API_URL
CORS_ORIGINS
```

## Known Gotchas

- **Tailwind v4**: Uses `@theme inline` blocks in CSS, not `tailwind.config.ts` for theme values. shadcn/ui init handles setup.
- **Next.js 16**: `Viewport` is a separate export from `Metadata` — use `export const viewport: Viewport`.
- **Recharts v3 types**: `Tooltip` `labelFormatter` expects `(label: ReactNode) => ReactNode`. Don't annotate `formatter` param types explicitly; let TS infer.
- **npm project naming**: npm disallows capital letters in project names.
- **After copying a scaffolded project**: always `rm -rf node_modules && npm install` to fix symlinks.

## Design System

- **Theme**: Dark mode only — `#0A0C0F` background, `#141619` cards
- **Mobile-first**: Primary target is mobile Bangladesh users
- **Animations**: Framer Motion for transitions and micro-interactions; GSAP for chart entrances, number counters, prize reveals
- **Design philosophy**: Avoid generic aesthetics (Inter/Roboto, purple gradients). Commit to a bold, intentional visual direction. See `.agents/skills/frontend-design/SKILL.md` for detailed guidelines.

## Frontend Routes

| Route | Auth |
|---|---|
| `/` | No |
| `/prediction/[id]` | No (vote requires auth) |
| `/login` | No |
| `/profile` | Yes |
| `/leaderboard` | Yes |
| `/friends` | Yes |
| `/create` | Yes |
| `/admin` | Yes (is_admin flag) |

## Database

Schema and migrations live in `supabase/migrations/001_initial_schema.sql`. Seed data (15 BD predictions) in `supabase/seed.sql`. Key tables: `users`, `predictions`, `votes`, `vote_stats`, `coin_transactions`, `friendships`, `lottery_results`, `app_config`.
