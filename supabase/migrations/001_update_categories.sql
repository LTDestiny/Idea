-- Add new category values to the idea_category enum
-- (ALTER TYPE ADD VALUE cannot run inside a transaction, so this file must only contain these statements)
ALTER TYPE idea_category ADD VALUE IF NOT EXISTS 'social_sciences';
ALTER TYPE idea_category ADD VALUE IF NOT EXISTS 'it';
ALTER TYPE idea_category ADD VALUE IF NOT EXISTS 'mechanical';
ALTER TYPE idea_category ADD VALUE IF NOT EXISTS 'electrical';
ALTER TYPE idea_category ADD VALUE IF NOT EXISTS 'chemical';
ALTER TYPE idea_category ADD VALUE IF NOT EXISTS 'biotechnology';
ALTER TYPE idea_category ADD VALUE IF NOT EXISTS 'civil_engineering';
ALTER TYPE idea_category ADD VALUE IF NOT EXISTS 'tourism';
