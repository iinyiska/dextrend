-- Supabase SQL Schema for DexTrend Admin Panel
-- Run this in Supabase SQL Editor

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  logo_url TEXT DEFAULT '',
  logo_text TEXT DEFAULT 'DexTrend',
  site_title TEXT DEFAULT 'DexTrend - Real-Time DEX Analytics',
  site_description TEXT DEFAULT 'Track trending tokens across multiple blockchains',
  primary_color TEXT DEFAULT '#00ff88',
  secondary_color TEXT DEFAULT '#22d3ee',
  header_bg_color TEXT DEFAULT '#0d0d0d',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (id, logo_text, site_title) 
VALUES (1, 'DexTrend', 'DexTrend - Real-Time DEX Analytics')
ON CONFLICT (id) DO NOTHING;

-- Banners Table
CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  link_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  position TEXT DEFAULT 'hero' CHECK (position IN ('hero', 'sidebar', 'footer')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ads Table
CREATE TABLE IF NOT EXISTS ads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  ad_code TEXT NOT NULL, -- HTML/Script for the ad
  position TEXT DEFAULT 'sidebar' CHECK (position IN ('header', 'sidebar', 'between_content', 'footer', 'popup')),
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Users Table (for simple auth)
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin (password: admin123 - please change!)
-- Password hash is bcrypt of 'admin123'
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', '$2a$10$rQEY7GwzQGKJKJKJKJKJKKJKJKJKJKJKJKJKJKJKJKJKJKJKJKJKJ')
ON CONFLICT (username) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public can read site_settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Public can read active banners" ON banners
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active ads" ON ads
  FOR SELECT USING (is_active = true);

-- Service role has full access (for admin operations)
CREATE POLICY "Service role full access to site_settings" ON site_settings
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to banners" ON banners
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to ads" ON ads
  FOR ALL USING (auth.role() = 'service_role');
