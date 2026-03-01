-- KiHobe Seed Data
-- Run AFTER the migration. No user required (created_by is NULL = admin-created).

-- ============================================================
-- PREDICTIONS
-- ============================================================

INSERT INTO predictions (id, title, description, category, status, resolution_date, resolution_source, yes_count, no_count, prize_description) VALUES

('2a67547a-d976-4db3-85c2-db57acff43b1',
 'Will India and Bangladesh normalize relations under the Yunus government?',
 'Relations between Dhaka and New Delhi have been strained since the political transition. Will the two countries restore full diplomatic normalcy — including border trade and transit agreements?',
 'international politics', 'active', '2026-06-30 18:00:00+00',
 'Joint statement from both foreign ministries',
 198, 312, 'BDT 750 bKash transfer'),

('5f639db4-e2b7-4b16-8ce0-088a6782df93',
 'Will Sheikh Hasina return to Bangladesh before the 2026 election?',
 'Former Prime Minister Sheikh Hasina fled to India in August 2024 following the mass uprising. Political analysts are divided on whether she will return to face trial or remain in exile.',
 'politics', 'active', '2026-06-30 18:00:00+00',
 'Bangladesh Election Commission / news confirmation',
 134, 289, 'BDT 1000 bKash transfer'),

('73e175a0-8378-4f00-9f27-3fac0234900e',
 'Will Bangladesh hold a national election in 2025?',
 'The interim government led by Dr. Muhammad Yunus has faced pressure from multiple political parties to set an election date. Will the vote actually happen before year end?',
 'politics', 'active', '2025-12-31 18:00:00+00',
 'Bangladesh Election Commission official announcement',
 412, 178, 'BDT 500 bKash transfer'),

('853f1196-c168-4cd7-be0b-d5d34be6b2b6',
 'Will BNP win the most seats in the next Bangladesh general election?',
 'BNP is widely seen as the frontrunner after the fall of the Awami League government. But fragmented opposition and new parties could split the vote.',
 'politics', 'active', '2026-12-31 18:00:00+00',
 'Official election results from Bangladesh Election Commission',
 523, 201, 'BDT 750 bKash transfer'),

('cfc7d7fb-f41b-4514-8037-8ef0006bbae2',
 'Will Donald Trump impose tariffs on Bangladesh garment exports in 2025?',
 'The US is Bangladesh''s largest garment export market. With Trump back in office and pushing broad tariff policies, the RMG sector faces major uncertainty.',
 'international politics', 'active', '2025-12-31 18:00:00+00',
 'US Federal Register / USTR official announcement',
 367, 445, 'BDT 500 bKash transfer');


-- ============================================================
-- VOTE STATS — realistic hourly snapshots over ~2 months
-- Each prediction has a unique trajectory.
-- ============================================================

-- Prediction 1: India-Bangladesh relations
-- Trajectory: starts ~39% YES, dips to ~30%, rallies to ~39% (final: 198/(198+312) = 38.8%)
-- Shows diplomatic uncertainty with slow sideways movement
INSERT INTO vote_stats (prediction_id, yes_count, no_count, recorded_at) VALUES
('2a67547a-d976-4db3-85c2-db57acff43b1',   3,   5, '2026-01-01 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',   5,   8, '2026-01-01 18:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',   8,  14, '2026-01-02 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  11,  18, '2026-01-02 18:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  14,  24, '2026-01-03 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  16,  29, '2026-01-03 18:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  19,  33, '2026-01-04 12:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  22,  39, '2026-01-05 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  24,  44, '2026-01-05 18:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  27,  51, '2026-01-06 12:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  30,  55, '2026-01-07 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  34,  58, '2026-01-08 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  38,  64, '2026-01-09 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  40,  72, '2026-01-10 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  43,  80, '2026-01-11 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  46,  85, '2026-01-12 12:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  48,  92, '2026-01-13 18:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  52,  97, '2026-01-15 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  55, 103, '2026-01-16 12:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  57, 112, '2026-01-18 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  60, 120, '2026-01-19 18:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  63, 125, '2026-01-21 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  67, 132, '2026-01-22 18:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  72, 138, '2026-01-24 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  78, 142, '2026-01-25 18:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  84, 150, '2026-01-27 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  90, 157, '2026-01-28 18:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1',  95, 165, '2026-01-30 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1', 102, 170, '2026-02-01 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1', 108, 178, '2026-02-03 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1', 112, 185, '2026-02-05 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1', 118, 190, '2026-02-07 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1', 125, 198, '2026-02-09 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1', 130, 208, '2026-02-11 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1', 138, 218, '2026-02-13 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1', 145, 228, '2026-02-15 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1', 152, 240, '2026-02-17 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1', 158, 252, '2026-02-19 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1', 165, 260, '2026-02-21 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1', 172, 270, '2026-02-23 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1', 178, 278, '2026-02-24 18:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1', 185, 290, '2026-02-26 06:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1', 190, 300, '2026-02-27 18:00:00+00'),
('2a67547a-d976-4db3-85c2-db57acff43b1', 198, 312, '2026-02-28 18:00:00+00');


