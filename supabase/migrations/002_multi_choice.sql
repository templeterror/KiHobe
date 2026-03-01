-- Multi-choice prediction support
-- Run AFTER 001_initial_schema.sql

-- ============================================================
-- PREDICTIONS: add multi-choice columns
-- ============================================================

ALTER TABLE predictions
  ADD COLUMN prediction_type VARCHAR(20) DEFAULT 'binary'
    CHECK (prediction_type IN ('binary', 'multi_choice')),
  ADD COLUMN choices JSONB,            -- [{"key":"tarek_zia","label":"Tarek Zia"}, ...]
  ADD COLUMN choice_counts JSONB,      -- {"tarek_zia": 312, "nahid_islam": 198, ...}
  ADD COLUMN outcome_choice TEXT;      -- winning choice key (NULL until resolved)

-- Multi-choice predictions must have choices and choice_counts
ALTER TABLE predictions
  ADD CONSTRAINT chk_multi_requires_choices CHECK (
    prediction_type = 'binary'
    OR (choices IS NOT NULL AND choice_counts IS NOT NULL)
  );

-- ============================================================
-- VOTES: support choice_key for multi-choice
-- ============================================================

ALTER TABLE votes
  ADD COLUMN choice_key TEXT;

ALTER TABLE votes
  ALTER COLUMN vote DROP NOT NULL;

-- Binary votes need boolean vote; multi-choice votes need choice_key
ALTER TABLE votes
  ADD CONSTRAINT chk_vote_type CHECK (
    (choice_key IS NULL AND vote IS NOT NULL)
    OR (choice_key IS NOT NULL)
  );

-- ============================================================
-- VOTE_STATS: add choice_counts snapshot
-- ============================================================

ALTER TABLE vote_stats
  ADD COLUMN choice_counts JSONB;

-- ============================================================
-- RPC: cast_vote_choice (multi-choice atomic voting)
-- ============================================================

CREATE OR REPLACE FUNCTION cast_vote_choice(
  p_user_id UUID,
  p_prediction_id UUID,
  p_choice_key TEXT
) RETURNS void AS $$
DECLARE
  v_current JSONB;
BEGIN
  -- Insert vote record
  INSERT INTO votes (user_id, prediction_id, vote, choice_key)
  VALUES (p_user_id, p_prediction_id, NULL, p_choice_key);

  -- Lock row and atomically increment the choice count
  SELECT choice_counts INTO v_current
  FROM predictions WHERE id = p_prediction_id FOR UPDATE;

  UPDATE predictions
    SET choice_counts = jsonb_set(
      COALESCE(v_current, '{}'::jsonb),
      ARRAY[p_choice_key],
      to_jsonb(COALESCE((v_current->>p_choice_key)::int, 0) + 1)
    ),
    updated_at = now()
    WHERE id = p_prediction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
