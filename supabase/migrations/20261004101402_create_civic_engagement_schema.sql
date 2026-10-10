/*
# Civic Engagement Platform — Initial Schema

## Overview
Creates the database backend for a national expectations survey platform where citizens
anonymously vote on key issues after OTP verification. Results are displayed on a live
dashboard. This is Phase 1: national-level survey with anonymous, fraud-resistant voting.

## New Tables

### survey_topics
- `id` (uuid, PK): unique identifier
- `title` (text): the survey question/title
- `description` (text): longer context for the topic
- `category` (text): grouping label (e.g. "National Priorities")
- `display_order` (int): ordering for UI display
- `is_active` (boolean): whether the topic is open for voting
- `created_at` (timestamptz): creation timestamp

### survey_options
- `id` (uuid, PK): unique identifier
- `topic_id` (uuid, FK → survey_topics): parent topic
- `label` (text): the option text shown to users
- `description` (text, nullable): optional context for the option
- `display_order` (int): ordering within the topic
- `created_at` (timestamptz): creation timestamp

### votes
- `id` (uuid, PK): unique identifier
- `topic_id` (uuid, FK → survey_topics): which topic was voted on
- `option_id` (uuid, FK → survey_options): which option was chosen
- `voter_hash` (text): SHA-256 hash of the verified contact — prevents duplicate voting while keeping votes anonymous
- `country_code` (text, nullable): country derived from request IP (for foreign IP blocking in future)
- `created_at` (timestamptz): when the vote was cast
- UNIQUE constraint on (topic_id, voter_hash) — one vote per person per topic

### otp_sessions
- `id` (uuid, PK): unique identifier
- `contact` (text): phone number or email used for verification
- `contact_hash` (text): SHA-256 hash of contact for lookups
- `otp_code` (text): the 6-digit OTP code
- `verified` (boolean, default false): whether the OTP has been verified
- `expires_at` (timestamptz): when the OTP expires (10 minutes)
- `consumed` (boolean, default false): whether this session was used to cast a vote
- `created_at` (timestamptz): creation timestamp

## Security
- RLS enabled on ALL tables.
- survey_topics, survey_options: public read (anon + authenticated), no writes from frontend.
- votes: public read (for dashboard), insert only via anon (backend enforces OTP verification + dedup).
- otp_sessions: no direct frontend access (backend manages these with service role).
- Unique constraint on votes prevents duplicate voting per topic.

## Seed Data
- 3 survey topics with 5-6 options each, covering national priorities, government attention, and youth empowerment.
*/

-- ===================== TABLES =====================

CREATE TABLE IF NOT EXISTS survey_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'National Priorities',
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS survey_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES survey_topics(id) ON DELETE CASCADE,
  label text NOT NULL,
  description text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES survey_topics(id) ON DELETE CASCADE,
  option_id uuid NOT NULL REFERENCES survey_options(id) ON DELETE CASCADE,
  voter_hash text NOT NULL,
  country_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(topic_id, voter_hash)
);

CREATE TABLE IF NOT EXISTS otp_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact text NOT NULL,
  contact_hash text NOT NULL,
  otp_code text NOT NULL,
  verified boolean NOT NULL DEFAULT false,
  expires_at timestamptz NOT NULL,
  consumed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ===================== INDEXES =====================

CREATE INDEX IF NOT EXISTS idx_survey_options_topic_id ON survey_options(topic_id);
CREATE INDEX IF NOT EXISTS idx_votes_topic_id ON votes(topic_id);
CREATE INDEX IF NOT EXISTS idx_votes_option_id ON votes(option_id);
CREATE INDEX IF NOT EXISTS idx_otp_sessions_contact_hash ON otp_sessions(contact_hash);

-- ===================== RLS =====================

ALTER TABLE survey_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_sessions ENABLE ROW LEVEL SECURITY;

-- survey_topics: public read
DROP POLICY IF EXISTS "public_read_topics" ON survey_topics;
CREATE POLICY "public_read_topics" ON survey_topics FOR SELECT
TO anon, authenticated USING (true);