-- Prediction 2: Sheikh Hasina return
-- Trajectory: starts ~5% YES → spikes on rumors → settles ~32% (final: 134/(134+289) = 31.7%)
-- Low baseline with sudden news-driven spikes and corrections
INSERT INTO vote_stats (prediction_id, yes_count, no_count, recorded_at) VALUES
('5f639db4-e2b7-4b16-8ce0-088a6782df93',   1,  18, '2026-01-01 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',   2,  28, '2026-01-02 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',   3,  35, '2026-01-03 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',   4,  42, '2026-01-04 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',   5,  48, '2026-01-05 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',   6,  52, '2026-01-06 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',   7,  56, '2026-01-07 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',   8,  60, '2026-01-08 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',   9,  65, '2026-01-09 12:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',  10,  70, '2026-01-10 18:00:00+00'),
-- rumor spike: news report about potential return
('5f639db4-e2b7-4b16-8ce0-088a6782df93',  18,  72, '2026-01-11 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',  25,  74, '2026-01-11 18:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',  30,  78, '2026-01-12 06:00:00+00'),
-- correction: rumor denied
('5f639db4-e2b7-4b16-8ce0-088a6782df93',  32,  88, '2026-01-13 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',  34,  98, '2026-01-14 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',  36, 108, '2026-01-15 12:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',  38, 115, '2026-01-17 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',  40, 122, '2026-01-19 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',  42, 128, '2026-01-21 06:00:00+00'),
-- second spike: court summons issued
('5f639db4-e2b7-4b16-8ce0-088a6782df93',  52, 132, '2026-01-22 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',  60, 135, '2026-01-22 18:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',  65, 140, '2026-01-23 12:00:00+00'),
-- slow fade
('5f639db4-e2b7-4b16-8ce0-088a6782df93',  68, 148, '2026-01-25 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',  72, 156, '2026-01-27 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',  76, 165, '2026-01-29 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',  80, 172, '2026-01-31 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',  84, 180, '2026-02-02 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',  88, 188, '2026-02-04 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',  92, 196, '2026-02-06 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93',  96, 205, '2026-02-08 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93', 100, 215, '2026-02-10 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93', 104, 225, '2026-02-12 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93', 108, 235, '2026-02-14 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93', 112, 245, '2026-02-16 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93', 116, 252, '2026-02-18 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93', 120, 260, '2026-02-20 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93', 124, 268, '2026-02-22 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93', 128, 278, '2026-02-25 06:00:00+00'),
('5f639db4-e2b7-4b16-8ce0-088a6782df93', 134, 289, '2026-02-28 18:00:00+00');


