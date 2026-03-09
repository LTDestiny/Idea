-- ============================================
-- Add image support to ideas and comments
-- ============================================

ALTER TABLE ideas ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT '{}';

ALTER TABLE comments ADD COLUMN IF NOT EXISTS image_url text;
