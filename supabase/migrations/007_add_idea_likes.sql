-- ============================================
-- Add idea_likes table for heart/like feature
-- ============================================

CREATE TABLE idea_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id uuid NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE (idea_id, user_id)
);

ALTER TABLE idea_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes"
  ON idea_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like"
  ON idea_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes"
  ON idea_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Enable realtime for live like count updates
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE idea_likes;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