-- Prediction 3: Bangladesh election in 2025
-- Trajectory: starts ~5% YES → builds momentum → surges to ~70% (final: 412/(412+178) = 69.8%)
-- Classic "gaining confidence" curve with organic ups and downs
INSERT INTO vote_stats (prediction_id, yes_count, no_count, recorded_at) VALUES
('73e175a0-8378-4f00-9f27-3fac0234900e',   2,  35, '2026-01-01 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e',   4,  42, '2026-01-01 18:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e',   6,  48, '2026-01-02 12:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e',   9,  52, '2026-01-03 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e',  12,  55, '2026-01-04 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e',  14,  58, '2026-01-05 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e',  18,  60, '2026-01-06 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e',  22,  63, '2026-01-07 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e',  25,  68, '2026-01-08 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e',  30,  72, '2026-01-09 12:00:00+00'),
-- election commission hints at timeline
('73e175a0-8378-4f00-9f27-3fac0234900e',  40,  74, '2026-01-10 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e',  52,  76, '2026-01-10 18:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e',  58,  78, '2026-01-11 12:00:00+00'),
-- pullback: parties disagree on voter rolls
('73e175a0-8378-4f00-9f27-3fac0234900e',  62,  85, '2026-01-12 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e',  65,  92, '2026-01-13 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e',  68,  96, '2026-01-14 18:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e',  74,  98, '2026-01-16 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e',  82, 100, '2026-01-17 18:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e',  90, 102, '2026-01-19 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e', 100, 104, '2026-01-20 18:00:00+00'),
-- strong rally: Yunus confirms election roadmap
('73e175a0-8378-4f00-9f27-3fac0234900e', 118, 106, '2026-01-21 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e', 135, 108, '2026-01-21 18:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e', 148, 110, '2026-01-22 12:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e', 155, 114, '2026-01-23 06:00:00+00'),
-- slight dip: opposition boycott threat
('73e175a0-8378-4f00-9f27-3fac0234900e', 160, 120, '2026-01-25 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e', 168, 125, '2026-01-27 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e', 178, 128, '2026-01-29 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e', 190, 130, '2026-01-31 06:00:00+00'),
-- steady climb
('73e175a0-8378-4f00-9f27-3fac0234900e', 210, 132, '2026-02-02 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e', 228, 135, '2026-02-04 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e', 248, 138, '2026-02-06 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e', 260, 142, '2026-02-08 06:00:00+00'),
-- small correction
('73e175a0-8378-4f00-9f27-3fac0234900e', 268, 148, '2026-02-10 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e', 278, 150, '2026-02-12 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e', 295, 152, '2026-02-14 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e', 310, 155, '2026-02-16 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e', 328, 158, '2026-02-18 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e', 345, 162, '2026-02-20 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e', 360, 165, '2026-02-22 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e', 378, 168, '2026-02-24 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e', 392, 172, '2026-02-26 06:00:00+00'),
('73e175a0-8378-4f00-9f27-3fac0234900e', 412, 178, '2026-02-28 18:00:00+00');


-- Prediction 4: BNP winning most seats
-- Trajectory: starts ~60% YES → climbs to ~80% → pulls back to ~72% (final: 523/(523+201) = 72.2%)
-- Starts strong but faces volatility as new parties emerge
INSERT INTO vote_stats (prediction_id, yes_count, no_count, recorded_at) VALUES
('853f1196-c168-4cd7-be0b-d5d34be6b2b6',  12,   8, '2026-01-01 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6',  22,  14, '2026-01-02 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6',  35,  20, '2026-01-03 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6',  48,  25, '2026-01-04 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6',  60,  30, '2026-01-05 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6',  72,  32, '2026-01-06 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6',  85,  35, '2026-01-07 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6',  98,  38, '2026-01-08 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 110,  40, '2026-01-09 12:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 125,  42, '2026-01-10 18:00:00+00'),
-- peak confidence: BNP rally
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 145,  44, '2026-01-11 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 162,  46, '2026-01-12 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 178,  48, '2026-01-13 12:00:00+00'),
-- pullback: new party announces strong slate
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 185,  58, '2026-01-14 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 192,  68, '2026-01-15 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 198,  78, '2026-01-16 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 210,  82, '2026-01-18 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 225,  88, '2026-01-20 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 240,  92, '2026-01-22 06:00:00+00'),
-- BNP internal split rumors
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 250, 105, '2026-01-24 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 258, 115, '2026-01-26 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 268, 120, '2026-01-28 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 280, 125, '2026-01-30 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 295, 130, '2026-02-01 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 310, 135, '2026-02-03 06:00:00+00'),
-- recovery
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 328, 138, '2026-02-05 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 345, 142, '2026-02-07 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 362, 148, '2026-02-09 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 378, 152, '2026-02-11 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 395, 158, '2026-02-13 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 410, 162, '2026-02-15 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 425, 168, '2026-02-17 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 440, 172, '2026-02-19 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 458, 178, '2026-02-21 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 475, 182, '2026-02-23 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 490, 188, '2026-02-25 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 508, 195, '2026-02-27 06:00:00+00'),
('853f1196-c168-4cd7-be0b-d5d34be6b2b6', 523, 201, '2026-02-28 18:00:00+00');


