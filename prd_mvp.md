# KiHobe — Product Requirements Document (MVP)

## 1. Product Overview

**KiHobe** is a non-monetary prediction market for Bangladesh. Users bet on real-world outcomes — not with money, but with coins that enter them into a prize lottery.

### Core Mechanic

- Users spend coins to vote YES or NO on binary predictions
- They vote on who they think will win in a multiple event prediction (who will win the world cup among every team)
- When a market resolves, correct voters enter a lottery
- The fewer people on the winning side, the higher each winner's chance of winning the prize
- 1 winner per market (configurable for future scaling)

### Target Audience

Bangladeshi users (18+), primarily mobile, sharing via Messenger/WhatsApp/Telegram.

---

## 2. Architecture

### 2.1 Monorepo Structure

```
KiHobe/
├── frontend/                # Next.js app
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities (supabase client, share, etc.)
│   │   └── styles/          # Global styles
│   ├── public/              # Static assets, PWA manifest, icons
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
├── backend/                 # FastAPI app
│   ├── app/
│   │   ├── main.py          # FastAPI entry point
│   │   ├── routers/         # API route modules
│   │   ├── models/          # Pydantic models
│   │   ├── services/        # Business logic (OTP, coins, markets, lottery)
│   │   ├── db.py            # Supabase client
│   │   └── config.py        # Settings / env vars
│   ├── requirements.txt
│   └── Dockerfile
├── supabase/
│   ├── migrations/          # SQL migration files
│   └── seed.sql             # Seed data
├── .env.example
└── prd_mvp.md               # This file
```

### 2.2 Backend Split (Hybrid)

| Layer | Responsibility |
|---|---|
| **Supabase (direct)** | Real-time subscriptions (live vote counts), data reads for predictions list, RPC for atomic vote casting, Row Level Security |
| **FastAPI** | Authentication (OTP), coin management, market creation/approval/resolution, leaderboard computation, lottery/prize selection, admin endpoints, scheduled tasks (daily coin grants) |

### 2.3 Data Flow

```
User (mobile browser)
  → Next.js frontend (Vercel)
    → Supabase (direct): read predictions, realtime vote updates
    → FastAPI (Railway): auth, vote (with coin deduction), admin, leaderboard
      → Supabase (server-side): writes, complex queries, coin operations
```

---

## 3. Tech Stack

### 3.1 Frontend

| Tool | Version | Purpose |
|---|---|---|
| **Next.js** | 16+ | App Router, SSR/SSG, API routes |
| **TypeScript** | 5+ | Type safety |
| **Tailwind CSS** | v4 | Utility-first styling (`@theme inline` blocks) |
| **shadcn/ui** | latest | Component primitives (buttons, dialogs, drawers, sheets) |
| **TradingView Lightweight Charts** | 4+ | Real-time, animated, canvas-based financial charts (45KB) |
| **Framer Motion** | 11+ | UI transitions, page animations, micro-interactions |
| **GSAP** | 3+ | Complex custom animations (chart entrances, prize reveals, number counters) |
| **Supabase JS** | 2+ | Client-side Supabase connection, Realtime subscriptions |
| **next-pwa / serwist** | latest | PWA service worker, offline support, push notifications |
| **Vaul** | latest | Bottom sheet / drawer component |

### 3.2 Backend

| Tool | Version | Purpose |
|---|---|---|
| **Python** | 3.12+ | Backend language |
| **FastAPI** | 0.110+ | REST API framework |
| **Pydantic** | 2+ | Request/response validation |
| **supabase-py** | 2+ | Server-side Supabase client |
| **httpx** | latest | HTTP client for BD SMS provider API calls |
| **APScheduler** | 3+ | Scheduled tasks (daily coin grants, market auto-resolution) |
| **python-jose** | latest | JWT token creation/validation |
| **redis** (optional) | latest | Rate limiting, OTP storage with TTL (can use Supabase for MVP) |

### 3.3 Database

| Tool | Purpose |
|---|---|
| **Supabase (PostgreSQL)** | Primary database, Realtime, Row Level Security, RPCs |

### 3.4 Deployment

| Service | What |
|---|---|
| **Vercel** | Frontend (Next.js) |
| **Railway** | Backend (FastAPI) |
| **Supabase Cloud** | Database, Realtime, Storage |

### 3.5 SMS Provider (OTP)

