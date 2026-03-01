-- KiHobe MVP — Initial Schema
-- Run this in the Supabase SQL editor after creating your project.

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(15) UNIQUE NOT NULL,
  display_name VARCHAR(50),
  coin_balance INTEGER DEFAULT 0 CHECK (coin_balance >= 0),
  referral_code VARCHAR(10) UNIQUE NOT NULL,
  referred_by UUID REFERENCES users(id),
  is_admin BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE,
  push_subscription JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(15) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category VARCHAR(50),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'active', 'closed', 'resolved')),
  resolution_date TIMESTAMPTZ,
  resolution_source TEXT,
  outcome BOOLEAN,       -- NULL until resolved; TRUE = YES, FALSE = NO
  yes_count INTEGER DEFAULT 0,
  no_count INTEGER DEFAULT 0,
  prize_description TEXT,
  winner_count INTEGER DEFAULT 1,
  created_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  prediction_id UUID REFERENCES predictions(id) NOT NULL,
  vote BOOLEAN NOT NULL,         -- TRUE = YES, FALSE = NO
  coins_spent INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, prediction_id)
);

CREATE TABLE vote_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID REFERENCES predictions(id) NOT NULL,
  yes_count INTEGER DEFAULT 0,
  no_count INTEGER DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  friend_id UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

CREATE TABLE lottery_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID REFERENCES predictions(id) NOT NULL,
  winner_id UUID REFERENCES users(id) NOT NULL,
  prize_description TEXT,
  claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  amount INTEGER NOT NULL,       -- positive = grant, negative = spend
  reason VARCHAR(50) NOT NULL CHECK (reason IN ('daily_grant', 'referral_bonus', 'vote_spend', 'admin_adjust')),
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE app_config (
  key VARCHAR(50) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Default config values
INSERT INTO app_config (key, value) VALUES
  ('daily_coin_grant', '3'),
  ('referral_coin_bonus', '5'),
  ('vote_coin_cost', '1'),
  ('coin_balance_cap', '50'),
  ('winners_per_market', '1');

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_predictions_status ON predictions(status);
CREATE INDEX idx_votes_user ON votes(user_id);
CREATE INDEX idx_votes_prediction ON votes(prediction_id);
CREATE INDEX idx_vote_stats_prediction ON vote_stats(prediction_id, recorded_at);
CREATE INDEX idx_coin_transactions_user ON coin_transactions(user_id, created_at);
CREATE INDEX idx_otp_phone ON otp_codes(phone, created_at);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_predictions_updated_at
  BEFORE UPDATE ON predictions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- RPC: cast_vote
-- Called from FastAPI after coin deduction check.
-- Atomically inserts the vote and increments yes/no count.
-- ============================================================

CREATE OR REPLACE FUNCTION cast_vote(
  p_user_id UUID,
  p_prediction_id UUID,
  p_vote BOOLEAN
) RETURNS void AS $$
BEGIN
  INSERT INTO votes (user_id, prediction_id, vote)
  VALUES (p_user_id, p_prediction_id, p_vote);

  IF p_vote THEN
    UPDATE predictions
      SET yes_count = yes_count + 1, updated_at = now()
      WHERE id = p_prediction_id;
  ELSE
    UPDATE predictions
      SET no_count = no_count + 1, updated_at = now()
      WHERE id = p_prediction_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE lottery_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE coin_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- users: read own row; admins read all
CREATE POLICY "users_read_own" ON users
  FOR SELECT USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_admin = TRUE
  ));

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id);

-- predictions: everyone reads active/closed/resolved; creator reads own draft; admins read all
CREATE POLICY "predictions_read_public" ON predictions
  FOR SELECT USING (
    status IN ('active', 'closed', 'resolved')
    OR created_by = auth.uid()
    OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_admin = TRUE)
  );

CREATE POLICY "predictions_insert_authenticated" ON predictions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- votes: users read own; insert via RPC only (SECURITY DEFINER bypasses RLS)
CREATE POLICY "votes_read_own" ON votes
  FOR SELECT USING (user_id = auth.uid());

-- vote_stats: anyone can read
CREATE POLICY "vote_stats_read_all" ON vote_stats
  FOR SELECT USING (TRUE);

-- friendships: users read own
CREATE POLICY "friendships_read_own" ON friendships
  FOR SELECT USING (user_id = auth.uid() OR friend_id = auth.uid());

CREATE POLICY "friendships_insert_own" ON friendships
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- lottery_results: users read their own wins
CREATE POLICY "lottery_results_read_own" ON lottery_results
  FOR SELECT USING (
    winner_id = auth.uid()
    OR EXISTS (SELECT 1 FROM votes v WHERE v.prediction_id = prediction_id AND v.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_admin = TRUE)
  );

-- coin_transactions: users read own
CREATE POLICY "coin_transactions_read_own" ON coin_transactions
  FOR SELECT USING (user_id = auth.uid());

-- app_config: anyone reads; only service role writes (FastAPI uses service role key)
CREATE POLICY "app_config_read_all" ON app_config
  FOR SELECT USING (TRUE);
