-- Launch System Database Schema
-- Creates tables for waitlist subscribers, launch settings, and purchases

-- Waitlist subscribers table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  source TEXT DEFAULT 'landing_page',
  referral_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  referred_by UUID REFERENCES waitlist(id),
  email_sequence_step INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Launch settings table (single row for configuration)
CREATE TABLE IF NOT EXISTS launch_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  launch_date TIMESTAMP WITH TIME ZONE NOT NULL,
  product_name TEXT NOT NULL DEFAULT 'LaunchPad SaaS',
  product_tagline TEXT DEFAULT 'The all-in-one platform for launching your SaaS',
  early_bird_price_cents INTEGER DEFAULT 9900,
  regular_price_cents INTEGER DEFAULT 19900,
  early_bird_spots INTEGER DEFAULT 100,
  early_bird_spots_claimed INTEGER DEFAULT 0,
  is_live BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchases table for tracking Stripe payments
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending',
  is_early_bird BOOLEAN DEFAULT FALSE,
  waitlist_id UUID REFERENCES waitlist(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email logs for tracking sent emails
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  waitlist_id UUID REFERENCES waitlist(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL,
  sequence_number INTEGER,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_referral_code ON waitlist(referral_code);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);
CREATE INDEX IF NOT EXISTS idx_purchases_email ON purchases(email);
CREATE INDEX IF NOT EXISTS idx_purchases_stripe_session ON purchases(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_waitlist ON email_logs(waitlist_id);

-- Insert default launch settings (set launch date to 7 days from now)
INSERT INTO launch_settings (launch_date, product_name, product_tagline)
VALUES (
  NOW() + INTERVAL '7 days',
  'LaunchPad SaaS',
  'The all-in-one platform for launching your SaaS'
)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE launch_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for waitlist (public can insert, only authenticated users can read all)
CREATE POLICY "Anyone can join waitlist" ON waitlist
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read launch_settings" ON launch_settings
  FOR SELECT USING (true);

-- Allow anon to read their own waitlist entry by email (for confirmation)
CREATE POLICY "Users can read own waitlist entry" ON waitlist
  FOR SELECT USING (true);

-- Service role can do everything (for admin operations)
CREATE POLICY "Service role full access on waitlist" ON waitlist
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on launch_settings" ON launch_settings
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on purchases" ON purchases
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on email_logs" ON email_logs
  FOR ALL USING (auth.role() = 'service_role');