| Provider | Cost | Notes |
|---|---|---|
| **BD local provider** (sms.bd, Alpha Net, or similar) | ~৳0.35/SMS (~$0.003) | BTRC-compliant, best deliverability for BD numbers |

OTP logic (code generation, expiry, rate limiting) is built into FastAPI, not outsourced to Twilio.

---

## 4. Feature Specifications

### 4.1 Authentication (Phone OTP)

**Flow:**
1. User enters Bangladeshi phone number (+880)
2. FastAPI generates a 6-digit OTP, stores it with 5-minute expiry
3. FastAPI sends OTP via BD local SMS provider API
4. User enters OTP in the app
5. FastAPI validates, creates/retrieves user, returns JWT
6. Frontend stores JWT, uses it for authenticated requests

**Rate limiting:**
- Max 3 OTP requests per phone number per 10 minutes
- Max 5 failed verification attempts per phone number per hour

**JWT:**
- Access token: 24-hour expiry
- Refresh token: 30-day expiry, stored in httpOnly cookie

### 4.2 Prediction Markets

**Market states:** `draft` → `pending_approval` → `active` → `closed` → `resolved`

**Market fields:**
- Title (question being predicted)
- Description / context
- Category (politics, sports, entertainment, economy, etc.)
- Resolution date (when betting closes)
- Resolution source (how the outcome is determined)
- Created by (user ID or admin)
- Status
- Yes count / No count (denormalized for fast reads)
- Prize description

**User-proposed markets:**
- Any authenticated user can submit a market proposal (status: `pending_approval`)
- Admin reviews and approves/rejects via admin dashboard
- Approved markets go to `active` status

**Market resolution:**
- Admin manually resolves markets (sets outcome to YES or NO)
- System triggers lottery for winning side
- Winners are notified via push notification & text messages

### 4.3 Voting / Betting

**Flow:**
1. User views active market
2. Taps YES or NO
3. Frontend calls FastAPI `/vote` endpoint
4. FastAPI checks: user is authenticated, has enough coins, hasn't already voted on this market
5. FastAPI atomically: deducts coin(s), records vote, increments yes/no count via Supabase RPC
6. Supabase Realtime pushes updated counts to all connected clients

**Constraints:**
- 1 vote per user per market
- Vote costs configurable coins (default: 1)
- Votes are mutable once per market (uses coins again)

### 4.4 Coin System

**Configurable values (stored in `app_config` table):**

| Config Key | Default | Description |
|---|---|---|
| `daily_coin_grant` | 3 | Coins granted to each user daily |
| `referral_coin_bonus` | 5 | Coins granted when a referred user signs up |
| `vote_coin_cost` | 1 | Coins deducted per vote |

**Daily coin grant:**
- FastAPI scheduled task runs at midnight (BD time, UTC+6)
- Grants coins to all active users
- Coins do not accumulate beyond a cap (configurable, default: 50)

**Referral bonus:**
- Each user has a unique referral code
- When a new user signs up via referral link, the referrer gets bonus coins
- Referral tracked via `referred_by` field on user record

### 4.5 Lottery / Prize System (MVP)

- 1 winner per market (configurable in `app_config` for future scaling)
- When a market resolves, all correct voters are entered into the lottery
- Winner is selected via cryptographically random selection (Python `secrets` module)
- Winner is notified via push notification & sms
- Prize details are defined when the market is created by admin
- Prize fulfillment is manual for MVP (admin contacts winner)

**Leverage mechanic:**
- If 90% voted YES and YES wins → each YES voter has a low chance of winning
- If 10% voted NO and NO wins → each NO voter has a high chance of winning
- This is the core differentiator: bet against the crowd for better odds

### 4.6 Leaderboard

**Among friends:**
- Users can add friends via shareable invite links
- Leaderboard shows: rank, username, total correct predictions, win rate, prizes won
- Computed by FastAPI on request (polling, not real-time)

**Global leaderboard:**
- Top 100 users by correct predictions
- Refreshed periodically (cached, not live)

### 4.7 Sharing

**Shareable items:**
- Individual prediction markets
- User profile
- Referral/invite link

**Channels:**
- Facebook Messenger (`fb-messenger://share?link=`)
- WhatsApp (`https://wa.me/?text=`)
- Instagram (copy link, deep link where possible)
- Telegram (`https://t.me/share/url?url=`)
- Copy link

