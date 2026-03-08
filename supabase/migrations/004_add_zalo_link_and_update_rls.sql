-- ============================================
-- Add zalo_link column to ideas table
-- ============================================
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS zalo_link TEXT;

-- ============================================
-- Update join_requests SELECT policy
-- Allow everyone to see approved requests (member list)
-- Keep owner/requester access for pending/rejected
-- ============================================
DROP POLICY IF EXISTS "join_requests_select" ON join_requests;

CREATE POLICY "join_requests_select" ON join_requests FOR SELECT USING (
  status = 'approved'
  OR (
    auth.role() = 'authenticated' AND (
      requester_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM ideas WHERE ideas.id = join_requests.idea_id AND ideas.creator_id = auth.uid()
      )
    )
  )
);
