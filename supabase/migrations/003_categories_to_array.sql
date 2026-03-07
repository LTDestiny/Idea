-- Convert category column from single enum value to array of enum values
ALTER TABLE ideas ALTER COLUMN category TYPE idea_category[] USING ARRAY[category];
ALTER TABLE ideas ALTER COLUMN category SET DEFAULT '{}';

-- Update index to use GIN for array operations
DROP INDEX IF EXISTS idx_ideas_category;
CREATE INDEX idx_ideas_category ON ideas USING GIN(category);
