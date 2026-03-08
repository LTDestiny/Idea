-- ============================================
-- Add notifications table + RPC function
-- ============================================

CREATE TABLE notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  idea_id     uuid NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  type        text NOT NULL CHECK (type IN ('comment', 'join_request', 'approved', 'rejected')),
  actor_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message     text NOT NULL,
  read        boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read) WHERE read = false;

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert" ON notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "notifications_update" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notifications_delete" ON notifications FOR DELETE USING (auth.uid() = user_id);

-- Function to create notifications for all idea members (or a specific user)
CREATE OR REPLACE FUNCTION create_idea_notification(
  p_idea_id uuid,
  p_actor_id uuid,
  p_type text,
  p_message text,
  p_target_user_id uuid DEFAULT NULL
) RETURNS void AS $$
BEGIN
  IF p_target_user_id IS NOT NULL THEN
    -- Targeted notification (e.g., for approve/reject to the requester)
    IF p_target_user_id != p_actor_id THEN
      INSERT INTO notifications (user_id, idea_id, type, actor_id, message)
      VALUES (p_target_user_id, p_idea_id, p_type, p_actor_id, p_message);
    END IF;
  ELSE
    -- Notify all idea members (owner + approved members) except the actor
    INSERT INTO notifications (user_id, idea_id, type, actor_id, message)
    SELECT member_id, p_idea_id, p_type, p_actor_id, p_message
    FROM (
      SELECT creator_id AS member_id FROM ideas WHERE id = p_idea_id
      UNION
      SELECT requester_id AS member_id FROM join_requests
        WHERE idea_id = p_idea_id AND status = 'approved'
    ) members
    WHERE member_id != p_actor_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