-- Prediction 5: Trump tariffs on Bangladesh garments
-- Trajectory: starts ~50/50 → drops to ~35% → surges to ~55% → settles ~45% (final: 367/(367+445) = 45.2%)
-- Volatile — swings on every Trump statement and trade news
INSERT INTO vote_stats (prediction_id, yes_count, no_count, recorded_at) VALUES
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2',   8,   8, '2026-01-01 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2',  14,  16, '2026-01-02 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2',  18,  25, '2026-01-03 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2',  22,  35, '2026-01-04 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2',  25,  42, '2026-01-05 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2',  28,  50, '2026-01-06 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2',  30,  58, '2026-01-07 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2',  32,  65, '2026-01-08 12:00:00+00'),
-- Trump tweet about "unfair trade" — YES spikes
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2',  48,  68, '2026-01-09 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2',  65,  70, '2026-01-09 18:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2',  78,  72, '2026-01-10 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2',  85,  78, '2026-01-11 06:00:00+00'),
-- USTR says "no immediate plans" — correction
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2',  88,  92, '2026-01-12 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2',  92, 108, '2026-01-13 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2',  95, 120, '2026-01-14 18:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2',  98, 130, '2026-01-16 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2', 102, 142, '2026-01-18 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2', 108, 155, '2026-01-20 06:00:00+00'),
-- second scare: executive order draft leaked
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2', 130, 158, '2026-01-21 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2', 155, 162, '2026-01-22 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2', 172, 168, '2026-01-23 06:00:00+00'),
-- calms down, BD lobbying effort news
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2', 178, 182, '2026-01-25 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2', 185, 198, '2026-01-27 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2', 192, 215, '2026-01-29 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2', 200, 230, '2026-01-31 06:00:00+00'),
-- slow drift
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2', 215, 248, '2026-02-02 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2', 228, 265, '2026-02-04 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2', 240, 280, '2026-02-06 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2', 255, 295, '2026-02-08 06:00:00+00'),
-- mini spike: trade review announced
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2', 275, 300, '2026-02-10 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2', 290, 308, '2026-02-12 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2', 300, 320, '2026-02-14 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2', 310, 338, '2026-02-16 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2', 320, 355, '2026-02-18 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2', 330, 370, '2026-02-20 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2', 340, 388, '2026-02-22 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2', 348, 405, '2026-02-24 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2', 355, 420, '2026-02-26 06:00:00+00'),
('cfc7d7fb-f41b-4514-8037-8ef0006bbae2', 367, 445, '2026-02-28 18:00:00+00');


-- ============================================================
-- MULTI-CHOICE PREDICTION: Who will be the next PM?
-- ============================================================

INSERT INTO predictions (
  id, title, description, category, status, resolution_date, resolution_source,
  prediction_type, choices, choice_counts,
  yes_count, no_count,
  prize_description, winner_count
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Who will be the next Prime Minister of Bangladesh?',
  'With a national election approaching, multiple candidates are emerging as frontrunners. Tarek Zia leads BNP, Nahid Islam represents the new generation from the student movement, and Dr. Shafik advocates for technocratic governance.',
  'politics',
  'active',
  '2026-12-31 18:00:00+00',
  'Bangladesh Election Commission official results',
  'multi_choice',
  '[{"key":"tarek_zia","label":"Tarek Zia"},{"key":"nahid_islam","label":"Nahid Islam"},{"key":"dr_shafik","label":"Dr. Shafik"}]',
  '{"tarek_zia": 487, "nahid_islam": 312, "dr_shafik": 198}',
  0, 0,
  'BDT 2000 bKash transfer',
  1
);