-- survey_options: public read
DROP POLICY IF EXISTS "public_read_options" ON survey_options;
CREATE POLICY "public_read_options" ON survey_options FOR SELECT
TO anon, authenticated USING (true);

-- votes: public read (for live dashboard), insert via anon (backend enforces logic)
DROP POLICY IF EXISTS "public_read_votes" ON votes;
CREATE POLICY "public_read_votes" ON votes FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_votes" ON votes;
CREATE POLICY "anon_insert_votes" ON votes FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- otp_sessions: no direct frontend access (backend uses service role key)
-- No policies = no access from anon/authenticated

-- ===================== SEED DATA =====================

INSERT INTO survey_topics (title, description, category, display_order, is_active)
VALUES
  ('What is your biggest concern for the nation''s future?',
   'From jobs to justice, tell us what keeps you up at night. Your voice shapes the national agenda.',
   'National Priorities', 1, true),
  ('Which issue needs the most urgent government attention?',
   'If the government could fix one thing immediately, what should it be? Rank your top priority.',
   'Governance & Policy', 2, true),
  ('What should be the top priority for youth empowerment?',
   'India has the world''s largest youth population. Where should we invest to unlock their potential?',
   'Youth & Future', 3, true)
ON CONFLICT DO NOTHING;

-- Options for Topic 1: Biggest concern
INSERT INTO survey_options (topic_id, label, description, display_order)
SELECT t.id, opt.label, opt.description, opt.display_order
FROM survey_topics t
CROSS JOIN (VALUES
  ('Employment & Jobs', 'Unemployment, underemployment, and lack of quality job opportunities', 1),
  ('Education Quality', 'Access to quality, affordable education and skill development', 2),
  ('Healthcare Access', 'Affordable healthcare, rural medical infrastructure, and public health', 3),
  ('Corruption & Transparency', 'Endemic corruption across public services and institutions', 4),
  ('Infrastructure & Transport', 'Roads, public transit, urban planning, and digital infrastructure', 5),
  ('Environment & Climate', 'Pollution, water security, and climate resilience', 6)
) AS opt(label, description, display_order)
WHERE t.title = 'What is your biggest concern for the nation''s future?'
ON CONFLICT DO NOTHING;

-- Options for Topic 2: Urgent government attention
INSERT INTO survey_options (topic_id, label, description, display_order)
SELECT t.id, opt.label, opt.description, opt.display_order
FROM survey_topics t
CROSS JOIN (VALUES
  ('Economic Recovery', 'Inflation control, GDP growth, and financial stability', 1),
  ('National Security', 'Border security, internal security, and defense readiness', 2),
  ('Agriculture & Farmers', 'Farmer income, agricultural reform, and rural economy', 3),
  ('Women''s Safety & Equality', 'Gender-based violence, workplace equality, and women''s rights', 4),
  ('Digital Infrastructure', 'Connectivity, data privacy, and digital public goods', 5),
  ('Poverty Alleviation', 'Welfare delivery, rural development, and social safety nets', 6)
) AS opt(label, description, display_order)
WHERE t.title = 'Which issue needs the most urgent government attention?'
ON CONFLICT DO NOTHING;

-- Options for Topic 3: Youth empowerment
INSERT INTO survey_options (topic_id, label, description, display_order)
SELECT t.id, opt.label, opt.description, opt.display_order
FROM survey_topics t
CROSS JOIN (VALUES
  ('Skill Development', 'Vocational training and industry-relevant skill building', 1),
  ('Job Creation', 'Employment generation schemes and private sector incentives', 2),
  ('Quality Education', 'World-class schools, colleges, and research institutions', 3),
  ('Entrepreneurship Support', 'Startup funding, ease of doing business, and mentorship', 4),
  ('Mental Health Support', 'Accessible counseling, awareness, and destigmatization', 5),
  ('Sports & Fitness', 'Sports infrastructure, athlete development, and public fitness', 6)
) AS opt(label, description, display_order)
WHERE t.title = 'What should be the top priority for youth empowerment?'
ON CONFLICT DO NOTHING;