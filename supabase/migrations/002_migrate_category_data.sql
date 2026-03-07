-- Migrate existing data: rename old category values to new ones
-- (Must run in a separate migration after enum values have been committed)
UPDATE ideas SET category = 'social_sciences' WHERE category = 'social';
UPDATE ideas SET category = 'it' WHERE category = 'technology';