**Static OG preview:**
- Each market page has Open Graph meta tags: title (market question), description (current YES/NO percentages), site name, default preview image
- No dynamic image generation for MVP

### 4.8 Profile

- Display name (editable)
- Phone number (masked: +880 1XXX-XXX-89)
- Stats: total bets, correct predictions, win rate,.
- Coin balance
- Friends list
- Referral link

### 4.9 PWA + Push Notifications

**PWA:**
- `manifest.json` with app name, icons, theme color
- Service worker for offline shell (app shell model)
- Install prompt on mobile browsers
- Splash screen

**Push notifications (web push via service worker):**
- Market resolved (your market has a result)
- You won the lottery
- Friend joined via your referral
- New trending market
- Daily reminder (if user hasn't visited)

### 4.10 Admin Dashboard

A simple admin-only section within the app (route-protected):

- **Markets:** View pending proposals → approve/reject. Create new markets. Resolve active markets (set YES/NO outcome). View all markets with filters.
- **Users:** View user list, coin balances, ban users.
- **Config:** Edit `app_config` values (coin amounts, etc.)
- **Lottery:** View lottery results, winner info per market.

Admin is determined by an `is_admin` flag on the user record.

---

## 5. Database Schema

### Tables

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(15) UNIQUE NOT NULL,
  display_name VARCHAR(50),
  coin_balance INTEGER DEFAULT 0,
  referral_code VARCHAR(10) UNIQUE NOT NULL,
  referred_by UUID REFERENCES users(id),
  is_admin BOOLEAN DEFAULT FALSE,
  push_subscription JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- OTP (short-lived, could also use Redis)
CREATE TABLE otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(15) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Predictions / Markets
CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category VARCHAR(50),
  status VARCHAR(20) DEFAULT 'draft',  -- draft, pending_approval, active, closed, resolved
  resolution_date TIMESTAMPTZ,
  resolution_source TEXT,
  outcome BOOLEAN,                      -- NULL until resolved, TRUE = YES, FALSE = NO
  yes_count INTEGER DEFAULT 0,
  no_count INTEGER DEFAULT 0,
  prize_description TEXT,
  winner_count INTEGER DEFAULT 1,
  created_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Votes
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  prediction_id UUID REFERENCES predictions(id) NOT NULL,
  vote BOOLEAN NOT NULL,                -- TRUE = YES, FALSE = NO
  coins_spent INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, prediction_id)        -- 1 vote per user per market
);

-- Hourly vote stats (for chart data)
CREATE TABLE vote_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID REFERENCES predictions(id) NOT NULL,
  yes_count INTEGER DEFAULT 0,
  no_count INTEGER DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- Friendships
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  friend_id UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- Lottery results
CREATE TABLE lottery_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID REFERENCES predictions(id) NOT NULL,
  winner_id UUID REFERENCES users(id) NOT NULL,
  prize_description TEXT,
  claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Coin transactions (audit log)
CREATE TABLE coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  amount INTEGER NOT NULL,              -- positive = grant, negative = spend
  reason VARCHAR(50) NOT NULL,          -- 'daily_grant', 'referral_bonus', 'vote_spend', 'admin_adjust'
  reference_id UUID,                    -- e.g. vote ID, referral user ID
  created_at TIMESTAMPTZ DEFAULT now()
);