-- Vote stats: Tarek Zia starts frontrunner ~55%, dips on scandal, recovers ~49%.
-- Nahid Islam starts low ~13%, surges on endorsement, ends ~31%.
-- Dr. Shafik steady ~30%, fades to ~20%.
INSERT INTO vote_stats (prediction_id, yes_count, no_count, choice_counts, recorded_at) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 8, "nahid_islam": 2, "dr_shafik": 5}', '2026-01-01 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 15, "nahid_islam": 4, "dr_shafik": 9}', '2026-01-01 18:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 22, "nahid_islam": 6, "dr_shafik": 14}', '2026-01-02 12:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 30, "nahid_islam": 8, "dr_shafik": 18}', '2026-01-03 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 38, "nahid_islam": 12, "dr_shafik": 22}', '2026-01-04 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 45, "nahid_islam": 15, "dr_shafik": 28}', '2026-01-05 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 52, "nahid_islam": 18, "dr_shafik": 32}', '2026-01-06 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 58, "nahid_islam": 22, "dr_shafik": 38}', '2026-01-07 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 62, "nahid_islam": 25, "dr_shafik": 42}', '2026-01-08 06:00:00+00'),
-- corruption allegation hits Tarek Zia, Nahid Islam surges
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 65, "nahid_islam": 35, "dr_shafik": 45}', '2026-01-09 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 68, "nahid_islam": 48, "dr_shafik": 48}', '2026-01-10 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 72, "nahid_islam": 58, "dr_shafik": 50}', '2026-01-11 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 78, "nahid_islam": 65, "dr_shafik": 52}', '2026-01-12 06:00:00+00'),
-- student movement endorses Nahid, Tarek stabilizes
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 85, "nahid_islam": 78, "dr_shafik": 55}', '2026-01-13 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 95, "nahid_islam": 88, "dr_shafik": 58}', '2026-01-15 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 108, "nahid_islam": 95, "dr_shafik": 62}', '2026-01-17 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 120, "nahid_islam": 105, "dr_shafik": 65}', '2026-01-19 06:00:00+00'),
-- Tarek Zia rally draws massive crowd, momentum shifts back
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 145, "nahid_islam": 110, "dr_shafik": 68}', '2026-01-20 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 165, "nahid_islam": 118, "dr_shafik": 72}', '2026-01-21 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 182, "nahid_islam": 125, "dr_shafik": 78}', '2026-01-23 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 198, "nahid_islam": 135, "dr_shafik": 82}', '2026-01-25 06:00:00+00'),
-- Dr. Shafik gets editorial endorsements, small bump
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 215, "nahid_islam": 142, "dr_shafik": 92}', '2026-01-27 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 230, "nahid_islam": 150, "dr_shafik": 100}', '2026-01-29 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 248, "nahid_islam": 158, "dr_shafik": 105}', '2026-01-31 06:00:00+00'),
-- February: steady march, Nahid keeps gaining, Dr. Shafik plateaus
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 268, "nahid_islam": 170, "dr_shafik": 110}', '2026-02-02 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 285, "nahid_islam": 182, "dr_shafik": 115}', '2026-02-04 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 300, "nahid_islam": 192, "dr_shafik": 120}', '2026-02-06 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 318, "nahid_islam": 205, "dr_shafik": 128}', '2026-02-08 06:00:00+00'),
-- Nahid Islam viral speech moment
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 330, "nahid_islam": 225, "dr_shafik": 132}', '2026-02-10 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 345, "nahid_islam": 242, "dr_shafik": 138}', '2026-02-12 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 358, "nahid_islam": 255, "dr_shafik": 142}', '2026-02-14 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 372, "nahid_islam": 265, "dr_shafik": 148}', '2026-02-16 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 388, "nahid_islam": 272, "dr_shafik": 155}', '2026-02-18 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 405, "nahid_islam": 280, "dr_shafik": 162}', '2026-02-20 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 420, "nahid_islam": 288, "dr_shafik": 170}', '2026-02-22 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 438, "nahid_islam": 295, "dr_shafik": 178}', '2026-02-24 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 458, "nahid_islam": 302, "dr_shafik": 185}', '2026-02-26 06:00:00+00'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0, 0, '{"tarek_zia": 487, "nahid_islam": 312, "dr_shafik": 198}', '2026-02-28 18:00:00+00');