-- App config (key-value for tunable settings)
CREATE TABLE app_config (
  key VARCHAR(50) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Supabase RPCs

```sql
-- Atomic vote casting (called from FastAPI after coin check)
CREATE OR REPLACE FUNCTION cast_vote(
  p_user_id UUID,
  p_prediction_id UUID,
  p_vote BOOLEAN
) RETURNS void AS $$
BEGIN
  INSERT INTO votes (user_id, prediction_id, vote)
  VALUES (p_user_id, p_prediction_id, p_vote);

  IF p_vote THEN
    UPDATE predictions SET yes_count = yes_count + 1, updated_at = now()
    WHERE id = p_prediction_id;
  ELSE
    UPDATE predictions SET no_count = no_count + 1, updated_at = now()
    WHERE id = p_prediction_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
```

### Supabase Realtime

- Enable Realtime on `predictions` table (for live `yes_count`/`no_count` updates)
- Frontend subscribes to changes on the active market being viewed

### Row Level Security

- `users`: Users can read their own row. Admins can read all.
- `predictions`: Everyone can read `active`/`closed`/`resolved`. Only creator can read `draft`. Admins can read all.
- `votes`: Users can read their own votes. Insert only through RPC.
- `lottery_results`: Users can read results for markets they participated in.

---

## 6. API Design (FastAPI)

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/request-otp` | Send OTP to phone number |
| POST | `/auth/verify-otp` | Verify OTP, return JWT |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Invalidate refresh token |

### Markets / Predictions

| Method | Endpoint | Description |
|---|---|---|
| GET | `/predictions` | List active predictions (paginated) |
| GET | `/predictions/{id}` | Get prediction details |
| POST | `/predictions` | Propose a new prediction (authenticated) |
| POST | `/predictions/{id}/vote` | Vote YES/NO (authenticated, deducts coins) |
| GET | `/predictions/{id}/chart` | Get hourly vote stats for chart |

### User / Profile

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users/me` | Get current user profile |
| PATCH | `/users/me` | Update display name |
| GET | `/users/me/votes` | Get my vote history |
| GET | `/users/me/coins` | Get coin balance + transaction history |
| POST | `/users/me/push-subscription` | Register push subscription |

### Friends / Leaderboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/friends` | Get friends list |
| POST | `/friends/add` | Add friend by referral code |
| GET | `/leaderboard/friends` | Friends leaderboard |
| GET | `/leaderboard/global` | Global top 100 |

### Admin

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/predictions` | List all predictions (all statuses) |
| PATCH | `/admin/predictions/{id}` | Approve/reject/resolve prediction |
| POST | `/admin/predictions` | Create prediction directly (active) |
| GET | `/admin/users` | List all users |
| PATCH | `/admin/users/{id}` | Adjust coins, ban/unban |
| GET | `/admin/config` | Get all config values |
| PATCH | `/admin/config/{key}` | Update config value |
| POST | `/admin/predictions/{id}/resolve` | Resolve market + trigger lottery |

---

## 7. Frontend Pages

| Route | Page | Auth Required |
|---|---|---|
| `/` | Home — prediction feed (active markets) | No |
| `/prediction/[id]` | Market detail — chart, vote buttons, share | No (vote requires auth) |
| `/login` | Phone number + OTP entry | No |
| `/profile` | User profile, stats, coin balance | Yes |
| `/leaderboard` | Friends + global leaderboard tabs | Yes |
| `/friends` | Friends list, add friend, invite link | Yes |
| `/create` | Propose a new market | Yes |
| `/admin` | Admin dashboard (markets, users, config) | Yes (admin) |

---

## 8. Real-Time Strategy (Hybrid)

| Feature | Method | Details |
|---|---|---|
| Vote counts on active market | Supabase Realtime | WebSocket subscription on `predictions` row |
| Chart data | Polling (30s) | Fetch `/predictions/{id}/chart` periodically |
| Leaderboard | Polling (60s) | Fetch on page load + interval |
| Push notifications | Web Push API | Service worker receives push events from FastAPI |

---

## 9. Deployment

### Frontend (Vercel)
- Connect to Git repo, auto-deploy `frontend/` directory
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`

### Backend (Railway)
- Deploy from `backend/` directory using Dockerfile
- Environment variables: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SMS_API_KEY`, `SMS_API_URL`, `JWT_SECRET`, `CORS_ORIGINS`

### Supabase
- Create project on Supabase Cloud
- Run migration SQL
- Enable Realtime on `predictions` table
- Configure RLS policies

---

## 10. Environment Variables

```env
# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_API_URL=https://kihobe-api.up.railway.app

# Backend (.env)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
JWT_SECRET=<random-256-bit-key>
JWT_ALGORITHM=HS256
SMS_PROVIDER=sms.bd          # or alpha.net.bd
SMS_API_KEY=<provider-api-key>
SMS_API_URL=<provider-endpoint>
CORS_ORIGINS=https://kihobe.vercel.app,http://localhost:3000
```

---

## 11. Design Direction
- **Theme:** Dark mode only (`#0A0C0F` background, `#141619` cards)
- **Mobile-first:** All layouts designed for mobile and desktop
- **Language:** English only for MVP
- **Typography:** Clean, modern sans-serif
- **Interactions:** Framer Motion for page transitions, card animations, micro-interactions. GSAP for complex chart animations, number counters, prize reveal effects.
